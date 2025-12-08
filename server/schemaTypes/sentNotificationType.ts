import { BellIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const sentNotificationType = defineType({
  name: "sentNotification",
  title: "Sent Notification",
  type: "document",
  icon: BellIcon,
  fields: [
    defineField({
      name: "notificationId",
      title: "Notification ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Notification Type",
      type: "string",
      options: {
        list: [
          { title: "Promo", value: "promo" },
          { title: "Order Update", value: "order" },
          { title: "System", value: "system" },
          { title: "Marketing", value: "marketing" },
          { title: "General", value: "general" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "string",
      options: {
        list: [
          { title: "Low", value: "low" },
          { title: "Medium", value: "medium" },
          { title: "High", value: "high" },
          { title: "Urgent", value: "urgent" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sentAt",
      title: "Sent At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sentBy",
      title: "Sent By",
      type: "string",
      description: "Admin email who sent this notification",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "actionUrl",
      title: "Action URL",
      type: "url",
      description: "Optional URL for notification action",
    }),
    defineField({
      name: "recipientCount",
      title: "Recipient Count",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "recipients",
      title: "Recipients",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "email",
              title: "Email",
              type: "string",
              validation: (Rule) => Rule.required().email(),
            }),
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "delivered",
              title: "Delivered",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "read",
              title: "Read",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "readAt",
              title: "Read At",
              type: "datetime",
            }),
          ],
          preview: {
            select: {
              email: "email",
              name: "name",
              delivered: "delivered",
              read: "read",
            },
            prepare(select) {
              const { email, name, delivered, read } = select;
              return {
                title: name,
                subtitle: `${email} • ${delivered ? "Delivered" : "Failed"} • ${
                  read ? "Read" : "Unread"
                }`,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      type: "type",
      sentAt: "sentAt",
      recipientCount: "recipientCount",
    },
    prepare(select) {
      const { title, type, sentAt, recipientCount } = select;
      return {
        title: title,
        subtitle: `${type} • ${recipientCount} recipients • ${new Date(
          sentAt
        ).toLocaleDateString()}`,
        media: BellIcon,
      };
    },
  },
});
