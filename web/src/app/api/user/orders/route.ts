import { getAuthUserId } from "@/lib/firebase-admin-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mock data for now - replace with actual database queries
    const orders = [
      {
        _id: "1",
        orderNumber: "ORD-2023-1001",
        totalAmount: 299.99,
        status: "Processing",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            name: "Wireless Headphones",
            quantity: 1,
            price: 199.99,
          },
          {
            name: "Phone Case",
            quantity: 2,
            price: 50.0,
          },
        ],
      },
      {
        _id: "2",
        orderNumber: "ORD-2023-1000",
        totalAmount: 159.99,
        status: "Shipped",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            name: "Bluetooth Speaker",
            quantity: 1,
            price: 159.99,
          },
        ],
      },
      {
        _id: "3",
        orderNumber: "ORD-2023-0999",
        totalAmount: 89.99,
        status: "Delivered",
        createdAt: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        items: [
          {
            name: "USB Cable",
            quantity: 3,
            price: 29.99,
          },
        ],
      },
    ];

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
