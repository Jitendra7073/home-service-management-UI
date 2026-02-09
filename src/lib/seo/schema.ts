/**
 * JSON-LD Schema Builders
 * Helper functions to generate structured data for SEO
 */

import { SITE_CONFIG, ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from "./constants";

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(options?: {
  description?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}) {
  return {
    ...ORGANIZATION_SCHEMA,
    description: options?.description || `${SITE_CONFIG.name} is a trusted home services platform connecting customers with verified professionals.`,
    address: options?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: options.address.street,
          addressLocality: options.address.city,
          addressRegion: options.address.state,
          postalCode: options.address.postalCode,
          addressCountry: options.address.country,
        }
      : undefined,
  };
}

/**
 * Generate LocalBusiness schema for service providers
 */
export function generateLocalBusinessSchema(options: {
  name: string;
  description?: string;
  url?: string;
  telephone?: string;
  email?: string;
  image?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  geoCoordinates?: {
    latitude: number;
    longitude: number;
  };
  priceRange?: string;
  rating?: number;
  reviewCount?: number;
  areaServed?: string[];
  openingHours?: string[];
}) {
  const {
    name,
    description,
    url,
    telephone,
    email,
    image,
    address,
    geoCoordinates,
    priceRange = "₹₹",
    rating,
    reviewCount,
    areaServed,
    openingHours,
  } = options;

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": url || `${SITE_CONFIG.url}/provider/${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    image,
    description,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    url: url || SITE_CONFIG.url,
    telephone,
    email,
    priceRange,
  };

  if (geoCoordinates) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: geoCoordinates.latitude,
      longitude: geoCoordinates.longitude,
    };
  }

  if (rating && reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      reviewCount: reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  if (areaServed && areaServed.length > 0) {
    schema.areaServed = areaServed.map((city) => ({
      "@type": "City",
      name: city,
    }));
  }

  if (openingHours && openingHours.length > 0) {
    schema.openingHoursSpecification = openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: hours.split("-")[0] || "09:00",
      closes: hours.split("-")[1] || "18:00",
    }));
  }

  return schema;
}

/**
 * Generate Service schema
 */
export function generateServiceSchema(options: {
  name: string;
  description?: string;
  category?: string;
  provider: {
    name: string;
    url?: string;
  };
  areaServed?: string;
  price?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
}) {
  const {
    name,
    description,
    category,
    provider,
    areaServed,
    price,
    currency = "INR",
    rating,
    reviewCount,
  } = options;

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description: description || `Professional ${name} service from ${provider.name}`,
    provider: {
      "@type": "LocalBusiness",
      name: provider.name,
      url: provider.url || SITE_CONFIG.url,
    },
  };

  if (areaServed) {
    schema.areaServed = {
      "@type": "City",
      name: areaServed,
    };
  }

  if (price) {
    schema.offers = {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    };
  }

  if (rating && reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      reviewCount: reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return schema;
}

/**
 * Generate Review schema
 */
export function generateReviewSchema(options: {
  itemName: string;
  reviews: Array<{
    author: string;
    rating: number;
    comment: string;
    datePublished?: string;
  }>;
  aggregateRating?: {
    rating: number;
    reviewCount: number;
  };
}) {
  const { itemName, reviews, aggregateRating } = options;

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: itemName,
    review: reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: review.comment,
      datePublished: review.datePublished || new Date().toISOString(),
    })),
  };

  if (aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.rating.toFixed(1),
      reviewCount: aggregateRating.reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{
  name: string;
  href: string;
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_CONFIG.url}${crumb.href}`,
    })),
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(faqs: Array<{
  question: string;
  answer: string;
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article schema for blog posts
 */
export function generateArticleSchema(options: {
  title: string;
  description?: string;
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
  image?: string;
  url?: string;
}) {
  const {
    title,
    description,
    publishDate = new Date().toISOString(),
    modifiedDate,
    author = SITE_CONFIG.name,
    image,
    url,
  } = options;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image || `${SITE_CONFIG.url}/og-blog-default.png`,
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url || SITE_CONFIG.url,
    },
  };
}

/**
 * Generate WebSite schema
 */
export function generateWebsiteSchema() {
  return WEBSITE_SCHEMA;
}

/**
 * Generate CollectionPage schema for category/listing pages
 */
export function generateCollectionPageSchema(options: {
  name: string;
  description?: string;
  url?: string;
  image?: string;
}) {
  const { name, description, url, image } = options;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description: description || `Browse ${name} on ${SITE_CONFIG.name}`,
    url: url || SITE_CONFIG.url,
    image: image || `${SITE_CONFIG.url}/og-collection-default.png`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [],
    },
  };
}

/**
 * Generate Place schema for city/location pages
 */
export function generatePlaceSchema(options: {
  cityName: string;
  description?: string;
  services?: string[];
}) {
  const { cityName, description, services } = options;

  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: cityName,
    description: description || `Home services available in ${cityName}`,
    hasMap: `https://www.google.com/maps/search/${encodeURIComponent(cityName)}`,
    geo: {
      "@type": "GeoCoordinates",
      // Note: These would need to be actual coordinates for the city
      // For now, using placeholder
      latitude: 0,
      longitude: 0,
    },
  };
}

/**
 * Combine multiple schemas into one
 */
export function combineSchemas(schemas: Record<string, any>[]) {
  return schemas.map((schema) => ({
    "@context": "https://schema.org",
    ...schema,
  }));
}
