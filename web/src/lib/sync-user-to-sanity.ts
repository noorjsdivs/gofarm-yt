import { User } from "firebase/auth";
import { client, writeClient } from "@/sanity/lib/client";
import { isUserAdmin } from "@/lib/adminUtils";

/**
 * Syncs a Firebase user to Sanity CMS
 * Creates a new user document in Sanity if it doesn't exist
 * Uses firebaseUid as the unique identifier
 * Automatically sets isAdmin=true if user email is in NEXT_PUBLIC_ADMIN_EMAIL
 *
 * @param firebaseUser - The Firebase user object
 * @returns The Sanity user document ID
 */
export async function syncUserToSanity(firebaseUser: User): Promise<string> {
  try {
    const { uid, email, displayName, photoURL } = firebaseUser;

    console.log("firebase", await firebaseUser);

    if (!email) {
      throw new Error("User email is required for Sanity sync");
    }

    // Check if user already exists in Sanity (use read client for queries)
    // Check by firebaseUid first, then by email as fallback
    const existingUser = await client.fetch(
      `*[_type == "user" && (firebaseUid == $firebaseUid || email == $email)][0]`,
      { firebaseUid: uid, email }
    );

    if (existingUser) {
      // Check if user should be admin based on NEXT_PUBLIC_ADMIN_EMAIL
      const shouldBeAdmin = isUserAdmin(email);

      // Prepare updates object
      const updates: any = {
        updatedAt: new Date().toISOString(),
      };

      // Update firebaseUid if it was missing (for users found by email only)
      if (!existingUser.firebaseUid || existingUser.firebaseUid !== uid) {
        updates.firebaseUid = uid;
      }

      // Sync isAdmin field if it doesn't match what it should be
      if (shouldBeAdmin && existingUser.isAdmin !== true) {
        updates.isAdmin = true;
      }

      // Only patch if there are updates to make
      if (Object.keys(updates).length > 1) {
        // More than just updatedAt
        await writeClient.patch(existingUser._id).set(updates).commit();
      }

      return existingUser._id;
    }

    // Use a unique document ID based on firebaseUid to prevent race conditions
    const documentId = `user-${uid}`;

    // Split displayName into firstName and lastName
    let firstName = "";
    let lastName = "";

    if (displayName) {
      const nameParts = displayName.trim().split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
    } else {
      // Fallback to email username if no displayName
      firstName = email.split("@")[0];
    }

    // Check if user should be admin based on NEXT_PUBLIC_ADMIN_EMAIL
    const shouldBeAdmin = isUserAdmin(email);

    console.log("🆕 Creating new user in Sanity...");
    // Create new user document in Sanity (use write client for mutations)
    // Use createIfNotExists to prevent duplicates during race conditions
    const newUser = await writeClient.createIfNotExists({
      _id: documentId,
      _type: "user",
      firebaseUid: uid,
      email: email,
      firstName: firstName,
      lastName: lastName || undefined,
      profileImageUrl: photoURL || undefined,
      rewardPoints: 0,
      loyaltyPoints: 0,
      totalSpent: 0,
      walletBalance: 0,
      walletTransactions: [],
      withdrawalRequests: [],
      wishlist: [],
      cart: [],
      orders: [],
      addresses: [],
      notifications: [],
      isActive: true,
      vendorStatus: "none",
      isVendor: false,
      isEmployee: false,
      isAdmin: shouldBeAdmin, // Automatically set based on NEXT_PUBLIC_ADMIN_EMAIL
      preferences: {
        newsletter: false,
        emailNotifications: true,
        smsNotifications: false,
        preferredCurrency: "USD",
        preferredLanguage: "en",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return newUser._id;
  } catch (error: any) {
    console.error("❌ Error syncing user to Sanity:", error);

    // Provide more helpful error messages
    if (error?.message?.includes("Insufficient permissions")) {
      console.error(
        "\n❌ SANITY TOKEN PERMISSION ERROR:",
        "\n📝 Your SANITY_API_TOKEN doesn't have write permissions.",
        "\n✅ Solution:",
        "\n   1. Go to: https://www.sanity.io/manage",
        "\n   2. Select your project:",
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        "\n   3. Navigate to: API → Tokens",
        "\n   4. Create new token with 'Editor' or 'Administrator' permissions",
        "\n   5. Update SANITY_API_TOKEN in your .env file",
        "\n   6. Restart your development server"
      );
    }

    throw error;
  }
}

/**
 * Gets a Sanity user by Firebase UID
 *
 * @param firebaseUid - The Firebase user ID
 * @returns The Sanity user document or null if not found
 */
export async function getSanityUserByFirebaseUid(
  firebaseUid: string
): Promise<any | null> {
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
        createdAt,
        updatedAt
      }`,
      { firebaseUid }
    );

    return user || null;
  } catch (error) {
    console.error("Error fetching Sanity user:", error);
    return null;
  }
}

/**
 * Updates a Sanity user's profile information
 *
 * @param firebaseUid - The Firebase user ID
 * @param updates - The fields to update
 * @returns The updated user document
 */
export async function updateSanityUser(
  firebaseUid: string,
  updates: {
    name?: string;
    image?: string;
    email?: string;
  }
): Promise<any> {
  try {
    const user = await getSanityUserByFirebaseUid(firebaseUid);

    if (!user) {
      throw new Error("User not found in Sanity");
    }

    // Use write client for patch operations
    const updatedUser = await writeClient
      .patch(user._id)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return updatedUser;
  } catch (error) {
    console.error("Error updating Sanity user:", error);
    throw error;
  }
}
