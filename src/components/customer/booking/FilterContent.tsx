import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

export default function FilterContent({
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    onReset,
    totalBookings,
    filteredCount,
}: any) {
    return (
        <div className="space-y-4">

            {/* STATUS FILTER */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full h-10 border-gray-300">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* SORT FILTER */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full h-10 border-gray-300">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date-desc">Newest First</SelectItem>
                        <SelectItem value="date-asc">Oldest First</SelectItem>
                        <SelectItem value="price-high">Price: High → Low</SelectItem>
                        <SelectItem value="price-low">Price: Low → High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* RESET BUTTON */}
            <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={onReset}
            >
                Reset Filters
            </Button>

            {/* SUMMARY CARD */}
            <Card className="bg-gradient-to-br from-gray-700 to-gray-900 text-white border-0 shadow-sm mt-4">
                <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-3 text-gray-300">
                        Booking Summary
                    </h3>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">Total Bookings</span>
                            <span className="font-semibold text-lg">{totalBookings}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">Showing</span>
                            <span className="font-semibold text-lg">{filteredCount}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
