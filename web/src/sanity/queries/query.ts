import { defineQuery } from "next-sanity";

const BANNER_QUERY = defineQuery(
  `*[_type == 'banner'] | order(publishedAt desc)`
);
const FEATURED_CATEGORY_QUERY = defineQuery(
  `*[_type == 'category' && featured == true] | order(name desc)`
);
const ALL_PRODUCTS_QUERY = defineQuery(`*[_type=="product"] | order(name asc)`);
const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
  ...,"categories": categories[]->title
}`
);
const FEATURE_PRODUCTS = defineQuery(
  `*[_type == 'product' && isFeatured == true] | order(name asc){
  ...,"categories": categories[]->title
}`
);
const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(name asc) `);

const LATEST_BLOG_QUERY = defineQuery(
  ` *[_type == 'blog' && isLatest == true]|order(name asc){
    ...,
    blogcategories[]->{
    title
  }
  }`
);

const GET_ALL_BLOG = defineQuery(
  `*[_type == 'blog'] | order(publishedAt desc)[0...$quantity]{
  ...,  
     blogcategories[]->{
    title
}
    }
  `
);

const SINGLE_BLOG_QUERY =
  defineQuery(`*[_type == "blog" && slug.current == $slug][0]{
  ..., 
    author->{
    name,
    image,
  },
  blogcategories[]->{
    title,
    "slug": slug.current,
  },
}`);

const BLOG_CATEGORIES = defineQuery(
  `*[_type == "blog"]{
     blogcategories[]->{
    ...
    }
  }`
);

const OTHERS_BLOG_QUERY = defineQuery(`*[
  _type == "blog"
  && defined(slug.current)
  && slug.current != $slug
]|order(publishedAt desc)[0...$quantity]{
...
  publishedAt,
  title,
  mainImage,
  slug,
  author->{
    name,
    image,
  },
  categories[]->{
    title,
    "slug": slug.current,
  }
}`);

// Address Query
const ADDRESS_QUERY = defineQuery(
  `*[_type=="address"] | order(publishedAt desc)`
);

const ALLCATEGORIES_QUERY = defineQuery(
  `*[_type == 'category'] | order(name asc) [0...$quantity]`
);

const ADMIN_CATEGORIES_QUERY = defineQuery(
  `*[_type == 'category'] | order(title asc) {
    _id,
    title,
    slug,
    description,
    featured
  }`
);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug] | order(name asc) [0]{
    ...,
    "averageRating": math::avg(*[_type == "review" && product._ref == ^._id && status == "approved"].rating),
    "totalReviews": count(*[_type == "review" && product._ref == ^._id && status == "approved"]),
    variant->{
      _id,
      title,
      slug
    },
    brand->{
      _id,
      title,
      slug
    },
    categories[]->{
      _id,
      title,
      slug
    },
    "weights": select(
      useAllWeights == true => *[_type == "productWeight" && isActive == true] | order(weight asc) {
        _id,
        name,
        value,
        unit,
        numericValue,
        isActive
      },
      weights[]->{
        _id,
        name,
        value,
        unit,
        numericValue,
        isActive
      }
    ),
    "sizes": select(
      useAllSizes == true => *[_type == "productSize" && isActive == true] | order(weight asc) {
        _id,
        value,
        isActive
      },
      sizes[]->{
        _id,
        value,
        isActive
      }
    ),
    "colors": select(
      useAllColors == true => *[_type == "productColor" && isActive == true] | order(weight asc) {
        _id,
        name,
        "value": hexCode,
        isActive
      },
      colors[]->{
        _id,
        name,
        "value": hexCode,
        isActive
      }
    )
  }`
);

const RELATED_PRODUCTS_QUERY = defineQuery(
  `*[_type == "product" && count((categories[]._ref)[@ in $categoryIds]) > 0 && slug.current != $currentSlug] | order(name asc) [0...$limit]{
    _id,
    name,
    slug,
    price,
    discount,
    stock,
    images,
    categories[]->{
      _id,
      title,
      slug
    }
  }`
);

const BRAND_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug]{
"brandName": brand->title
}`);

const PRODUCTS_BY_VARIANT_QUERY = defineQuery(
  `*[_type == "product" && variant->slug.current == $variantSlug] | order(name asc) {
    ...,
    variant->{
      _id,
      title,
      slug,
      description,
      image
    },
    brand->{
      _id,
      title,
      slug
    },
    categories[]->{
      _id,
      title,
      slug
    },
    "averageRating": math::avg(*[_type == "review" && product._ref == ^._id && status == "approved"].rating),
    "totalReviews": count(*[_type == "review" && product._ref == ^._id && status == "approved"])
  }`
);

const VARIANT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "productVariant" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description,
    image,
    seoTitle,
    seoDescription,
    "productCount": count(*[_type == "product" && variant._ref == ^._id])
  }`
);

export {
  BANNER_QUERY,
  FEATURED_CATEGORY_QUERY,
  ALL_PRODUCTS_QUERY,
  DEAL_PRODUCTS,
  FEATURE_PRODUCTS,
  BRANDS_QUERY,
  LATEST_BLOG_QUERY,
  SINGLE_BLOG_QUERY,
  GET_ALL_BLOG,
  BLOG_CATEGORIES,
  OTHERS_BLOG_QUERY,
  ADDRESS_QUERY,
  ALLCATEGORIES_QUERY,
  ADMIN_CATEGORIES_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  RELATED_PRODUCTS_QUERY,
  BRAND_QUERY,
  PRODUCTS_BY_VARIANT_QUERY,
  VARIANT_BY_SLUG_QUERY,
};
