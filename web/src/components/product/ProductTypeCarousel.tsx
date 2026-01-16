"use client";

import { useEffect, useRef, useState } from "react";
import { ALL_PRODUCTS_QUERY_RESULT } from "../../../sanity.types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "./ProductCard";

interface Props {
  variantId: string;
  variantTitle: string;
  variantSlug: string;
  products: ALL_PRODUCTS_QUERY_RESULT;
}

const ProductTypeCarousel = ({
  variantTitle,
  variantSlug,
  products,
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);
  const [cardWidth, setCardWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  //   Update items per view based on screen size

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        // xl
        setItemsPerView(5);
      } else if (width >= 1024) {
        // lg
        setItemsPerView(4);
      } else if (width >= 768) {
        // md
        setItemsPerView(3);
      } else if (width >= 640) {
        // sm
        setItemsPerView(2);
      } else if (width >= 480) {
        // sm
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);
  // Calculate card width based on container width and items per view
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const gapWidth = 16; // gap-4 = 16px
      const totalGaps = itemsPerView - 1;
      const availableWidth = containerWidth - totalGaps * gapWidth;
      setCardWidth(availableWidth / itemsPerView);
    }
  }, [itemsPerView]);
  //   Scroll by one prodouct at a time
  // Scroll by one product at a time
  const maxIndex = Math.max(0, products.length - 1);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  if (!products || products?.length == 0) return null;

  return (
    <div className="mb-12 bg-gofarm-white rounded-2xl border border-gofarm-light-gray/30 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-b-gofarm-light-gray">
        <div className="flex items-center gap-4">
          <h3 className="text-xl lg:text-2xl font-bold text-gofarm-black capitalize">
            {variantTitle}
          </h3>
          <span className="px-3 py-1 bg-gofarm-light-orange text-gofarm-green text-sm font-semibold rounded-full">
            {products?.length} {products?.length === 1 ? "Product" : "Products"}
          </span>
        </div>
        <Link
          href={`/products/${variantSlug}`}
          className="flex items-center gap-2 text-gofarm-green hover:text-gofarm-light-green font-semibold text-sm lg:text-base hoverEffect group"
        >
          View More{" "}
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
      <div className="relative">
        {/* Carousel Container */}
        {/* Navigation Buttons */}
        {/* Products Grid */}
        <div className="overflow-hidden w-full" ref={containerRef}>
          <motion.div
            className="flex gap-4"
            animate={{
              x:
                -currentIndex *
                (cardWidth + 16) /* 16 is the gap between cards */,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            {products?.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="shrink-0"
                style={{
                  width: `${cardWidth}px`,
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductTypeCarousel;
