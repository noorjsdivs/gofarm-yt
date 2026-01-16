"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Package, Search, ArrowRight, Grid3X3 } from "lucide-react";
import Link from "next/link";

const NoProductAvailable = ({
  selectedTab,
  variantTitle,
  className,
}: {
  selectedTab?: string;
  variantTitle?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 min-h-80 space-y-8 text-center bg-linear-to-br from-gray-50/50 to-white rounded-xl border border-gray-200/50 w-full",
        className
      )}
    >
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative"
      >
        <div className="w-20 h-20 bg-linear-to-br from-gofarm-light-green/10 to-gofarm-light-green/20 rounded-full flex items-center justify-center">
          <Package className="w-10 h-10 text-gofarm-light-green/60" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
          <Search className="w-3 h-3 text-gray-400" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-bold text-gray-800">No Products Found</h2>
        <p className="text-gray-600 max-w-md">
          We couldn&apos;t find any products{" "}
          {variantTitle && (
            <>
              in the{" "}
              <span className="font-semibold text-gofarm-green capitalize">
                {variantTitle}
              </span>{" "}
              category
            </>
          )}
          . This category might be temporarily out of stock.
        </p>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-4 w-full max-w-md"
      >
        <p className="text-sm text-gray-500 font-medium">
          What would you like to do?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-gofarm-light-green hover:bg-gofarm-green text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Grid3X3 className="w-4 h-4" />
            Browse All Products
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/category"
            className="inline-flex items-center justify-center gap-2 border border-gofarm-light-green text-gofarm-light-green hover:bg-gofarm-light-green hover:text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300"
          >
            <Package className="w-4 h-4" />
            View Categories
          </Link>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
            <Search className="w-3 h-3" />
            Try exploring our other product categories
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NoProductAvailable;
