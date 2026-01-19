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
import { BusinessCard } from "@/components/admin/business-card";
import { EmptyState } from "@/components/admin/empty-state";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Building2, Search } from "lucide-react";
import {
  useAdminBusinesses,
  useApproveBusiness,
  useRestrictBusiness,
  useLiftBusinessRestriction,
  useBusinessCategories,
} from "@/hooks/use-admin-queries";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const APPROVAL_STATUS = {
  ALL: "all",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  RESTRICTED: "restricted",
} as const;

export function BusinessManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || APPROVAL_STATUS.ALL
  );
  const [categoryFilter, setCategoryFilter] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [processingAction, setProcessingAction] = useState<{
    id: string;
    type: string;
  } | null>(null);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentQ = params.get("q") || "";
    const currentStatus = params.get("status") || APPROVAL_STATUS.ALL;
    const currentCategory = params.get("category") || "all";

    if (
      currentQ === searchQuery &&
      currentStatus === statusFilter &&
      currentCategory === categoryFilter
    ) {
      return;
    }

    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");

    if (statusFilter !== APPROVAL_STATUS.ALL)
      params.set("status", statusFilter);
    else params.delete("status");

    if (categoryFilter !== "all") params.set("category", categoryFilter);
    else params.delete("category");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    searchQuery,
    statusFilter,
    categoryFilter,
    pathname,
    router,
    searchParams,
  ]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  // Query
  const { data: businessesData, isLoading, error } = useAdminBusinesses();

  const allBusinesses = businessesData?.data || [];

  // Client-side Filtering
  const filteredBusinesses = allBusinesses.filter((business: any) => {
    // Status Filter
    if (statusFilter !== APPROVAL_STATUS.ALL) {
      if (statusFilter === APPROVAL_STATUS.PENDING) {
        if (business.isApproved || business.isRejected) return false;
      } else if (statusFilter === APPROVAL_STATUS.APPROVED) {
        if (!business.isApproved) return false;
      } else if (statusFilter === APPROVAL_STATUS.REJECTED) {
        if (!business.isRejected) return false;
      } else if (statusFilter === APPROVAL_STATUS.RESTRICTED) {
        if (!business.isRestricted) return false;
      }
    }

    // Category Filter
    if (
      categoryFilter !== "all" &&
      business.category?.name !== categoryFilter
    ) {
      return false;
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName =
        business.businessName?.toLowerCase().includes(q) ||
        business.name?.toLowerCase().includes(q);
      const matchOwner = business.user?.name?.toLowerCase().includes(q);
      const matchEmail = business.contactEmail?.toLowerCase().includes(q);
      return matchName || matchOwner || matchEmail;
    }
    return true;
  });

  // Client-side Pagination
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedBusinesses = filteredBusinesses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const businesses = paginatedBusinesses; // For rendering compatibility

  // Mutations
  const { mutate: approveBusiness, isPending: isApprovePending } =
    useApproveBusiness();
  const { mutate: restrictBusiness, isPending: isRestrictPending } =
    useRestrictBusiness();
  const { mutate: liftRestriction, isPending: isLiftPending } =
    useLiftBusinessRestriction();

  // Note: Reject handled via redirect to detail page for now as it requires reason

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBlockBusiness = async (reason: string) => {
    if (!selectedBusiness) return;
    setProcessingAction({
      id: selectedBusiness._id || selectedBusiness.id,
      type: "block",
    });
    restrictBusiness(
      {
        businessId: selectedBusiness._id || selectedBusiness.id,
        reason,
      },
      {
        onSettled: () => setProcessingAction(null),
      }
    );
    setBlockDialogOpen(false);
  };

  // Fetch Categories for Filtering
  const { data: categoriesData } = useBusinessCategories();
  const categories = (
    categoriesData?.categories?.map((c: any) => c.name) || []
  ).sort() as string[];

  const isMutationPending =
    isApprovePending || isRestrictPending || isLiftPending;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, description, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <div className="flex gap-2 h-10 ">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-10">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={APPROVAL_STATUS.ALL}>All Status</SelectItem>
              <SelectItem value={APPROVAL_STATUS.PENDING}>Pending</SelectItem>
              <SelectItem value={APPROVAL_STATUS.APPROVED}>Approved</SelectItem>
              <SelectItem value={APPROVAL_STATUS.REJECTED}>Rejected</SelectItem>
              <SelectItem value={APPROVAL_STATUS.RESTRICTED}>
                Restricted
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Note: This category filter will only show categories present in the current page */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] h-10">
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

      {/* Businesses Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <EmptyState
          icon={Building2}
          title="Error loading businesses"
          description={
            error?.message || "Something went wrong. Please try again."
          }
        />
      ) : businesses.length === 0 ? (
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
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business: any) => (
              <BusinessCard
                key={business._id || business.id}
                id={business._id || business.id}
                name={business.name || business.businessName}
                description={business.description}
                category={business.category?.name}
                ownerName={business.user?.name}
                ownerEmail={business.user?.email}
                email={business.contactEmail}
                phone={business.phoneNumber || business.phone}
                isApproved={business.isApproved}
                isRejected={business.isRejected}
                isRestricted={business.isRestricted}
                restrictionReason={business.restrictionReason}
                onViewDetails={() =>
                  router.push(
                    `/admin/businesses/${business._id || business.id}`
                  )
                }
                onApprove={
                  !business.isApproved && !business.isRejected
                    ? () => {
                        const id = business._id || business.id;
                        setProcessingAction({ id, type: "approve" });
                        approveBusiness(id, {
                          onSettled: () => setProcessingAction(null),
                        });
                      }
                    : undefined
                }
                onReject={
                  !business.isApproved && !business.isRejected
                    ? () =>
                        router.push(
                          `/admin/businesses/${business._id || business.id}`
                        )
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
                    ? () => {
                        const id = business._id || business.id;
                        setProcessingAction({ id, type: "unblock" });
                        liftRestriction(id, {
                          onSettled: () => setProcessingAction(null),
                        });
                      }
                    : undefined
                }
                actionLoading={
                  processingAction &&
                  processingAction.id === (business._id || business.id)
                    ? processingAction.type
                    : null
                }
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(page - 1)}
                      className={
                        page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => {
                      if (
                        totalPages > 10 &&
                        Math.abs(page - p) > 2 &&
                        p !== 1 &&
                        p !== totalPages
                      ) {
                        if (Math.abs(page - p) === 3)
                          return (
                            <PaginationItem key={p}>
                              <span className="px-4">...</span>
                            </PaginationItem>
                          );
                        return null;
                      }
                      return (
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={page === p}
                            onClick={() => handlePageChange(p)}
                            className="cursor-pointer">
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      className={
                        page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Block Business Dialog */}
      <BlockDialog
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        onConfirm={handleBlockBusiness}
        title="Block Business"
        entityName={
          selectedBusiness?.name || selectedBusiness?.businessName || ""
        }
        description={`You are about to block ${
          selectedBusiness?.name || selectedBusiness?.businessName || ""
        }. This will restrict access to this business and all its services.`}
      />
    </div>
  );
}
