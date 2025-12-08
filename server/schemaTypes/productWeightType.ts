import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productWeightType = defineType({
  name: "productWeight",
  title: "Product Weight",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Weight Name",
      type: "string",
      description: "e.g., 500gm, 1 Kilo, 2 Kilos, etc.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "Weight Value",
      type: "string",
      description: "Short code: 500g, 1kg, 2kg, etc.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "unit",
      title: "Unit",
      type: "string",
      description: "Weight unit",
      options: {
        list: [
          { title: "Grams (g)", value: "g" },
          { title: "Kilograms (kg)", value: "kg" },
          { title: "Pounds (lb)", value: "lb" },
          { title: "Ounces (oz)", value: "oz" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "numericValue",
      title: "Numeric Value",
      type: "number",
      description: "Numeric weight value (for sorting and calculations)",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "isActive",
      title: "Active Status",
      type: "boolean",
      description: "Toggle to activate or deactivate this weight",
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

            const query = `count(*[_type == "productWeight" && weight == $weight && _id != $id])`;
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
      description: "Optional weight description",
    }),
  ],
  preview: {
    select: {
      title: "name",
      value: "value",
      unit: "unit",
      isActive: "isActive",
      weight: "weight",
    },
    prepare(select) {
      return {
        title: select.title,
        subtitle: `${select.value} (${select.unit}) • ${
          select.isActive ? "🟢 Active" : "🔴 Inactive"
        } • Order: ${select.weight}`,
      };
    },
  },
});
