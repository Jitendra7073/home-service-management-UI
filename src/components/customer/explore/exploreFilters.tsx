"use client";

import React from "react";
import { X, Filter, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface FiltersProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;

  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;

  rating: number;
  onRatingChange: (rating: number) => void;

  hasActiveFilters: boolean;
  onClearFilters: () => void;

  mobileFilterOpen: boolean;
  setMobileFilterOpen: (open: boolean) => void;
}

const Filters: React.FC<FiltersProps> = ({
  selectedCategories,
  onToggleCategory,
  priceRange,
  onPriceChange,
  rating,
  onRatingChange,
  hasActiveFilters,
  onClearFilters,
  mobileFilterOpen,
  setMobileFilterOpen,
}) => {
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

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-sm p-6 shadow-sm border border-gray-200 sticky top-24 hover:shadow-md transition-shadow">
          {/* Categories Filter */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className=" py-2 font-black text-gray-900  text-xs uppercase tracking-widest text-gray-800">
                Categories
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-sm">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-gray-700 font-medium">
                  Select Categories
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {categories.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No categories found
                  </div>
                )}

                {categories.map((category: any) => (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => onToggleCategory(category.id)}>
                    {category.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Show selected items under dropdown */}
            {selectedCategories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {categories
                  .filter((cat: any) => selectedCategories.includes(cat.id))
                  .map((cat: any) => (
                    <span
                      key={cat.id}
                      className="px-3 py-1 text-xs bg-gray-200 rounded-sm text-gray-700">
                      {cat.name}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="font-black text-gray-900 mb-4 text-xs uppercase tracking-widest">
              Price Range
            </h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="5000"
                value={priceRange[1]}
                onChange={(e) =>
                  onPriceChange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-gray-800"
              />
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Min</span>
                <span className="font-black text-gray-900 text-lg">
                  ₹{priceRange[1].toLocaleString()}
                </span>
                <span className="text-gray-600 text-sm">Max</span>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="font-black text-gray-900 mb-4 text-xs uppercase tracking-widest">
              Rating
            </h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <label
                  key={star}
                  className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="rating"
                    checked={rating === star}
                    onChange={() => onRatingChange(star)}
                    className="w-4 h-4 text-gray-800 cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    {Array(star)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-gray-300 text-gray-400"
                        />
                      ))}
                  </div>
                  <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm font-medium">
                    {star}+ Stars
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="w-full px-4 py-3 bg-slate-800 text-white rounded-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md">
          <Filter className="w-5 h-5" />
          {mobileFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>

        {mobileFilterOpen && (
          <div className="mt-4 bg-white rounded-sm p-6 space-y-6 animate-fade-in shadow-lg border border-gray-200">
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                <X className="w-4 h-4" />
                Reset Filters
              </button>
            )}

            {/* MOBILE CATEGORY FILTER */}
            <div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase">
                  Categories
                </h3>

                {/* FULL category list inside dropdown for mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-gray-700 font-medium">
                      Select Categories
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64 max-h-72 overflow-y-auto">
                    <DropdownMenuLabel>Select Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {categories.map((category: any) => (
                      <DropdownMenuCheckboxItem
                        key={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => onToggleCategory(category.id)}>
                        {category.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Selected categories below dropdown */}
                {selectedCategories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {categories
                      .filter((cat: any) => selectedCategories.includes(cat.id))
                      .map((cat: any) => (
                        <span
                          key={cat.id}
                          className="px-3 py-1 bg-gray-200 text-gray-900 text-xs rounded-sm flex items-center gap-1">
                          {cat.name}
                          <button
                            onClick={() => onToggleCategory(cat.id)}
                            className="text-gray-600 hover:text-gray-900">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* MOBILE PRICE FILTER */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase">
                Price
              </h3>

              <input
                type="range"
                min="0"
                max="5000"
                value={priceRange[1]}
                onChange={(e) =>
                  onPriceChange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full h-2 bg-gray-300 rounded-lg"
              />

              <p className="text-gray-600 text-sm mt-2">
                ₹{priceRange[1].toLocaleString()}
              </p>
            </div>

            {/* MOBILE RATING FILTER */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase">
                Rating
              </h3>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <label
                    key={star}
                    className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="mobile-rating"
                      checked={rating === star}
                      onChange={() => onRatingChange(star)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 text-sm flex items-center gap-1">
                      {Array(star)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-500"
                          />
                        ))}
                      {star}+ stars
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Filters;
