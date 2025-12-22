import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productVariantType = defineType({
  name: "productVariant",
  title: "Product Variants",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Variant Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g., Vegetables, Delicious and Nuts, etc.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Brief description of this product variant category",
    }),
    defineField({
      name: "image",
      title: "Variant Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Representative image for this variant",
    }),
    defineField({
      name: "isActive",
      title: "Active Status",
      type: "boolean",
      initialValue: true,
      description: "Toggle to activate or deactivate this variant",
    }),
    defineField({
      name: "weight",
      title: "Display Order",
      type: "number",
      description:
        "Lower numbers appear first (e.g., 1 shows before 2). Must be unique.",
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom(async (value, context) => {
            const { document, getClient } = context;
            const client = getClient({ apiVersion: "2024-01-01" });

            if (!value) return true;

            const query = `count(*[_type == "productVariant" && weight == $weight && _id != $id])`;
            const params = { weight: value, id: document?._id || "" };
            const count = await client.fetch(query, params);

            return count === 0
              ? true
              : "This display order is already in use. Please choose a different number.";
          }),
      initialValue: 1,
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Custom title for SEO (optional)",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Custom description for SEO (optional)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      isActive: "isActive",
      weight: "weight",
    },
    prepare(selection) {
      const { title, media, isActive, weight } = selection;
      return {
        title: title,
        subtitle: `${
          isActive ? "🟢 Active" : "🔴 Inactive"
        } • Order: ${weight}`,
        media: media,
      };
    },
  },
});
