"use client";

import { useState } from "react";
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
import {
  useAdminServices,
  useRestrictService,
  useLiftServiceRestriction,
} from "@/hooks/use-admin-queries";
import {
  List,
  Search,
  Loader2,
} from "lucide-react";

export function ServiceManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Build params for API call
  const params: { limit: number; categoryId?: string } = { limit: 100 };

  if (categoryFilter !== "all") {
    params.categoryId = categoryFilter;
  }

  // Fetch services using custom hook
  const { data: response, isLoading, error, isError } = useAdminServices(params);

  const services = response?.data || [];

  // Mutations
  const restrictServiceMutation = useRestrictService();
  const liftServiceRestrictionMutation = useLiftServiceRestriction();

  const handleBlockService = async (reason: string) => {
    if (!selectedService) return;

    await restrictServiceMutation.mutateAsync({
      serviceId: selectedService._id,
      reason,
    });

    setBlockDialogOpen(false);
    setSelectedService(null);
  };

  const handleUnblockService = async (serviceId: string) => {
    await liftServiceRestrictionMutation.mutateAsync(serviceId);
  };

  const getFilteredServices = () => {
    let filtered = services;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service: any) =>
          service.name?.toLowerCase().includes(query) ||
          service.description?.toLowerCase().includes(query) ||
          service.business?.businessName?.toLowerCase().includes(query) ||
          service.category?.name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const categories = Array.from(
    new Set(services.map((s: any) => s.category?.name).filter(Boolean))
  ).sort();

  const businesses = Array.from(
    new Set(services.map((s: any) => s.business?.businessName).filter(Boolean))
  ).sort();

  const isMutationPending =
    restrictServiceMutation.isPending ||
    liftServiceRestrictionMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
          <p className="text-muted-foreground">
            Manage all services across the platform
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, description, business, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category: any) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={List}
          title="Error loading services"
          description={error?.message || "Something went wrong. Please try again."}
        />
      ) : getFilteredServices().length === 0 ? (
        <EmptyState
          icon={List}
          title="No services found"
          description={
            searchQuery || categoryFilter !== "all"
              ? "Try adjusting your filters"
              : "No services available yet"
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getFilteredServices().map((service: any) => (
            <ServiceCard
              key={service._id}
              id={service._id}
              name={service.name}
              description={service.description || ""}
              duration={service.durationInMinutes || service.duration || 0}
              price={service.price}
              currency={service.currency || "INR"}
              businessName={
                service.business?.businessName || service.business?.name || "Unknown"
              }
              categoryName={service.category?.name || "Uncategorized"}
              isRestricted={service.isRestricted || false}
              restrictionReason={service.restrictionReason}
              isActive={service.isActive ?? true}
              onViewDetails={() => { }}
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
                  ? () => handleUnblockService(service._id)
                  : undefined
              }
              isActionPending={isMutationPending}
            />
          ))}
        </div>
      )}

      {/* Block Service Dialog */}
      <BlockDialog
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        onConfirm={handleBlockService}
        title="Restrict Service"
        entityName={selectedService?.name || ""}
        description={`You are about to restrict ${selectedService?.name || ""}. This will hide the service from customers.`}
      />
    </div>
  );
}
