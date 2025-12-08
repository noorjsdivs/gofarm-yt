import {
  BasketIcon,
  BillIcon,
  BulbFilledIcon,
  CubeIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  FolderIcon,
  HomeIcon,
  ImageIcon,
  StarIcon,
  TagIcon,
  TrolleyIcon,
  UserIcon,
  UsersIcon,
} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('GoFarm Admin')
    .items([
      // Products Section
      S.listItem()
        .title('Products')
        .icon(TrolleyIcon)
        .child(
          S.list()
            .title('Products')
            .items([
              S.listItem()
                .title('All Products')
                .icon(TrolleyIcon)
                .schemaType('product')
                .child(
                  S.documentTypeList('product')
                    .title('All Products')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),

              S.listItem()
                .title('Product Variants')
                .icon(TagIcon)
                .schemaType('productVariant')
                .child(
                  S.documentTypeList('productVariant')
                    .title('Product Variants')
                    .defaultOrdering([{field: 'weight', direction: 'asc'}]),
                ),

              S.listItem()
                .title('Product Weights')
                .icon(TagIcon)
                .schemaType('productWeight')
                .child(
                  S.documentTypeList('productWeight')
                    .title('Product Weights')
                    .defaultOrdering([{field: 'weight', direction: 'asc'}]),
                ),

              S.listItem()
                .title('Product Sizes')
                .icon(TagIcon)
                .schemaType('productSize')
                .child(
                  S.documentTypeList('productSize')
                    .title('Product Sizes')
                    .defaultOrdering([{field: 'weight', direction: 'asc'}]),
                ),

              S.listItem()
                .title('Product Colors')
                .icon(TagIcon)
                .schemaType('productColor')
                .child(
                  S.documentTypeList('productColor')
                    .title('Product Colors')
                    .defaultOrdering([{field: 'weight', direction: 'asc'}]),
                ),

              S.listItem()
                .title('Categories')
                .icon(FolderIcon)
                .schemaType('category')
                .child(
                  S.documentTypeList('category')
                    .title('Categories')
                    .defaultOrdering([{field: 'title', direction: 'asc'}]),
                ),

              S.listItem()
                .title('Brands')
                .icon(StarIcon)
                .schemaType('brand')
                .child(
                  S.documentTypeList('brand')
                    .title('Brands')
                    .defaultOrdering([{field: 'title', direction: 'asc'}]),
                ),

              S.listItem()
                .title('Reviews')
                .icon(DocumentTextIcon)
                .schemaType('review')
                .child(
                  S.documentTypeList('review')
                    .title('Reviews')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),
              S.divider(),
              S.listItem()
                .title('Vendor Products')
                .icon(DocumentTextIcon)
                .schemaType('vendorProduct')
                .child(
                  S.documentTypeList('vendorProduct')
                    .title('Vendor Products')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),
            ]),
        ),

      S.divider(),

      // Banners Section
      S.listItem()
        .title('Banners')
        .icon(ImageIcon)
        .child(
          S.list()
            .title('Banners')
            .items([
              S.listItem()
                .title('Home Banners')
                .icon(ImageIcon)
                .schemaType('banner')
                .child(
                  S.documentTypeList('banner')
                    .title('Home Banners')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),
            ]),
        ),

      S.divider(),

      // Orders & Subscriptions Section
      S.listItem()
        .title('Orders & Subscriptions')
        .icon(BasketIcon)
        .child(
          S.list()
            .title('Orders & Subscriptions')
            .items([
              S.listItem()
                .title('All Orders')
                .icon(BasketIcon)
                .schemaType('order')
                .child(
                  S.documentTypeList('order')
                    .title('All Orders')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),

              S.listItem()
                .title('Pending Orders')
                .icon(BasketIcon)
                .schemaType('order')
                .child(
                  S.documentTypeList('order')
                    .title('Pending Orders')
                    .filter('_type == "order" && status == "pending"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),

              S.listItem()
                .title('Processing Orders')
                .icon(BasketIcon)
                .schemaType('order')
                .child(
                  S.documentTypeList('order')
                    .title('Processing Orders')
                    .filter('_type == "order" && status == "processing"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),

              S.listItem()
                .title('Delivered Orders')
                .icon(BasketIcon)
                .schemaType('order')
                .child(
                  S.documentTypeList('order')
                    .title('Delivered Orders')
                    .filter('_type == "order" && status == "delivered"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),

              S.listItem()
                .title('Cancelled Orders')
                .icon(BasketIcon)
                .schemaType('order')
                .child(
                  S.documentTypeList('order')
                    .title('Cancelled Orders')
                    .filter('_type == "order" && status == "cancelled"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),

              S.divider(),

              S.listItem()
                .title('Subscriptions')
                .icon(BillIcon)
                .schemaType('subscription')
                .child(
                  S.documentTypeList('subscription')
                    .title('Subscriptions')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),
            ]),
        ),

      S.divider(),

      // Users & Access Section
      S.listItem()
        .title('Users & Access')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Users & Access')
            .items([
              S.listItem()
                .title('All Users')
                .icon(UserIcon)
                .schemaType('user')
                .child(
                  S.documentTypeList('user')
                    .title('All Users')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),

              S.listItem()
                .title('User Addresses')
                .icon(HomeIcon)
                .schemaType('address')
                .child(
                  S.documentTypeList('address')
                    .title('User Addresses')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),

              S.listItem()
                .title('Access Requests')
                .icon(EnvelopeIcon)
                .schemaType('userAccessRequest')
                .child(
                  S.documentTypeList('userAccessRequest')
                    .title('Access Requests')
                    .filter('_type == "userAccessRequest"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),
              S.divider(),
              S.listItem()
                .title('Local Stores')
                .icon(EnvelopeIcon)
                .schemaType('store')
                .child(
                  S.documentTypeList('store')
                    .title('Local Stores')
                    .filter('_type == "store"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),
            ]),
        ),

      S.divider(),

      // Blog Section
      S.listItem()
        .title('Blog')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('Blog Posts')
                .icon(DocumentTextIcon)
                .schemaType('blog')
                .child(
                  S.documentTypeList('blog')
                    .title('Blog Posts')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),

              S.listItem()
                .title('Blog Categories')
                .icon(FolderIcon)
                .schemaType('blogcategory')
                .child(
                  S.documentTypeList('blogcategory')
                    .title('Blog Categories')
                    .defaultOrdering([{field: 'title', direction: 'asc'}]),
                ),

              S.listItem()
                .title('Authors')
                .icon(UserIcon)
                .schemaType('author')
                .child(
                  S.documentTypeList('author')
                    .title('Authors')
                    .defaultOrdering([{field: 'name', direction: 'asc'}]),
                ),
            ]),
        ),

      S.divider(),

      // Communication Section
      S.listItem()
        .title('Communication')
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title('Communication')
            .items([
              S.listItem()
                .title('Contact Submissions')
                .icon(EnvelopeIcon)
                .schemaType('contact')
                .child(
                  S.documentTypeList('contact')
                    .title('Contact Submissions')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),

              S.listItem()
                .title('Sent Notifications')
                .icon(BillIcon)
                .schemaType('sentNotification')
                .child(
                  S.documentTypeList('sentNotification')
                    .title('Sent Notifications')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),
            ]),
        ),
      S.divider(),

      // Coupon and Discount Section
      S.listItem()
        .title('Coupon and Discount')
        .icon(BulbFilledIcon)
        .child(
          S.list()
            .title('Coupon and Discount')
            .items([
              S.listItem()
                .title('Coupons')
                .icon(CubeIcon)
                .schemaType('coupon')
                .child(
                  S.documentTypeList('coupon')
                    .title('Coupons')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
                ),
            ]),
        ),
    ])
