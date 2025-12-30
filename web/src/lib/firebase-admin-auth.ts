import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { client } from "@/sanity/lib/client";

/**
 * Get the current authenticated user from Firebase session cookie
 * This replaces Clerk's auth() and currentUser() functions
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    // Check both cookie names for backward compatibility
    const idToken =
      cookieStore.get("session")?.value ||
      cookieStore.get("firebaseToken")?.value;

    if (!idToken) {
      return null;
    }

    // Verify the ID token (not session cookie)
    const decodedClaims = await adminAuth.verifyIdToken(idToken, true);

    // Get user from Firebase Admin
    const userRecord = await adminAuth.getUser(decodedClaims.uid);

    return {
      uid: userRecord.uid,
      email: userRecord.email || "",
      emailVerified: userRecord.emailVerified,
      displayName: userRecord.displayName || "",
      photoURL: userRecord.photoURL || "",
      phoneNumber: userRecord.phoneNumber || "",
      disabled: userRecord.disabled,
      metadata: userRecord.metadata,
      customClaims: userRecord.customClaims || {},
      providerData: userRecord.providerData || [],
    };
  } catch (error: any) {
    // Only log detailed error if it's not an expired token (which is expected)
    if (error?.code === "auth/id-token-expired") {
      console.log("⚠️ Firebase token expired - client should refresh");
    } else {
      console.error("Error getting current user:", error);
    }
    return null;
  }
}

/**
 * Get just the user ID from the session
 * This replaces Clerk's auth() function which returns { userId }
 */
export async function getAuthUserId() {
  try {
    const cookieStore = await cookies();
    // Check both cookie names for backward compatibility
    const idToken =
      cookieStore.get("session")?.value ||
      cookieStore.get("firebaseToken")?.value;

    if (!idToken) {
      return null;
    }

    // Verify the ID token (not session cookie)
    const decodedClaims = await adminAuth.verifyIdToken(idToken, true);
    return decodedClaims.uid;
  } catch (error: any) {
    // Only log detailed error if it's not an expired token (which is expected)
    if (error?.code === "auth/id-token-expired") {
      console.log("⚠️ Firebase token expired - client should refresh");
    } else {
      console.error("Error getting auth user ID:", error);
    }
    return null;
  }
}

/**
 * Check if user is authenticated
 * Returns the user ID if authenticated, null otherwise
 */
export async function requireAuth() {
  const userId = await getAuthUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

/**
 * Get user data from Sanity by Firebase UID
 */
export async function getSanityUserByFirebaseId(firebaseUid: string) {
  try {
    const user = await client.fetch(
      `*[_type == "user" && firebaseUid == $firebaseUid][0]{
        _id,
        _type,
        firebaseUid,
        email,
        name,
        image,
        role,
        accountStatus,
        wallet,
        addresses,
        orders,
        wishlist,
        notifications,
        premiumAccount,
        businessAccount,
        employee,
        isAdmin,
        createdAt,
        updatedAt
      }`,
      { firebaseUid }
    );

    return user || null;
  } catch (error) {
    console.error("Error getting Sanity user:", error);
    return null;
  }
}

/**
 * Check if current user is admin
 * Checks TWO sources (isAdmin only exists in Sanity, not Firebase):
 * 1. NEXT_PUBLIC_ADMIN_EMAIL environment variable (fast check)
 * 2. Sanity database isAdmin field (requires DB query)
 * User is admin if EITHER condition is true
 */
export async function isAdmin() {
  const user = await getCurrentUser();

  if (!user || !user.email) {
    return false;
  }

  // Check 1: Environment variable (faster, no DB query needed)
  const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (adminEmailsEnv) {
    try {
      const adminEmails = adminEmailsEnv
        .replace(/[\[\]]/g, "") // Remove brackets if present
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email.length > 0);

      if (adminEmails.includes(user.email.toLowerCase())) {
        return true;
      }
    } catch (error) {
      console.error("Error parsing NEXT_PUBLIC_ADMIN_EMAIL:", error);
    }
  }

  // Check 2: Sanity database isAdmin field
  try {
    const sanityUser = await client.fetch(
      `*[_type == "user" && firebaseUid == $firebaseUid][0]{ isAdmin, email }`,
      { firebaseUid: user.uid }
    );

    if (sanityUser?.isAdmin === true) {
      return true;
    }
  } catch (error) {
    console.error("Error checking Sanity isAdmin field:", error);
  }

  return false;
}

/**
 * Require admin access
 */
export async function requireAdmin() {
  const isUserAdmin = await isAdmin();

  if (!isUserAdmin) {
    throw new Error("Forbidden: Admin access required");
  }

  const user = await getCurrentUser();
  return user;
}

/**
 * Check if current authenticated user is admin - API route helper
 * Returns { isAdmin: boolean, user: User | null }
 * Useful for API routes that need both user data and admin status
 */
export async function checkAdminAccess() {
  const user = await getCurrentUser();

  if (!user) {
    return { isAdmin: false, user: null };
  }

  const userIsAdmin = await isAdmin();

  return { isAdmin: userIsAdmin, user };
}
