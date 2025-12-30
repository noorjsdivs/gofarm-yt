import { getAuthUserId } from "@/lib/firebase-admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, dateOfBirth, firebaseUid } = body;

    // Update or create user in Sanity
    const sanityUser = {
      _type: "user",
      firebaseUid: firebaseUid || userId,
      email: "", // We'll get this from Clerk
      firstName,
      lastName,
      phone,
      dateOfBirth,
      updatedAt: new Date().toISOString(),
    };

    // Check if user exists in Sanity
    const existingUser = await backendClient.fetch(
      `*[_type == "user" && firebaseUid == $firebaseUid][0]`,
      { firebaseUid: firebaseUid || userId }
    );

    let result;
    if (existingUser) {
      // Update existing user
      result = await backendClient
        .patch(existingUser._id)
        .set({
          firstName,
          lastName,
          phone,
          dateOfBirth,
          updatedAt: new Date().toISOString(),
        })
        .commit();
    } else {
      // Create new user
      result = await backendClient.create({
        ...sanityUser,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: result,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
