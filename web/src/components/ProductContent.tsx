"use client";
import { trackProductView } from "@/lib/analytics";
import {
  BRAND_QUERY_RESULT,
  Product,
  PRODUCT_BY_SLUG_QUERY_RESULT,
  ProductColor,
  ProductSize,
  ProductWeight,
} from "../../sanity.types";
import { useCompareStore } from "@/stores/compareStore";
import { useShareStore } from "@/stores/shareStore";
import { useEffect, useState } from "react";
import {
  ProductActionWrapper,
  ProductAnimationWrapper,
  ProductDetailsWrapper,
  ProductImageWrapper,
  ProductSectionWrapper,
} from "./ProductClientWrapper";
import Container from "./Container";
import DynamicBreadcrumb from "./common/DynamicBreadcrumb";
import ImageView from "./ImageView";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  ArrowLeftRight,
  ClockFading,
  CornerDownLeft,
  Share,
  StarIcon,
  Truck,
} from "lucide-react";
import PriceView from "./product/PriceView";
import ProductOptions from "./ProductOptions";
import AddToCartButton from "./product/AddToCartButton";
import FavoriteIcon from "./FavoriteIcon";
import FavoriteButton from "./FavoriteButton";
import ProductCharacteristics from "./ProductCharacteristics";
import { Button } from "./ui/button";
import RelatedProducts from "./RelatedProducts";

interface ProductContentProps {
  product: PRODUCT_BY_SLUG_QUERY_RESULT;
  relatedProducts: Product[];
  brand: BRAND_QUERY_RESULT | null;
}

const ProductContent = ({
  product,
  relatedProducts,
  brand,
}: ProductContentProps) => {
  // Get actual review data from product
  const averageRating = product?.averageRating || 0;
  const totalReviews = product?.totalReviews || 0;

  // Compare and Share stores
  const { addToCompare, isInCompare } = useCompareStore();
  const { openShare } = useShareStore();
  const isInCompareList = product?._id ? isInCompare(product._id) : false;

  // State for dynamic pricing based on weight selection
  const [displayPrice, setDisplayPrice] = useState(product?.price || 0);
  const [selectedWeightInfo, setSelectedWeightInfo] = useState<string>("");
  const [initialWeightId, setInitialWeightId] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<{
    weight?: ProductWeight;
    size?: ProductSize;
    color?: ProductColor;
    calculatedPrice?: number;
  }>({});

  // Track product view on component mount
  useEffect(() => {
    if (product) {
      trackProductView({
        productId: product._id,
        name: product.name || "Unknown",
      });
    }
  }, [product]);

  // Set default weight selection and calculate initial price
  useEffect(() => {
    if (
      product?.hasWeights &&
      product?.weights &&
      Array.isArray(product.weights)
    ) {
      const activeWeights = product.weights.filter(
        (w: any) => w?.isActive !== false,
      );
      if (activeWeights.length > 0) {
        const firstWeight = activeWeights[0] as ProductWeight;

        // Calculate initial price for first weight
        const basePrice = product?.price || 0;
        const baseWeight = (product as any)?.baseWeight;
        const discount = product?.discount || 0;

        if (baseWeight && firstWeight.numericValue) {
          const priceRatio = firstWeight.numericValue / baseWeight;
          const calculatedPrice = basePrice * priceRatio;

          // Don't apply discount here - PriceView handles it
          setDisplayPrice(calculatedPrice);

          // Set weight info display
          let displayWeight = firstWeight.name || firstWeight.value || "";
          if (!firstWeight.name && firstWeight.numericValue) {
            if (firstWeight.numericValue >= 1000) {
              displayWeight = `${(firstWeight.numericValue / 1000).toFixed(
                firstWeight.numericValue % 1000 === 0 ? 0 : 1,
              )}kg`;
            } else {
              displayWeight = `${firstWeight.numericValue}g`;
            }
          }
          setSelectedWeightInfo(displayWeight);
        }
      }
    }
  }, [product]);
  return (
    <ProductAnimationWrapper>
      <Container>
        {/* Breadcrumb Navigation */}
        <DynamicBreadcrumb
          productData={{
            name: product?.name || "",
            slug: product?.slug?.current || "",
          }}
        />
        <div className="flex flex-col md:flex-row gap-10 pb-6">
          {/* Proudct Images */}
          {product?.images && (
            <ProductImageWrapper>
              <ImageView images={product?.images} isStock={product?.stock} />
            </ProductImageWrapper>
          )}
          {/* Product Details */}
          <ProductDetailsWrapper>
            {/* Title and Category */}
            <div>
              {product?.brand && (
                <Badge className="bg-gofarm-light-green/10 text-gofarm-green hover:bg-gofarm-light-green/20 w-fit">
                  {brand && brand.length > 0 && (
                    <span className="font-semibold tracking-wide">
                      {brand[0]?.brandName}
                    </span>
                  )}
                </Badge>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold text-gofarm-green leading-tight">
                {product?.name}
              </h1>
              <p className="text-lg text-dark-text leading-relaxed">
                {product?.description}
              </p>

              {/* Enhanced Rating Display */}
              {totalReviews > 0 ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        size={16}
                        className={`${
                          index < Math.floor(averageRating)
                            ? "text-gofarm-light-green fill-gofarm-light-green"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gofarm-green">
                    {averageRating.toFixed(1)} ({totalReviews}{" "}
                    {totalReviews === 1 ? "review" : "reviews"})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        size={16}
                        className="text-gray-300"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">No reviews yet</span>
                </div>
              )}
            </div>
            {/* Pricing & Options Section */}
            <div className="space-y-4 border-y border-gray-200 py-6 bg-white/70 rounded-lg px-4">
              {/* Price Display */}
              <div className="space-y-2">
                <PriceView
                  price={displayPrice}
                  discount={product?.discount}
                  className="text-2xl font-bold"
                />
                {selectedWeightInfo && (
                  <p className="text-sm text-gofarm-gray">
                    Price for{" "}
                    <span className="font-semibold text-gofarm-green">
                      {selectedWeightInfo}
                    </span>
                  </p>
                )}
                {product?.hasWeights && (product as any)?.baseWeight && (
                  <p className="text-xs text-gofarm-gray">
                    Base price: ${product.price?.toFixed(2)} for{" "}
                    {(product as any).baseWeight}g
                  </p>
                )}
              </div>
              {/* Product Options (Weight, Size, etc.) */}
              <ProductOptions
                hasWeights={product?.hasWeights}
                weights={(product?.weights as any) || null}
                hasVariants={product?.hasVariants}
                sizes={(product?.sizes as any) || null}
                colors={(product?.colors as any) || null}
                basePrice={product?.price}
                baseWeight={(product as any)?.baseWeight}
                discount={product?.discount}
                stock={product?.stock}
                initialWeightId={initialWeightId}
                onSelectionChange={(selection) => {
                  setSelectedOptions(selection);
                  if (selection.calculatedPrice !== undefined) {
                    setDisplayPrice(selection.calculatedPrice);
                  }
                  if (selection.weight) {
                    let displayWeight =
                      selection.weight.name || selection.weight.value || "";
                    if (
                      !selection.weight.name &&
                      selection.weight.numericValue
                    ) {
                      if (selection.weight.numericValue >= 1000) {
                        displayWeight = `${(
                          selection.weight.numericValue / 1000
                        ).toFixed(
                          selection.weight.numericValue % 1000 === 0 ? 0 : 1,
                        )}kg`;
                      } else {
                        displayWeight = `${selection.weight.numericValue}g`;
                      }
                    }
                    setSelectedWeightInfo(displayWeight);
                  }
                }}
              />
              {/* Enhanced Stock Status */}
              <div className="flex items-center gap-3">
                <Badge
                  className={`text-sm font-semibold ${
                    product?.stock === 0
                      ? "bg-red-100 text-red-700 hover:bg-red-100"
                      : product?.stock && product.stock < 10
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        : "bg-green-100 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {product?.stock === 0
                    ? "Out of Stock"
                    : product?.stock && product.stock < 10
                      ? `Only ${product.stock} left!`
                      : "In Stock"}
                </Badge>
              </div>
              {/* Discount Information */}
              {product?.discount && product.discount > 0 && (
                <div className="bg-gofarm-orange/10 text-gofarm-orange px-3 py-2 rounded-lg text-sm font-medium">
                  💰 Save {product.discount}% on this item!
                </div>
              )}
            </div>
            {/* Action Buttons */}
            <ProductActionWrapper delay={0.3}>
              <div className="flex items-center gap-2.5 lg:gap-5">
                <AddToCartButton
                  product={product}
                  selectedOptions={selectedOptions}
                  displayPrice={displayPrice}
                />
                <FavoriteButton showProduct={true} product={product} />
              </div>
              {/* Product Characteristics */}
              <ProductActionWrapper delay={0.4}>
                <ProductCharacteristics product={product} brand={brand} />
              </ProductActionWrapper>
              {/* Action Links */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-gray-200 py-5 -mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (product?._id) {
                      addToCompare(product as any);
                    }
                  }}
                  className={`flex items-center gap-2 text-sm hover:text-gofarm-light-green transition-colors ${
                    isInCompareList
                      ? "text-gofarm-green font-semibold"
                      : "text-black"
                  }`}
                >
                  <ArrowLeftRight className="text-lg" />
                  <span>
                    {isInCompareList ? "In Compare List" : "Compare Product"}
                  </span>
                </Button>
                <button className="flex items-center gap-2 text-sm text-black hover:text-gofarm-light-green hoverEffect transition-colors">
                  <ClockFading className="text-lg" />
                  <span>Ask a question</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-black hover:text-gofarm-light-green hoverEffect transition-colors">
                  <Truck className="text-lg" />
                  <span>Delivery & Return</span>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (product) {
                      openShare(product as any);
                    }
                  }}
                  className="flex items-center gap-2 text-sm text-black hover:text-gofarm-light-green transition-colors"
                >
                  <Share className="text-lg" />
                  <span>Share</span>
                </Button>
              </div>
            </ProductActionWrapper>
            {/* Delivery Information */}
            <ProductActionWrapper delay={0.5}>
              <div className="flex flex-col">
                <div className="border border-border border-b-0 p-4 flex items-center gap-3 bg-white/70 rounded-t-lg">
                  <Truck size={32} className="text-gofarm-orange" />
                  <div>
                    <p className="text-lg font-semibold text-black">
                      Free Delivery
                    </p>
                    <p className="text-sm text-gray-500">
                      Enter your Postal code for Delivery Availability.{" "}
                      <button className="underline underline-offset-2 hover:text-gofarm-light-green transition-colors">
                        Check now
                      </button>
                    </p>
                  </div>
                </div>
                <div className="border border-border p-4 flex items-center gap-3 bg-white/70 rounded-b-lg">
                  <CornerDownLeft size={32} className="text-gofarm-orange" />
                  <div>
                    <p className="text-lg font-semibold text-black">
                      Return Delivery
                    </p>
                    <p className="text-sm text-gray-500">
                      Free 30 days Delivery Returns.{" "}
                      <button className="underline underline-offset-2 hover:text-gofarm-light-green transition-colors">
                        Details
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </ProductActionWrapper>
          </ProductDetailsWrapper>
        </div>
        {/* Related Products */}
        <ProductSectionWrapper delay={1.0}>
          <RelatedProducts
            currentProduct={product as Product}
            relatedProducts={relatedProducts}
          />
        </ProductSectionWrapper>
      </Container>
    </ProductAnimationWrapper>
  );
};

export default ProductContent;
