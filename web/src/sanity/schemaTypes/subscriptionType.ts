import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const subscriptionType = defineType({
  name: "subscription",
  title: "Newsletter Subscriptions",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "email",
      title: "Email Address",
      type: "email",
      description: "Subscriber's email address",
      validation: (Rule) =>
        Rule.required().custom((email) => {
          // Normalize email for uniqueness check
          const normalizedEmail = email?.toLowerCase().trim();
          return true; // Validation passes, uniqueness is enforced by GROQ query
        }),
    }),
    defineField({
      name: "status",
      title: "Subscription Status",
      type: "string",
      description: "Current status of the subscription",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Unsubscribed", value: "unsubscribed" },
          { title: "Pending", value: "pending" },
        ],
      },
      initialValue: "active",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
      description: "Date and time when the user subscribed",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "unsubscribedAt",
      title: "Unsubscribed At",
      type: "datetime",
      description: "Date and time when the user unsubscribed (if applicable)",
    }),
    defineField({
      name: "source",
      title: "Subscription Source",
      type: "string",
      description: "Where the subscription came from",
      options: {
        list: [
          { title: "Footer Form", value: "footer" },
          { title: "Popup", value: "popup" },
          { title: "Checkout", value: "checkout" },
          { title: "Other", value: "other" },
        ],
      },
      initialValue: "footer",
    }),
    defineField({
      name: "ipAddress",
      title: "IP Address",
      type: "string",
      description: "IP address of the subscriber",
    }),
    defineField({
      name: "userAgent",
      title: "User Agent",
      type: "string",
      description: "Browser/device information",
    }),
  ],
  preview: {
    select: {
      email: "email",
      status: "status",
      subscribedAt: "subscribedAt",
    },
    prepare({ email, status, subscribedAt }) {
      const date = subscribedAt
        ? new Date(subscribedAt).toLocaleDateString()
        : "N/A";
      return {
        title: email,
        subtitle: `${status} - Subscribed: ${date}`,
      };
    },
  },
});
