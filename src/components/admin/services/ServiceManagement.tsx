"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlockDialog } from "@/components/admin/block-dialog";
import { ServiceCard } from "@/components/admin/service-card";
import { EmptyState } from "@/components/admin/empty-state";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { List, Search } from "lucide-react";
import {
  useAdminServices,
  useRestrictService,
  useLiftServiceRestriction,
  useBusinessCategories,
} from "@/hooks/use-admin-queries";
import { AdminDataGrid } from "@/components/admin/ui/admin-data-grid";

interface Service {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  durationInMinutes?: number;
  duration?: number;
  price: number;
  currency?: string;
  businessProfile?: { businessName?: string };
  business?: { name?: string };
  category?: { name?: string };
  isRestricted?: boolean;
  restrictionReason?: string;
  restrictionRequestMessage?: string;
  isActive?: boolean;
}

export function ServiceManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState<string>(
    searchParams.get("category") || "all",
  );
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [page, setPage] = useState(1);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentQ = params.get("q") || "";
    const currentCategory = params.get("category") || "all";

    if (currentQ === searchQuery && currentCategory === categoryFilter) {
      return;
    }

    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");

    if (categoryFilter !== "all") params.set("category", categoryFilter);
    else params.delete("category");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchQuery, categoryFilter, pathname, router, searchParams]);

  // Reset page
  useEffect(() => {
    setPage(1);
  }, [searchQuery, categoryFilter]);

  // Query
  const { data: servicesData, isLoading, error } = useAdminServices();

  const allServices = (servicesData?.data || []) as Service[];

  // Client-side Filtering
  const filteredServices = allServices.filter((service) => {
    // Category Filter
    if (categoryFilter !== "all" && service.category?.name !== categoryFilter) {
      return false;
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = service.name?.toLowerCase().includes(q);
      const matchDesc = service.description?.toLowerCase().includes(q);
      const matchBusiness = service.businessProfile?.businessName
        ?.toLowerCase()
        .includes(q);
      return matchName || matchDesc || matchBusiness;
    }
    return true;
  });

  // Client-side Pagination
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedServices = filteredServices.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const services = paginatedServices; // For rendering compatibility

  // Mutations
  const { mutate: restrictService, isPending: isRestrictPending } =
    useRestrictService();
  const { mutate: liftRestriction, isPending: isLiftPending } =
    useLiftServiceRestriction();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBlockService = async (reason: string) => {
    if (!selectedService) return;
    restrictService({
      serviceId: selectedService.id || selectedService._id,
      reason,
    });
    setBlockDialogOpen(false);
  };

  const handleUnblockService = async (serviceId: string) => {
    liftRestriction(serviceId);
  };

  // Fetch Categories for Filtering
  const { data: categoriesData } = useBusinessCategories();
  const categories = (
    categoriesData?.categories?.map((c: any) => c.name) || []
  ).sort() as string[];

  const isMutationPending = isRestrictPending || isLiftPending;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, description, business, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-10 w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Services Grid */}
      {error ? (
        <EmptyState
          icon={List}
          title="Error loading services"
          description={
            error?.message || "Something went wrong. Please try again."
          }
        />
      ) : (
        <AdminDataGrid
          data={services}
          isLoading={isLoading}
          gridClassName="lg:grid-cols-3"
          emptyState={{
            icon: List,
            title: "No services found",
            description:
              searchQuery || categoryFilter !== "all"
                ? "Try adjusting your filters"
                : "No services available yet",
          }}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          renderItem={(service) => (
            <ServiceCard
              key={service.id || service._id || "unknown"}
              id={service.id || service._id || ""}
              name={service.name}
              description={service.description || ""}
              duration={service.durationInMinutes || service.duration || 0}
              price={service.price}
              currency={service.currency || "INR"}
              businessName={
                service.businessProfile?.businessName ||
                service.business?.name ||
                "Unknown"
              }
              categoryName={service.category?.name || "Uncategorized"}
              isRestricted={service.isRestricted ?? false}
              restrictionReason={service.restrictionReason || ""}
              restrictionRequestMessage={
                service.restrictionRequestMessage || ""
              }
              isActive={service.isActive ?? true}
              onViewDetails={() =>
                router.push(
                  `/admin/services/${service.id || service._id || ""}`,
                )
              }
              onBlock={
                !service.isRestricted
                  ? () => {
                      setSelectedService(service);
                      setBlockDialogOpen(true);
                    }
                  : undefined
              }
              onUnblock={
                service.isRestricted
                  ? () => handleUnblockService(service.id || service._id || "")
                  : undefined
              }
              isActionPending={isMutationPending}
            />
          )}
        />
      )}

      {/* Block Service Dialog */}
      <BlockDialog
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        onConfirm={handleBlockService}
        title="Restrict Service"
        entityName={selectedService?.name || ""}
        description={`You are about to restrict ${
          selectedService?.name || ""
        }. This will hide the service from customers.`}
      />
    </div>
  );
}
