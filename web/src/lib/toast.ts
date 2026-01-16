import { toast } from "sonner";

// Enhanced toast utilities with theme-aware styling and better UX
export const showToast = {
  // Success toast with custom styling
  success: (
    message: string,
    description?: string,
    action?: { label: string; onClick: () => void }
  ) => {
    toast.success(message, {
      description,
      duration: 4000,
      action: action || {
        label: "✓",
        onClick: () => {},
      },
      className: "border-l-4 border-gofarm-green",
    });
  },

  // Error toast with enhanced styling
  error: (
    message: string,
    description?: string,
    action?: { label: string; onClick: () => void }
  ) => {
    toast.error(message, {
      description,
      duration: 6000,
      action: action || {
        label: "Dismiss",
        onClick: () => toast.dismiss(),
      },
      className: "border-l-4 border-red-500",
    });
  },

  // Warning toast
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
      className: "border-l-4 border-orange-500",
    });
  },

  // Info toast
  info: (
    message: string,
    description?: string,
    action?: { label: string; onClick: () => void }
  ) => {
    toast.info(message, {
      description,
      duration: 4000,
      action,
      className: "border-l-4 border-blue-500",
    });
  },

  // Loading toast for async operations
  loading: (message: string) => {
    return toast.loading(message, {
      duration: Infinity,
      className: "border-l-4 border-gray-400",
    });
  },

  // Promise toast for handling async operations
  promise: function <T>(
    promise: Promise<T>,
    options: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((error: Error) => string);
    }
  ) {
    return toast.promise(promise, {
      loading: options.loading || "Processing...",
      success: options.success || "Success!",
      error: options.error || "Something went wrong!",
    });
  },

  // Custom toast with action button (primary use case: add to cart)
  addToCart: (
    productName: string,
    options?: {
      description?: string;
      onViewCart?: () => void;
    }
  ) => {
    toast.success(`🛒 ${productName} added to cart!`, {
      description:
        options?.description || "Item successfully added to your shopping cart",
      duration: 4000,
      action: {
        label: "View Cart",
        onClick:
          options?.onViewCart ||
          (() => {
            window.location.href = "/cart";
          }),
      },
      className: "border-l-4 border-gofarm-green bg-gofarm-light-green/5",
    });
  },

  // Custom toast for wishlist
  addToWishlist: (
    productName: string,
    options?: {
      onViewWishlist?: () => void;
    }
  ) => {
    toast.success(`❤️ ${productName} added to wishlist!`, {
      description: "You can view all your favorite items in the wishlist",
      duration: 4000,
      action: {
        label: "View Wishlist",
        onClick:
          options?.onViewWishlist ||
          (() => {
            window.location.href = "/wishlist";
          }),
      },
      className: "border-l-4 border-pink-500 bg-pink-50/50",
    });
  },

  // Custom toast with action
  custom: (message: string, action: { label: string; onClick: () => void }) => {
    toast(message, {
      action,
      duration: 5000,
      className: "border-l-4 border-gofarm-green",
    });
  },

  // Dismiss all toasts
  dismiss: (id?: string | number) => {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  },
};

// Theme-aware toast colors matching the app's color scheme
export const toastColors = {
  success: "#22c55e", // gofarm-green
  error: "#ef4444", // red-500
  warning: "#f97316", // orange-500
  info: "#3b82f6", // blue-500
  dark: "#1f2937", // gray-800
  light: "#ffffff", // white
  gofarmGreen: "#22c55e",
  gofarmLightGreen: "#dcfce7",
  gofarmOrange: "#f97316",
};
