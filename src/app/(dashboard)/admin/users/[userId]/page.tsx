"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Ban,
  Shield,
  Building2,
  Info,
  ChevronLeft,
  ChevronRight,
  Filter,
  Activity,
  Clock,
  Monitor,
  Globe,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserDetailsSkeleton from "./loading-skeleton";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const queryClient = useQueryClient();

  // Fetch user details
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user details");
      }
      const result = await res.json();
      return result.data;
    },
    retry: 1,
  });

  // Mutation for unblocking user
  const unblockUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/admin/users/${userId}/lift-restriction`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to unblock user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleUnblockUser = async () => {
    try {
      await unblockUserMutation.mutateAsync(userId);
      toast.success("User unblocked successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to unblock user");
    }
  };

  if (isLoading) {
    return <UserDetailsSkeleton />;
  }

  if (error || !user) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-6">
          <User className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">User not found</p>
        </CardContent>
      </Card>
    );
  }

  // Handle data mapping based on API response structure
  const fullName =
    user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberDays = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  // Get primary address
  const primaryAddress =
    user.addresses && user.addresses.length > 0 ? user.addresses[0] : null;

  const formatAddress = (addr: any) => {
    if (!addr) return "No address provided";
    if (typeof addr === "string") return addr;

    return [addr.street, addr.city, addr.state, addr.postalCode, addr.country]
      .filter(Boolean)
      .join(", ");
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case "customer":
        return <User className="h-3 w-3" />;
      case "provider":
        return <Building2 className="h-3 w-3" />;
      case "admin":
        return <Shield className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
            {user.isRestricted ? (
              <Badge variant="destructive" className="gap-2">
                <Ban className="h-3 w-3" />
                Restricted
              </Badge>
            ) : (
              <Badge variant="default" className="gap-2 bg-emerald-600">
                <Shield className="h-3 w-3" />
                Active
              </Badge>
            )}
            <Badge variant="outline" className="gap-2">
              {getRoleIcon()}
              <span className="capitalize">{user.role}</span>
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Member for {memberDays} days
          </p>
        </div>
        {user.role !== "admin" && user.isRestricted && (
          <Button
            variant="default"
            className="gap-2"
            onClick={handleUnblockUser}
            disabled={unblockUserMutation.isPending}>
            <Shield className="h-4 w-4" />
            Unblock User
          </Button>
        )}
      </div>

      {/* Restriction Details */}
      {user.isRestricted && user.restrictionReason && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Ban className="h-5 w-5" />
              Restriction Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-sm border border-destructive/20 bg-destructive/10 p-4">
              <p className="mb-2 text-sm font-semibold text-destructive">
                Reason for Restriction
              </p>
              <p className="text-destructive">{user.restrictionReason}</p>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                This user is currently restricted from accessing the platform.
                Use the "Unblock User" button to lift the restriction.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1 h-fit sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32 ring-4 ring-muted">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Full Name
                </p>
                <p className="font-semibold">{fullName}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium text-sm break-all">{user.email}</p>
                </div>
              </div>

              {(user.phone || user.mobile) && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{user.phone || user.mobile}</p>
                  </div>
                </div>
              )}

              {primaryAddress && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Address
                  </p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <p className="font-medium text-sm leading-relaxed">
                      {formatAddress(primaryAddress)}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Member Since
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Business Profile and Activity Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Provider Business Profile */}
          {user.role === "provider" && user.businessProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-sm border bg-card p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {user.businessProfile.businessName}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.businessProfile.isRestricted && (
                        <Badge variant="destructive" className="gap-1">
                          <Ban className="h-3 w-3" />
                          Blocked
                        </Badge>
                      )}
                      {!user.businessProfile.isApproved && (
                        <Badge
                          variant="outline"
                          className="border-yellow-600 text-yellow-700">
                          Pending
                        </Badge>
                      )}
                      {user.businessProfile.isApproved &&
                        !user.businessProfile.isRestricted && (
                          <Badge variant="default" className="bg-emerald-600">
                            Approved
                          </Badge>
                        )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() =>
                      router.push(
                        `/admin/businesses/${user.businessProfile?.id}`,
                      )
                    }>
                    View Business Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Legacy Business Array Support */}
          {user.role === "provider" &&
            user.businesses &&
            user.businesses.length > 0 &&
            !user.businessProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Businesses ({user.businesses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {user.businesses.map((business: any) => (
                      <div
                        key={business._id || business.id}
                        className="rounded-sm border bg-card p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold">
                            {business.name || business.businessName}
                          </h3>
                          <div className="flex flex-wrap gap-1">
                            {business.isRestricted && (
                              <Badge variant="destructive" className="gap-1">
                                <Ban className="h-3 w-3" />
                                Blocked
                              </Badge>
                            )}
                            {!business.isApproved && (
                              <Badge
                                variant="outline"
                                className="border-yellow-600 text-yellow-700">
                                Pending
                              </Badge>
                            )}
                            {business.isApproved && !business.isRestricted && (
                              <Badge
                                variant="default"
                                className="bg-emerald-600">
                                Approved
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() =>
                            router.push(
                              `/admin/businesses/${business._id || business.id
                              }`,
                            )
                          }>
                          View Business Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Activity Logs Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activity Logs
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recent activities and actions performed by this user
                  </p>
                </div>
              </div>
            </CardHeader>

            <ActivityLogsSection userId={userId} userRole={user.role} />
          </Card>
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  SUCCESS:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  FAILED:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  PENDING:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  PROCESSING:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
};

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(dateString).toLocaleDateString();
}

function ActivityLogItem({ log }: { log: any }) {
  return (
    <div className="group rounded-sm border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50">
      <div className="space-y-3">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-snug text-foreground">
              {log.description || log.actionType}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">{log.actionType}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <MetadataPopover metadata={log.metadata} />
            )}
            <Badge
              variant="outline"
              className={`${STATUS_STYLES[log.status] || STATUS_STYLES.SUCCESS
                } font-medium`}>
              {log.status}
            </Badge>
          </div>
        </div>

        {/* Details Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {log.ipAddress && (
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              <span className="font-mono">{log.ipAddress}</span>
            </div>
          )}

          {log.userAgent && (
            <div className="flex items-center gap-1.5">
              <Monitor className="h-3.5 w-3.5" />
              <span className="truncate max-w-[200px]" title={log.userAgent}>
                {log.userAgent}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            <Clock className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap font-medium">
              {timeAgo(log.createdAt)}
            </span>
          </div>
        </div>

        {/* Full Timestamp */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <span className="font-medium">
            {new Date(log.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "medium",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

function MetadataPopover({ metadata }: { metadata: any }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-sm hover:bg-accent">
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[400px] max-w-[90vw]">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Additional Information</p>
          </div>

          <pre className="max-h-[400px] overflow-auto rounded-sm bg-muted p-4 text-xs font-mono leading-relaxed">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ActivityLogsSection({
  userId,
  userRole,
}: {
  userId: string;
  userRole: string;
}) {
  const router = useRouter();
  const searchParams = useParams();

  // Get filters from URL or use defaults
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const [page, setPage] = useState(parseInt(urlParams?.get("page") || "1"));
  const [statusFilter, setStatusFilter] = useState<string>(
    urlParams?.get("status") || "all",
  );
  const [searchQuery, setSearchQuery] = useState(
    urlParams?.get("search") || "",
  );
  const [actionTypeFilter, setActionTypeFilter] = useState<string>(
    urlParams?.get("actionType") || "all",
  );
  const [dateFilter, setDateFilter] = useState<string>(
    urlParams?.get("dateFilter") || "all",
  );
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const limit = 4;

  // Update URL when filters change
  const updateURL = (filters: Record<string, string | number>) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.set(key, String(value));
      }
    });

    const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""
      }`;
    window.history.replaceState({}, "", newUrl);
  };

  // Update URL whenever filters change
  useState(() => {
    if (typeof window !== "undefined") {
      updateURL({
        page,
        status: statusFilter,
        search: searchQuery,
        actionType: actionTypeFilter,
        dateFilter: dateFilter,
      });
    }
  });

  const { data, isLoading } = useQuery({
    queryKey: ["activity-logs", userId, page, statusFilter], // Only server-side filters
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        status: statusFilter,
      });

      const res = await fetch(
        `/api/admin/users/${userId}/activity-logs?${params.toString()}`,
      );
      if (!res.ok) throw new Error("Failed to load logs");
      return res.json();
    },
    staleTime: 1000 * 30,
    retry: 1,
  });

  // Client-side filtering
  const filterLogs = (logs: any[]) => {
    let filtered = [...logs];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.description?.toLowerCase().includes(query) ||
          log.actionType?.toLowerCase().includes(query) ||
          log.ipAddress?.toLowerCase().includes(query) ||
          log.userAgent?.toLowerCase().includes(query),
      );
    }

    // Action type filter
    if (actionTypeFilter && actionTypeFilter !== "all") {
      filtered = filtered.filter((log) => log.actionType === actionTypeFilter);
    }

    // Date filter
    if (dateFilter && dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "yesterday":
          filterDate.setDate(filterDate.getDate() - 1);
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "last7days":
          filterDate.setDate(filterDate.getDate() - 7);
          break;
        case "last30days":
          filterDate.setDate(filterDate.getDate() - 30);
          break;
        case "last90days":
          filterDate.setDate(filterDate.getDate() - 90);
          break;
      }

      if (dateFilter === "yesterday") {
        const tomorrow = new Date(filterDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filtered = filtered.filter((log) => {
          const logDate = new Date(log.createdAt);
          return logDate >= filterDate && logDate < tomorrow;
        });
      } else if (dateFilter !== "all") {
        filtered = filtered.filter(
          (log) => new Date(log.createdAt) >= filterDate,
        );
      }
    }

    return filtered;
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setActionTypeFilter("all");
    setDateFilter("all");
    setPage(1);
    window.history.replaceState({}, "", window.location.pathname);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setPage(1); // Reset to page 1 when filter changes

    const newFilters: Record<string, string | number> = {
      page: 1,
      status: statusFilter,
      search: searchQuery,
      actionType: actionTypeFilter,
      dateFilter: dateFilter,
    };

    switch (filterType) {
      case "status":
        setStatusFilter(value);
        newFilters.status = value;
        break;
      case "search":
        setSearchQuery(value);
        newFilters.search = value;
        break;
      case "actionType":
        setActionTypeFilter(value);
        newFilters.actionType = value;
        break;
      case "dateFilter":
        setDateFilter(value);
        newFilters.dateFilter = value;
        break;
    }

    updateURL(newFilters);
  };

  if (isLoading) {
    return (
      <CardContent className="flex flex-col space-y-3 px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[120px]" />
          </div>
          <Skeleton className="h-10 w-[180px] rounded-sm" />
          <Skeleton className="h-4 w-[200px] ml-auto" />
        </div>
        {/* Activity Log Items Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-sm border p-4 space-y-3">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-sm" />
                  <Skeleton className="h-6 w-[80px] rounded-sm" />
                </div>
              </div>

              {/* Details Row */}
              <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-3 w-[120px]" />
                <Skeleton className="h-3 w-[150px]" />
                <Skeleton className="h-3 w-[100px] ml-auto" />
              </div>

              {/* Timestamp */}
              <div className="pt-2 border-t">
                <Skeleton className="h-3 w-[180px]" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    );
  }

  const rawLogs = data?.data?.logs || [];
  const filteredLogs = filterLogs(rawLogs);
  const totalLogs = data?.data?.total || 0;
  const totalPages = Math.ceil(totalLogs / limit);

  // Get unique action types for filter dropdown
  const uniqueActionTypes = Array.from(
    new Set(rawLogs.map((log: any) => log.actionType)),
  ).sort();

  const hasActiveFilters =
    statusFilter !== "all" ||
    searchQuery !== "" ||
    actionTypeFilter !== "all" ||
    dateFilter !== "all";

  if (!rawLogs.length && !hasActiveFilters && page === 1) {
    return (
      <CardContent className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-6">
        <Activity className="h-12 w-12 text-muted-foreground" />
        <p className="font-semibold text-lg">No activity yet</p>
        <p className="text-sm text-muted-foreground text-center">
          User activity will appear here once they start interacting with the
          platform
        </p>
      </CardContent>
    );
  }

  return (
    <>
      <CardContent className="px-6">
        {/* Search and Filters */}
        <div className="space-y-4 mb-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search logs by description, action, IP address..."
              value={searchQuery}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {searchQuery && (
              <button
                onClick={() => handleFilterChange("search", "")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                ✕
              </button>
            )}
          </div>

          {/* Primary Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">
                Status:
              </span>
              <Select
                value={statusFilter}
                onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">
                Date:
              </span>
              <Select
                value={dateFilter}
                onValueChange={(value) =>
                  handleFilterChange("dateFilter", value)
                }>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">
                Action:
              </span>
              <Select
                value={actionTypeFilter}
                onValueChange={(value) =>
                  handleFilterChange("actionType", value)
                }>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActionTypes.map((actionType: any) => (
                    <SelectItem key={actionType} value={actionType}>
                      {actionType.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="gap-2">
                Clear Filters
              </Button>
            )}

            {/* Results Count */}
            <div className="ml-auto text-sm text-muted-foreground whitespace-nowrap">
              {filteredLogs.length > 0 ? (
                <>
                  Showing {filteredLogs.length} of {rawLogs.length} logs
                  {hasActiveFilters && ` (filtered)`}
                </>
              ) : (
                "No results"
              )}
            </div>
          </div>
        </div>

        {/* Logs List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-sm border p-4 space-y-3 animate-pulse">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-sm" />
                    <Skeleton className="h-6 w-[80px] rounded-sm" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Skeleton className="h-3 w-[120px]" />
                  <Skeleton className="h-3 w-[150px]" />
                  <Skeleton className="h-3 w-[100px] ml-auto" />
                </div>
                <div className="pt-2 border-t">
                  <Skeleton className="h-3 w-[180px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-center py-8">
            <Filter className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No logs found</p>
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters
                ? "Try adjusting your filters or search query"
                : "No activity logs available"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log: any) => (
              <ActivityLogItem key={log.id || log._id} log={log} />
            ))}
          </div>
        )}
      </CardContent>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPage = Math.max(1, page - 1);
                  setPage(newPage);
                  updateURL({
                    page: newPage,
                    status: statusFilter,
                    search: searchQuery,
                    actionType: actionTypeFilter,
                    dateFilter: dateFilter,
                  });
                }}
                disabled={page === 1}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPage = Math.min(totalPages, page + 1);
                  setPage(newPage);
                  updateURL({
                    page: newPage,
                    status: statusFilter,
                    search: searchQuery,
                    actionType: actionTypeFilter,
                    dateFilter: dateFilter,
                  });
                }}
                disabled={page === totalPages}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
