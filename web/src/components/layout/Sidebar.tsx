import {
  X,
  Home,
  ShoppingBag,
  BookOpen,
  Flame,
  User,
  ShoppingCart,
  Heart,
  Package,
  Tag,
  Phone,
  HelpCircle,
  Info,
  Grid3X3,
  Logs,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useOutsideClick } from "@/hooks";
import useCartStore from "../../../store";
import SocialMedia from "../common/SocialMedia";
import { categoriesData } from "../../../constants";
import Logo from "../Logo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const { items, favoriteProduct } = useCartStore();
  const user = useAuthStore((state) => state.user);

  // Enhanced menu sections with icons
  const userMenuItems = [
    { title: "My Account", href: "/account", icon: User },
    { title: "My Orders", href: "/orders", icon: Package },
    { title: "Wishlist", href: "/wishlist", icon: Heart },
    { title: "Shopping Cart", href: "/cart", icon: ShoppingCart },
  ];

  const mainMenuItems = [
    { title: "Home", href: "/", icon: Home },
    { title: "Shop", href: "/shop", icon: ShoppingBag },
    { title: "Categories", href: "/category", icon: Grid3X3 },
    { title: "Brands", href: "/brands", icon: Tag },
    { title: "Blog", href: "/blog", icon: BookOpen },
    { title: "Hot Deal", href: "/deal", icon: Flame },
  ];

  const supportMenuItems = [
    { title: "Help Center", href: "/help", icon: HelpCircle },
    { title: "Customer Service", href: "/support", icon: Phone },
    { title: "About Us", href: "/about", icon: Info },
  ];

  return (
    <div
      className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-primary/50 shadow-xl transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform ease-in-out duration-300`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-black z-50 h-screen text-primary-foreground p-6 border-r border-r-gofarm-green flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gofarm-green scrollbar-track-transparent"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gofarm-green">
          <Logo className="text-white" />
          <button
            onClick={onClose}
            className="hover:text-gofarm-light-green hoverEffect p-2 rounded-md hover:bg-gofarm-green/30"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gofarm-light-green uppercase tracking-wider">
            Quick Access
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {/* Shopping Cart */}
            <Link
              onClick={onClose}
              href="/cart"
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gofarm-green/30 hover:bg-gofarm-green/50 transition-colors duration-200 text-center relative"
            >
              <ShoppingCart size={20} className="text-gofarm-light-green" />
              <span className="text-xs font-medium text-zinc-300">Cart</span>
              {items?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gofarm-green text-white h-4 w-4 rounded-full text-xs font-semibold flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              onClick={onClose}
              href="/wishlist"
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gofarm-green/30 hover:bg-gofarm-green/50 transition-colors duration-200 text-center relative"
            >
              <Heart size={20} className="text-pink-400" />
              <span className="text-xs font-medium text-zinc-300">
                Wishlist
              </span>
              {favoriteProduct?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white h-4 w-4 rounded-full text-xs font-semibold flex items-center justify-center">
                  {favoriteProduct.length}
                </span>
              )}
            </Link>

            {/* Orders */}
            {user && (
              <Link
                onClick={onClose}
                href="/user/orders"
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gofarm-green/30 hover:bg-gofarm-green/50 transition-colors duration-200 text-center"
              >
                <Logs size={20} className="text-blue-400" />
                <span className="text-xs font-medium text-zinc-300">
                  Orders
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* User Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gofarm-light-green uppercase tracking-wider">
            My Account
          </h3>
          <div className="flex flex-col gap-2">
            {userMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  onClick={onClose}
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium tracking-wide transition-all duration-200 hover:text-gofarm-light-green hover:bg-gofarm-green/30 ${
                    pathname === item.href
                      ? "text-gofarm-light-green bg-gofarm-green/50"
                      : "text-zinc-300"
                  }`}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gofarm-light-green uppercase tracking-wider">
            Navigation
          </h3>
          <div className="flex flex-col gap-2">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  onClick={onClose}
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium tracking-wide transition-all duration-200 hover:text-gofarm-light-green hover:bg-gofarm-green/30 ${
                    pathname === item.href
                      ? "text-gofarm-light-green bg-gofarm-green/50"
                      : "text-zinc-300"
                  }`}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gofarm-light-green uppercase tracking-wider">
            Popular Categories
          </h3>
          <div className="flex flex-col gap-1">
            {categoriesData.slice(0, 6).map((item) => (
              <Link
                onClick={onClose}
                key={item.title}
                href={`/category/${item.href}`}
                className="text-xs font-medium text-zinc-400 hover:text-gofarm-light-green transition-colors duration-200 py-1.5 px-2 rounded hover:bg-gofarm-green/20 capitalize"
              >
                {item.title}
              </Link>
            ))}
            <Link
              onClick={onClose}
              href="/category"
              className="text-xs font-semibold text-gofarm-orange hover:text-gofarm-light-orange transition-colors duration-200 py-1.5 px-2 rounded hover:bg-gofarm-green/20 mt-1"
            >
              View All Categories →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gofarm-light-green uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Link
              onClick={onClose}
              href="/deal"
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gofarm-green/30 hover:bg-gofarm-green/50 transition-colors duration-200 text-center"
            >
              <Flame size={20} className="text-gofarm-orange" />
              <span className="text-xs font-medium text-zinc-300">
                Hot Deals
              </span>
            </Link>
            <Link
              onClick={onClose}
              href="/wishlist"
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gofarm-green/30 hover:bg-gofarm-green/50 transition-colors duration-200 text-center"
            >
              <Heart size={20} className="text-gofarm-light-green" />
              <span className="text-xs font-medium text-zinc-300">
                Wishlist
              </span>
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gofarm-light-green uppercase tracking-wider">
            Support
          </h3>
          <div className="flex flex-col gap-2">
            {supportMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  onClick={onClose}
                  key={item.title}
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium tracking-wide transition-all duration-200 hover:text-gofarm-light-green hover:bg-gofarm-green/30 ${
                    pathname === item.href
                      ? "text-gofarm-light-green bg-gofarm-green/50"
                      : "text-zinc-300"
                  }`}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gofarm-green my-2"></div>

        {/* Promotional Banner */}
        <div className="bg-linear-to-r from-gofarm-green to-gofarm-green rounded-lg p-4 text-center">
          <h4 className="text-sm font-bold text-gofarm-light-green mb-1">
            Special Offer!
          </h4>
          <p className="text-xs text-zinc-300 mb-2">
            Get 20% off on your first order
          </p>
          <Link
            onClick={onClose}
            href="/deal"
            className="inline-block text-xs font-semibold text-white bg-gofarm-orange hover:bg-gofarm-light-orange px-3 py-1 rounded-full transition-colors duration-200"
          >
            Shop Now
          </Link>
        </div>

        {/* Social Media */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gofarm-light-green uppercase tracking-wider mb-3">
            Follow Us
          </h3>
          <SocialMedia />
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
