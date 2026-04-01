import ProductContent from "@/components/ProductContent";
import ProductPageSkeleton from "@/components/skeleton/ProductPageSkeleton";
import {
  generateBreadcrumbSchema,
  generateProductMetadata,
  generateProductSchema,
} from "@/lib/seo";
import {
  getBrand,
  getProductBySlug,
  getRelatedProducts,
} from "@/sanity/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import {
  Product,
  PRODUCT_BY_SLUG_QUERY_RESULT,
} from "../../../../../sanity.types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for could not be found.",
    };
  }

  //   Fetch brand data if needed
  const brand = await getBrand(slug);
  const productWithBrand = { ...product, brand };

  return generateProductMetadata(productWithBrand);
}

const SingleProudctPage = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <div>
      <Suspense fallback={<ProductPageSkeleton />}>
        <ProductPageContent slug={slug} />
      </Suspense>
    </div>
  );
};

const ProductPageContent = async ({ slug }: { slug: string }) => {
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }

  // Fetch related data on the server side
  const categoryIds =
    product?.categories?.map(
      (cat: { _id: string; title: string | null; slug: string }) => cat._id,
    ) || [];
  const [relatedProducts, brand] = await Promise.all([
    getRelatedProducts(categoryIds, product?.slug?.current || "", 4),
    getBrand(product?.slug?.current as string),
  ]);

  // Convert null values to undefined for TypeScript compatibility
  const productWithReviews = {
    ...product,
    averageRating: product.averageRating ?? undefined,
    totalReviews: product.totalReviews ?? undefined,
  };

  const productWithBrand = { ...productWithReviews, brand };

  // Generate structured data
  const productSchema = generateProductSchema(productWithBrand);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    { name: productWithReviews.name || "Product", url: `/product/${slug}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <ProductContent
        product={productWithReviews as PRODUCT_BY_SLUG_QUERY_RESULT}
        relatedProducts={relatedProducts || ([] as unknown as Product[])}
        brand={brand || undefined}
      />
    </>
  );
};

export default SingleProudctPage;
