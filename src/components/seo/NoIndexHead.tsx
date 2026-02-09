/**
 * NoIndexHead Component
 * Adds noindex meta tags to prevent search engine indexing
 * Use this in client components where you can't export metadata
 */
"use client";

import { useEffect } from "react";

interface NoIndexHeadProps {
  noindex?: boolean;
  nofollow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
}

/**
 * Adds noindex meta tags to the document head
 * Use this to prevent sensitive pages from being indexed by search engines
 *
 * @example
 * ```tsx
 * <NoIndexHead noindex nofollow />
 * ```
 */
export function NoIndexHead({
  noindex = true,
  nofollow = true,
  noarchive = true,
  nosnippet = false,
  noimageindex = false,
}: NoIndexHeadProps) {
  useEffect(() => {
    // Create meta tag
    const robotsValue = [
      noindex ? "noindex" : "",
      nofollow ? "nofollow" : "",
      noarchive ? "noarchive" : "",
      nosnippet ? "nosnippet" : "",
      noimageindex ? "noimageindex" : "",
    ]
      .filter(Boolean)
      .join(", ");

    const metaTag = document.createElement("meta");
    metaTag.name = "robots";
    metaTag.content = robotsValue;
    metaTag.setAttribute("data-noindex", "true"); // Mark for cleanup

    // Add to head
    document.head.appendChild(metaTag);

    // Cleanup on unmount
    return () => {
      const existingTag = document.head.querySelector(
        'meta[name="robots"][data-noindex="true"]'
      );
      if (existingTag) {
        existingTag.remove();
      }
    };
  }, [noindex, nofollow, noarchive, nosnippet, noimageindex]);

  return null; // This component doesn't render anything
}

/**
 * Quick preset for admin pages
 */
export function AdminNoIndex() {
  return <NoIndexHead noindex nofollow noarchive nosnippet />;
}

/**
 * Quick preset for dashboard pages
 */
export function DashboardNoIndex() {
  return <NoIndexHead noindex nofollow />;
}

/**
 * Quick preset for auth pages
 */
export function AuthNoIndex() {
  return <NoIndexHead noindex nofollow />;
}
