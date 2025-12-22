/**
 * Admin Utility Functions
 *
 * IMPORTANT: isAdmin field only exists in Sanity database, NOT in Firebase user records.
 *
 * This module provides admin authentication checks using TWO independent methods:
 *
 * 1. ENVIRONMENT VARIABLE (NEXT_PUBLIC_ADMIN_EMAIL):
 *    - Set in .env file as comma-separated emails
 *    - Example: NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com,admin2@example.com
 *    - Can use brackets: [admin@example.com,admin2@example.com]
 *    - Fast check, works in middleware and client-side
 *    - No database query needed
 *
 * 2. SANITY DATABASE (isAdmin field on user document):
 *    - Set isAdmin=true for a user document in Sanity Studio
 *    - This field ONLY exists in Sanity, not in Firebase
 *    - More flexible, can be changed without redeployment
 *    - Requires database query, used in server-side code
 *
 * Both methods work independently. A user is admin if EITHER condition is true.
 */

import React from "react";

// Admin utility functions
export const getAdminEmails = (): string[] => {
  const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!adminEmailsEnv) return [];

  try {
    // Handle array format: [email1,email2] or just comma-separated: email1,email2
    const cleanEmails = adminEmailsEnv
      .replace(/[\[\]]/g, "") // Remove brackets if present
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    return cleanEmails;
  } catch (error) {
    console.error("Error parsing admin emails:", error);
    return [];
  }
};

export const isUserAdmin = (userEmail: string | null | undefined): boolean => {
  if (!userEmail) return false;

  const adminEmails = getAdminEmails();
  return adminEmails.includes(userEmail.toLowerCase());
};

/**
 * Comprehensive admin check that considers both database isAdmin field and environment variable
 * @param user - User object with email and isAdmin fields
 * @returns true if user is admin based on either database flag or environment variable
 */
export const isAdmin = (
  user: { email?: string | null; isAdmin?: boolean } | null | undefined
): boolean => {
  if (!user) return false;

  // Check if user has isAdmin flag set in database
  if (user.isAdmin === true) return true;

  // Fallback to environment variable check
  if (user.email) {
    return isUserAdmin(user.email);
  }

  return false;
};

/**
 * React hook to check if user is admin
 * Checks both environment variable AND Sanity database isAdmin field
 * @param userEmail - User's email address
 * @param firebaseUid - User's Firebase UID (optional, for more accurate Sanity query)
 * @returns true if user is admin based on either env var or Sanity isAdmin field
 */
export const useIsAdmin = (
  userEmail: string | null | undefined,
  firebaseUid?: string | null | undefined
): boolean => {
  const [isAdminInSanity, setIsAdminInSanity] = React.useState<boolean>(false);
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  React.useEffect(() => {
    // First check env variable (fast)
    if (userEmail && isUserAdmin(userEmail)) {
      setIsAdminInSanity(true);
      setIsChecking(false);
      return;
    }

    // Then check Sanity database
    if (userEmail || firebaseUid) {
      setIsChecking(true);
      fetch("/api/auth/check-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, firebaseUid }),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsAdminInSanity(data.isAdmin === true);
          setIsChecking(false);
        })
        .catch((error) => {
          console.error("Error checking admin status:", error);
          setIsAdminInSanity(false);
          setIsChecking(false);
        });
    } else {
      setIsAdminInSanity(false);
      setIsChecking(false);
    }
  }, [userEmail, firebaseUid]);

  // While checking, return false to prevent premature access
  return isChecking ? false : isAdminInSanity;
};
