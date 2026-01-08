"use client";

import { ArrowRight, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Type
interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  totalProvidersCount: number;
  activeProvidersCount: number;
}

const CategoryList = ({ isVisible, search }: any) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isError, isLoading, isPending } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/common/businessCategories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const categories = data?.categories || [];

  // Search Filter
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;

    return categories.filter((category: Category) => {
      const nameMatch = category.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const descMatch = category.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return nameMatch || descMatch;
    });
  }, [searchTerm, categories]);

  const displayedCategories = isVisible
    ? filteredCategories.slice(0, 6)
    : filteredCategories;

  // Loading State
  if (isLoading || isPending) {
    return (
      <section className="relative overflow-hidden py-14 md:py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center sm:justify-between mb-5">
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
              Explore Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="group relative bg-white rounded-md overflow-hidden border border-gray-100 p-6 space-y-4">
                {/* Title Skeleton */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-1/2 rounded-md" />
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>

                {/* Stats Skeleton */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-2.5 h-2.5 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-2.5 h-2.5 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="text-center py-20 text-red-600 font-semibold">
        Failed to load categories.
      </div>
    );
  }

  // Main UI
  return (
    <section className="relative overflow-hidden py-10 md:py-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center sm:justify-between mb-5">
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
            Explore Categories
          </h2>

          {isVisible && (
            <Link
              href="/customer/explore/categories"
              className="hidden sm:inline-flex items-center gap-1 text-blue-600 font-semibold text-sm hover:underline">
              All Categories
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* SEARCH ENABLED IF search={true} */}
        {search && (
          <div className="relative group pb-10">
            <div className="flex items-center border bg-white rounded-md px-4 sm:px-6 py-3 sm:py-4 gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
              />
            </div>
          </div>
        )}

        {/* CATEGORY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedCategories.map((category: Category) => {
            const categoryName =
              category.name.charAt(0).toUpperCase() + category.name.slice(1);

            return (
              <Link
                key={category.id}
                href={`/customer/explore?categories=${category.id}`}
                className="group relative block bg-white rounded-md overflow-hidden
                   border border-gray-200 hover:border-blue-200
                   hover:shadow-lg transition-all">
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {categoryName}
                      </h3>

                      <ChevronRight
                        className="w-4 h-4 text-blue-600 opacity-0
                           group-hover:opacity-100 transition-opacity"
                      />
                    </div>

                    <p className="mt-1 text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  </div>

                  {/* STATS */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {/* Total Providers */}
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-sm text-gray-700">
                        {category.totalProvidersCount > 1
                          ? "Total Businesses"
                          : "Total Business"}
                        <span className="ml-1 font-semibold text-gray-900">
                          {category.totalProvidersCount ?? 0}
                        </span>
                      </span>
                    </div>

                    {/* Available Providers */}
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-gray-700">
                        Available Now
                        <span className="ml-1 font-semibold text-green-600">
                          {category.activeProvidersCount ?? 0}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile button */}
        {isVisible && (
          <div className="sm:hidden w-full my-2">
            <Link
              href="/customer/explore/categories"
              className="float-right inline-flex mt-3 pr-2 items-center gap-1 text-blue-600 font-semibold text-sm hover:underline">
              All Categories
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryList;
