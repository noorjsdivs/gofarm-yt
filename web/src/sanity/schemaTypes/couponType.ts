import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const couponType = defineType({
  name: "coupon",
  title: "Coupon",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Coupon Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description:
        "Display name for the coupon (e.g., 'Black Friday Sale', 'Summer Discount')",
    }),
    defineField({
      name: "code",
      title: "Coupon Code",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .max(20)
          .uppercase()
          .regex(/^[A-Z0-9_-]+$/, {
            name: "alphanumeric",
            invert: false,
          })
          .custom((code) => {
            if (code && code !== code.toUpperCase()) {
              return "Coupon code must be in uppercase";
            }
            return true;
          }),
      description:
        "Unique coupon code that customers will enter (uppercase letters, numbers, hyphens, and underscores only)",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Internal description of the coupon",
    }),
    defineField({
      name: "discountType",
      title: "Discount Type",
      type: "string",
      options: {
        list: [
          { title: "Percentage", value: "percentage" },
          { title: "Fixed Amount", value: "fixed" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "discountValue",
      title: "Discount Value",
      type: "number",
      validation: (Rule) =>
        Rule.required()
          .positive()
          .custom((value, context) => {
            const discountType = (context.document as any)?.discountType;
            if (discountType === "percentage" && value && value > 100) {
              return "Percentage discount cannot exceed 100%";
            }
            return true;
          }),
      description: "Percentage (e.g., 10 for 10%) or fixed amount (e.g., 50)",
    }),
    defineField({
      name: "minimumOrderAmount",
      title: "Minimum Order Amount",
      type: "number",
      validation: (Rule) => Rule.min(0),
      description:
        "Minimum order subtotal required to use this coupon (0 for no minimum)",
      initialValue: 0,
    }),
    defineField({
      name: "maxDiscountAmount",
      title: "Maximum Discount Amount",
      type: "number",
      validation: (Rule) => Rule.min(0),
      description:
        "Maximum discount amount for percentage coupons (optional, 0 for unlimited)",
      initialValue: 0,
      hidden: ({ document }) => document?.discountType !== "percentage",
    }),
    defineField({
      name: "usageLimit",
      title: "Usage Limit",
      type: "number",
      validation: (Rule) => Rule.min(0).integer(),
      description:
        "Total number of times this coupon can be used (0 for unlimited)",
      initialValue: 0,
    }),
    defineField({
      name: "usageLimitPerUser",
      title: "Usage Limit Per User",
      type: "number",
      validation: (Rule) => Rule.min(0).integer(),
      description:
        "Number of times a single user can use this coupon (0 for unlimited)",
      initialValue: 1,
    }),
    defineField({
      name: "timesUsed",
      title: "Times Used",
      type: "number",
      readOnly: true,
      initialValue: 0,
      description: "Total number of times this coupon has been used",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      description: "When the coupon becomes active",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "expiryDate",
      title: "Expiry Date",
      type: "datetime",
      description: "When the coupon expires (leave empty for no expiry)",
      validation: (Rule) =>
        Rule.custom((expiryDate, context) => {
          const startDate = (context.document as any)?.startDate;
          if (
            expiryDate &&
            startDate &&
            new Date(expiryDate) <= new Date(startDate)
          ) {
            return "Expiry date must be after start date";
          }
          return true;
        }),
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      description: "Enable or disable this coupon",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isPublic",
      title: "Show Publicly",
      type: "boolean",
      description:
        "Display this coupon in public coupon listings (homepage, promotions page)",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "applicableProducts",
      title: "Applicable Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      description:
        "Specific products this coupon applies to (leave empty to apply to entire order)",
    }),
    defineField({
      name: "applicableCategories",
      title: "Applicable Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      description:
        "Specific categories this coupon applies to (leave empty to apply to entire order)",
    }),
    defineField({
      name: "excludedProducts",
      title: "Excluded Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      description: "Products excluded from this coupon",
    }),
    defineField({
      name: "firstOrderOnly",
      title: "First Order Only",
      type: "boolean",
      description: "Restrict coupon to users placing their first order",
      initialValue: false,
    }),
    defineField({
      name: "userRestrictions",
      title: "User Restrictions",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Specific user emails or Firebase UIDs allowed to use this coupon (leave empty for all users)",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      name: "name",
      code: "code",
      discountType: "discountType",
      discountValue: "discountValue",
      isActive: "isActive",
      expiryDate: "expiryDate",
    },
    prepare({ name, code, discountType, discountValue, isActive, expiryDate }) {
      const discount =
        discountType === "percentage"
          ? `${discountValue}%`
          : `$${discountValue}`;
      const status = isActive ? "🟢" : "🔴";
      const expired =
        expiryDate && new Date(expiryDate) < new Date() ? " (Expired)" : "";
      return {
        title: `${status} ${name || code}`,
        subtitle: `Code: ${code} - ${discount} off${expired}`,
      };
    },
  },
  orderings: [
    {
      title: "Code (A-Z)",
      name: "codeAsc",
      by: [{ field: "code", direction: "asc" }],
    },
    {
      title: "Created Date (Newest First)",
      name: "createdDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Active Status",
      name: "activeFirst",
      by: [{ field: "isActive", direction: "desc" }],
    },
  ],
});
