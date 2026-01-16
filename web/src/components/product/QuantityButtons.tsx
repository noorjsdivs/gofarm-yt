import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product, PRODUCT_BY_SLUG_QUERY_RESULT } from "../../../sanity.types";
import useCartStore from "../../../store";
import { showToast } from "@/lib/toast";

interface Props {
  product: Product | PRODUCT_BY_SLUG_QUERY_RESULT;
  className?: string;
  borderStyle?: string;
}

const QuantityButtons = ({ product, className, borderStyle }: Props) => {
  const { addItem, removeItem, getItemCount } = useCartStore();
  const itemCount = getItemCount(product?._id || "");
  const isOutOfStock = product?.stock === 0;

  // Calculate quantity unit based on baseWeight
  const baseWeight = product?.baseWeight;
  const selectedWeight = product?.selectedWeight;
  let qtyUnit = 1;
  let displayUnit = "";

  if (baseWeight && selectedWeight?.numericValue) {
    qtyUnit = selectedWeight.numericValue / baseWeight;
    // Display as kg if baseWeight is used
    displayUnit = "kg";
  }

  const handleRemoveProduct = () => {
    if (!product?._id) return;
    removeItem(product._id);
    const newCount = itemCount - qtyUnit;
    if (newCount > 0) {
      showToast.success(
        "Quantity Updated",
        `${product?.name} quantity decreased to ${newCount}${displayUnit}`
      );
    } else {
      showToast.success(
        "Item Removed",
        `${product?.name} removed from your cart`
      );
    }
  };

  const handleAddToCart = () => {
    if (!product?._id) return;
    const maxStock = product?.stock ?? 0;
    const newCount = itemCount + qtyUnit;

    if (maxStock >= newCount) {
      addItem(product as Product);
      showToast.success(
        "Quantity Updated",
        `${product?.name} quantity increased to ${newCount}${displayUnit}`
      );
    } else {
      showToast.error(
        "Stock Limit Reached",
        `Only ${maxStock}${displayUnit} available in stock`
      );
    }
  };
  return (
    <div
      className={cn(
        "flex items-center gap-1 pb-1 text-base",
        className,
        borderStyle
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className="w-6 h-6 border-0 hover:bg-gofarm-green/20"
        onClick={handleRemoveProduct}
        disabled={itemCount === 0 || isOutOfStock}
      >
        <Minus />
      </Button>
      <span className="font-semibold text-sm w-6 text-center text-gofarm-black">
        {itemCount} {displayUnit}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="w-6 h-6 border-0 hover:bg-gofarm-green/20"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
