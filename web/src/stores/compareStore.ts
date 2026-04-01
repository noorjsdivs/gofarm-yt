import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { Product } from "../../sanity.types";

interface CompareStore {
  compareProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const MAX_COMPARE_ITEMS = 4;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      compareProducts: [],

      addToCompare: (product) => {
        const { compareProducts } = get();

        // Check if already in compare
        if (compareProducts.some((p) => p._id === product._id)) {
          toast.info("Product already in compare list");
          return;
        }

        // Check max limit
        if (compareProducts.length >= MAX_COMPARE_ITEMS) {
          toast.error(`Maximum ${MAX_COMPARE_ITEMS} products can be compared`);
          return;
        }

        set({ compareProducts: [...compareProducts, product] });
        toast.success("Added to compare list");
      },

      removeFromCompare: (productId) => {
        set((state) => ({
          compareProducts: state.compareProducts.filter(
            (p) => p._id !== productId,
          ),
        }));
        toast.success("Removed from compare");
      },

      clearCompare: () => {
        set({ compareProducts: [] });
        toast.success("Compare list cleared");
      },

      isInCompare: (productId) => {
        return get().compareProducts.some((p) => p._id === productId);
      },
    }),
    {
      name: "compare-storage",
    },
  ),
);
