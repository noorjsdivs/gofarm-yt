import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

// Product Grid Skeleton for shop pages
export const ProductGridSkeleton = () => (
  <div className="p-6 space-y-6">
    {/* Header Skeleton */}
    <div className="text-center space-y-3">
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-5 w-96 mx-auto" />
    </div>

    {/* Filters Skeleton */}
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-80 space-y-4">
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </Card>
      </div>

      {/* Products Grid Skeleton */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative">
                <Skeleton className="h-48 w-full" />
                <div className="absolute top-2 right-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Simple Product Cards Grid Skeleton (for home page)
export const ProductCardsGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <div className="relative">
          <Skeleton className="h-48 w-full" />
          <div className="absolute top-2 right-2">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Category Grid Skeleton
export const CategoryGridSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="text-center space-y-3">
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-5 w-96 mx-auto" />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {[...Array(12)].map((_, i) => (
        <Card key={i} className="overflow-hidden group cursor-pointer">
          <div className="aspect-square relative">
            <Skeleton className="h-full w-full" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Skeleton className="h-4 w-3/4 bg-white/30" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// Blog Posts Skeleton
export const BlogPostsSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="text-center space-y-3">
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-5 w-96 mx-auto" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <Skeleton className="h-16 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Brands Grid Skeleton
export const BrandsGridSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="text-center space-y-3">
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-5 w-96 mx-auto" />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {[...Array(16)].map((_, i) => (
        <Card
          key={i}
          className="aspect-square p-4 flex items-center justify-center"
        >
          <Skeleton className="h-16 w-16 rounded-lg" />
        </Card>
      ))}
    </div>
  </div>
);
