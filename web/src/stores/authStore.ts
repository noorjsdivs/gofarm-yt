import { create } from "zustand";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  UserCredential,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { toast } from "sonner";

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithGithub: () => Promise<UserCredential>;
  sendEmailLink: (email: string) => Promise<void>;
  completeEmailLinkSignIn: (email: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initializeAuth: () => () => void;
}

// Helper function to sync user to Sanity via API route
async function syncUserToSanityAPI(user: User): Promise<void> {
  try {
    const idToken = await user.getIdToken();

    const response = await fetch("/api/auth/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Failed to sync user to Sanity:", error);
      // Don't throw - allow auth to continue even if sync fails
    } else {
      const result = await response.json();
      console.log("✅ User synced to Sanity successfully:", result);
    }
  } catch (error) {
    console.error("❌ Error syncing user to Sanity:", error);
    // Don't throw - allow auth to continue even if sync fails
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  signIn: async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Sync will happen in onAuthStateChanged
      toast.success("Successfully signed in!");
      return result;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to sign in";
      toast.error(message);
      throw error;
    }
  },
  signUp: async (email: string, password: string, displayName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }
      // Sync will happen in onAuthStateChanged
      toast.success("Account created successfully!");
      return result;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create account";
      toast.error(message);
      throw error;
    }
  },
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Sync will happen in onAuthStateChanged
      // Don't show success toast here - let the calling component handle it after Sanity check
      return result;
    } catch (error: unknown) {
      console.error("Google sign-in error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to sign in with Google";
      toast.error(message);
      throw error;
    }
  },

  signInWithGithub: async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Sync will happen in onAuthStateChanged
      // Don't show success toast here - let the calling component handle it after Sanity check
      return result;
    } catch (error: unknown) {
      console.error("Github sign-in error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to sign in with Github";
      toast.error(message);
      throw error;
    }
  },
  sendEmailLink: async (email: string) => {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/sign-in/email-link`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save email to localStorage for email link sign-in
      window.localStorage.setItem("emailForSignIn", email);
      toast.success("Sign-in link sent to your email!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to send sign-in link";
      toast.error(message);
      throw error;
    }
  },
  completeEmailLinkSignIn: async (email: string) => {
    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        throw new Error("Invalid sign-in link");
      }
      const result = await signInWithEmailLink(
        auth,
        email,
        window.location.href
      );
      // Clear email from localStorage
      window.localStorage.removeItem("emailForSignIn");
      // Sync will happen in onAuthStateChanged
      toast.success("Successfully signed in!");
      return result;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to complete sign-in";
      toast.error(message);
      throw error;
    }
  },
  logout: async () => {
    try {
      // Flush any pending cart sync before logging out
      //   const { default: useCartStore } = await import("@/store");
      //   await useCartStore.getState().flushPendingSync();

      await signOut(auth);
      toast.success("Successfully signed out!");

      // Clear all local storage and session data
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to home page and force reload to clear all state
      window.location.href = "/";
    } catch (error: unknown) {
      console.error("❌ Logout error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to sign out";
      toast.error(message);
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to send reset email";
      toast.error(message);
      throw error;
    }
  },
  initializeAuth: () => {
    let tokenRefreshInterval: NodeJS.Timeout | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔐 Auth state changed:", user ? user.email : "No user");
      set({ user });

      // Clear existing token refresh interval
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
        tokenRefreshInterval = null;
      }

      // Set or clear the session cookie
      if (user) {
        console.log("👤 User authenticated, setting up session...");
        // Get fresh token and set session
        const token = await user.getIdToken(true);
        const sessionResponse = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!sessionResponse.ok) {
          console.error("Failed to set session cookie");
          set({ loading: false });
          return;
        }

        // Wait a bit to ensure cookie is set in browser
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Set up token refresh interval (refresh every 50 minutes)
        // Firebase tokens expire after 1 hour, so we refresh before that
        tokenRefreshInterval = setInterval(async () => {
          try {
            const currentUser = auth.currentUser;
            if (currentUser) {
              const freshToken = await currentUser.getIdToken(true);
              await fetch("/api/auth/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: freshToken }),
              });
            }
          } catch (error) {
            console.error("❌ Failed to refresh token:", error);
          }
        }, 50 * 60 * 1000); // 50 minutes

        // Sync user to Sanity (this is the ONLY sync point now)
        await syncUserToSanityAPI(user);

        // Load and sync cart/wishlist from Sanity
        // const { default: useCartStore } = await import("@/store");

        // Load cart from Sanity (this will merge with local cart if any)
        // await useCartStore.getState().loadCartFromSanity();

        // Load wishlist from Sanity (this will merge with local wishlist if any)
        // await useCartStore.getState().loadWishlistFromSanity();

        // Set loading to false AFTER session is established and data is loaded
        set({ loading: false });
      } else {
        await fetch("/api/auth/session", {
          method: "DELETE",
        });

        // Set loading to false for logged out state
        set({ loading: false });
      }
    });

    return () => {
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
      unsubscribe();
    };
  },
}));
