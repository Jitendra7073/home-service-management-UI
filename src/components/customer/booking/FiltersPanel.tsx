"use client";

import FilterContent from "@/components/customer/booking/FilterContent";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";

export default function FiltersPanel({
    mobileFiltersOpen,
    setMobileFiltersOpen,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    resetFilters,
    data,
    filteredBookings
}: any) {
    return (
        <>
            {/* Mobile Filters */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden flex items-center gap-2 border-gray-300">
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-600" />
                            Filters
                        </SheetTitle>
                        <SheetDescription>Filter and sort your bookings</SheetDescription>
                    </SheetHeader>

                    <div className="mt-6">
                        <FilterContent
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            onReset={resetFilters}
                            totalBookings={data?.length || 0}
                            filteredCount={filteredBookings?.length || 0}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:w-80">
                <div className="sticky top-20">
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                            </div>

                            <FilterContent
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                onReset={resetFilters}
                                totalBookings={data?.length || 0}
                                filteredCount={filteredBookings?.length || 0}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
