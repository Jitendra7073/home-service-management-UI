import { MetadataRoute } from "next";

/**
 * Robots.txt Configuration for Homhelper
 * Blocks all sensitive/private pages from search engines
 * Allows only public-facing customer pages
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://HomHelpers-services.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        // Allow public customer pages
        allow: [
          "/",
          "/customer/explore",
          "/customer/explore/categories",
          "/customer/about",
          "/customer/terms",
          "/customer/privacy-policy",
        ],
        // Block all sensitive and private areas
        disallow: [
          // API routes
          "/api/",

          // Admin dashboard (completely private)
          "/admin/",

          // Staff dashboard (private)
          "/staff/",

          // Authentication pages
          "/auth/",

          // Provider dashboard and onboarding (private)
          "/provider/dashboard",
          "/provider/onboard",

          // Customer private areas
          "/customer/dashboard",
          "/customer/booking",
          "/customer/cart",
          "/customer/profile",

          // Next.js internal
          "/_next/",

          // Static files
          "/static/",
        ],
      },
      {
        userAgent: "Googlebot",
        // Additional rules specifically for Googlebot
        allow: ["/"],
        disallow: [
          "/api/",
          "/admin/",
          "/staff/",
          "/auth/",
          "/provider/dashboard",
          "/customer/dashboard",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
