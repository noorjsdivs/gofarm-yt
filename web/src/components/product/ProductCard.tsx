import React from "react";
import { Product } from "../../../sanity.types";
import Link from "next/link";
import Image from "next/image";
import { image } from "@/sanity/image";
import { Badge } from "../ui/badge";
import Title from "../common/Title";
import { StarIcon } from "lucide-react";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";
import ProductSideMenu from "./ProductSideMenu";

const ProductCard = ({ product }: { product: Product }) => {
  const isOutOfStock = product?.stock === 0;
  const hasDiscount = product?.discount && product.discount > 0;
  const averageRating = Math.round(product?.averageRating || 0);
  return (
    <div className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-60 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
        {product?.images && (
          <Link
            href={`/product/${product?.slug?.current}`}
            className="block h-full"
          >
            <Image
              src={image(product?.images[0]).url()}
              alt={product?.name || "Product Image"}
              width={500}
              height={500}
              loading="lazy"
              className={`w-full h-full object-cover transition-all duration-500 ${
                isOutOfStock ? "opacity-40 grayscale" : "group-hover:scale-110"
              }`}
            />
          </Link>
        )}
        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <Badge className="bg-red-500 text-white text-[10px] px-2 py-0.5 shadow-md">
              Out of Stock
            </Badge>
          ) : (
            <>
              {product?.status === "sale" && (
                <Badge className="bg-gofarm-orange text-white text-[10px] px-2 py-0.5 shadow-md">
                  Sale
                </Badge>
              )}
              {product?.status === "new" && (
                <Badge className="bg-gofarm-green text-white text-[10px] px-2 py-0.5 shadow-md">
                  New
                </Badge>
              )}
              {product?.status === "hot" && (
                <Badge className="bg-red-500 text-white text-[10px] px-2 py-0.5 shadow-md">
                  Hot
                </Badge>
              )}
              {hasDiscount && (
                <Badge className="bg-red-500 text-white text-[10px] px-2 py-0.5 shadow-md font-bold">
                  -{product.discount}%
                </Badge>
              )}
            </>
          )}
        </div>
        {/* Prouct Side Menu */}
        <ProductSideMenu product={product} />
      </div>
      {/* Content Container */}
      <div className="p-3 space-y-2">
        <Link href={`/prodcut/${product?.slug?.current}`}>
          <Title className="text-sm font-semibold line-clamp-1 mb-1 group-hover:text-gofarm-green transition-colors leading-tight">
            {product?.name}
          </Title>
        </Link>
        {/* Rating - Compact */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
              const isFilled = index < averageRating;
              return (
                <StarIcon
                  key={index}
                  className={`w-3 h-3 ${
                    isFilled ? "text-amber-400" : "text-gray-300"
                  }`}
                  fill={isFilled ? "#fbbf24" : "#d1d5db"}
                />
              );
            })}
          </div>
          <span className="text-[10px] text-gofarm-gray">
            ({product?.totalReviews || 0})
          </span>
        </div>
        {/* Stock Status - Only show urgency */}
        {!isOutOfStock && (product?.stock as number) <= 10 && (
          <p className="text-[10px] text-gofarm-orange font-medium">
            Only {product?.stock} left
          </p>
        )}
        {/* Price */}
        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-base font-bold"
        />
        <AddToCartButton product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
