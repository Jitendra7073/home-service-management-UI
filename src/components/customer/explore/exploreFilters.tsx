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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Card } from "rsuite";
import { CardContent } from "@/components/ui/card";
import FilterContent from "../booking/FilterContent";

interface FiltersProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;

  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;

  hasActiveFilters: boolean;
  onClearFilters: () => void;

  mobileFilterOpen: boolean;
  setMobileFilterOpen: (open: boolean) => void;

  cities?: string[];
  selectedCity?: string;
  onCityChange?: (city: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  selectedCategories,
  onToggleCategory,
  priceRange,
  onPriceChange,
  hasActiveFilters,
  onClearFilters,
  mobileFilterOpen,
  setMobileFilterOpen,
  cities = [],
  selectedCity = "",
  onCityChange,
}) => {
  const { data } = useQuery({
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
      <div className="hidden lg:block">
        <div className="sticky top-20 ">
          <Card className="border-gray-200 shadow-sm rounded-lg">
            <CardContent className="py-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium text-gray-700 block">
                    Categories
                  </label>
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

              {onCityChange && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 block mb-4">
                    City
                  </label>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={!cities || cities.length === 0}
                        className="w-full justify-between text-gray-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed">
                        {selectedCity || "All Cities"}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
                      <DropdownMenuLabel>Select City</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* If cities exist */}
                      {cities && cities.length > 0 ? (
                        <>
                          <DropdownMenuCheckboxItem
                            checked={!selectedCity}
                            onCheckedChange={() => onCityChange("")}>
                            All Cities
                          </DropdownMenuCheckboxItem>

                          <DropdownMenuSeparator />

                          {cities.map((city) => (
                            <DropdownMenuCheckboxItem
                              key={city}
                              checked={selectedCity === city}
                              onCheckedChange={() => onCityChange(city)}>
                              {city}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </>
                      ) : (
                        /* No cities available */
                        <div className="px-3 py-4 text-xs text-gray-500 text-center">
                          No cities available for the selected filters.
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Selected city chip */}
                  {selectedCity && (
                    <div className="mt-3">
                      <span className="px-3 py-1 text-xs bg-gray-200 rounded-sm text-gray-700 inline-flex items-center gap-2">
                        {selectedCity}
                        <button
                          onClick={() => onCityChange("")}
                          className="text-gray-600 hover:text-gray-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Price Range Filter */}
              <div >
                <label className="text-sm font-medium text-gray-700 block pb-2">
                  Price Range
                </label>
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Filters */}
      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="lg:hidden flex items-center gap-2 border-gray-300 h-auto">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[300px] sm:w-[350px] p-6 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              Filters
            </SheetTitle>
            <SheetDescription>Refine your service search</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6 pb-10">
            {/* RESET FILTERS */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                <X className="w-4 h-4" /> Reset Filters
              </button>
            )}

            {/* CATEGORY FILTER */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase">
                Categories
              </h3>

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

              {/* Selected categories */}
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

            {/* PRICE FILTER */}
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

            {/* CITY FILTER */}
            {cities && cities.length > 0 && onCityChange && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase">
                  City
                </h3>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-gray-700 font-medium">
                      {selectedCity || "All Cities"}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64 max-h-72 overflow-y-auto">
                    <DropdownMenuLabel>Select City</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuCheckboxItem
                      checked={!selectedCity}
                      onCheckedChange={() => onCityChange("")}>
                      All Cities
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuSeparator />

                    {cities.map((city) => (
                      <DropdownMenuCheckboxItem
                        key={city}
                        checked={selectedCity === city}
                        onCheckedChange={() => onCityChange(city)}>
                        {city}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {selectedCity && (
                  <div className="mt-3">
                    <span className="px-3 py-1 bg-gray-200 text-gray-900 text-xs rounded-sm inline-flex items-center gap-2">
                      {selectedCity}
                      <button
                        onClick={() => onCityChange("")}
                        className="text-gray-600 hover:text-gray-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Filters;
