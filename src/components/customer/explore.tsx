"use client";

import React, { useMemo, useState } from "react";

import ExploreHeader from "@/components/customer/explore/exploreHeroSection";
import SearchBar from "@/components/customer/explore/exploreSearchBar";
import Filters from "@/components/customer/explore/exploreFilters";
import Results, {
  ExtendedService,
} from "@/components/customer/explore/exploreResults";
import Pagination from "@/components/customer/explore/explorePagination";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { Zap } from "lucide-react";

// --- Types ---
interface Service {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  durationInMinutes: number;
  price: number;
  isActive: boolean;
  slots: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
  }>;
}

interface BusinessProfile {
  id: string;
  businessName: string;
  isActive: boolean;
  services: Service[];
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark: string;
  userId: string;
}

interface Provider {
  id: string;
  name: string;
  email: string;
  mobile: string;
  rating?: number;
  reviews?: number;
  businessProfile: BusinessProfile | null;
  addresses: Address[];
}

const Explore: React.FC = () => {
  const { data, isLoading, isError, isPending, error } = useQuery({
    queryKey: ["providers"],
    queryFn: async (): Promise<Provider[]> => {
      const response = await fetch("/api/customer/providers");
      const data = await response.json();
      return data.providers;
    },
  });

  const providers: Provider[] = data || [];

  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page") || 1);
  const limitFromUrl = Number(searchParams.get("limit") || 6);

  const [page, setPage] = useState(pageFromUrl);
  const [limit, setLimit] = useState(limitFromUrl);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedState, setSelectedState] = useState<string>(""); // reserved for future
  const [rating, setRating] = useState<number>(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Categories
  const categories = useMemo<string[]>(() => {
    const cats = new Set<string>();
    providers.forEach((provider) => {
      provider.businessProfile?.services.forEach((service) => {
        cats.add(service.category.name);
      });
    });
    return Array.from(cats);
  }, [providers]);

  const updatePage = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    params.set("limit", String(limit));
    router.push(`?${params.toString()}`);
  };

  // All services from providers
  const allServices = useMemo<ExtendedService[]>(() => {
    const services: ExtendedService[] = [];

    providers.forEach((provider) => {
      provider.businessProfile?.services.forEach((service) => {
        services.push({
          ...service,
          businessId: provider.businessProfile!.id,
          providerId: provider.id,
          providerName: provider.name,
          rating: provider.rating,
        });
      });
    });

    return services;
  }, [providers]);

  // Filtered services
  const filteredServices = useMemo<ExtendedService[]>(() => {
    return allServices.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(service.category.id);

      const matchesPrice =
        priceRange[0] !== 0 || priceRange[1] !== 5000
          ? service.price >= priceRange[0] && service.price <= priceRange[1]
          : true;

      const matchesRating = rating === 0 || (service.rating || 0) >= rating;

      return matchesSearch && matchesCategory && matchesRating && matchesPrice;
    });
  }, [allServices, searchTerm, selectedCategories, priceRange, rating]);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredServices.length / limit);

  const toggleCategory = (category: string): void => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = (): void => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setSelectedState("");
    setRating(0);
  };

  const handleServiceClick = (service: ExtendedService) => {
    router.push(
      `/customer/explore/${service.providerId}?serviceId=${service.id}`
    );
  };

  const hasActiveFilters =
    !!searchTerm ||
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000 ||
    !!selectedState ||
    rating > 0;

  return (
    <div className="min-h-screen ">
      <ExploreHeader
        totalServices={allServices.length}
        filteredCount={filteredServices.length}
        totalProviders={providers.length}
        isVisible={false}
        icons={<Zap className="w-8 h-8 text-gray-300" />}
        heading={"All Services"}
        description={
          "Browse all available services from professional providers."
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-5 sm:py-10">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <Filters
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            rating={rating}
            onRatingChange={setRating}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            mobileFilterOpen={mobileFilterOpen}
            setMobileFilterOpen={setMobileFilterOpen}
          />
          <div className="lg:col-span-3">
            <Results
              services={paginatedServices}
              onServiceClick={handleServiceClick}
              isLoading={isLoading || isPending}
              isError={isError}
              error={error}
            />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={updatePage}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #1f2937;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #1f2937;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default Explore;
