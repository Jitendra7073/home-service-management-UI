"use client"
import ServicesTable from "@/components/provider/dashboard/services-table";
import BookingHeader from "@/components/provider/header";
import AddServiceModal from "@/components/provider/services/create/AddServiceModal";
import ServiceStatsCards from "@/components/provider/services/quick-card";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function ServiceView() {
    const [openAddService, setOpenAddService] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["services"],
        queryFn: async () => {
            const res = await fetch("/api/provider/service", {
                method: "GET",
            });
            return res.json();
        },
    })
    return <div className="flex w-full justify-center">
        <div className="w-full max-w-[1400px] px-2 md:px-6 space-y-6">
            <BookingHeader
                title="Services"
                description="Manage your services, pricing, and availability"
                isVisibleAddServiceButton
                onAddServiceClick={() => setOpenAddService(true)}
            />
            <ServiceStatsCards
                total={data?.length}
                active={data?.filter((s: any) => s.isActive === true).length}
                inactive={data?.filter((s: any) => s.isActive === false).length}
                isLoading={isLoading}
            />
            <ServicesTable NumberOfRows={10} />

            <AddServiceModal
                open={openAddService}
                onClose={() => setOpenAddService(false)}
            />

        </div>
    </div>
}