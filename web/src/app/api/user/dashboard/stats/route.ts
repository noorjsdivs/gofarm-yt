import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/firebase-admin-auth";
import {
  getUserOrders,
  getUserWishlist,
  getUserNotifications,
  getUserByClerkId,
} from "@/sanity/queries/userQueries";

interface Notification {
  read: boolean;
  id: string;
  title: string;
  message: string;
  sentAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  totalPrice?: number;
}

interface WishlistItem {
  _id: string;
  addedAt: string;
  name?: string;
  product?: {
    name: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch real data from Sanity
    const [userOrders, userWishlist, userNotifications, userData] =
      await Promise.all([
        getUserOrders(user.uid),
        getUserWishlist(user.uid),
        getUserNotifications(user.uid),
        getUserByClerkId(user.uid),
      ]);

    // Calculate stats from real data
    const stats = {
      ordersCount: userOrders?.length || 0,
      wishlistCount: userWishlist?.length || 0,
      notificationsCount: userNotifications?.length || 0,
      unreadNotifications:
        userNotifications?.filter((n: Notification) => !n.read)?.length || 0,
      rewardPoints: userData?.rewardPoints || 0,
      walletBalance: userData?.walletBalance || 0,
    };

    // Create recent activity from real data
    const recentActivity = [];

    // Add recent orders to activity
    if (userOrders && userOrders.length > 0) {
      const recentOrders = userOrders
        .sort(
          (a: Order, b: Order) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        )
        .slice(0, 2);

      recentOrders.forEach((order: Order) => {
        recentActivity.push({
          id: `order-${order._id}`,
          title: `Order ${
            order.status === "delivered"
              ? "Delivered"
              : order.status === "shipped"
              ? "Shipped"
              : "Placed"
          }`,
          description: `Order #${order.orderNumber} ${
            order.status === "delivered"
              ? "has been delivered"
              : order.status === "shipped"
              ? "has been shipped"
              : "has been placed successfully"
          }`,
          timestamp: order.orderDate,
          type: "order" as const,
        });
      });
    }

    // Add recent wishlist items to activity
    if (userWishlist && userWishlist.length > 0) {
      const recentWishlistItem = userWishlist[0];
      if (recentWishlistItem) {
        recentActivity.push({
          id: `wishlist-${recentWishlistItem._id}`,
          title: "Item Added to Wishlist",
          description: `Added ${recentWishlistItem.name} to your wishlist`,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // Approximate time
          type: "wishlist" as const,
        });
      }
    }

    // Add recent notifications to activity
    if (userNotifications && userNotifications.length > 0) {
      const recentNotifications = userNotifications
        .sort(
          (a: Notification, b: Notification) =>
            new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        )
        .slice(0, 1);

      recentNotifications.forEach((notification: Notification) => {
        recentActivity.push({
          id: `notification-${notification.id}`,
          title: notification.title,
          description:
            notification.message.length > 80
              ? notification.message.substring(0, 80) + "..."
              : notification.message,
          timestamp: notification.sentAt,
          type: "notification" as const,
        });
      });
    }

    // Sort activity by timestamp (newest first) and limit to 4 items
    recentActivity.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const limitedActivity = recentActivity.slice(0, 4);

    return NextResponse.json({
      success: true,
      stats,
      recentActivity: limitedActivity,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
