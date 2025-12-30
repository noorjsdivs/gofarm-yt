import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { client, writeClient } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Get user from Sanity
    const user = await client.fetch(
      `*[_type == "user" && firebaseUid == $uid][0] {
        _id,
        cart[] {
          _key,
          product->{
            _id,
            name,
            slug,
            price,
            discount,
            stock,
            images,
            description,
            status,
            badge,
            brand->{_id, title, logo},
            categories[]->{_id, title, slug}
          },
          quantity,
          addedAt,
          size,
          color
        }
      }`,
      { uid: decodedToken.uid }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        cart: user.cart || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cart",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Invalid cart items" },
        { status: 400 }
      );
    }

    // Get user from Sanity
    const user = await client.fetch(
      `*[_type == "user" && firebaseUid == $uid][0] {
        _id,
        cart
      }`,
      { uid: decodedToken.uid }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Build new cart from incoming items
    const newCart = items.map((item: any, index: number) => ({
      _key: `${item.product._id}-${Date.now()}-${index}-${Math.random()
        .toString(36)
        .substring(7)}`,
      product: {
        _type: "reference",
        _ref: item.product._id,
      },
      quantity: item.quantity,
      addedAt: new Date().toISOString(),
      size: item.size || undefined,
      color: item.color || undefined,
    }));

    // Update user's cart in Sanity (replace completely)
    await writeClient.patch(user._id).set({ cart: newCart }).commit();

    // Fetch updated cart with product details
    const updatedUser = await client.fetch(
      `*[_type == "user" && _id == $userId][0] {
        cart[] {
          _key,
          product->{
            _id,
            name,
            slug,
            price,
            discount,
            stock,
            images,
            description,
            status,
            badge,
            brand->{_id, title, logo},
            categories[]->{_id, title, slug}
          },
          quantity,
          addedAt,
          size,
          color
        }
      }`,
      { userId: user._id }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Cart synced successfully",
        cart: updatedUser.cart || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error syncing cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to sync cart",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    const { productId, quantity, size, color } = await req.json();

    // Get user from Sanity
    const user = await client.fetch(
      `*[_type == "user" && firebaseUid == $uid][0] {
        _id,
        cart
      }`,
      { uid: decodedToken.uid }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    let cart = user.cart || [];
    const existingIndex = cart.findIndex(
      (item: any) => item.product._ref === productId
    );

    if (existingIndex >= 0) {
      // Update existing item
      cart[existingIndex].quantity = quantity;
      if (size) cart[existingIndex].size = size;
      if (color) cart[existingIndex].color = color;
    } else {
      // Add new item
      cart.push({
        _key: `${productId}-${Date.now()}`,
        product: {
          _type: "reference",
          _ref: productId,
        },
        quantity,
        addedAt: new Date().toISOString(),
        size: size || undefined,
        color: color || undefined,
      });
    }

    // Update cart in Sanity
    await writeClient.patch(user._id).set({ cart }).commit();

    return NextResponse.json(
      {
        success: true,
        message: "Cart updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update cart",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    // Get user from Sanity
    const user = await client.fetch(
      `*[_type == "user" && firebaseUid == $uid][0] {
        _id,
        cart
      }`,
      { uid: decodedToken.uid }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    let cart = user.cart || [];

    if (productId) {
      // Remove specific product
      const beforeCount = cart.length;
      cart = cart.filter((item: any) => item.product._ref !== productId);
    } else {
      // Clear entire cart
      cart = [];
    }

    // Update cart in Sanity
    await writeClient.patch(user._id).set({ cart }).commit();

    return NextResponse.json(
      {
        success: true,
        message: productId ? "Item removed from cart" : "Cart cleared",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting cart item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete cart item",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
