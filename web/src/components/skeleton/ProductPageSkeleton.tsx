"use client";

import Container from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const ProductPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50/50">
      <Container>
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 mb-6 pt-6">
          <Skeleton className="h-4 w-12 bg-gray-200" />
          <Skeleton className="h-4 w-4 bg-gray-200" />
          <Skeleton className="h-4 w-16 bg-gray-200" />
          <Skeleton className="h-4 w-4 bg-gray-200" />
          <Skeleton className="h-4 w-32 bg-gray-200" />
        </div>

        <div className="flex flex-col md:flex-row gap-10 py-6">
          {/* Image Gallery Skeleton */}
          <div className="w-full md:w-1/2">
            <div className="space-y-4">
              {/* Main Image */}
              <Skeleton className="w-full h-96 rounded-lg bg-gray-200" />

              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {[...Array(4)].map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-16 h-16 rounded-md bg-gray-200"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="w-full md:w-1/2 flex flex-col gap-5">
            {/* Title and Description */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-2/3 bg-gray-200" />

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton
                      key={index}
                      className="w-3 h-3 rounded bg-gray-200"
                    />
                  ))}
                </div>
                <Skeleton className="h-4 w-12 bg-gray-200" />
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-3 border-t border-b border-gray-200 py-5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-24 bg-gray-200" />
                <Skeleton className="h-6 w-16 bg-gray-200" />
              </div>
              <Skeleton className="h-6 w-20 bg-gray-200" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 lg:gap-5">
              <Skeleton className="h-12 w-40 bg-gray-200" />
              <Skeleton className="h-12 w-12 bg-gray-200" />
            </div>

            {/* Product Characteristics */}
            <Card className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-32 bg-gray-200" />
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <Skeleton className="h-4 w-20 bg-gray-200" />
                    <Skeleton className="h-4 w-16 bg-gray-200" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Action Links */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 bg-gray-200" />
                  <Skeleton className="h-4 w-20 bg-gray-200" />
                </div>
              ))}
            </div>

            {/* Delivery Info */}
            <div className="flex flex-col">
              <Card className="border-b-0 rounded-b-none">
                <div className="p-3 flex items-center gap-2.5">
                  <Skeleton className="w-8 h-8 bg-gray-200" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24 bg-gray-200" />
                    <Skeleton className="h-3 w-48 bg-gray-200" />
                  </div>
                </div>
              </Card>
              <Card className="rounded-t-none">
                <div className="p-3 flex items-center gap-2.5">
                  <Skeleton className="w-8 h-8 bg-gray-200" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32 bg-gray-200" />
                    <Skeleton className="h-3 w-40 bg-gray-200" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Product Details Section Skeleton */}
        <div className="mt-10 space-y-6">
          <Skeleton className="h-8 w-48 bg-gray-200 mx-auto" />

          {/* Tab Navigation */}
          <div className="flex gap-8 border-b">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-6 w-24 bg-gray-200 mb-4" />
            ))}
          </div>

          {/* Content Area */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-gray-200" />
            <Skeleton className="h-4 w-5/6 bg-gray-200" />
            <Skeleton className="h-4 w-4/5 bg-gray-200" />
            <Skeleton className="h-4 w-3/4 bg-gray-200" />
          </div>
        </div>

        {/* Trust Indicators Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
          {[...Array(3)].map((_, index) => (
            <Card
              key={index}
              className="border-2 border-gray-100 text-center p-4 space-y-2"
            >
              <Skeleton className="h-8 w-8 bg-gray-200 mx-auto" />
              <Skeleton className="h-4 w-24 bg-gray-200 mx-auto" />
              <Skeleton className="h-3 w-32 bg-gray-200 mx-auto" />
            </Card>
          ))}
        </div>

        {/* Product Specifications Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[...Array(4)].map((_, index) => (
            <Card
              key={index}
              className="border-2 border-gray-100 p-4 space-y-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-5 w-5 bg-gray-200" />
                <Skeleton className="h-4 w-20 bg-gray-200" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full bg-gray-200" />
                <Skeleton className="h-3 w-3/4 bg-gray-200" />
                <Skeleton className="h-3 w-2/3 bg-gray-200" />
              </div>
            </Card>
          ))}
        </div>

        {/* Reviews Section Skeleton */}
        <div className="mt-12">
          <Card className="p-6 space-y-6">
            <Skeleton className="h-8 w-48 bg-gray-200" />

            {/* Rating Summary Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-12 w-12 bg-gray-200" />
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Skeleton key={index} className="h-4 w-4 bg-gray-200" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-4 w-32 bg-gray-200" />
                <Skeleton className="h-8 w-24 bg-gray-200" />
              </div>

              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Skeleton className="h-3 w-8 bg-gray-200" />
                    <Skeleton className="h-2 flex-1 bg-gray-200" />
                    <Skeleton className="h-3 w-6 bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews Skeleton */}
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24 bg-gray-200" />
                      <Skeleton className="h-4 w-16 bg-gray-200" />
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <Skeleton
                          key={starIndex}
                          className="h-3 w-3 bg-gray-200"
                        />
                      ))}
                    </div>
                    <Skeleton className="h-4 w-3/4 bg-gray-200" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-full bg-gray-200" />
                      <Skeleton className="h-4 w-5/6 bg-gray-200" />
                      <Skeleton className="h-4 w-4/5 bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-16 space-y-6">
          <Skeleton className="h-8 w-64 bg-gray-200" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="p-4 space-y-3">
                <Skeleton className="w-full h-48 bg-gray-200" />
                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                <Skeleton className="h-6 w-1/2 bg-gray-200" />
                <Skeleton className="h-8 w-full bg-gray-200" />
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductPageSkeleton;
