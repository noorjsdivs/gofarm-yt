import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const vendorApplicationType = defineType({
  name: "vendorApplication",
  title: "Vendor Application",
  type: "document",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
      description: "Reference to the user who applied",
    }),
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Firebase User ID",
    }),
    defineField({
      name: "userEmail",
      title: "User Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessType",
      title: "Business Type",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Individual/Sole Proprietor", value: "individual" },
          { title: "Partnership", value: "partnership" },
          { title: "Limited Liability Company (LLC)", value: "llc" },
          { title: "Corporation", value: "corporation" },
          { title: "Cooperative", value: "cooperative" },
        ],
      },
    }),
    defineField({
      name: "businessDescription",
      title: "Business Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessAddress",
      title: "Business Address",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessPhone",
      title: "Business Phone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessEmail",
      title: "Business Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "taxId",
      title: "Tax ID / EIN",
      type: "string",
    }),
    defineField({
      name: "websiteUrl",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "productsCategory",
      title: "Primary Product Category",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Fresh Fruits", value: "fruits" },
          { title: "Vegetables", value: "vegetables" },
          { title: "Dairy Products", value: "dairy" },
          { title: "Meat & Poultry", value: "meat" },
          { title: "Bakery Items", value: "bakery" },
          { title: "Organic Products", value: "organic" },
          { title: "Packaged Foods", value: "packaged" },
          { title: "Beverages", value: "beverages" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "estimatedMonthlyRevenue",
      title: "Estimated Monthly Sales Volume",
      type: "string",
      options: {
        list: [
          { title: "$0 - $1,000", value: "0-1000" },
          { title: "$1,000 - $5,000", value: "1000-5000" },
          { title: "$5,000 - $10,000", value: "5000-10000" },
          { title: "$10,000 - $25,000", value: "10000-25000" },
          { title: "$25,000 - $50,000", value: "25000-50000" },
          { title: "$50,000+", value: "50000+" },
        ],
      },
    }),
    defineField({
      name: "status",
      title: "Application Status",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Pending Review", value: "pending" },
          { title: "Under Review", value: "reviewing" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "appliedAt",
      title: "Applied At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "reviewedAt",
      title: "Reviewed At",
      type: "datetime",
    }),
    defineField({
      name: "reviewedBy",
      title: "Reviewed By",
      type: "string",
      description: "Email of admin who reviewed the application",
    }),
    defineField({
      name: "approvalNotes",
      title: "Approval Notes",
      type: "text",
      description: "Internal notes for admin review",
    }),
    defineField({
      name: "rejectionReason",
      title: "Rejection Reason",
      type: "text",
      description: "Reason for rejection (shown to applicant)",
      hidden: ({ document }) => document?.status !== "rejected",
    }),
    defineField({
      name: "adminNotes",
      title: "Admin Notes",
      type: "text",
      description: "Private admin notes",
    }),
  ],
  preview: {
    select: {
      businessName: "businessName",
      userEmail: "userEmail",
      status: "status",
      appliedAt: "appliedAt",
    },
    prepare(select) {
      const { businessName, userEmail, status, appliedAt } = select;

      const statusEmojis: Record<string, string> = {
        pending: "⏳",
        reviewing: "🔍",
        approved: "✅",
        rejected: "❌",
      };

      return {
        title: `${statusEmojis[status] || ""} ${businessName}`,
        subtitle: `${userEmail} • ${new Date(appliedAt).toLocaleDateString()}`,
      };
    },
  },
});
