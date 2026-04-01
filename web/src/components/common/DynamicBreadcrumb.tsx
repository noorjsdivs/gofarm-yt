/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import Link from "next/link";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface DynamicBreadcrumbProps {
  customItems?: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
  // For dynamic routes - pass the actual data
  productData?: {
    name: string;
    slug: string;
  };
  categoryData?: {
    name: string;
    slug: string;
  };
  brandData?: {
    name: string;
    slug: string;
  };
  // For nested routes - specify parent context
  parentPath?: string; // e.g., "/dashboard" for dashboard/cart
}

const DynamicBreadcrumb = ({
  customItems,
  className = "",
  productData,
  categoryData,
  brandData,
  parentPath,
}: DynamicBreadcrumbProps) => {
  const pathname = usePathname();
  const [detectedParentPath, setDetectedParentPath] = useState<string | null>(
    null,
  );

  // Detect parent path from referrer or session storage
  useEffect(() => {
    if (parentPath) {
      setDetectedParentPath(parentPath);
      return;
    }

    // Clear parent context if we're on dashboard itself
    if (pathname === "/dashboard") {
      sessionStorage.removeItem("breadcrumb-parent");
      setDetectedParentPath(null);
      return;
    }

    // Check if we came from dashboard based on document referrer
    const referrer = document.referrer;
    if (referrer) {
      const referrerUrl = new URL(referrer);
      const referrerPath = referrerUrl.pathname;

      // If we came from dashboard, include it in breadcrumb
      if (
        referrerPath === "/dashboard" ||
        referrerPath.startsWith("/dashboard/")
      ) {
        setDetectedParentPath("/dashboard");
      }
    }

    // Also check session storage for navigation context
    const storedParent = sessionStorage.getItem("breadcrumb-parent");
    if (storedParent === "/dashboard") {
      setDetectedParentPath("/dashboard");
    }
  }, [parentPath, pathname]);

  const formatSegmentLabel = (segment: string): string => {
    // Handle special cases
    const specialCases: Record<string, string> = {
      "sign-in": "Sign In",
      "sign-up": "Sign Up",
      "my-account": "My Account",
      "order-history": "Order History",
    };

    if (specialCases[segment]) {
      return specialCases[segment];
    }

    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  //   Generate breadcrumb items based on pathname and dynamic data

  const generateBreadcrumbs = () => {
    const pathSegments = pathname
      .split("/")
      .filter((segment) => segment !== "");

    const breadcrumbs: Array<{
      label: string;
      href?: string;
      isLast: boolean;
    }> = [];

    // Always start with Home
    breadcrumbs.push({
      label: "Home",
      href: "/",
      isLast: pathSegments.length === 0,
    });

    // If we're on home page, return just Home
    if (pathSegments.length === 0) {
      return breadcrumbs;
    }

    // For nested routes with parent context (e.g., dashboard/cart)
    const activeParentPath = parentPath || detectedParentPath;
    if (
      activeParentPath &&
      !pathSegments.includes(activeParentPath.replace("/", ""))
    ) {
      // Add the parent to the breadcrumbs
      const parentSegment = activeParentPath.replace("/", "");
      breadcrumbs.push({
        label: formatSegmentLabel(parentSegment),
        href: activeParentPath,
        isLast: false,
      });
    }

    // Build breadcrumbs for each segment
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      const isLast = index === pathSegments.length - 1;
      const parentSegment = pathSegments[index - 1];

      // Skip route groups like (client), (user), (public)
      if (segment.startsWith("(") && segment.endsWith(")")) {
        return;
      }

      // Build the current path
      currentPath += `/${segment}`;

      // Handle dynamic routes with provided data
      if (parentSegment === "product" && productData && isLast) {
        breadcrumbs.push({
          label: productData.name,
          href: undefined,
          isLast: true,
        });
        return;
      }

      if (parentSegment === "category" && categoryData && isLast) {
        breadcrumbs.push({
          label: categoryData.name,
          href: undefined,
          isLast: true,
        });
        return;
      }

      if (parentSegment === "brands" && brandData && isLast) {
        breadcrumbs.push({
          label: brandData.name,
          href: undefined,
          isLast: true,
        });
        return;
      }

      // Format the segment label
      const label = formatSegmentLabel(segment);

      // Add breadcrumb item
      if (label) {
        breadcrumbs.push({
          label,
          href: isLast ? undefined : currentPath,
          isLast,
        });
      }
    });

    // Replace with custom items if provided
    if (customItems && customItems.length > 0) {
      // Keep Home, add custom items
      const homeBreadcrumb = breadcrumbs[0];
      const customBreadcrumbs = customItems.map((item, index) => ({
        ...item,
        isLast: index === customItems.length - 1,
      }));

      return [homeBreadcrumb, ...customBreadcrumbs];
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className={cn("my-3", className)}>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs?.map((crumb, index) => (
            <div key={index} className="flex items-center">
              <BreadcrumbItem>
                {crumb?.isLast ? (
                  <BreadcrumbPage className="text-gofarm-green font-medium truncate max-w-xs">
                    {crumb?.label}
                  </BreadcrumbPage>
                ) : (
                  // <BreadcrumbLink>
                  <Link
                    href={crumb?.href || "/"}
                    className={cn(
                      "flex items-center hover:text-gofarm-green hoverEffect",
                    )}
                  >
                    {index === 0 && <Home size={16} />}
                    <span className={index === 0 ? "ml-1" : ""}>
                      {crumb?.label}
                    </span>
                  </Link>
                  // </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!crumb.isLast && <BreadcrumbSeparator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default DynamicBreadcrumb;
