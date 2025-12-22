import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productSizeType = defineType({
  name: "productSize",
  title: "Product Size",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Size Name",
      type: "string",
      description: "e.g., Small, Medium, Large, XL, 2XL, etc.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "Size Value",
      type: "string",
      description: "Short code: S, M, L, XL, XXL, etc.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Active Status",
      type: "boolean",
      description: "Toggle to activate or deactivate this size",
      initialValue: true,
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

            const query = `count(*[_type == "productSize" && weight == $weight && _id != $id])`;
            const params = { weight: value, id: document?._id || "" };
            const count = await client.fetch(query, params);

            return count === 0
              ? true
              : "This display order is already in use. Please choose a different number.";
          }),
      initialValue: 1,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Optional size description or measurements",
    }),
  ],
  preview: {
    select: {
      title: "name",
      value: "value",
      isActive: "isActive",
      weight: "weight",
    },
    prepare(select) {
      return {
        title: select.title,
        subtitle: `${select.value} • ${
          select.isActive ? "🟢 Active" : "🔴 Inactive"
        } • Order: ${select.weight}`,
      };
    },
  },
});
