/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

type Weight = {
  _id: string;
  name: string | null;
  value: string | null;
  unit: "g" | "kg" | "lb" | "oz" | null;
  numericValue: number | null;
  isActive: boolean | null;
};

type Size = {
  _id: string;
  value: string | null;
  isActive: boolean | null;
};

type Color = {
  _id: string;
  name: string | null;
  value: string | null;
  isActive: boolean | null;
};

interface ProductOptionsProps {
  hasWeights?: boolean;
  weights?: Weight[] | null;
  hasVariants?: boolean;
  sizes?: Size[] | null;
  colors?: Color[] | null;
  basePrice?: number;
  baseWeight?: number;
  discount?: number;
  stock?: number;
  initialWeightId?: string;
  onSelectionChange?: (selection: {
    weight?: Weight;
    size?: Size;
    color?: Color;
    calculatedPrice?: number;
  }) => void;
}

const ProductOptions = ({
  hasWeights,
  weights,
  hasVariants,
  sizes,
  colors,
  basePrice,
  baseWeight,
  discount,
  stock,
  initialWeightId,
  onSelectionChange,
}: ProductOptionsProps) => {
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  // Set initial weight selection
  useEffect(() => {
    if (initialWeightId && !selectedWeight) {
      setSelectedWeight(initialWeightId);
    }
  }, [initialWeightId, selectedWeight]);

  // Calculate price based on weight (without discount - PriceView handles that)
  const calculatePriceForWeight = (weight: Weight): number => {
    if (!basePrice || !baseWeight || !weight.numericValue)
      return basePrice || 0;

    // numericValue is already in grams (e.g., 5000 for 5kg)
    const weightInGrams = weight.numericValue;

    // Calculate proportional price (original price without discount)
    const priceRatio = weightInGrams / baseWeight;
    return basePrice * priceRatio;
  };

  const handleWeightSelect = (weightId: string) => {
    setSelectedWeight(weightId);
    const weight = activeWeights.find((w) => w._id === weightId);
    const calculatedPrice = weight
      ? calculatePriceForWeight(weight)
      : basePrice;

    onSelectionChange?.({
      weight,
      size: activeSizes.find((s) => s._id === selectedSize),
      color: activeColors.find((c) => c._id === selectedColor),
      calculatedPrice,
    });
  };

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId);
    const size = activeSizes.find((s) => s._id === sizeId);
    const weight = activeWeights.find((w) => w._id === selectedWeight);
    const calculatedPrice = weight
      ? calculatePriceForWeight(weight)
      : basePrice;

    onSelectionChange?.({
      weight,
      size,
      color: activeColors.find((c) => c._id === selectedColor),
      calculatedPrice,
    });
  };

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
    const color = activeColors.find((c) => c._id === colorId);
    const weight = activeWeights.find((w) => w._id === selectedWeight);
    const calculatedPrice = weight
      ? calculatePriceForWeight(weight)
      : basePrice;

    onSelectionChange?.({
      weight: activeWeights.find((w) => w._id === selectedWeight),
      size: activeSizes.find((s) => s._id === selectedSize),
      color,
      calculatedPrice,
    });
  };

  // Filter active options
  const activeWeights = weights?.filter((w) => w.isActive !== false) || [];
  const activeSizes = sizes?.filter((s) => s.isActive !== false) || [];
  const activeColors = colors?.filter((c) => c.isActive !== false) || [];

  // Don't render if no options are available
  if (!hasWeights && !hasVariants) return null;

  if (
    activeWeights.length === 0 &&
    activeSizes.length === 0 &&
    activeColors.length === 0
  ) {
    return null;
  }
  return (
    <div className="space-y-6 border-t border-gray-200 pt-6">
      {/* Weight Options */}
      {hasWeights && activeWeights.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gofarm-black">
            Select Weight {!stock || stock === 0 ? "(Out of Stock)" : ""}
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
            {activeWeights.map((weight) => {
              const weightPrice = calculatePriceForWeight(weight);
              const isOutOfStock = !stock || stock === 0;

              // Format display weight
              let displayWeight = weight.name || weight.value || "";
              if (!weight.name && weight.numericValue) {
                if (weight.numericValue >= 1000) {
                  displayWeight = `${(weight.numericValue / 1000).toFixed(
                    weight.numericValue % 1000 === 0 ? 0 : 1,
                  )}kg`;
                } else {
                  displayWeight = `${weight.numericValue}g`;
                }
              }

              return (
                <button
                  key={weight._id}
                  onClick={() =>
                    !isOutOfStock && handleWeightSelect(weight._id)
                  }
                  disabled={isOutOfStock}
                  className={cn(
                    "relative p-2 sm:p-3 rounded-lg border-2 font-medium text-xs sm:text-sm transition-all duration-200 text-left",
                    isOutOfStock
                      ? "border-gofarm-light-gray bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                      : selectedWeight === weight._id
                        ? "border-gofarm-green bg-gofarm-light-green/10 text-gofarm-green"
                        : "border-gofarm-light-gray hover:border-gofarm-light-green text-gofarm-gray hover:text-gofarm-green",
                  )}
                >
                  <div className="flex flex-col gap-0.5 sm:gap-1">
                    <span className="font-bold text-xs sm:text-sm truncate">
                      {displayWeight}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isOutOfStock ? "text-gray-400" : "text-gofarm-green",
                      )}
                    >
                      ${weightPrice.toFixed(2)}
                    </span>
                  </div>
                  {selectedWeight === weight._id && !isOutOfStock && (
                    <Check
                      size={14}
                      className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-gofarm-green text-white rounded-full p-0.5"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* Size Options */}
      {hasVariants && activeSizes.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gofarm-black">
            Select Size
          </Label>
          <div className="flex flex-wrap gap-2">
            {activeSizes.map((size) => (
              <button
                key={size._id}
                onClick={() => handleSizeSelect(size._id)}
                className={cn(
                  "relative px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all duration-200 min-w-[60px]",
                  selectedSize === size._id
                    ? "border-gofarm-green bg-gofarm-light-green/10 text-gofarm-green"
                    : "border-gofarm-light-gray hover:border-gofarm-light-green text-gofarm-gray hover:text-gofarm-green",
                )}
              >
                {size.value}
                {selectedSize === size._id && (
                  <Check
                    size={16}
                    className="absolute -top-1 -right-1 bg-gofarm-green text-white rounded-full p-0.5"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Options */}
      {hasVariants && activeColors.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gofarm-black">
            Select Color
            {selectedColor && (
              <span className="ml-2 text-sm font-normal text-gofarm-gray">
                ({activeColors.find((c) => c._id === selectedColor)?.name})
              </span>
            )}
          </Label>
          <div className="flex flex-wrap gap-3">
            {activeColors.map((color) => (
              <button
                key={color._id}
                onClick={() => handleColorSelect(color._id)}
                className={cn(
                  "relative w-12 h-12 rounded-full border-4 transition-all duration-200 hover:scale-110",
                  selectedColor === color._id
                    ? "border-gofarm-green shadow-lg"
                    : "border-gofarm-light-gray hover:border-gofarm-light-green",
                )}
                style={{ backgroundColor: color.value || undefined }}
                title={color.name || undefined}
              >
                {selectedColor === color._id && (
                  <Check
                    size={20}
                    className="absolute inset-0 m-auto text-white drop-shadow-lg"
                    style={{
                      filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Options Summary */}
      {(selectedWeight || selectedSize || selectedColor) && (
        <div className="bg-gofarm-light-orange/20 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-gofarm-black">
            Your Selection:
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedWeight && (
              <Badge className="bg-gofarm-green text-white">
                {activeWeights.find((w) => w._id === selectedWeight)?.value}
                {/* {activeWeights.find((w) => w._id === selectedWeight)?.unit} */}
              </Badge>
            )}
            {selectedSize && (
              <Badge className="bg-gofarm-green text-white">
                Size: {activeSizes.find((s) => s._id === selectedSize)?.value}
              </Badge>
            )}
            {selectedColor && (
              <Badge className="bg-gofarm-green text-white">
                {activeColors.find((c) => c._id === selectedColor)?.name}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOptions;
