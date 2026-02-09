/**
 * SEO Components & Utilities - Barrel Export
 * All SEO-related exports in one place
 */

// Components
export {
  JsonLdScript,
  OrganizationSchema,
  LocalBusinessSchema,
  ServiceSchema,
  ReviewSchema,
  BreadcrumbSchema,
  FAQSchema,
  ArticleSchema,
  WebsiteSchema,
  CollectionPageSchema,
} from "./JsonLdScript";

export {
  Breadcrumbs,
  ServerBreadcrumbs,
  generateBreadcrumbsFromPath,
  generateBreadcrumbProps,
  type BreadcrumbItem,
} from "./Breadcrumbs";

export {
  NoIndexHead,
  AdminNoIndex,
  DashboardNoIndex,
  AuthNoIndex,
} from "./NoIndexHead";

// Metadata generators
export {
  generateBaseMetadata,
  generateServiceMetadata,
  generateCategoryMetadata,
  generateProviderMetadata,
  generateCityMetadata,
  generateBlogMetadata,
  generateNoIndexMetadata,
  generateLegalMetadata,
} from "@/lib/seo/metadata";

// Schema generators
export {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateServiceSchema,
  generateReviewSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateArticleSchema,
  generateWebsiteSchema,
  generateCollectionPageSchema,
  generatePlaceSchema,
  combineSchemas,
} from "@/lib/seo/schema";

// Constants
export {
  SITE_CONFIG,
  SEO_DEFAULTS,
  SERVICE_KEYWORDS,
  LOCATION_MODIFIERS,
  META_TITLE_TEMPLATES,
  META_DESCRIPTION_TEMPLATES,
  ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA,
  BREADCRUMB_SCHEMA,
  IMAGE_DIMENSIONS,
  SITEMAP_CONFIG,
  ROBOTS_RULES,
  CATEGORY_SLUGS,
  MAJOR_CITIES,
} from "@/lib/seo/constants";
