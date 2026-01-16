/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { Product } from "../../../sanity.types";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, Heart, Share2 } from "lucide-react";
import useCartStore from "../../../store";
import _ from "lodash";
import { toast } from "sonner";

const ProductSidemenu = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useCartStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  useEffect(() => {
    const availableItem = _.find(
      favoriteProduct,
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableItem || null);
  }, [product, favoriteProduct]);

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct ? "Removed from wishlist" : "Added to wishlist",
          {
            description: existingProduct
              ? "Product removed successfully!"
              : "Product added successfully!",
            duration: 3000,
          }
        );
      });
    }
  };
  return (
    <div
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-10",
        className
      )}
    >
      <button
        onClick={handleFavorite}
        className={`p-2 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 ${
          existingProduct
            ? "bg-gofarm-green text-white"
            : "bg-white/90 text-gofarm-gray hover:bg-gofarm-green hover:text-white"
        }`}
        title={existingProduct ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={16} />
      </button>
      <button className="p-2 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300">
        <ArrowLeftRight size={16} />
      </button>
      <button className="p-2 rounded-full shadow-lg border border-gofarm-green/20 backdrop-blur-sm hover:scale-110 transition-all duration-300">
        <Share2 size={16} />
      </button>
    </div>
  );
};

export default ProductSidemenu;
