import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Product Reviews",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule) => Rule.required(),
      description: "The product being reviewed",
    }),
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
      description: "The user who wrote the review",
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(5)
          .integer()
          .error("Rating must be between 1 and 5"),
      description: "Rating from 1 to 5 stars",
    }),
    defineField({
      name: "title",
      title: "Review Title",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .min(5)
          .max(100)
          .error("Title must be between 5 and 100 characters"),
      description: "Brief headline for the review",
    }),
    defineField({
      name: "content",
      title: "Review Content",
      type: "text",
      validation: (Rule) =>
        Rule.required()
          .min(20)
          .max(1000)
          .error("Review content must be between 20 and 1000 characters"),
      description: "Detailed review text",
    }),
    defineField({
      name: "isVerifiedPurchase",
      title: "Verified Purchase",
      type: "boolean",
      initialValue: false,
      description: "Whether this review is from a verified purchaser",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Review Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
      description: "Admin approval status",
    }),
    defineField({
      name: "helpful",
      title: "Helpful Count",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
      description: "Number of users who found this review helpful",
    }),
    defineField({
      name: "helpfulBy",
      title: "Marked Helpful By",
      type: "array",
      of: [{ type: "reference", to: [{ type: "user" }] }],
      description: "Users who marked this review as helpful",
      hidden: true,
    }),
    defineField({
      name: "adminNotes",
      title: "Admin Notes",
      type: "text",
      description: "Internal notes for admins (not visible to users)",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "approvedAt",
      title: "Approved At",
      type: "datetime",
      readOnly: true,
      description: "When the review was approved",
    }),
    defineField({
      name: "approvedBy",
      title: "Approved By",
      type: "string",
      readOnly: true,
      description: "Admin who approved the review",
    }),
  ],
  preview: {
    select: {
      title: "title",
      rating: "rating",
      status: "status",
      userName: "user.firstName",
      userLastName: "user.lastName",
      productName: "product.name",
    },
    prepare(selection) {
      const { title, rating, status, userName, userLastName, productName } =
        selection;
      const stars = "★".repeat(rating || 0) + "☆".repeat(5 - (rating || 0));
      const reviewer =
        userName && userLastName
          ? `${userName} ${userLastName}`
          : "Unknown User";

      return {
        title: title || "Untitled Review",
        subtitle: `${stars} - ${reviewer} | ${
          productName || "Unknown Product"
        }`,
        description: `Status: ${status || "pending"}`,
      };
    },
  },
  orderings: [
    {
      title: "Created Date, Newest",
      name: "createdDateDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Created Date, Oldest",
      name: "createdDateAsc",
      by: [{ field: "createdAt", direction: "asc" }],
    },
    {
      title: "Rating, Highest",
      name: "ratingDesc",
      by: [{ field: "rating", direction: "desc" }],
    },
    {
      title: "Rating, Lowest",
      name: "ratingAsc",
      by: [{ field: "rating", direction: "asc" }],
    },
    {
      title: "Most Helpful",
      name: "helpfulDesc",
      by: [{ field: "helpful", direction: "desc" }],
    },
  ],
});
