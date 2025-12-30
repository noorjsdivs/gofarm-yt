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
        wishlist[]->{
          _id,
          name,
          slug,
          price,
          discount,
          stock,
          images,
          brand->{_id, title},
          categories[]->{_id, title}
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
        wishlist: user.wishlist || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch wishlist",
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
        { success: false, message: "Invalid wishlist items" },
        { status: 400 }
      );
    }

    // Get user from Sanity
    const user = await client.fetch(
      `*[_type == "user" && firebaseUid == $uid][0] {
        _id
      }`,
      { uid: decodedToken.uid }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Build wishlist from incoming items
    const wishlist = items.map((item: any) => ({
      _type: "reference",
      _ref: item._id,
      _key: `${item._id}-${Date.now()}-${Math.random()}`,
    }));

    // Update user's wishlist in Sanity (replace completely)
    await writeClient.patch(user._id).set({ wishlist }).commit();

    // Fetch updated wishlist with product details
    const updatedUser = await client.fetch(
      `*[_type == "user" && _id == $userId][0] {
        wishlist[]->{
          _id,
          name,
          slug,
          price,
          discount,
          stock,
          images,
          brand->{_id, title},
          categories[]->{_id, title}
        }
      }`,
      { userId: user._id }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Wishlist synced successfully",
        wishlist: updatedUser.wishlist || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error syncing wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to sync wishlist",
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

    const { productId, action } = await req.json();

    if (!productId || !action) {
      return NextResponse.json(
        { success: false, message: "Product ID and action required" },
        { status: 400 }
      );
    }

    // Get user from Sanity
    const user = await client.fetch(
      `*[_type == "user" && firebaseUid == $uid][0] {
        _id,
        wishlist
      }`,
      { uid: decodedToken.uid }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    let wishlist = user.wishlist || [];

    if (action === "add") {
      // Add to wishlist if not exists
      const exists = wishlist.some((ref: any) => ref._ref === productId);
      if (!exists) {
        wishlist.push({
          _type: "reference",
          _ref: productId,
          _key: `${productId}-${Date.now()}`,
        });
      }
    } else if (action === "remove") {
      // Remove from wishlist
      wishlist = wishlist.filter((ref: any) => ref._ref !== productId);
    }

    // Update wishlist in Sanity
    await writeClient.patch(user._id).set({ wishlist }).commit();

    return NextResponse.json(
      {
        success: true,
        message: `Product ${
          action === "add" ? "added to" : "removed from"
        } wishlist`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update wishlist",
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

    // Get user from Sanity
    const user = await client.fetch(
      `*[_type == "user" && firebaseUid == $uid][0] {
        _id
      }`,
      { uid: decodedToken.uid }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Clear wishlist
    await writeClient.patch(user._id).set({ wishlist: [] }).commit();

    return NextResponse.json(
      {
        success: true,
        message: "Wishlist cleared",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to clear wishlist",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
