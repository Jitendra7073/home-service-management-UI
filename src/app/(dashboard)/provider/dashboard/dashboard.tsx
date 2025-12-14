"use client"
import { BookingTable } from "@/components/provider/dashboard/booking-table";
import FeedbackTable from "@/components/provider/dashboard/customer-feedback-table";
import QuickCounts from "@/components/provider/dashboard/dashboardStats";
import RevenueChart from "@/components/provider/dashboard/revenue-chart";
import ServiceChart from "@/components/provider/dashboard/service-chart";
import ServicesTable from "@/components/provider/dashboard/services-table";
import Welcome from "@/components/provider/dashboard/welcome";
import { useQuery } from "@tanstack/react-query";

const DashboardComponents = () => {

    // Fetching all QUick Counts Data
    const { data, isLoading, isPending, isError, error } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const res = await fetch('/api/provider/dashboard', { cache: 'no-store' });
            const data = res.json()
            return data;
        },
        staleTime: 5 * 60 * 1000,
    })

    return <div className="flex w-full justify-center">
        <div className="w-full max-w-[1400px] px-2 md:px-6 space-y-6">
            <Welcome />
            <QuickCounts data={data} isLoading={isLoading} isPending={isPending} isError={isError} error={error} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={data?.monthlyAnalysis || []} isLoading={isLoading || isPending} />
                <ServiceChart data={data?.serviceBookingStats || []} isLoading={isLoading || isPending} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ServicesTable />
                <FeedbackTable />
            </div>
            <BookingTable />
        </div>
    </div>
        ;
};

export default DashboardComponents;
