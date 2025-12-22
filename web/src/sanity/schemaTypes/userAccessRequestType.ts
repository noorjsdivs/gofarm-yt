import { defineField, defineType } from "sanity";

export const userAccessRequestType = defineType({
  name: "userAccessRequest",
  title: "User Access Request",
  type: "document",
  fields: [
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "requestedAt",
      title: "Requested At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "approvedAt",
      title: "Approved At",
      type: "datetime",
    }),
    defineField({
      name: "approvedBy",
      title: "Approved By",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "rejectedAt",
      title: "Rejected At",
      type: "datetime",
    }),
    defineField({
      name: "rejectedBy",
      title: "Rejected By",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "notes",
      title: "Admin Notes",
      type: "text",
      description: "Internal notes for admin review",
    }),
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "status",
      firstName: "firstName",
      lastName: "lastName",
    },
    prepare(selection) {
      const { title, subtitle, firstName, lastName } = selection;
      const name = firstName && lastName ? `${firstName} ${lastName}` : title;
      return {
        title: name,
        subtitle: `Status: ${subtitle}`,
      };
    },
  },
  orderings: [
    {
      title: "Requested Date (newest first)",
      name: "requestedAtDesc",
      by: [{ field: "requestedAt", direction: "desc" }],
    },
    {
      title: "Status",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
});
