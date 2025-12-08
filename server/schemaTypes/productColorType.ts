import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productColorType = defineType({
  name: "productColor",
  title: "Product Color",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Color Name",
      type: "string",
      description: "e.g., Red, Blue, Black, White, etc.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hexCode",
      title: "Hex Color Code",
      type: "string",
      description: "e.g., #FF0000 for red",
      validation: (Rule) =>
        Rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
          name: "hex",
          invert: false,
        }),
    }),
    defineField({
      name: "isActive",
      title: "Active Status",
      type: "boolean",
      description: "Toggle to activate or deactivate this color",
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

            const query = `count(*[_type == "productColor" && weight == $weight && _id != $id])`;
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
    }),
  ],
  preview: {
    select: {
      title: "name",
      hexCode: "hexCode",
      isActive: "isActive",
      weight: "weight",
    },
    prepare(select) {
      return {
        title: select.title,
        subtitle: `${select.hexCode} • ${
          select.isActive ? "🟢 Active" : "🔴 Inactive"
        } • Order: ${select.weight}`,
        media: undefined,
      };
    },
  },
});
