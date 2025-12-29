"use client";

import React, { useMemo, useState, useEffect } from "react"; // ✅ ADDED useEffect

import ExploreHeader from "@/components/customer/explore/exploreHeroSection";
import SearchBar from "@/components/customer/explore/exploreSearchBar";
import Filters from "@/components/customer/explore/exploreFilters";

import Pagination from "@/components/customer/explore/explorePagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import Results from "./explore/exploreResults";

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
    time: true;
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
  reviews?: number;
  businessProfile: BusinessProfile | null;
  addresses: Address[];
}

const Explore: React.FC = () => {
  const queryClient = useQueryClient();

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

  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const [limit, setLimit] = useState(Number(searchParams.get("limit") || 6));
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cats = searchParams.get("categories");
    return cats ? cats.split(",") : [];
  });
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    const min = Number(searchParams.get("minPrice") || 0);
    const max = Number(searchParams.get("maxPrice") || 5000);
    return [min, max];
  });
  const [selectedState, setSelectedState] = useState<string>(
    searchParams.get("state") || ""
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams();

    // Add filters to URL
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    if (priceRange[1] < 5000) params.set("maxPrice", String(priceRange[1]));
    if (selectedState) params.set("state", selectedState);

    // Add pagination
    if (page !== 1) params.set("page", String(page));
    if (limit !== 6) params.set("limit", String(limit));

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [
    searchTerm,
    selectedCategories,
    priceRange,
    selectedState,
    page,
    limit,
    router,
  ]);

  // Categories
  const categories = useMemo<string[]>(() => {
    const cats = new Set<string>();
    providers.forEach((provider) => {
      provider.businessProfile?.services.forEach((service) => {
        cats.add(service.category.name);
      });
    });
    queryClient.invalidateQueries({
      queryKey:["providers"]
    });

    return Array.from(cats);
  }, [providers]);

  const updatePage = (newPage: number) => {
    setPage(newPage);
  };

  // All services from providers
  const allServices = useMemo(() => {
    const services: any[] = [];

    providers.forEach((provider) => {
      provider.businessProfile?.services.forEach((service) => {
        services.push({
          ...service,
          businessId: provider.businessProfile!.id,
          providerId: provider.id,
          providerName: provider.name,
        });
      });
    });
    queryClient.invalidateQueries({
      queryKey:["providers"]
    });

    return services;
  }, [providers]);

  // Filtered services
  const filteredServices = useMemo(() => {
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

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [allServices, searchTerm, selectedCategories, priceRange]);

  const totalPages = Math.ceil(filteredServices.length / limit);

  const toggleCategory = (category: string): void => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPage(1); 
  };

  const clearFilters = (): void => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setSelectedState("");
    setPage(1);
    router.replace(window.location.pathname, { scroll: false });
  };

  const handleServiceClick = (service: any) => {
    router.push(
      `/customer/explore/${service.providerId}?serviceId=${service.id}`
    );
  };

  const hasActiveFilters =
    !!searchTerm ||
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000 ||
    !!selectedState

  return (
    <div className="min-h-screen bg-muted/50">
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
        <div className="flex justify-between mb-6 gap-2">
          <div className="relative w-full">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <div className="flex lg:hidden">
            <Filters
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              mobileFilterOpen={mobileFilterOpen}
              setMobileFilterOpen={setMobileFilterOpen}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block bg-white h-fit">
            <Filters
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              mobileFilterOpen={mobileFilterOpen}
              setMobileFilterOpen={setMobileFilterOpen}
            />
          </div>
          <div className="lg:col-span-3">
            <Results
              services={filteredServices}
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