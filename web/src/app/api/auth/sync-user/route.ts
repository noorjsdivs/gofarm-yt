import { NextRequest, NextResponse } from "next/server";
import { syncUserToSanity } from "../../../../lib/sync-user-to-sanity";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    // Parse FIREBASE_PRIVATE_KEY if it's a JSON string
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (privateKey && privateKey.startsWith("{")) {
      // It's a JSON object, parse it to get the private_key
      const serviceAccount = JSON.parse(privateKey);
      privateKey = serviceAccount.private_key;
    }

    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey?.replace(/\\n/g, "\n"),
      }),
    });
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📥 Received sync-user request");
    const { idToken } = await request.json();

    if (!idToken) {
      console.error("❌ No ID token provided");
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(idToken);

    // Get the full user record from firebase
    const firebaseUser = await getAuth().getUser(decodedToken.uid);

    // Sync the user to Sanity
    const userForSync = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || null,
      photoURL: firebaseUser.photoURL || null,
    };

    console.log("💾 Syncing user to Sanity...");
    // Sync to Sanity
    const sanityUserId = await syncUserToSanity(userForSync as any);
    console.log("✅ User synced to Sanity with ID:", sanityUserId);
    return NextResponse.json({
      success: true,
      sanityUserId,
      firebaseUid: firebaseUser.uid,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to sign in";
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: message || "Failed to sync user" },
      { status: 500 }
    );
  }
}
