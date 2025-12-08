import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const vendorProductType = defineType({
  name: "vendorProduct",
  title: "Vendor Products",
  type: "document",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "vendorEmail",
      title: "Vendor Email",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
      description: "Email of the vendor who created this product",
    }),
    defineField({
      name: "vendorName",
      title: "Vendor Name",
      type: "string",
      readOnly: true,
      description: "Name of the vendor",
    }),
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
      description: "Base price for the base weight",
    }),
    defineField({
      name: "baseWeight",
      title: "Base Weight",
      type: "number",
      description:
        "Base weight in grams for price calculation (e.g., 500 for 500gm)",
      validation: (Rule) => Rule.min(0),
      hidden: ({ document }) => !document?.hasWeights,
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: { type: "brand" },
    }),
    defineField({
      name: "variant",
      title: "Product Variant",
      type: "reference",
      to: { type: "productVariant" },
      description: "Select the product variant/type category",
    }),
    defineField({
      name: "hasWeights",
      title: "Has Weights",
      type: "boolean",
      description:
        "Enable if this product has weight options (e.g., 500gm, 1kg)",
      initialValue: false,
    }),
    defineField({
      name: "useAllWeights",
      title: "Use All Available Weights",
      type: "boolean",
      description:
        "Enable to automatically include all active weights. Disable to manually select specific weights.",
      initialValue: false,
      hidden: ({ document }) => !document?.hasWeights,
    }),
    defineField({
      name: "weights",
      title: "Available Weights",
      type: "array",
      of: [{ type: "reference", to: { type: "productWeight" } }],
      hidden: ({ document }) =>
        !document?.hasWeights || !!document?.useAllWeights,
      description: "Select specific weights for this product",
    }),
    defineField({
      name: "hasVariants",
      title: "Has Size/Color Variants",
      type: "boolean",
      description: "Enable if this product has size/color variants",
      initialValue: false,
    }),
    defineField({
      name: "useAllSizes",
      title: "Use All Available Sizes",
      type: "boolean",
      description:
        "Enable to automatically include all active sizes. Disable to manually select specific sizes.",
      initialValue: false,
      hidden: ({ document }) => !document?.hasVariants,
    }),
    defineField({
      name: "sizes",
      title: "Available Sizes",
      type: "array",
      of: [{ type: "reference", to: { type: "productSize" } }],
      hidden: ({ document }) =>
        !document?.hasVariants || !!document?.useAllSizes,
      description: "Select specific sizes for this product",
    }),
    defineField({
      name: "useAllColors",
      title: "Use All Available Colors",
      type: "boolean",
      description:
        "Enable to automatically include all active colors. Disable to manually select specific colors.",
      initialValue: false,
      hidden: ({ document }) => !document?.hasVariants,
    }),
    defineField({
      name: "colors",
      title: "Available Colors",
      type: "array",
      of: [{ type: "reference", to: { type: "productColor" } }],
      hidden: ({ document }) =>
        !document?.hasVariants || !!document?.useAllColors,
      description: "Select specific colors for this product",
    }),
    // Vendor-specific fields
    defineField({
      name: "profitMargin",
      title: "Profit Margin (%)",
      type: "number",
      validation: (Rule) => Rule.required().min(0).max(100),
      initialValue: 10,
      description: "Vendor's profit margin percentage",
    }),
    defineField({
      name: "vendorProductStatus",
      title: "Vendor Product Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Pending Approval", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
          { title: "Pending Deactivation", value: "pending_deactivation" },
          { title: "Pending Activation", value: "pending_activation" },
        ],
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "approvalStatus",
      title: "Approval Status",
      type: "string",
      options: {
        list: [
          { title: "Awaiting Review", value: "awaiting" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "awaiting",
    }),
    defineField({
      name: "rejectionReason",
      title: "Rejection Reason",
      type: "text",
      description: "Reason for rejection by admin",
      hidden: ({ document }) => document?.approvalStatus !== "rejected",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      description: "When the product was submitted for approval",
    }),
    defineField({
      name: "approvedAt",
      title: "Approved At",
      type: "datetime",
      description: "When the product was approved by admin",
      hidden: ({ document }) => document?.approvalStatus !== "approved",
    }),
    defineField({
      name: "approvedBy",
      title: "Approved By",
      type: "string",
      description: "Admin who approved this product",
      hidden: ({ document }) => document?.approvalStatus !== "approved",
    }),
    defineField({
      name: "mainProductId",
      title: "Main Product ID",
      type: "string",
      description:
        "ID of the product in main products collection after approval",
      readOnly: true,
    }),
    // Analytics fields
    defineField({
      name: "totalSales",
      title: "Total Sales",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description: "Total number of units sold",
    }),
    defineField({
      name: "totalRevenue",
      title: "Total Revenue",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description: "Total revenue generated from this product",
    }),
    defineField({
      name: "totalProfit",
      title: "Total Profit",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description: "Total profit earned by vendor",
    }),
    defineField({
      name: "lastOrderDate",
      title: "Last Order Date",
      type: "datetime",
      readOnly: true,
      description: "Date of last order containing this product",
    }),
  ],
  preview: {
    select: {
      title: "name",
      vendor: "vendorEmail",
      status: "vendorProductStatus",
      media: "images",
      price: "price",
    },
    prepare(selection) {
      const { title, vendor, status, media, price } = selection;
      const image = media && media[0];
      return {
        title: title,
        subtitle: `${vendor} - ${status} - $${price}`,
        media: image,
      };
    },
  },
});
