import React from "react";
import PriceFormatter from "./PriceFormatter";
interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}

const PriceView = ({ price, discount, className }: Props) => {
  const originalPrice = price || 0;
  const discountAmount =
    discount && originalPrice ? (discount * originalPrice) / 100 : 0;
  const currentPrice = originalPrice - discountAmount;
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-2">
        <PriceFormatter amount={currentPrice} className="text-gofarm-green" />
        {discount && discountAmount > 0 && (
          <div className="flex items-center gap-1">
            <PriceFormatter
              amount={originalPrice}
              className="line-through text-xs font-normal text-zinc-500"
            />
            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
              -{discount}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceView;
