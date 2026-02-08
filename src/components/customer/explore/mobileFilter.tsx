"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, X, ChevronDown, Star } from "lucide-react";

export default function MobileFilters({
  mobileFilterOpen,
  setMobileFilterOpen,
  hasActiveFilters,
  onClearFilters,
  categories,
  selectedCategories,
  onToggleCategory,
  priceRange,
  onPriceChange,
  rating,
  onRatingChange,
}: any) {
  return (
    <>
      {/* MOBILE FILTER BUTTON */}
      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetTrigger asChild>
          <button className="lg:hidden w-full px-4 py-3 bg-slate-800 text-white rounded-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </SheetTrigger>

        {/* SIDEBAR CONTENT */}
        <SheetContent side="left" className="w-[300px] px-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              Filters
            </SheetTitle>
            <SheetDescription>Apply filters to refine results</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6 pb-10">
            {/* RESET BUTTON */}
            {hasActiveFilters && (
              <Button
                variant="secondary"
                onClick={onClearFilters}
                className="w-full flex items-center gap-2">
                <X className="w-4 h-4" />
                Reset Filters
              </Button>
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
                    .filter((c: any) => selectedCategories.includes(c.id))
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
                className="w-full h-2 bg-gray-300 rounded-sm"
              />

              <p className="text-gray-600 text-sm mt-2">
                ₹{priceRange[1].toLocaleString()}
              </p>
            </div>

            {/* RATING FILTER */}
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
        </SheetContent>
      </Sheet>
    </>
  );
}
