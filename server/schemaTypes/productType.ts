import {TrolleyIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
      description: 'Base price for the base weight',
    }),
    defineField({
      name: 'baseWeight',
      title: 'Base Weight',
      type: 'number',
      description: 'Base weight in grams for price calculation (e.g., 500 for 500gm)',
      validation: (Rule) => Rule.min(0),
      hidden: ({document}) => !document?.hasWeights,
    }),
    defineField({
      name: 'discount',
      title: 'Discount',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: {type: 'brand'},
    }),

    defineField({
      name: 'status',
      title: 'Product Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Hot', value: 'hot'},
          {title: 'Sale', value: 'sale'},
        ],
      },
    }),
    defineField({
      name: 'variant',
      title: 'Product Variant',
      type: 'reference',
      to: {type: 'productVariant'},
      description: 'Select the product variant/type category',
    }),
    defineField({
      name: 'hasWeights',
      title: 'Has Weights',
      type: 'boolean',
      description: 'Enable if this product has weight options (e.g., 500gm, 1kg)',
      initialValue: false,
    }),
    defineField({
      name: 'useAllWeights',
      title: 'Use All Available Weights',
      type: 'boolean',
      description:
        'Enable to automatically include all active weights. Disable to manually select specific weights.',
      initialValue: false,
      hidden: ({document}) => !document?.hasWeights,
    }),
    defineField({
      name: 'weights',
      title: 'Available Weights',
      type: 'array',
      of: [{type: 'reference', to: {type: 'productWeight'}}],
      hidden: ({document}) => !document?.hasWeights || !!document?.useAllWeights,
      description: 'Select specific weights for this product',
    }),
    defineField({
      name: 'hasVariants',
      title: 'Has Size/Color Variants',
      type: 'boolean',
      description: 'Enable if this product has size/color variants',
      initialValue: false,
    }),
    defineField({
      name: 'useAllSizes',
      title: 'Use All Available Sizes',
      type: 'boolean',
      description:
        'Enable to automatically include all active sizes. Disable to manually select specific sizes.',
      initialValue: false,
      hidden: ({document}) => !document?.hasVariants,
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{type: 'reference', to: {type: 'productSize'}}],
      hidden: ({document}) => !document?.hasVariants || !!document?.useAllSizes,
      description: 'Select specific sizes for this product',
    }),
    defineField({
      name: 'useAllColors',
      title: 'Use All Available Colors',
      type: 'boolean',
      description:
        'Enable to automatically include all active colors. Disable to manually select specific colors.',
      initialValue: false,
      hidden: ({document}) => !document?.hasVariants,
    }),
    defineField({
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [{type: 'reference', to: {type: 'productColor'}}],
      hidden: ({document}) => !document?.hasVariants || !!document?.useAllColors,
      description: 'Select specific colors for this product',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Product',
      type: 'boolean',
      description: 'Toggle to Featured on or off',
      initialValue: false,
    }),
    defineField({
      name: 'isOffer',
      title: 'Offer Product',
      type: 'boolean',
      description: 'Toggle to show this product in Offer section',
      initialValue: false,
    }),
    defineField({
      name: 'enableRatingsManagement',
      title: 'Ratings Management',
      type: 'boolean',
      description: 'Enable to view and manage product ratings and reviews',
      initialValue: false,
    }),
    defineField({
      name: 'averageRating',
      title: 'Average Rating',
      type: 'number',
      readOnly: true,
      description: 'Calculated average rating from approved reviews',
      validation: (Rule) => Rule.min(0).max(5),
      hidden: ({document}) => !document?.enableRatingsManagement,
    }),
    defineField({
      name: 'totalReviews',
      title: 'Total Reviews',
      type: 'number',
      readOnly: true,
      initialValue: 0,
      description: 'Total number of approved reviews',
      hidden: ({document}) => !document?.enableRatingsManagement,
    }),
    defineField({
      name: 'ratingDistribution',
      title: 'Rating Distribution',
      type: 'object',
      readOnly: true,
      description: 'Distribution of ratings (1-5 stars)',
      hidden: ({document}) => !document?.enableRatingsManagement,
      fields: [
        defineField({
          name: 'fiveStars',
          title: '5 Stars',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'fourStars',
          title: '4 Stars',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'threeStars',
          title: '3 Stars',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'twoStars',
          title: '2 Stars',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'oneStar',
          title: '1 Star',
          type: 'number',
          initialValue: 0,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images',
      subtitle: 'price',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      const image = media && media[0]
      return {
        title: title,
        subtitle: `$${subtitle}`,
        media: image,
      }
    },
  },
})
