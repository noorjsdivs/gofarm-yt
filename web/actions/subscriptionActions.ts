"use server";

import { client, writeClient } from "@/sanity/lib/client";

interface SubscriptionData {
  email: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface SubscriptionResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  alreadySubscribed?: boolean;
}

/**
 * Subscribe a user to the newsletter
 * Checks for existing subscription before creating a new one
 */
export async function subscribeToNewsletter(
  subscriptionData: SubscriptionData
): Promise<SubscriptionResponse> {
  try {
    const { email, source = "footer", ipAddress, userAgent } = subscriptionData;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please provide a valid email address",
        error: "Invalid email format",
      };
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists (first check)
    const existingSubscription = await client.fetch(
      `*[_type == "subscription" && email == $email][0]`,
      { email: normalizedEmail }
    );

    if (existingSubscription) {
      // If already subscribed and active
      if (existingSubscription.status === "active") {
        return {
          success: false,
          message:
            "You're already subscribed to our newsletter! Check your inbox for our latest updates.",
          alreadySubscribed: true,
        };
      }

      // If previously unsubscribed, reactivate
      if (existingSubscription.status === "unsubscribed") {
        await writeClient
          .patch(existingSubscription._id)
          .set({
            status: "active",
            subscribedAt: new Date().toISOString(),
            unsubscribedAt: null,
          })
          .commit();

        return {
          success: true,
          message:
            "Welcome back! You've been successfully resubscribed to our newsletter.",
          data: { reactivated: true },
        };
      }
    }

    // Double-check before creating (prevents race conditions)
    const doubleCheck = await client.fetch(
      `*[_type == "subscription" && email == $email][0]`,
      { email: normalizedEmail }
    );

    if (doubleCheck) {
      return {
        success: false,
        message:
          "You're already subscribed to our newsletter! Check your inbox for our latest updates.",
        alreadySubscribed: true,
      };
    }

    // Create new subscription
    const newSubscription = await writeClient.create({
      _type: "subscription",
      email: normalizedEmail,
      status: "active",
      subscribedAt: new Date().toISOString(),
      source,
      ipAddress: ipAddress || "unknown",
      userAgent: userAgent || "unknown",
    });

    return {
      success: true,
      message:
        "Thank you for subscribing! Check your email for a welcome message.",
      data: {
        subscriptionId: newSubscription._id,
        email: newSubscription.email,
      },
    };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Unsubscribe a user from the newsletter
 */
export async function unsubscribeFromNewsletter(
  email: string
): Promise<SubscriptionResponse> {
  try {
    const subscription = await client.fetch(
      `*[_type == "subscription" && email == $email && status == "active"][0]`,
      { email: email.toLowerCase().trim() }
    );

    if (!subscription) {
      return {
        success: false,
        message: "Email not found in our subscription list",
      };
    }

    await writeClient
      .patch(subscription._id)
      .set({
        status: "unsubscribed",
        unsubscribedAt: new Date().toISOString(),
      })
      .commit();

    return {
      success: true,
      message: "You have been successfully unsubscribed from our newsletter",
    };
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    return {
      success: false,
      message: "Failed to unsubscribe. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Check if an email is subscribed
 */
export async function checkSubscriptionStatus(
  email: string
): Promise<{ subscribed: boolean; status?: string }> {
  try {
    const subscription = await client.fetch(
      `*[_type == "subscription" && email == $email][0]`,
      { email: email.toLowerCase().trim() }
    );

    if (!subscription) {
      return { subscribed: false };
    }

    return {
      subscribed: subscription.status === "active",
      status: subscription.status,
    };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return { subscribed: false };
  }
}
