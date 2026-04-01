// Centralized analytics service for Firebase event tracking

import { analytics } from "@/lib/firebase";
import { logEvent, Analytics } from "firebase/analytics";

// Types for event parameters
type AddToCartParams = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  userId?: string;
};

type RemoveFromCartParams = AddToCartParams;

type OrderPlacedParams = {
  orderId: string;
  amount: number;
  status: string;
  userId?: string;
};

type OrderStatusUpdateParams = {
  orderId: string;
  status: string;
  userId?: string;
};

type UserRegistrationParams = {
  userId: string;
  email: string;
};

type UserLoginParams = UserRegistrationParams;

type ProductViewParams = {
  productId: string;
  name: string;
  userId?: string;
};

// Helper to safely log events (no-op if analytics is not initialized)
export function trackEvent(
  eventName: string,
  eventParams: Record<
    string,
    string | number | boolean | undefined | unknown[]
  > = {}
) {
  if (typeof window !== "undefined" && analytics) {
    logEvent(analytics as Analytics, eventName, eventParams);
  } else {
    // Optionally, queue events or log to console in dev
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics] ${eventName}`, eventParams);
    }
  }
}

// E-commerce specific events
export function trackAddToCart(params: AddToCartParams) {
  trackEvent("add_to_cart", params);
}

export function trackRemoveFromCart(params: RemoveFromCartParams) {
  trackEvent("remove_from_cart", params);
}

export function trackOrderPlaced(params: OrderPlacedParams) {
  trackEvent("order_placed", params);
}

export function trackOrderStatusUpdate(params: OrderStatusUpdateParams) {
  trackEvent("order_status_update", params);
}

export function trackUserRegistration(params: UserRegistrationParams) {
  trackEvent("user_registration", params);
}

export function trackUserLogin(params: UserLoginParams) {
  trackEvent("user_login", params);
}

export function trackProductView(params: ProductViewParams) {
  trackEvent("view_product", params);
}

// Additional e-commerce tracking functions
export function trackCartView(userId?: string) {
  trackEvent("view_cart", { userId });
}

export function trackCheckoutStarted(params: {
  userId?: string;
  cartValue: number;
  itemCount: number;
}) {
  trackEvent("begin_checkout", params);
}

export function trackSearchPerformed(params: {
  searchTerm: string;
  userId?: string;
  resultCount?: number;
}) {
  trackEvent("search", params);
}

export function trackCategoryView(params: {
  categoryId: string;
  categoryName: string;
  userId?: string;
}) {
  trackEvent("view_category", params);
}

export function trackWishlistAdd(params: {
  productId: string;
  name: string;
  userId?: string;
}) {
  trackEvent("add_to_wishlist", params);
}

export function trackWishlistRemove(params: {
  productId: string;
  name: string;
  userId?: string;
}) {
  trackEvent("remove_from_wishlist", params);
}

export function trackPageView(params: {
  pagePath: string;
  pageTitle?: string;
  userId?: string;
}) {
  trackEvent("page_view", params);
}

// Advanced e-commerce tracking
export function trackPurchase(params: {
  orderId: string;
  value: number;
  currency?: string;
  items: Array<{
    productId: string;
    name: string;
    category?: string;
    quantity: number;
    price: number;
  }>;
  userId?: string;
}) {
  trackEvent("purchase", params);
}

export function trackBestSellingProducts(params: {
  products: Array<{
    productId: string;
    name: string;
    category?: string;
    salesCount: number;
    revenue: number;
  }>;
  timeframe: string; // e.g., "weekly", "monthly"
}) {
  trackEvent("best_selling_products", params);
}

export function trackOrderDetails(params: {
  orderId: string;
  orderNumber: string;
  status: string;
  value: number;
  itemCount: number;
  paymentMethod: string;
  shippingMethod?: string;
  userId?: string;
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}) {
  trackEvent("order_details", params);
}

export function trackOrderFullfillment(params: {
  orderId: string;
  status: string;
  previousStatus: string;
  value: number;
  fulfillmentTime?: number; // in hours/days
  userId?: string;
}) {
  trackEvent("order_fulfillment", params);
}

export function trackInventoryAction(params: {
  productId: string;
  name: string;
  action: "restock" | "low_stock" | "out_of_stock";
  currentStock: number;
  previousStock?: number;
}) {
  trackEvent("inventory_action", params);
}

/**
 * Track customer lifetime analytics
 */
export function trackCustomerLifetime(
  userId: string,
  totalSpent: number,
  orderCount: number,
  avgOrderValue: number
) {
  if (typeof window !== "undefined" && analytics) {
    logEvent(analytics, "customer_lifetime_value", {
      user_id: userId,
      total_spent: totalSpent,
      order_count: orderCount,
      average_order_value: avgOrderValue,
      ltv_segment:
        totalSpent > 1000
          ? "high_value"
          : totalSpent > 500
          ? "medium_value"
          : "low_value",
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track product search events
 */
export function trackProductSearch(
  searchTerm: string,
  resultsCount: number,
  category?: string,
  filters?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && analytics) {
    logEvent(analytics, "search", {
      search_term: searchTerm,
      results_count: resultsCount,
      category: category || "all",
      filters: JSON.stringify(filters || {}),
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track category view events with enhanced data
 */
export function trackCategoryViewEnhanced(
  categoryName: string,
  categoryId: string,
  productCount: number
) {
  if (typeof window !== "undefined" && analytics) {
    logEvent(analytics, "view_item_list", {
      item_list_id: categoryId,
      item_list_name: categoryName,
      items_count: productCount,
      list_type: "category",
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track enhanced user registration events
 */
export function trackUserRegistrationEnhanced(
  userId: string,
  registrationMethod: "email" | "google" | "facebook" | "other"
) {
  if (typeof window !== "undefined" && analytics) {
    logEvent(analytics, "sign_up", {
      method: registrationMethod,
      user_id: userId,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track enhanced user login events
 */
export function trackUserLoginEnhanced(
  userId: string,
  loginMethod: "email" | "google" | "facebook" | "other"
) {
  if (typeof window !== "undefined" && analytics) {
    logEvent(analytics, "login", {
      method: loginMethod,
      user_id: userId,
      timestamp: new Date().toISOString(),
    });
  }
}

// Add more as needed for your analytics needs
