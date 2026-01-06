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
import { BusinessCard } from "@/components/admin/business-card";
import { EmptyState } from "@/components/admin/empty-state";
import {
  useAdminBusinesses,
  useApproveBusiness,
  useRejectBusiness,
  useRestrictBusiness,
  useLiftBusinessRestriction,
} from "@/hooks/use-admin-queries";
import { useRouter } from "next/navigation";
import {
  Building2,
  Search,
  Loader2,
} from "lucide-react";

const APPROVAL_STATUS = {
  ALL: "all",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export function BusinessManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(APPROVAL_STATUS.ALL);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);

  // Build params for API call
  const params: { limit: number; isApproved?: boolean; isRejected?: boolean; categoryId?: string } = {
    limit: 100,
  };

  if (statusFilter === APPROVAL_STATUS.PENDING) {
    params.isApproved = false;
  } else if (statusFilter === APPROVAL_STATUS.APPROVED) {
    params.isApproved = true;
  } else if (statusFilter === APPROVAL_STATUS.REJECTED) {
    params.isRejected = true;
  }

  if (categoryFilter !== "all") {
    params.categoryId = categoryFilter;
  }

  // Fetch businesses using custom hook
  const { data: response, isLoading, error, isError } = useAdminBusinesses(params);

  const businesses = response?.data || [];

  // Mutations
  const approveMutation = useApproveBusiness();
  const rejectMutation = useRejectBusiness();
  const restrictMutation = useRestrictBusiness();
  const liftRestrictionMutation = useLiftBusinessRestriction();

  const handleBlockBusiness = async (reason: string) => {
    if (!selectedBusiness) return;

    await restrictMutation.mutateAsync({
      businessId: selectedBusiness._id,
      reason,
    });

    setBlockDialogOpen(false);
    setSelectedBusiness(null);
  };

  const getFilteredBusinesses = () => {
    let filtered = businesses;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (business: any) =>
          (business.name || business.businessName)?.toLowerCase().includes(query) ||
          business.description?.toLowerCase().includes(query) ||
          business.user?.name?.toLowerCase().includes(query) ||
          business.user?.email?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const categories = Array.from(
    new Set(businesses.map((b: any) => b.category?.name).filter(Boolean))
  );

  const isMutationPending =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    restrictMutation.isPending ||
    liftRestrictionMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Businesses Management</h1>
          <p className="text-muted-foreground">
            Review and manage all businesses on the platform
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, description, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={APPROVAL_STATUS.ALL}>All Status</SelectItem>
              <SelectItem value={APPROVAL_STATUS.PENDING}>Pending</SelectItem>
              <SelectItem value={APPROVAL_STATUS.APPROVED}>Approved</SelectItem>
              <SelectItem value={APPROVAL_STATUS.REJECTED}>Rejected</SelectItem>
            </SelectContent>
          </Select>

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

      {/* Businesses Grid */}
      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <EmptyState
          icon={Building2}
          title="Error loading businesses"
          description={error?.message || "Something went wrong. Please try again."}
        />
      ) : getFilteredBusinesses().length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No businesses found"
          description={
            searchQuery || statusFilter !== APPROVAL_STATUS.ALL
              ? "Try adjusting your filters"
              : "No businesses registered yet"
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getFilteredBusinesses().map((business: any) => (
            <BusinessCard
              key={business._id}
              id={business._id}
              name={business.name || business.businessName}
              description={business.description}
              category={business.category?.name}
              ownerName={business.user?.name}
              ownerEmail={business.user?.email}
              email={business.email}
              phone={business.phone}
              address={business.address}
              isApproved={business.isApproved}
              isRejected={business.isRejected}
              isRestricted={business.isRestricted}
              restrictionReason={business.restrictionReason}
              onViewDetails={() => router.push(`/admin/businesses/${business._id}`)}
              onApprove={
                !business.isApproved && !business.isRejected
                  ? () => approveMutation.mutate(business._id)
                  : undefined
              }
              onReject={
                !business.isApproved && !business.isRejected
                  ? () => rejectMutation.mutate({ businessId: business._id })
                  : undefined
              }
              onBlock={
                business.isApproved && !business.isRestricted
                  ? () => {
                    setSelectedBusiness(business);
                    setBlockDialogOpen(true);
                  }
                  : undefined
              }
              onUnblock={
                business.isRestricted
                  ? () => liftRestrictionMutation.mutate(business._id)
                  : undefined
              }
              isActionPending={isMutationPending}
            />
          ))}
        </div>
      )}

      {/* Block Business Dialog */}
      <BlockDialog
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        onConfirm={handleBlockBusiness}
        title="Block Business"
        entityName={selectedBusiness?.name || selectedBusiness?.businessName || ""}
        description={`You are about to block ${selectedBusiness?.name || selectedBusiness?.businessName || ""}. This will restrict access to this business and all its services.`}
      />
    </div>
  );
}
