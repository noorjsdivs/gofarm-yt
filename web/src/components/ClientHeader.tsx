"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import TopHeaderBadge from "./TopHeaderBadge";
import Container from "./Container";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import FavoriteIcon from "./FavoriteIcon";
import NotificationBellIcon from "./NotificationBellIcon";
import CartIcon from "./CartIcon";
import UserDropDown from "./UserDropDown";
import MobileMenu from "./MobileMenu";
import HeaderMenu from "./HeaderMenu";
import Link from "next/link";

const ClientHeader = () => {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVendor, setIsVendor] = useState(false);

  // Track when component is mounted on client side
  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  const getSignInUrl = () => {
    if (!isMounted || typeof window === "undefined") return "/sign-in";
    const currentPath = window.location.pathname + window.location.search;
    return `/sign-in?redirectTo=${encodeURIComponent(currentPath)}`;
  };

  const getSignUpUrl = () => {
    if (!isMounted || typeof window === "undefined") return "/sign-up";
    const currentPath = window.location.pathname + window.location.search;
    return `/sign-up?redirectTo=${encodeURIComponent(currentPath)}`;
  };

  return (
    <header className="">
      <TopHeaderBadge />
      <div>
        <Container className="flex items-center justify-between py-3 lg:py-4">
          <Logo />
          <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
            <SearchBar />
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <CartIcon />
            <FavoriteIcon />
            <NotificationBellIcon />
            {loading ? (
              <div className="flex items-center gap-2.5 py-2 px-3 rounded-xl border border-gray-200 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-200" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3.5 w-16 bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>
              </div>
            ) : (
              <>
                {user ? (
                  <UserDropDown />
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href={getSignInUrl()}
                      className="bg-transparent border border-gofarm-green hover:bg-gofarm-green text-gofarm-green hover:text-gofarm-white px-3 py-1.5 rounded text-sm font-semibold hoverEffect"
                    >
                      Sign In
                    </Link>
                    <Link
                      href={getSignUpUrl()}
                      className="bg-gofarm-green border border-gofarm-green hover:bg-transparent text-gofarm-white hover:text-gofarm-green px-3 py-1.5 rounded text-sm font-semibold hoverEffect"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </Container>
      </div>
      {/* Bottom Header Menu */}
      <div className="bg-gofarm-white border-y border-gofarm-gray/20">
        <Container className="flex items-center justify-between py-2 lg:py-3">
          <div className="flex md:hidden items-center">
            <MobileMenu />
          </div>
          <div className="flex">
            <HeaderMenu />
          </div>
          {/* Right: Help Button */}
          <div className="flex items-center gap-2">
            <Link
              href="/help"
              className="text-sm font-medium text-gofarm-gray hover:text-gofarm-light-green hoverEffect whitespace-nowrap"
            >
              Need Help?
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default ClientHeader;
