/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ShoppingBag } from "lucide-react";
import QuantityButtons from "./QuantityButtons";
import { Product, PRODUCT_BY_SLUG_QUERY_RESULT } from "../../../sanity.types";
import useCartStore from "../../../store";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import PriceFormatter from "./PriceFormatter";

interface Props {
  product: Product | PRODUCT_BY_SLUG_QUERY_RESULT;
  className?: string;
  selectedOptions?: {
    weight?: any;
    size?: any;
    color?: any;
    calculatedPrice?: number;
  };
  displayPrice?: number;
}

const AddToCartButton = ({
  product,
  className,
  selectedOptions,
  displayPrice,
}: Props) => {
  const { addItem, getItemCount } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  // Use the display price if provided, otherwise use product price
  const basePrice = displayPrice ?? product?.price ?? 0;

  // Apply discount to get the actual price to be stored in cart
  const discount = product?.discount ?? 0;
  const discountAmount = discount > 0 ? (discount * basePrice) / 100 : 0;
  const effectivePrice = basePrice - discountAmount;

  // All hooks must be called before any conditional logic
  const itemCount = getItemCount(product?._id || "");
  const isOutOfStock = product?.stock === 0;

  // Use useEffect to set isClient to true after component mounts
  // This ensures that the component only renders on the client-side
  // Preventing hydration errors due to server/client mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddToCart = () => {
    // Calculate quantity increment based on baseWeight
    const baseWeight = (product as Product)?.baseWeight;
    const selectedWeight = selectedOptions?.weight;
    let incrementQty = 1;
    if (baseWeight && selectedWeight?.numericValue) {
      // e.g., if baseWeight is 1000g and selected is 3000g, incrementQty = 3
      incrementQty = selectedWeight.numericValue / baseWeight;
    }

    const maxStock = product?.stock ?? 0;
    const newTotalQty = itemCount + incrementQty;

    if (maxStock >= newTotalQty) {
      // Create a product with the selected price and options
      const productWithOptions = {
        ...product,
        price: effectivePrice,
        selectedWeight: selectedOptions?.weight,
        selectedSize: selectedOptions?.size,
        selectedColor: selectedOptions?.color,
        baseWeight: (product as Product)?.baseWeight,
      };

      addItem(productWithOptions);

      const selectionText = [
        selectedOptions?.weight?.value || selectedOptions?.weight?.name,
        selectedOptions?.size?.value,
        selectedOptions?.color?.name,
      ]
        .filter(Boolean)
        .join(", ");

      const priceInfo =
        discount > 0
          ? `$${effectivePrice.toFixed(2)} (${discount}% off)`
          : `$${effectivePrice.toFixed(2)}`;

      const qtyDisplay =
        baseWeight && selectedWeight?.numericValue
          ? `Qty: ${newTotalQty}kg`
          : `Qty: ${newTotalQty}`;

      const description = selectionText
        ? `${selectionText} • ${priceInfo} • ${qtyDisplay}`
        : `${priceInfo} • ${qtyDisplay}`;

      showToast.addToCart(product?.name || "Product", {
        description,
        onViewCart: () => {
          window.location.href = "/cart";
        },
      });
    } else {
      showToast.error(
        "Stock Limit Reached",
        `Only ${maxStock}${baseWeight ? "kg" : " items"} available in stock`
      );
    }
  };

  // Early return after all hooks have been called - this is crucial for Rules of Hooks

  if (!isClient) {
    return (
      <div className="w-full h-12 flex items-center">
        <Button
          disabled
          className={cn(
            "w-full bg-gray-200 text-gray-500 shadow-none border border-gray-300",
            className
          )}
        >
          <ShoppingBag /> Loading...
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-12 flex items-center group">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1 border-border">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter amount={effectivePrice * itemCount} />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          variant={"outline"}
          disabled={isOutOfStock}
          className="w-full flex-1 rounded-md border-2 border-gofarm-green hover:border-gofarm-green relative overflow-hidden group/button"
        >
          <span className="absolute inset-0 bg-gofarm-green -translate-y-full group-hover/button:translate-y-0 transition-transform duration-500 ease-out"></span>
          <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover/button:text-white font-semibold">
            <ShoppingBag className="w-4 h-4" /> Add to cart
          </span>
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
