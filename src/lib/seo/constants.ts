/**
 * SEO Constants for Homhelper
 * Centralized configuration for SEO metadata
 */

export const SITE_CONFIG = {
  name: "Homhelper",
  domain: "https://homhelpers.vercel.app",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://homhelpers.vercel.app",
  defaultLocale: "en_US",
  timeZone: "Asia/Kolkata",
} as const;

export const SEO_DEFAULTS = {
  title: {
    default: "Homhelper - Book Trusted Home Services Online",
    template: "%s | Homhelper",
  },
  description:
    "Connect with top-rated local professionals for cleaning, repair, maintenance, and more. Fast, reliable, and secure booking with Homhelper.",
  keywords: [
    "home helpers",
    "home services",
    "home service app",
    "trusted home experts",
    "verified professionals",
    "on-demand home maintenance",
    "local service marketplace",
    "book home services online",
    "home service providers near me",
  ],
  twitterCard: "summary_large_image",
  ogType: "website",
} as const;

export const SERVICE_KEYWORDS = {
  // Cleaning Services
  cleaning: [
    "professional house cleaning",
    "deep cleaning services",
    "home sanitization",
    "bathroom deep cleaning",
    "kitchen cleaning",
    "sofa cleaning",
    "carpet cleaning",
    "water tank cleaning",
  ],
  // Repairs
  repair: [
    "emergency plumber near me",
    "certified electrician",
    "AC repair services",
    "appliance repair",
    "washing machine repair",
    "refrigerator repair",
    "microwave repair",
    "geyser repair",
  ],
  // Construction
  construction: [
    "home renovation",
    "bathroom remodeling",
    "kitchen remodeling",
    "home painter",
    "carpentry services",
    "flooring installation",
    "roofing contractors",
  ],
  // Lifestyle
  lifestyle: [
    "pest control services",
    "movers and packers",
    "house shifting services",
    "interior designers",
    "pet grooming services",
  ],
} as const;

export const LOCATION_MODIFIERS = [
  "near me",
  "in {city}",
  "at home",
  "online booking",
  "same day",
  "24/7",
  "emergency",
  "affordable",
  "best",
  "top-rated",
  "verified",
] as const;

export const META_TITLE_TEMPLATES = {
  homepage: "Homhelper - {description}",
  service: "{service} in {city} | Homhelper",
  service_nearme:
    "{service} Near Me | {city} | Best {service} Providers - Homhelper",
  provider: "{businessName} - {service} | {city}",
  category: "{category} Services in India | Homhelper",
  city: "Home Services in {city} | Homhelper",
  blog: "{title} | Homhelper Blog",
  about: "About Us - {description} | Homhelper",
} as const;

export const META_DESCRIPTION_TEMPLATES = {
  service: `Get the best {service} in {city} from verified professionals. {uniqueValue}. ⭐ {rating} from {reviewCount} reviews. Book now!`,
  provider: `{businessName} offers {service} in {city}. {uniqueValue}. ⭐ {rating}/5 from {reviewCount} reviews.`,
  category: `Book {category} services across India. {servicesList}. Verified experts, transparent pricing, 30-day warranty.`,
  city: `Book home services in {city}. {servicesCount}+ services available. Trusted professionals, best prices guaranteed.`,
} as const;

export const ORGANIZATION_SCHEMA = {
  "@type": "Organization" as const,
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/logo.png`,
  sameAs: [
    "https://www.facebook.com/homhelpers",
    "https://www.twitter.com/homhelpers",
    "https://www.instagram.com/homhelpers",
    "https://www.linkedin.com/company/homhelpers",
  ],
  contactPoint: {
    "@type": "ContactPoint" as const,
    telephone: "+91-XXXXXXXXXX",
    contactType: "customer service",
    availableLanguage: "English",
    areaServed: "IN",
  },
};

export const WEBSITE_SCHEMA = {
  "@type": "WebSite" as const,
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.url,
  potentialAction: {
    "@type": "SearchAction" as const,
    target: {
      "@type": "EntryPoint" as const,
      urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org" as const,
  "@type": "BreadcrumbList" as const,
};

export const IMAGE_DIMENSIONS = {
  og: { width: 1200, height: 630 },
  twitter: { width: 1200, height: 600 },
  thumbnail: { width: 500, height: 500 },
} as const;

export const SITEMAP_CONFIG = {
  changefrequency: {
    always: "always" as const,
    hourly: "hourly" as const,
    daily: "daily" as const,
    weekly: "weekly" as const,
    monthly: "monthly" as const,
    yearly: "yearly" as const,
    never: "never" as const,
  },
  priority: {
    highest: 1.0,
    high: 0.9,
    medium: 0.7,
    low: 0.5,
    lowest: 0.3,
  },
} as const;

export const ROBOTS_RULES = {
  // Allow only public pages
  allow: [
    "/",
    "/customer/explore",
    "/customer/explore/categories",
    "/customer/about",
    "/customer/terms",
    "/customer/privacy-policy",
  ],
  // Block sensitive areas
  disallow: [
    "/api/",
    "/admin/",
    "/staff/",
    "/auth/",
    "/provider/dashboard",
    "/provider/onboard",
    "/customer/dashboard",
    "/customer/booking",
    "/customer/cart",
    "/customer/profile",
    "/_next/",
    "/static/",
  ],
} as const;

// Service category mappings for SEO
export const CATEGORY_SLUGS = {
  "home-cleaning": "Home Cleaning",
  "ac-repair": "AC Repair",
  plumbing: "Plumbing",
  electrical: "Electrical",
  carpentry: "Carpentry",
  painting: "Painting",
  "pest-control": "Pest Control",
  "appliance-repair": "Appliance Repair",
  "beauty-wellness": "Beauty & Wellness",
  "packers-movers": "Packers & Movers",
} as const;

// City/Location slugs
export const MAJOR_CITIES = [
  "mumbai",
  "delhi",
  "bangalore",
  "hyderabad",
  "chennai",
  "kolkata",
  "pune",
  "ahmedabad",
  "jaipur",
  "surat",
] as const;
