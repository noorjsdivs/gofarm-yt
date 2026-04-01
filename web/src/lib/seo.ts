import { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
import { Category, Product } from "../../sanity.types";

const BASE_URL = "https://gofarm.reactbd.com";

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(product: Product): Metadata {
  const title = product.name || "Product";
  const description =
    product.description ||
    `Buy ${title} online at gofarm. ${
      product.price ? `Price: $${product.price}` : ""
    }`;
  const imageUrl = product.images?.[0]
    ? urlFor(product.images[0]).url()
    : "/og-image.jpg";
  const url = `${BASE_URL}/product/${product.slug?.current}`;

  // Extract brand name if it's populated
  const brandName =
    typeof product.brand === "object" ? product.brand?.name : "";

  return {
    title,
    description,
    keywords: [
      product.name || "",
      brandName || "",
      "buy online",
      "shop",
      "e-commerce",
    ].filter(Boolean),
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "gofarm",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(
  category: Category,
  productCount: number = 0,
): Metadata {
  const title = category.title || "Category";
  const description =
    category.description ||
    `Browse ${productCount} products in ${title} category at gofarm. Find the best deals and quality items.`;
  const imageUrl = category.image
    ? urlFor(category.image).url()
    : "/og-image.jpg";
  const url = `${BASE_URL}/category/${category.slug?.current}`;

  return {
    title,
    description,
    keywords: [
      category.title || "",
      "category",
      "shop",
      "buy online",
      "e-commerce",
      "products",
    ].filter(Boolean),
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "gofarm",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate Product Schema (JSON-LD) for rich snippets
 */
export function generateProductSchema(product: Product) {
  const imageUrl = product.images?.[0] ? urlFor(product.images[0]).url() : "";

  // Extract brand name if it's populated
  const brandName =
    typeof product.brand === "object" ? product.brand?.name : "gofarm";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: imageUrl,
    sku: product._id,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product/${product.slug?.current}`,
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      )
        .toISOString()
        .split("T")[0],
      availability:
        product.stock && product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.averageRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.averageRating,
        reviewCount: product.totalReviews || 0,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

/**
 * Generate BreadcrumbList Schema (JSON-LD)
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate Organization Schema (JSON-LD)
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "gofarm",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Your trusted online shopping destination for quality items and exceptional customer service.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "en",
    },
    sameAs: [
      "https://facebook.com/gofarm",
      "https://twitter.com/gofarm",
      "https://instagram.com/gofarm",
      "https://linkedin.com/company/gofarm",
    ],
  };
}

/**
 * Generate WebSite Schema (JSON-LD) with search action
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "gofarm",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate ItemList Schema for product listings
 */
export function generateItemListSchema(products: Product[], listName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE_URL}/product/${product.slug?.current}`,
      name: product.name,
    })),
  };
}

/**
 * Generate Review Schema for product reviews
 */
export function generateReviewSchema(reviews: any[], product: Product) {
  if (!reviews || reviews.length === 0) return null;

  const reviewSchemas = reviews.map((review) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      "@type": "Person",
      name: review.userName || "Anonymous",
    },
    reviewBody: review.comment,
    datePublished: review._createdAt,
  }));

  return reviewSchemas;
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Helper to create canonical URL
 */
export function getCanonicalUrl(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Generate metadata for homepage
 */
export function generateHomeMetadata(): Metadata {
  return {
    title: "gofarm - Your Trusted Online Shopping Destination",
    description:
      "Discover amazing products at gofarm, your trusted online shopping destination for quality items and exceptional customer service. Shop electronics, fashion, home goods and more with fast delivery.",
    keywords: [
      "online shopping",
      "e-commerce",
      "buy online",
      "shop online",
      "best deals",
      "electronics",
      "fashion",
      "home goods",
    ],
    openGraph: {
      type: "website",
      url: BASE_URL,
      title: "gofarm - Your Trusted Online Shopping Destination",
      description:
        "Discover amazing products at gofarm. Shop electronics, fashion, home goods and more with fast delivery.",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "gofarm Online Store",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "gofarm - Your Trusted Online Shopping Destination",
      description:
        "Discover amazing products at gofarm. Shop electronics, fashion, home goods and more.",
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: BASE_URL,
    },
  };
}
