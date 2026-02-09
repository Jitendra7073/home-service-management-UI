import { Metadata } from "next";
import ServiceDetailClient from "./ServiceDetailClient";

// SEO
import { generateServiceMetadata } from "@/lib/seo/metadata";

// ============================================================================
// SEO: generateMetadata function (runs on server)
// ============================================================================

interface Provider {
  id: string;
  name: string;
  email: string;
  mobile: string;
  businessProfile: {
    id: string;
    businessName: string;
    contactEmail: string | null;
    phoneNumber: string | null;
    websiteURL: string | null;
    isActive: boolean;
    services: Array<{
      id: string;
      name: string;
      coverImage: string;
      averageRating: number;
      reviewCount: number;
      price: number;
      category: {
        name: string;
        description: string;
      };
    }>;
    addresses?: Array<{
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    }>;
  };
  addresses: Array<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
}

/**
 * Generate metadata for service detail pages
 * This runs on the server and fetches provider data
 */
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { providerId: string };
  searchParams: { serviceId?: string };
}): Promise<Metadata> {
  const { providerId } = params;
  const serviceId = searchParams.serviceId;

  try {
    // Fetch provider data from backend
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${baseUrl}/api/v1/customer/providers/${providerId}`, {
      method: "GET",
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      // Return basic metadata if fetch fails
      return {
        title: "Service Details | Homhelper",
        description: "Book trusted home services with Homhelper",
      };
    }

    const data = await response.json();
    const provider: Provider = data.provider;

    if (!provider || !provider.businessProfile) {
      return {
        title: "Service Not Available | Homhelper",
        description: "This service is currently unavailable",
      };
    }

    const business = provider.businessProfile;
    const service = serviceId
      ? business.services.find((s) => s.id === serviceId)
      : business.services[0];

    if (!service) {
      return {
        title: `${business.businessName} | Homhelper`,
        description: `Book services from ${business.businessName}`,
      };
    }

    const primaryAddress = provider.addresses?.[0] || business.addresses?.[0];
    const city = primaryAddress?.city || "Your City";

    // Generate SEO metadata
    return generateServiceMetadata({
      serviceName: service.name,
      categoryName: service.category.name,
      city: city,
      description: service.category.description || `Professional ${service.name} service`,
      price: service.price,
      rating: service.averageRating,
      reviewCount: service.reviewCount,
      coverImage: service.coverImage,
      providerName: provider.name,
      businessName: business.businessName,
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Service Details | Homhelper",
      description: "Book trusted home services with Homhelper",
    };
  }
}

// ============================================================================
// Server Component wrapper
// ============================================================================

export default function ServiceDetailPage() {
  return <ServiceDetailClient />;
}
