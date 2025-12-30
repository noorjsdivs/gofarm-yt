import React from "react";
import useCartStore from "../../store";
import Link from "next/link";
import { Loader2, ShoppingCart } from "lucide-react";

const CartIcon = () => {
  const { items, isLoadingCart } = useCartStore();
  const itemCount = items?.length || 0;
  const displayCount = itemCount > 9 ? "9+" : itemCount;
  return (
    <Link href={"/cart"} className="group relative">
      <ShoppingCart className="group-hover:text-gofarm-light-green hoverEffect" />
      {isLoadingCart ? (
        <span className="absolute -top-1 -right-1 bg-gofarm-green text-white rounded-full text-xs font-semibold flex items-center justify-center w-[18px] h-[18px]">
          <Loader2 className="w-3 h-3 animate-spin" />
        </span>
      ) : itemCount > 0 ? (
        <span
          className={`absolute -top-1 -right-1 bg-gofarm-green text-white rounded-full text-xs font-semibold flex items-center justify-center min-w-[14px] h-[14px] ${
            itemCount > 9 ? "px-1" : ""
          }`}
        >
          {displayCount}
        </span>
      ) : (
        <span className="absolute -top-1 -right-1 bg-gofarm-green text-white rounded-full text-xs font-semibold flex items-center justify-center min-w-[14px]">
          0
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
