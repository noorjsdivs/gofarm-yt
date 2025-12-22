import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const addressType = defineType({
  name: "address",
  title: "Addresses",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      description: "Full name for this address",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "email",
      title: "User Email",
      type: "email",
      description: "Email of the user this address belongs to",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      description: "Reference to the user this address belongs to",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      description: "Phone number for this address (optional)",
    }),
    defineField({
      name: "address",
      title: "Street Address",
      type: "string",
      description: "The street address including apartment/unit number",
      validation: (Rule) => Rule.required().min(5).max(200),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "state",
      title: "State/Province",
      type: "string",
      description: "State, province, or region",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "zip",
      title: "ZIP/Postal Code",
      type: "string",
      description: "Postal code for this address",
      validation: (Rule) => Rule.required().max(20),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      description: "Country for this address",
      initialValue: "United States",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "countryCode",
      title: "Country Code",
      type: "string",
      description: "Two letter country code (e.g. US, CA, GB)",
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: "stateCode",
      title: "State Code",
      type: "string",
      description: "State/Province code for international addresses",
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: "subArea",
      title: "Sub Area",
      type: "string",
      description: "Sub area, district, or neighborhood",
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: "type",
      title: "Address Type",
      type: "string",
      description: "Type of address (home, office, other)",
      options: {
        list: [
          { title: "Home", value: "home" },
          { title: "Office", value: "office" },
          { title: "Other", value: "other" },
        ],
      },
      initialValue: "home",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "default",
      title: "Default Address",
      type: "boolean",
      description: "Is this the default shipping address?",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "address",
      city: "city",
      state: "state",
      isDefault: "default",
      type: "type",
    },
    prepare({ title, subtitle, city, state, isDefault, type }) {
      return {
        title: `${title} ${isDefault ? "(Default)" : ""}`,
        subtitle: `${type}: ${subtitle}, ${city}, ${state}`,
      };
    },
  },
});
