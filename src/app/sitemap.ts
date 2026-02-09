import { MetadataRoute } from "next";
import { backend } from "@/lib/backend";

/**
 * Dynamic Sitemap for Homhelper
 * Automatically includes all public pages, services, providers, and categories
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://HomHelpers-services.vercel.app";

  // Static pages - always included
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/customer/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/customer/explore/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/customer/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/customer/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/customer/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    // Fetch all providers (public service detail pages)
    const providersResponse = await fetch(`${baseUrl}/api/customer/providers`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    let providerPages: MetadataRoute.Sitemap = [];
    if (providersResponse.ok) {
      const providersData = await providersResponse.json();
      const providers = providersData?.providers || providersData || [];

      providerPages = providers
        .filter((provider: any) => provider?.isActive !== false && provider?.businessProfile)
        .map((provider: any) => ({
          url: `${baseUrl}/customer/explore/${provider.id}`,
          lastModified: provider.updatedAt ? new Date(provider.updatedAt) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
    }

    // Fetch all categories
    const categoriesResponse = await fetch(`${baseUrl}/api/common/businessCategories`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    let categoryPages: MetadataRoute.Sitemap = [];
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      const categories = categoriesData?.categories || [];

      categoryPages = categories.map((category: any) => ({
        url: `${baseUrl}/customer/explore/categories/${category.id}`,
        lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }

    // Combine all pages
    return [...staticPages, ...providerPages, ...categoryPages];
  } catch (error) {
    // If fetching fails, return at least the static pages
    console.error("Error generating dynamic sitemap:", error);
    return staticPages;
  }
}
