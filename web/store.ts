import { create } from "zustand";
import { persist } from "zustand/middleware";
import _ from "lodash";
import { auth } from "@/lib/firebase";

// Helper function to get auth token
async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  // Force refresh to ensure we always have a valid token
  return await user.getIdToken(true);
}

// Debounced sync function to prevent race conditions
let syncTimeout: NodeJS.Timeout | null = null;
let pendingCartItems: CartItem[] = [];

async function debouncedSyncCartToSanity(items: CartItem[]): Promise<void> {
  // Store the latest items for immediate sync if needed
  pendingCartItems = items;

  // Clear existing timeout
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  // Set new timeout to sync after 500ms of no changes
  syncTimeout = setTimeout(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return; // Not logged in, skip sync

      const response = await fetch("/api/user/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            product: { _id: item.product._id },
            quantity: item.quantity,
          })),
        }),
      });

      if (response.ok) {
        pendingCartItems = []; // Clear pending items after successful sync
      }
    } catch (error) {
      console.error("Failed to sync cart to Sanity:", error);
    }
  }, 500); // Wait 500ms after last change before syncing
}

// Immediate sync function to flush any pending changes
async function flushCartSync(): Promise<void> {
  // Clear the debounced timeout
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }

  // If there are pending items, sync them immediately
  if (pendingCartItems.length > 0) {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch("/api/user/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: pendingCartItems.map((item) => ({
            product: { _id: item.product._id },
            quantity: item.quantity,
          })),
        }),
      });

      if (response.ok) {
        pendingCartItems = [];
      }
    } catch (error) {
      console.error("Failed to flush cart sync:", error);
    }
  }
}

// Helper function to sync cart to Sanity (immediate)
async function syncCartToSanity(items: CartItem[]): Promise<void> {
  try {
    const token = await getAuthToken();
    if (!token) return; // Not logged in, skip sync

    await fetch("/api/user/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      }),
    });
  } catch (error) {
    console.error("Failed to sync cart to Sanity:", error);
  }
}

// Helper function to sync single cart item to Sanity
async function syncCartItemToSanity(
  productId: string,
  quantity: number
): Promise<void> {
  try {
    const token = await getAuthToken();
    if (!token) return;

    await fetch("/api/user/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
  } catch (error) {
    console.error("Failed to sync cart item to Sanity:", error);
  }
}

// Helper function to delete cart item from Sanity
async function deleteCartItemFromSanity(productId: string): Promise<void> {
  try {
    const token = await getAuthToken();
    if (!token) return;

    await fetch(`/api/user/cart?productId=${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Failed to delete cart item from Sanity:", error);
  }
}

// Helper function to sync wishlist to Sanity
async function syncWishlistItemToSanity(
  productId: string,
  action: "add" | "remove"
): Promise<void> {
  try {
    const token = await getAuthToken();
    if (!token) return;

    await fetch("/api/user/wishlist", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, action }),
    });
  } catch (error) {
    console.error("Failed to sync wishlist to Sanity:", error);
  }
}

// Helper function to generate cart hash for sync detection
function generateCartHash(items: CartItem[]): string {
  if (items.length === 0) return "";

  const sorted = [...items].sort((a, b) =>
    (a.product._id || "").localeCompare(b.product._id || "")
  );

  return sorted.map((item) => `${item.product._id}:${item.quantity}`).join("|");
}

export interface CartItem {
  product: any;
  quantity: number;
}

export interface AppliedCoupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
}

interface StoreState {
  items: CartItem[];
  isLoadingCart: boolean; // Loading state for cart
  lastSyncedCartHash: string | null; // Hash of last synced cart state (persisted)
  appliedCoupon: AppliedCoupon | null; // Applied coupon
  addItem: (product: any) => void;
  addMultipleItems: (
    products: Array<{ product: any; quantity: number }>
  ) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => Promise<void>;
  loadCartFromSanity: () => Promise<void>;
  syncCartToDatabase: () => Promise<void>;
  flushPendingSync: () => Promise<void>; // New method to flush pending syncs before logout
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getTotalDiscount: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => CartItem[];
  // coupon methods
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  getCouponDiscount: () => number;
  // favorite
  favoriteProduct: any[];
  addToFavorite: (product: any) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
  loadWishlistFromSanity: () => Promise<void>;
  syncWishlistToDatabase: () => Promise<void>;
  // order placement state
  isPlacingOrder: boolean;
  orderStep: "validating" | "creating" | "emailing" | "redirecting";
  setOrderPlacementState: (
    isPlacing: boolean,
    step?: "validating" | "creating" | "emailing" | "redirecting"
  ) => void;
}

const useCartStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],
      isLoadingCart: false, // Initialize loading state
      lastSyncedCartHash: null, // Initialize cart hash
      appliedCoupon: null, // Initialize coupon state
      addItem: (product) =>
        set((state) => {
          const existingItem = _.find(
            state.items,
            (item) => item.product._id === product._id
          );

          // Calculate increment based on baseWeight
          const baseWeight = (product as any).baseWeight;
          const selectedWeight = (product as any).selectedWeight;
          let incrementQty = 1;

          if (baseWeight && selectedWeight?.numericValue) {
            // Calculate how many base units this weight represents
            // e.g., if baseWeight is 1000g and selected is 3000g, incrementQty = 3
            incrementQty = selectedWeight.numericValue / baseWeight;
          }

          let newItems;
          if (existingItem) {
            newItems = _.map(state.items, (item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + incrementQty }
                : item
            );
          } else {
            newItems = [...state.items, { product, quantity: incrementQty }];
          }

          // Sync entire cart to Sanity with debouncing to prevent race conditions
          debouncedSyncCartToSanity(newItems);

          return { items: newItems };
        }),
      addMultipleItems: (products) =>
        set((state) => {
          let updatedItems = [...state.items];

          _.forEach(products, ({ product, quantity }) => {
            const existingItem = _.find(
              updatedItems,
              (item) => item.product._id === product._id
            );

            if (existingItem) {
              updatedItems = _.map(updatedItems, (item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              );
            } else {
              updatedItems.push({ product, quantity });
            }
          });

          return { items: updatedItems };
        }),
      removeItem: (productId) =>
        set((state) => {
          const existingItem = _.find(
            state.items,
            (item) => item.product._id === productId
          );

          if (!existingItem) {
            return state;
          }

          // Calculate decrement based on baseWeight
          const baseWeight = (existingItem.product as any).baseWeight;
          const selectedWeight = (existingItem.product as any).selectedWeight;
          let decrementQty = 1;

          if (baseWeight && selectedWeight?.numericValue) {
            // Calculate how many base units to remove
            decrementQty = selectedWeight.numericValue / baseWeight;
          }

          const newItems = _.reduce(
            state.items,
            (acc: CartItem[], item) => {
              if (item.product._id === productId) {
                const newQty = item.quantity - decrementQty;
                if (newQty > 0) {
                  acc.push({ ...item, quantity: newQty });
                }
              } else {
                acc.push(item);
              }
              return acc;
            },
            [] as CartItem[]
          );

          // Sync entire cart to Sanity with debouncing
          debouncedSyncCartToSanity(newItems);

          return { items: newItems };
        }),
      deleteCartProduct: (productId) =>
        set((state) => {
          const newItems = _.filter(
            state.items,
            (item) => item.product._id !== productId
          );

          // Sync entire cart to Sanity with debouncing
          debouncedSyncCartToSanity(newItems);

          return { items: newItems };
        }),
      resetCart: async () => {
        // Clear local cart state FIRST to prevent Case 3 from syncing it back
        set({
          items: [],
          appliedCoupon: null,
          lastSyncedCartHash: "", // Set to empty string to indicate intentional clear
        });

        // Then clear cart from Sanity database
        try {
          const token = await getAuthToken();
          if (token) {
            const response = await fetch("/api/user/cart", {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error("Failed to clear cart from Sanity:", errorData);
              throw new Error(errorData.message || "Failed to clear cart");
            }

            const data = await response.json();
            console.log("✅ Cart cleared from Sanity:", data.message);
          }
        } catch (err) {
          console.error("❌ Error clearing cart from Sanity:", err);
          throw err; // Re-throw so calling code can handle it
        }
      },
      // Coupon methods
      applyCoupon: (coupon: AppliedCoupon) => {
        set({ appliedCoupon: coupon });
      },
      removeCoupon: () => {
        set({ appliedCoupon: null });
      },
      getCouponDiscount: () => {
        const coupon = get().appliedCoupon;
        return coupon ? coupon.discountAmount : 0;
      },
      getTotalPrice: () => {
        // This should be the final payable amount (current/discounted prices)
        return _.reduce(
          get().items,
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        );
      },
      getSubTotalPrice: () => {
        // This should be the gross amount (before discount)
        return _.reduce(
          get().items,
          (total, item) => {
            const currentPrice = item.product.price ?? 0;
            const discount = item.product.discount ?? 0;
            const discountAmount = (discount * currentPrice) / 100;
            const grossPrice = currentPrice + discountAmount;
            return total + grossPrice * item.quantity;
          },
          0
        );
      },
      getTotalDiscount: () => {
        // New function to get total discount amount
        return _.reduce(
          get().items,
          (total, item) => {
            const currentPrice = item.product.price ?? 0;
            const discount = item.product.discount ?? 0;
            const discountAmount = (discount * currentPrice) / 100;
            return total + discountAmount * item.quantity;
          },
          0
        );
      },
      getItemCount: (productId) => {
        const item = _.find(
          get().items,
          (item) => item.product._id === productId
        );
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => get().items,
      addToFavorite: (product: any) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = _.some(
              state.favoriteProduct,
              (item) => item._id === product._id
            );

            // Sync to Sanity in background
            if (product._id) {
              syncWishlistItemToSanity(
                product._id,
                isFavorite ? "remove" : "add"
              );
            }

            return {
              favoriteProduct: isFavorite
                ? _.filter(
                    state.favoriteProduct,
                    (item) => item._id !== product._id
                  )
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },
      removeFromFavorite: (productId: string) => {
        // Sync removal to Sanity in background
        syncWishlistItemToSanity(productId, "remove");

        set((state: StoreState) => ({
          favoriteProduct: _.filter(
            state.favoriteProduct,
            (item) => item?._id !== productId
          ),
        }));
      },
      resetFavorite: () => {
        // Clear wishlist from Sanity in background
        const token = getAuthToken();
        if (token) {
          token.then((t) => {
            if (t) {
              fetch("/api/user/wishlist", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${t}` },
              }).catch((err) =>
                console.error("Failed to clear wishlist from Sanity:", err)
              );
            }
          });
        }

        set({ favoriteProduct: [] });
      },
      // Load cart from Sanity (on login)
      loadCartFromSanity: async () => {
        try {
          set({ isLoadingCart: true });

          const token = await getAuthToken();
          if (!token) {
            set({ isLoadingCart: false });
            return;
          }

          const response = await fetch("/api/user/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error loading cart from Sanity:", errorData);
            set({ isLoadingCart: false });
            return;
          }

          const data = await response.json();

          if (data.success && data.cart) {
            // Convert Sanity cart to CartItem format
            const sanityItems: CartItem[] = data.cart
              .filter((item: any) => item.product)
              .map((item: any) => ({
                product: item.product,
                quantity: item.quantity,
              }));

            const localItems = get().items;
            const currentHash = generateCartHash(localItems);
            const sanityHash = generateCartHash(sanityItems);
            const lastSyncedHash = get().lastSyncedCartHash;

            // Case 1: Carts are already in sync - do nothing
            if (currentHash === sanityHash && currentHash === lastSyncedHash) {
              set({ isLoadingCart: false });
              return;
            }

            // Case 2: Local cart is empty - use Sanity cart
            if (localItems.length === 0) {
              // Check if this is an intentional clear (hash is empty string)
              if (lastSyncedHash === "") {
                // Don't load from Sanity, keep cart empty
                set({ isLoadingCart: false });
                return;
              }
              set({
                items: sanityItems,
                lastSyncedCartHash: sanityHash,
                isLoadingCart: false,
              });
              return;
            }

            // Case 3: Sanity cart is empty - sync local cart to Sanity (but not if intentionally cleared)
            if (sanityItems.length === 0) {
              // Check if this is an intentional clear (hash is empty string)
              if (lastSyncedHash === "") {
                // Don't sync local back to Sanity, keep both empty
                set({ isLoadingCart: false });
                return;
              }
              set({
                lastSyncedCartHash: currentHash,
                isLoadingCart: false,
              });
              await get().syncCartToDatabase();
              return;
            }

            // Case 4: Both have items - use Sanity as source of truth
            // On page reload, always prefer Sanity cart to avoid duplicates
            set({
              items: sanityItems,
              lastSyncedCartHash: sanityHash,
              isLoadingCart: false,
            });
          } else if (data.success && (!data.cart || data.cart.length === 0)) {
            // Empty Sanity cart
            const localItems = get().items;

            if (localItems.length > 0) {
              const currentHash = generateCartHash(localItems);
              set({
                lastSyncedCartHash: currentHash,
                isLoadingCart: false,
              });
              await get().syncCartToDatabase();
            } else {
              set({
                lastSyncedCartHash: "",
                isLoadingCart: false,
              });
            }
          }
        } catch (error) {
          console.error("Failed to load cart from Sanity:", error);
          set({ isLoadingCart: false });
        }
      },
      // Sync current cart to Sanity
      syncCartToDatabase: async () => {
        try {
          const token = await getAuthToken();
          if (!token) {
            return;
          }

          const items = get().items;

          const response = await fetch("/api/user/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: items.map((item) => ({
                product: { _id: item.product._id },
                quantity: item.quantity,
              })),
            }),
          });

          if (response.ok) {
            // Update hash after successful sync
            const newHash = generateCartHash(items);
            set({ lastSyncedCartHash: newHash });
          }
        } catch (error) {
          console.error("❌ Failed to sync cart to Sanity:", error);
        }
      },
      // Flush any pending debounced sync immediately (call before logout)
      flushPendingSync: async () => {
        await flushCartSync();
      },
      // Load wishlist from Sanity (on login)
      loadWishlistFromSanity: async () => {
        try {
          const token = await getAuthToken();
          if (!token) return;

          const response = await fetch("/api/user/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.wishlist) {
              // Merge with existing local wishlist
              const localWishlist = get().favoriteProduct;
              const sanityWishlist = data.wishlist;

              // Combine both lists and remove duplicates by _id
              const mergedWishlist = _.unionBy(
                sanityWishlist,
                localWishlist,
                "_id"
              );

              set({ favoriteProduct: mergedWishlist });

              // Sync merged wishlist back to Sanity if local had items
              if (localWishlist.length > 0) {
                await get().syncWishlistToDatabase();
              }
            }
          }
        } catch (error) {
          console.error("Failed to load wishlist from Sanity:", error);
        }
      },
      // Sync current wishlist to Sanity
      syncWishlistToDatabase: async () => {
        try {
          const token = await getAuthToken();
          if (!token) return;

          const products = get().favoriteProduct;
          await fetch("/api/user/wishlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: products.map((p) => ({ _id: p._id })),
            }),
          });
        } catch (error) {
          console.error("Failed to sync wishlist to Sanity:", error);
        }
      },
      // order placement state
      isPlacingOrder: false,
      orderStep: "validating" as const,
      setOrderPlacementState: (isPlacing, step = "validating") => {
        set({
          isPlacingOrder: isPlacing,
          orderStep: step,
        });
      },
    }),
    {
      name: "cart-store",
      // Persist cart items, wishlist, coupon, and sync hash
      partialize: (state) => ({
        items: state.items,
        favoriteProduct: state.favoriteProduct,
        appliedCoupon: state.appliedCoupon,
        lastSyncedCartHash: state.lastSyncedCartHash,
      }),
      // Merge function to handle conflicts when hydrating
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
      }),
    }
  )
);

export default useCartStore;
