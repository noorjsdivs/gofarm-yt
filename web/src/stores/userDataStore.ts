import { create } from "zustand";

interface UserData {
  ordersCount: number;
  isEmployee: boolean;
  unreadNotifications: number;
  walletBalance: number;
  isLoading: boolean;
}

interface UserDataStore extends UserData {
  fetchUserData: (userId: string, forceRefresh?: boolean) => Promise<void>;
  refreshUserData: (userId: string) => Promise<void>;
  resetUserData: () => void;
}

// Cache for user data to prevent unnecessary API calls
let cachedData: UserData | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

const initialUserData: UserData = {
  ordersCount: 0,
  isEmployee: false,
  unreadNotifications: 0,
  walletBalance: 0,
  isLoading: false,
};

export const useUserDataStore = create<UserDataStore>((set, get) => ({
  ...initialUserData,

  fetchUserData: async (userId: string, forceRefresh = false) => {
    if (!userId) {
      set(initialUserData);
      return;
    }

    // Use cached data if available and not expired
    const now = Date.now();
    if (!forceRefresh && cachedData && now - cacheTimestamp < CACHE_DURATION) {
      set(cachedData);
      return;
    }

    set({ isLoading: true });

    try {
      // Fetch all user data in a single optimized API call
      const response = await fetch("/api/user/combined-data", {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();

        const newUserData: UserData = {
          ordersCount: data.ordersCount || 0,
          isEmployee: data.isEmployee || false,
          unreadNotifications: data.unreadNotifications || 0,
          walletBalance: data.walletBalance || 0,
          isLoading: false,
        };

        // Update cache
        cachedData = newUserData;
        cacheTimestamp = now;

        set(newUserData);
      } else if (response.status === 401) {
        // User not authenticated - silently reset to initial state
        set({ ...initialUserData, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      // Silently handle errors - don't log for unauthorized users
      set({ ...initialUserData, isLoading: false });
    }
  },

  refreshUserData: async (userId: string) => {
    await get().fetchUserData(userId, true);
  },

  resetUserData: () => {
    set(initialUserData);
    cachedData = null;
    cacheTimestamp = 0;
  },
}));
