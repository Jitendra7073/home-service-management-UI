"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

// Type
interface Category {
  id: string;
  name: string;
  description: string;
  providersCount: number;
  color: string;
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
      <section className="relative overflow-hidden py-20">
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
                className="group relative h-40 rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
              />
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
            <div className="flex items-center border bg-white rounded-xl px-4 sm:px-6 py-3 sm:py-4 gap-3">
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
          {displayedCategories.map((category: Category) => (
            <div
              key={category.id}
              className="group relative bg-white rounded-2xl overflow-hidden border-2 hover:shadow-lg border-gray-200 transition-all cursor-pointer">
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    {category.name.charAt(0).toUpperCase() +
                      category.name.slice(1)}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      {category.providersCount} Providers
                    </span>
                  </div>

                  <Link
                    href="/customer/explore"
                    className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:underline">
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
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
