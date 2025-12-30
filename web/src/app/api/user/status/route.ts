import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/firebase-admin-auth";
import { backendClient } from "@/sanity/lib/backendClient";
import { writeClient } from "@/sanity/lib/client";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Check if user exists in Sanity
    const userEmail = user.email;
    const userId = user.uid;

    // Try to find user by firebaseUid first, fallback to email
    const sanityUser = await backendClient.fetch(
      `*[_type == "user" && (firebaseUid == $userId || email == $email)][0]{
        _id,
        firebaseUid,
        email,
        firstName,
        lastName,
        isActive,
        isBusiness,
        isVendor,
        vendorStatus,
        vendorAppliedAt,
        vendorApprovedAt,
        vendorRejectedAt,
        vendorRejectionReason,
        premiumStatus,
        businessStatus,
        membershipType,
        premiumAppliedAt,
        premiumApprovedBy,
        premiumApprovedAt,
        businessAppliedAt,
        businessApprovedBy,
        businessApprovedAt,
        rejectionReason,
        isEmployee,
        employeeRole,
        employeeStatus
      }`,
      { userId, email: userEmail }
    );

    return NextResponse.json({
      success: true,
      userExists: !!sanityUser,
      userProfile: sanityUser || null,
    });
  } catch (error) {
    console.error("Error checking user status:", error);
    return NextResponse.json(
      { error: "Failed to check user status" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userEmail = user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Check if user already exists in Sanity
    const existingSanityUser = await backendClient.fetch(
      `*[_type == "userType" && email == $email][0]`,
      { email: userEmail }
    );

    if (existingSanityUser) {
      // Check current premium status
      if (existingSanityUser.premiumStatus === "rejected") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Premium application was rejected. Please contact admin for assistance.",
          },
          { status: 400 }
        );
      }

      if (existingSanityUser.premiumStatus === "pending") {
        return NextResponse.json(
          {
            success: false,
            error: "Premium application is already pending approval.",
          },
          { status: 400 }
        );
      }

      if (existingSanityUser.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: "User already has premium account.",
          },
          { status: 400 }
        );
      }

      // Update existing user to pending status
      const updatedUser = await writeClient
        .patch(existingSanityUser._id)
        .set({
          premiumStatus: "pending",
          premiumAppliedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        success: true,
        message:
          "🎉 Premium application submitted successfully! Your application is now under review and you'll be notified within 24-48 hours once it's processed.",
        userProfile: updatedUser,
      });
    }

    // Create new user with pending premium status
    const newUser = await writeClient.create({
      _type: "userType",
      email: userEmail,
      firstName: user.displayName?.split(" ")[0] || "",
      lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
      isActive: false, // Will be set to true when approved
      premiumStatus: "pending",
      isBusiness: false,
      businessStatus: "none",
      membershipType: "standard",
      premiumAppliedAt: new Date().toISOString(),
      rewardPoints: 0,
      loyaltyPoints: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        newsletter: true,
        emailNotifications: true,
        smsNotifications: false,
        preferredCurrency: "USD",
        preferredLanguage: "en",
      },
    });

    // Track user registration event
    try {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/analytics/track`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: "user_registration",
            eventParams: {
              userId: newUser._id,
              email: userEmail,
              membershipType: "standard",
              premiumStatus: "pending",
            },
          }),
        }
      );
    } catch (analyticsError) {
      console.error("Failed to track user registration event:", analyticsError);
    }

    return NextResponse.json({
      success: true,
      message:
        "🎉 Premium application submitted successfully! Your application is now under review and you'll be notified within 24-48 hours once it's processed.",
      userProfile: newUser,
    });
  } catch (error) {
    console.error("Error creating user in Sanity:", error);
    return NextResponse.json(
      { error: "Failed to register for premium services" },
      { status: 500 }
    );
  }
}
