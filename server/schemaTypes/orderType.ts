import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    {
      name: "invoice",
      type: "object",
      fields: [
        { name: "id", type: "string" },
        { name: "number", type: "string" },
        { name: "hosted_invoice_url", type: "url" },
      ],
    },
    defineField({
      name: "stripeCheckoutSessionId",
      title: "Stripe Checkout Session ID",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "stripe",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "stripe",
    }),
    defineField({
      name: "firebaseUid",
      title: "Firebase User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Firebase UID of the user who placed this order",
    }),
    defineField({
      name: "clerkPaymentId",
      title: "Clerk Payment ID",
      type: "string",
      description: "Clerk payment session or transaction ID",
      hidden: ({ document }) => document?.paymentMethod !== "clerk",
    }),
    defineField({
      name: "clerkPaymentStatus",
      title: "Clerk Payment Status",
      type: "string",
      description: "Status of Clerk payment",
      hidden: ({ document }) => document?.paymentMethod !== "clerk",
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "stripe",
    }),
    // SSLCommerz payment fields
    defineField({
      name: "sslcommerzTransactionId",
      title: "SSLCommerz Transaction ID",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "sslcommerz",
    }),
    defineField({
      name: "sslcommerzSessionKey",
      title: "SSLCommerz Session Key",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "sslcommerz",
    }),
    defineField({
      name: "sslcommerzValidationId",
      title: "SSLCommerz Validation ID",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "sslcommerz",
    }),
    defineField({
      name: "sslcommerzBankTransactionId",
      title: "SSLCommerz Bank Transaction ID",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "sslcommerz",
    }),
    defineField({
      name: "sslcommerzCardType",
      title: "SSLCommerz Card Type",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "sslcommerz",
    }),
    defineField({
      name: "sslcommerzCardIssuer",
      title: "SSLCommerz Card Issuer",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "sslcommerz",
    }),
    defineField({
      name: "sslcommerzCardBrand",
      title: "SSLCommerz Card Brand",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "sslcommerz",
    }),
    defineField({
      name: "sslcommerzCardNo",
      title: "SSLCommerz Card Number (Masked)",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "sslcommerz",
    }),
    defineField({
      name: "sslcommerzTransactionDate",
      title: "SSLCommerz Transaction Date",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "sslcommerz",
    }),
    defineField({
      name: "paidAt",
      title: "Paid At",
      type: "datetime",
      description: "Timestamp when payment was completed",
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `${select.price * select.quantity}`,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "tax",
      title: "Tax Amount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "shipping",
      title: "Shipping Cost",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "productDiscount",
      title: "Product Discount",
      type: "number",
      description: "Total discount from product-level discounts",
      initialValue: 0,
    }),
    defineField({
      name: "businessDiscount",
      title: "Business Discount",
      type: "number",
      description: "2% discount for business accounts",
      initialValue: 0,
    }),
    defineField({
      name: "coupon",
      title: "Applied Coupon",
      type: "object",
      fields: [
        defineField({
          name: "code",
          title: "Coupon Code",
          type: "string",
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
          },
        }),
        defineField({
          name: "discountValue",
          title: "Discount Value",
          type: "number",
          description:
            "Percentage (e.g., 20 for 20%) or fixed amount (e.g., 10 for $10)",
        }),
        defineField({
          name: "discountAmount",
          title: "Discount Amount Applied",
          type: "number",
          description: "Actual discount amount applied to this order",
        }),
        defineField({
          name: "couponRef",
          title: "Coupon Reference",
          type: "reference",
          to: [{ type: "coupon" }],
        }),
      ],
      description: "Coupon applied to this order with discount details",
      preview: {
        select: {
          code: "code",
          discountType: "discountType",
          discountValue: "discountValue",
          discountAmount: "discountAmount",
        },
        prepare(select) {
          const typeDisplay =
            select.discountType === "percentage"
              ? `${select.discountValue}% off`
              : `$${select.discountValue} off`;

          return {
            title: `🎟️ ${select.code}`,
            subtitle: `${typeDisplay} | Saved: $${
              select.discountAmount?.toFixed(2) || 0
            }`,
          };
        },
      },
    }),
    defineField({
      name: "address",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({ name: "state", title: "State", type: "string" }),
        defineField({ name: "zip", title: "Zip Code", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "address", title: "Address", type: "string" }),
        defineField({ name: "name", title: "Name", type: "string" }),
      ],
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Address Confirmed", value: "address_confirmed" },
          { title: "Order Confirmed", value: "order_confirmed" },
          { title: "Packed", value: "packed" },
          { title: "Ready for Delivery", value: "ready_for_delivery" },
          { title: "Out for Delivery", value: "out_for_delivery" },
          { title: "Delivered", value: "delivered" },
          { title: "Completed", value: "completed" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Rescheduled", value: "rescheduled" },
          { title: "Failed Delivery", value: "failed_delivery" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "Cash on Delivery", value: "cash_on_delivery" },
          { title: "Stripe", value: "stripe" },
          { title: "SSLCommerz", value: "sslcommerz" },
          { title: "Clerk", value: "clerk" },
          { title: "Card", value: "card" },
        ],
      },
    }),
    // Employee tracking fields
    defineField({
      name: "addressConfirmedBy",
      title: "Address Confirmed By",
      type: "string",
      description: "Call center employee who confirmed the address",
    }),
    defineField({
      name: "addressConfirmedAt",
      title: "Address Confirmed At",
      type: "datetime",
    }),
    defineField({
      name: "orderConfirmedBy",
      title: "Order Confirmed By",
      type: "string",
      description: "Call center employee who confirmed the order",
    }),
    defineField({
      name: "orderConfirmedAt",
      title: "Order Confirmed At",
      type: "datetime",
    }),
    defineField({
      name: "packedBy",
      title: "Packed By",
      type: "string",
      description: "Packer employee who packed the order",
    }),
    defineField({
      name: "packedAt",
      title: "Packed At",
      type: "datetime",
    }),
    defineField({
      name: "packingNotes",
      title: "Packing Notes",
      type: "text",
      description: "Notes added by packer during packing",
    }),
    defineField({
      name: "assignedWarehouseBy",
      title: "Assigned to Warehouse By",
      type: "string",
      description: "Employee who assigned order to warehouse",
    }),
    defineField({
      name: "assignedWarehouseAt",
      title: "Assigned to Warehouse At",
      type: "datetime",
    }),
    defineField({
      name: "dispatchedBy",
      title: "Dispatched By",
      type: "string",
      description: "Warehouse employee who dispatched the order",
    }),
    defineField({
      name: "dispatchedAt",
      title: "Dispatched At",
      type: "datetime",
    }),
    defineField({
      name: "assignedDeliverymanId",
      title: "Assigned Deliveryman ID",
      type: "string",
      description: "ID of the deliveryman assigned to this order",
    }),
    defineField({
      name: "assignedDeliverymanName",
      title: "Assigned Deliveryman Name",
      type: "string",
      description: "Name of the deliveryman assigned to this order",
    }),
    defineField({
      name: "deliveredBy",
      title: "Delivered By",
      type: "string",
      description: "Deliveryman who delivered the order",
    }),
    defineField({
      name: "deliveredAt",
      title: "Delivered At",
      type: "datetime",
    }),
    defineField({
      name: "deliveryNotes",
      title: "Delivery Notes",
      type: "text",
      description: "Notes from deliveryman during delivery",
    }),
    defineField({
      name: "deliveryAttempts",
      title: "Delivery Attempts",
      type: "number",
      initialValue: 0,
      description: "Number of delivery attempts made",
    }),
    defineField({
      name: "rescheduledDate",
      title: "Rescheduled Delivery Date",
      type: "datetime",
      description: "New delivery date if rescheduled",
    }),
    defineField({
      name: "rescheduledReason",
      title: "Rescheduled Reason",
      type: "text",
      description: "Reason for rescheduling delivery",
    }),
    defineField({
      name: "cashCollected",
      title: "Cash Collected",
      type: "boolean",
      initialValue: false,
      description: "Whether cash was collected from customer",
    }),
    defineField({
      name: "cashCollectedAmount",
      title: "Cash Collected Amount",
      type: "number",
      description: "Amount of cash collected",
    }),
    defineField({
      name: "cashCollectedAt",
      title: "Cash Collected At",
      type: "datetime",
    }),
    // Cash submission to accounts tracking
    defineField({
      name: "cashSubmittedToAccounts",
      title: "Cash Submitted to Accounts",
      type: "boolean",
      initialValue: false,
      description: "Whether deliveryman has submitted cash to accounts",
    }),
    defineField({
      name: "cashSubmittedBy",
      title: "Cash Submitted By",
      type: "string",
      description: "Deliveryman who submitted the cash",
    }),
    defineField({
      name: "cashSubmittedAt",
      title: "Cash Submitted At",
      type: "datetime",
      description: "When cash was submitted to accounts",
    }),
    defineField({
      name: "cashSubmissionNotes",
      title: "Cash Submission Notes",
      type: "text",
      description: "Notes from deliveryman during submission",
    }),
    defineField({
      name: "assignedAccountsEmployeeId",
      title: "Assigned Accounts Employee ID",
      type: "string",
      description: "ID of accounts employee assigned to receive cash",
    }),
    defineField({
      name: "assignedAccountsEmployeeName",
      title: "Assigned Accounts Employee Name",
      type: "string",
      description: "Name of accounts employee assigned to receive cash",
    }),
    defineField({
      name: "cashSubmissionStatus",
      title: "Cash Submission Status",
      type: "string",
      options: {
        list: [
          { title: "Not Submitted", value: "not_submitted" },
          { title: "Pending Review", value: "pending" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "not_submitted",
      description: "Status of cash submission to accounts",
    }),
    defineField({
      name: "cashSubmissionRejectionReason",
      title: "Cash Submission Rejection Reason",
      type: "text",
      description: "Reason why accounts rejected the cash submission",
    }),
    defineField({
      name: "paymentReceivedBy",
      title: "Payment Received By",
      type: "string",
      description: "Accounts employee who received payment from deliveryman",
    }),
    defineField({
      name: "paymentReceivedAt",
      title: "Payment Received At",
      type: "datetime",
    }),
    // Cancellation tracking fields
    defineField({
      name: "cancellationRequested",
      title: "Cancellation Requested",
      type: "boolean",
      initialValue: false,
      description:
        "Whether customer has requested cancellation (pending admin approval)",
    }),
    defineField({
      name: "cancellationRequestedAt",
      title: "Cancellation Requested At",
      type: "datetime",
      description: "When the customer requested cancellation",
    }),
    defineField({
      name: "cancellationRequestReason",
      title: "Cancellation Request Reason",
      type: "text",
      description: "Reason provided by customer for cancellation request",
    }),
    defineField({
      name: "cancelledAt",
      title: "Cancelled At",
      type: "datetime",
      description: "When the order was actually cancelled",
    }),
    defineField({
      name: "cancelledBy",
      title: "Cancelled By",
      type: "string",
      description: "Who cancelled the order (customer, admin email, or system)",
    }),
    defineField({
      name: "cancellationReason",
      title: "Cancellation Reason",
      type: "text",
      description: "Final cancellation reason (used when actually cancelled)",
    }),
    defineField({
      name: "amountPaid",
      title: "Amount Paid",
      type: "number",
      description: "Total amount paid by customer (for refund tracking)",
    }),
    defineField({
      name: "refundedToWallet",
      title: "Refunded to Wallet",
      type: "boolean",
      initialValue: false,
      description: "Whether refund was added to customer's wallet",
    }),
    defineField({
      name: "refundAmount",
      title: "Refund Amount",
      type: "number",
      description: "Amount refunded to wallet",
    }),
    defineField({
      name: "statusHistory",
      title: "Status History",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "status",
              title: "Status",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "changedBy",
              title: "Changed By",
              type: "string",
              description: "Employee email or admin who changed the status",
            }),
            defineField({
              name: "changedByRole",
              title: "Changed By Role",
              type: "string",
              options: {
                list: [
                  { title: "Admin", value: "admin" },
                  { title: "Call Center", value: "callcenter" },
                  { title: "Packer", value: "packer" },
                  { title: "Warehouse", value: "warehouse" },
                  { title: "Delivery Man", value: "deliveryman" },
                  { title: "In-Charge", value: "incharge" },
                  { title: "Accounts", value: "accounts" },
                  { title: "System", value: "system" },
                ],
              },
            }),
            defineField({
              name: "changedAt",
              title: "Changed At",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "notes",
              title: "Notes",
              type: "text",
            }),
          ],
          preview: {
            select: {
              status: "status",
              changedBy: "changedBy",
              changedAt: "changedAt",
            },
            prepare(select) {
              return {
                title: select.status,
                subtitle: `By ${select.changedBy} on ${new Date(
                  select.changedAt
                ).toLocaleDateString()}`,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
      status: "status",
      paymentStatus: "paymentStatus",
    },
    prepare(select) {
      const orderIdSnippet = `${select.orderId.slice(
        0,
        5
      )}...${select.orderId.slice(-5)}`;

      // Format status for display
      const statusMap: Record<string, string> = {
        pending: "🔴 Pending",
        address_confirmed: "🟡 Address Confirmed",
        order_confirmed: "🟢 Order Confirmed",
        packed: "📦 Packed",
        ready_for_delivery: "🏭 Ready for Delivery",
        out_for_delivery: "🚚 Out for Delivery",
        delivered: "✅ Delivered",
        completed: "✔️ Completed",
        cancelled: "❌ Cancelled",
        rescheduled: "🔄 Rescheduled",
        failed_delivery: "⚠️ Failed Delivery",
      };

      const statusDisplay = statusMap[select.status] || select.status;
      const paymentDisplay =
        select.paymentStatus === "paid"
          ? "💳 Paid"
          : "💰 " + select.paymentStatus;

      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${statusDisplay} | ${select.amount} ${select.currency} | ${paymentDisplay}`,
        media: BasketIcon,
      };
    },
  },
});
