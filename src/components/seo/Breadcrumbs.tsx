/**
 * Breadcrumbs Component
 * Displays breadcrumb navigation with structured data
 * Can be used in both client and server components
 */

"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showSchema?: boolean;
  homeLabel?: string;
  homeHref?: string;
}

/**
 * Breadcrumbs Component
 *
 * Displays a breadcrumb trail with structured data for SEO.
 * Automatically includes Home as the first breadcrumb.
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { name: "Services", href: "/services" },
 *     { name: "Cleaning", href: "/services/cleaning" },
 *     { name: "Home Cleaning", href: "/services/cleaning/home", current: true },
 *   ]}
 * />
 * ```
 */
export function Breadcrumbs({
  items,
  className,
  showSchema = true,
  homeLabel = "Home",
  homeHref = "/",
}: BreadcrumbsProps) {
  // Add home as first breadcrumb if not already present
  const allItems = items[0]?.href === homeHref
    ? items
    : [{ name: homeLabel, href: homeHref }, ...items];

  // Generate structured data
  const generateSchema = () => {
    const { SITE_CONFIG } = require("@/lib/seo/constants");

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: allItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_CONFIG.url}${item.href}`,
      })),
    };
  };

  return (
    <>
      {showSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSchema()) }}
        />
      )}

      <nav
        className={cn("flex items-center space-x-1 text-sm", className)}
        aria-label="Breadcrumb"
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <React.Fragment key={item.href}>
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              )}

              {item.current || isLast ? (
                <span
                  className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center hover:text-primary transition-colors text-muted-foreground hover:underline truncate max-w-[200px] sm:max-w-none"
                >
                  {index === 0 && <Home className="h-4 w-4 mr-1" />}
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}

/**
 * Server-side Breadcrumbs Component
 * Use this in server components where client-side features aren't needed
 */
export function ServerBreadcrumbs({
  items,
  className,
  showSchema = true,
  homeLabel = "Home",
  homeHref = "/",
}: BreadcrumbsProps) {
  // Add home as first breadcrumb if not already present
  const allItems = items[0]?.href === homeHref
    ? items
    : [{ name: homeLabel, href: homeHref }, ...items];

  // Generate structured data
  const generateSchema = () => {
    const { SITE_CONFIG } = require("@/lib/seo/constants");

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: allItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_CONFIG.url}${item.href}`,
      })),
    };
  };

  return (
    <>
      {showSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSchema()) }}
        />
      )}

      <nav
        className={cn("flex items-center space-x-1 text-sm", className)}
        aria-label="Breadcrumb"
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <React.Fragment key={item.href}>
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              )}

              {item.current || isLast ? (
                <span
                  className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center hover:text-primary transition-colors text-muted-foreground hover:underline truncate max-w-[200px] sm:max-w-none"
                >
                  {index === 0 && <Home className="h-4 w-4 mr-1" />}
                  {item.name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}

/**
 * Generate breadcrumb items from pathname
 */
export function generateBreadcrumbsFromPath(
  pathname: string,
  customLabels?: Record<string, string>
): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  const defaultLabels: Record<string, string> = {
    customer: "Services",
    explore: "Explore",
    categories: "Categories",
    admin: "Admin",
    provider: "Provider",
    staff: "Staff",
    auth: "Auth",
    login: "Login",
    register: "Register",
    dashboard: "Dashboard",
    booking: "Bookings",
    cart: "Cart",
    profile: "Profile",
    about: "About Us",
    terms: "Terms & Conditions",
    "privacy-policy": "Privacy Policy",
    ...customLabels,
  };

  const items: BreadcrumbItem[] = [];
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Check if segment is a UUID (dynamic route)
    const isDynamic = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);

    items.push({
      name: isDynamic
        ? "Details"
        : (customLabels?.[segment] || defaultLabels[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())),
      href: currentPath,
      current: isLast,
    });
  });

  return items;
}

/**
 * Breadcrumb Props Generator
 * Helper to generate breadcrumb props for common page types
 */
export function generateBreadcrumbProps(pageType: string, params?: {
  category?: string;
  service?: string;
  city?: string;
  provider?: string;
}) {
  const base: BreadcrumbItem[] = [{ name: "Home", href: "/" }];

  switch (pageType) {
    case "service":
      return [
        ...base,
        { name: "Services", href: "/customer/explore/categories" },
        { name: params?.category || "Service", href: `/customer/explore/categories/${params?.category}` },
        { name: params?.service || "Details", href: `/customer/explore/${params?.provider}`, current: true },
      ];

    case "category":
      return [
        ...base,
        { name: "Services", href: "/customer/explore/categories" },
        { name: params?.category || "Category", href: `/customer/explore/categories/${params?.category}`, current: true },
      ];

    case "city":
      return [
        ...base,
        { name: "Services", href: "/customer/explore" },
        { name: `Services in ${params?.city}`, href: `/city/${params?.city}`, current: true },
      ];

    default:
      return base;
  }
}
