import { auth } from "firebase-admin";
import { getApps, initializeApp, cert } from "firebase-admin/app";

// Initialize Firebase Admin
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

export const adminAuth = auth();

export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
