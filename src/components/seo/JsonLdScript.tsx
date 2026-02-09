/**
 * JsonLdScript Component
 * Server-side component for injecting JSON-LD structured data
 * Use this in server components for better SEO
 */

import React from "react";
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateServiceSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateArticleSchema,
  generateWebsiteSchema,
  generateCollectionPageSchema,
} from "@/lib/seo/schema";

interface JsonLdScriptProps {
  data: Record<string, any> | Record<string, any>[];
}

/**
 * Server component for JSON-LD schema markup
 * Add this to any page that needs structured data
 *
 * @example
 * ```tsx
 * <JsonLdScript data={generateOrganizationSchema()} />
 * ```
 */
export function JsonLdScript({ data }: JsonLdScriptProps) {
  // Handle both single schema object and array of schemas
  const jsonData = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

/**
 * Organization Schema Component
 */
export function OrganizationSchema(props?: {
  description?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}) {

  const schema = generateOrganizationSchema(props);
  return <JsonLdScript data={schema} />;
}

/**
 * LocalBusiness Schema Component
 */
export function LocalBusinessSchema(props: {
  name: string;
  description?: string;
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
  rating?: number;
  reviewCount?: number;
}) {

  const schema = generateLocalBusinessSchema(props);
  return <JsonLdScript data={schema} />;
}

/**
 * Service Schema Component
 */
export function ServiceSchema(props: {
  name: string;
  description?: string;
  category?: string;
  provider: {
    name: string;
    url?: string;
  };
  areaServed?: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
}) {

  const schema = generateServiceSchema(props);
  return <JsonLdScript data={schema} />;
}

/**
 * Review Schema Component
 */
export function ReviewSchema(props: {
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

  const schema = generateReviewSchema(props);
  return <JsonLdScript data={schema} />;
}

/**
 * Breadcrumb Schema Component
 */
export function BreadcrumbSchema(props: {
  breadcrumbs: Array<{
    name: string;
    href: string;
  }>;
}) {

  const schema = generateBreadcrumbSchema(props.breadcrumbs);
  return <JsonLdScript data={schema} />;
}

/**
 * FAQ Schema Component
 */
export function FAQSchema(props: {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}) {

  const schema = generateFAQSchema(props.faqs);
  return <JsonLdScript data={schema} />;
}

/**
 * Article Schema Component
 */
export function ArticleSchema(props: {
  title: string;
  description?: string;
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
  image?: string;
  url?: string;
}) {

  const schema = generateArticleSchema(props);
  return <JsonLdScript data={schema} />;
}

/**
 * Website Schema Component
 */
export function WebsiteSchema() {

  const schema = generateWebsiteSchema();
  return <JsonLdScript data={schema} />;
}

/**
 * Collection Page Schema Component
 */
export function CollectionPageSchema(props: {
  name: string;
  description?: string;
  url?: string;
  image?: string;
}) {

  const schema = generateCollectionPageSchema(props);
  return <JsonLdScript data={schema} />;
}
