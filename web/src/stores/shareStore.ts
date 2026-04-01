import { create } from "zustand";
import { Product } from "../../sanity.types";

interface ShareStore {
  isOpen: boolean;
  product: Product | null;
  openShare: (product: Product) => void;
  closeShare: () => void;
}

export const useShareStore = create<ShareStore>((set) => ({
  isOpen: false,
  product: null,
  openShare: (product) => set({ isOpen: true, product }),
  closeShare: () => set({ isOpen: false, product: null }),
}));
