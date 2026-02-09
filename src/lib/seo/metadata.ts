/**
 * SEO Metadata Generators
 * Helper functions to generate metadata for different page types
 */

import { Metadata } from "next";
import {
  SITE_CONFIG,
  SEO_DEFAULTS,
  META_TITLE_TEMPLATES,
  META_DESCRIPTION_TEMPLATES,
  IMAGE_DIMENSIONS,
} from "./constants";

/**
 * Generate base metadata for a page
 */
export function generateBaseMetadata(options?: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}): Metadata {
  const {
    title = SEO_DEFAULTS.title.default,
    description = SEO_DEFAULTS.description,
    image,
    noIndex = false,
    noFollow = false,
  } = options || {};

  return {
    title,
    description,
    keywords: SEO_DEFAULTS.keywords,
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: SEO_DEFAULTS.ogType,
      locale: SEO_DEFAULTS.defaultLocale,
      url: SITE_CONFIG.url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: image
        ? [
            {
              url: image,
              width: IMAGE_DIMENSIONS.og.width,
              height: IMAGE_DIMENSIONS.og.height,
              alt: title,
            },
          ]
        : [
            {
              url: "/og-image.png",
              width: IMAGE_DIMENSIONS.og.width,
              height: IMAGE_DIMENSIONS.og.height,
              alt: SITE_CONFIG.name,
            },
          ],
    },
    twitter: {
      card: SEO_DEFAULTS.twitterCard,
      title,
      description,
      images: image ? [image] : ["/og-image.png"],
      creator: `@${SITE_CONFIG.name.toLowerCase()}`,
    },
  };
}

/**
 * Generate metadata for service detail pages
 */
export function generateServiceMetadata(options: {
  serviceName: string;
  categoryName: string;
  city: string;
  description: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  coverImage?: string;
  providerName?: string;
  businessName?: string;
}): Metadata {
  const {
    serviceName,
    categoryName,
    city,
    description,
    price,
    rating = 0,
    reviewCount = 0,
    coverImage,
    providerName,
    businessName,
  } = options;

  const title = `${serviceName} in ${city} | ${SITE_CONFIG.name}`;
  const priceText = price ? `Starting ₹${price}` : "";
  const ratingText = rating > 0 ? `⭐ ${rating.toFixed(1)}` : "";
  const reviewsText = reviewCount > 0 ? `from ${reviewCount} reviews` : "";

  const metaDescription = `Book ${serviceName} in ${city} from verified professionals. ${description} ${priceText} ${ratingText} ${reviewsText}. 30-day warranty, instant booking.`.trim();

  return {
    ...generateBaseMetadata({
      title,
      description: metaDescription,
      image: coverImage || "/og-service-default.png",
    }),
    keywords: [
      serviceName,
      `${serviceName} in ${city}`,
      `${serviceName} near me`,
      categoryName,
      `${categoryName} services`,
      `best ${serviceName}`,
      `affordable ${serviceName}`,
      `verified ${serviceName}`,
      providerName || businessName || "",
      city,
      "home services",
      "professional services",
    ],
    alternates: {
      canonical: `${SITE_CONFIG.url}/customer/explore/${providerName || "provider"}`,
    },
  };
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(options: {
  categoryName: string;
  categorySlug: string;
  description?: string;
  services?: string[];
  image?: string;
}): Metadata {
  const { categoryName, description, services = [], image } = options;

  const title = `${categoryName} Services in India | ${SITE_CONFIG.name}`;
  const servicesList = services.length > 0
    ? services.slice(0, 5).join(", ")
    : "professional services";

  const metaDescription = description ||
    `Book ${categoryName} services across India. ${servicesList}. Verified experts, transparent pricing, 30-day warranty.`;

  return {
    ...generateBaseMetadata({
      title,
      description: metaDescription,
      image: image || "/og-category-default.png",
    }),
    keywords: [
      categoryName,
      `${categoryName} services`,
      `${categoryName} near me`,
      `professional ${categoryName.toLowerCase()}`,
      `best ${categoryName.toLowerCase()}`,
      ...services.slice(0, 10),
    ],
    alternates: {
      canonical: `${SITE_CONFIG.url}/customer/explore/categories`,
    },
  };
}

/**
 * Generate metadata for provider/business profile pages
 */
export function generateProviderMetadata(options: {
  businessName: string;
  serviceName: string;
  city: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  logo?: string;
}): Metadata {
  const {
    businessName,
    serviceName,
    city,
    description = `Book ${serviceName} from ${businessName}. Verified professionals, best prices.`,
    rating = 0,
    reviewCount = 0,
    logo,
  } = options;

  const title = `${businessName} - ${serviceName} | ${city}`;
  const ratingText = rating > 0 ? `⭐ ${rating.toFixed(1)}` : "";

  const metaDescription = `${description} ${ratingText} ${reviewCount > 0 ? `from ${reviewCount} reviews` : ""}. Instant booking with ${SITE_CONFIG.name}.`;

  return {
    ...generateBaseMetadata({
      title,
      description: metaDescription,
      image: logo || "/og-provider-default.png",
    }),
    keywords: [
      businessName,
      serviceName,
      `${serviceName} in ${city}`,
      `best ${businessName}`,
      city,
      "verified provider",
      "trusted professionals",
    ],
    alternates: {
      canonical: `${SITE_CONFIG.url}/provider/${businessName.toLowerCase().replace(/\s+/g, "-")}`,
    },
  };
}

/**
 * Generate metadata for city/location pages
 */
export function generateCityMetadata(options: {
  cityName: string;
  servicesCount?: number;
  image?: string;
}): Metadata {
  const { cityName, servicesCount = 50, image } = options;

  const title = `Home Services in ${cityName} | ${SITE_CONFIG.name}`;
  const description = `Book ${servicesCount}+ home services in ${cityName}. Cleaning, repairs, maintenance, and more. Trusted professionals, best prices guaranteed.`;

  return {
    ...generateBaseMetadata({
      title,
      description,
      image: image || `/og-city-${cityName.toLowerCase()}.png`,
    }),
    keywords: [
      `home services in ${cityName}`,
      `${cityName} home services`,
      `service providers in ${cityName}`,
      `cleaning services ${cityName}`,
      `plumber ${cityName}`,
      `electrician ${cityName}`,
      `${cityName} services near me`,
    ],
    alternates: {
      canonical: `${SITE_CONFIG.url}/city/${cityName.toLowerCase()}`,
    },
  };
}

/**
 * Generate metadata for blog/content pages
 */
export function generateBlogMetadata(options: {
  title: string;
  description: string;
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
  image?: string;
  tags?: string[];
}): Metadata {
  const { title, description, author, image, tags = [] } = options;

  return {
    ...generateBaseMetadata({
      title: `${title} | ${SITE_CONFIG.name} Blog`,
      description,
      image: image || "/og-blog-default.png",
    }),
    keywords: tags,
    authors: author ? [{ name: author }] : [{ name: SITE_CONFIG.name }],
    openGraph: {
      type: "article",
      title,
      description,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      images: image
        ? [
            {
              url: image,
              width: IMAGE_DIMENSIONS.og.width,
              height: IMAGE_DIMENSIONS.og.height,
              alt: title,
            },
          ]
        : [
            {
              url: "/og-blog-default.png",
              width: IMAGE_DIMENSIONS.og.width,
              height: IMAGE_DIMENSIONS.og.height,
              alt: SITE_CONFIG.name,
            },
          ],
      publishedTime: options.publishDate,
      modifiedTime: options.modifiedDate,
      authors: [author || SITE_CONFIG.name],
    },
  };
}

/**
 * Generate metadata for protected/noindex pages
 */
export function generateNoIndexMetadata(options?: {
  title?: string;
  description?: string;
}): Metadata {
  const { title, description } = options || {};

  return {
    title: title || "Dashboard | Homhelper",
    description: description || "Access your Homhelper dashboard",
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

/**
 * Generate metadata for legal pages (Terms, Privacy, About)
 */
export function generateLegalMetadata(options: {
  type: "about" | "terms" | "privacy";
  title?: string;
  description?: string;
}): Metadata {
  const { type, title, description } = options;

  const titles = {
    about: "About Us - Trusted Home Services Platform | Homhelper",
    terms: "Terms & Conditions | Homhelper",
    privacy: "Privacy Policy | Homhelper",
  };

  const descriptions = {
    about:
      "Learn about Homhelper - India's most trusted home services platform. Connect with verified professionals for all your home service needs.",
    terms:
      "Read Homhelper's terms and conditions. Understand your rights and responsibilities when using our home services platform.",
    privacy:
      "Homhelper's privacy policy. Learn how we protect your data and privacy when you use our home services platform.",
  };

  return generateBaseMetadata({
    title: title || titles[type],
    description: description || descriptions[type],
  });
}
