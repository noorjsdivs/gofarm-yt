import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/firebase-admin-auth";
import { writeClient, client } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, applicationType } = await request.json(); // applicationType: "premium" | "business"

    if (!email || !applicationType) {
      return NextResponse.json(
        { error: "Email and application type are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await client.fetch(
      `*[_type == "userType" && email == $email][0]`,
      { email }
    );

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (applicationType === "premium") {
      // Cancel premium application - only if pending or rejected
      if (
        existingUser.premiumStatus !== "pending" &&
        existingUser.premiumStatus !== "rejected"
      ) {
        return NextResponse.json(
          { error: "Cannot cancel premium application in current status" },
          { status: 400 }
        );
      }

      const result = await writeClient
        .patch(existingUser._id)
        .set({
          premiumStatus: "cancelled",
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        success: true,
        message: "Premium application cancelled. You can apply again.",
        user: result,
      });
    } else if (applicationType === "business") {
      // Cancel business application - only if pending or rejected
      if (
        existingUser.businessStatus !== "pending" &&
        existingUser.businessStatus !== "rejected"
      ) {
        return NextResponse.json(
          { error: "Cannot cancel business application in current status" },
          { status: 400 }
        );
      }

      const result = await writeClient
        .patch(existingUser._id)
        .set({
          businessStatus: "cancelled",
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        success: true,
        message: "Business application cancelled. You can apply again.",
        user: result,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid application type" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error cancelling application:", error);
    return NextResponse.json(
      { error: "Failed to cancel application" },
      { status: 500 }
    );
  }
}
