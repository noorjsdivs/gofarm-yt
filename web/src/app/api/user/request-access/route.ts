import { getAuthUserId } from "@/lib/firebase-admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firebaseUid, email, firstName, lastName } = body;

    // Check if user request already exists
    const existingRequest = await backendClient.fetch(
      `*[_type == "userAccessRequest" && firebaseUid == $firebaseUid][0]`,
      { firebaseUid }
    );

    if (existingRequest) {
      return NextResponse.json({
        success: false,
        message: "Access request already exists",
      });
    }

    // Create access request in Sanity
    const accessRequest = await backendClient.create({
      _type: "userAccessRequest",
      firebaseUid,
      email,
      firstName,
      lastName,
      status: "pending",
      requestedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      notes: "",
    });

    return NextResponse.json({
      success: true,
      message: "Access request submitted successfully",
      requestId: accessRequest._id,
    });
  } catch (error) {
    console.error("Error creating access request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
