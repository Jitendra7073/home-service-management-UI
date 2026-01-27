"use client";

import { useParams, useRouter } from "next/navigation";

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
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
      // Also invalidate list
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
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-[250px]" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card Skeleton */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Skeleton className="h-32 w-32 rounded-full" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-5 w-[200px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary Skeleton */}
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-6 w-[120px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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

    // Check if it's just a string or an object
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
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

      <div
        className={`${
          user.role === "provider"
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-2"
            : "grid gap-6 md:grid-cols-2"
        }`}>
        {/* Restriction Details */}
        {user.isRestricted && user.restrictionReason && (
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-destructive">
                Restriction Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4">
                <p className="mb-2 text-sm font-semibold text-destructive">
                  Reason for Restriction
                </p>
                <p className="text-destructive">{user.restrictionReason}</p>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  This user is currently restricted from accessing the platform.
                  To lift the restriction.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{fullName}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {(user.phone || user.mobile) && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{user.phone || user.mobile}</p>
                  </div>
                </div>
              )}

              {primaryAddress && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <p className="font-medium">
                      {formatAddress(primaryAddress)}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Member Since</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Businesses */}
        {user.role === "provider" && user.businessProfile && (
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Card key={user.businessProfile.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">
                      {user.businessProfile.businessName}
                    </CardTitle>
                    <div className="flex gap-1">
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
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {/* Legacy Business Array Support (if API returns array) */}
        {user.role === "provider" &&
          user.businesses &&
          user.businesses.length > 0 &&
          !user.businessProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Businesses ({user.businesses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {user.businesses.map((business: any) => (
                    <Card key={business._id || business.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">
                            {business.name || business.businessName}
                          </CardTitle>
                          <div className="flex gap-1">
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
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                          onClick={() =>
                            router.push(
                              `/admin/businesses/${
                                business._id || business.id
                              }`,
                            )
                          }>
                          View Business Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        <Card className={user.role === "customer" ? "" : "col-span-2"}>
          <CardHeader className="flex flex-row items-center justify-between px-6">
            <div className="space-y-2">
              <CardTitle>Activity Logs</CardTitle>
              <p className="text-sm text-muted-foreground">
                Recent activities and actions performed by this user
              </p>
            </div>
          </CardHeader>

          <ActivityLogsSection userId={userId} userRole={user.role} />
        </Card>
      </div>
    </div>
  );
}

// Activity Logs Component
function ActivityLogsSection({
  userId,
  userRole,
}: {
  userId: string;
  userRole: string;
}) {
  const { data: logsData, isLoading } = useQuery({
    queryKey: ["user-activity-logs", userId],
    queryFn: async () => {
      const res = await fetch(
        `/api/admin/users/${userId}/activity-logs?limit=20`,
      );
      if (!res.ok) throw new Error("Failed to fetch activity logs");
      const result = await res.json();
      return result.data;
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <CardContent className="space-y-2 max-h-[420px] overflow-y-auto px-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-sm border bg-background p-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </CardContent>
    );
  }

  const logs = logsData?.logs || [];

  if (logs.length === 0) {
    return (
      <CardContent className="flex min-h-[200px] flex-col items-center justify-center p-6">
        <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium">No activity logs yet</p>
        <p className="text-sm text-muted-foreground">
          Activity will appear here
        </p>
      </CardContent>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      SUCCESS:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      PENDING:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      EMAIL_SENT:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      PROCESSING:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };

    return (
      <span
        className={`rounded-sm px-3 py-1 text-xs font-medium ${
          statusStyles[status] || statusStyles.SUCCESS
        }`}>
        {status}
      </span>
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const formatJSON = (obj: any) => {
    const jsonString = JSON.stringify(obj, null, 2);
    return jsonString
      .split("\n")
      .map((line) => {
        // Color keys
        line = line.replace(
          /"([^"]+)":/g,
          '<span style="color: #9CDCFE">"$1"</span>:',
        );

        // Color string values
        line = line.replace(
          /: "([^"]*)"/g,
          ': <span style="color: #CE9178">"$1"</span>',
        );

        // Color numbers
        line = line.replace(
          /: (\d+),?$/g,
          ': <span style="color: #B5CEA8">$1</span>',
        );
        line = line.replace(
          /: (\d+\.\d+),?$/g,
          ': <span style="color: #B5CEA8">$1</span>',
        );

        // Color booleans
        line = line.replace(
          /: (true|false),?$/g,
          ': <span style="color: #569CD6">$1</span>',
        );

        // Color null
        line = line.replace(
          /: (null),?$/g,
          ': <span style="color: #569CD6">$1</span>',
        );

        return line;
      })
      .join("\n");
  };

  return (
    <CardContent className="space-y-2 max-h-[420px] overflow-y-auto px-6">
      {logs.map((log: any) => (
        <div
          key={log.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-sm border bg-background p-4 hover:bg-accent transition">
          {/* Left Info */}
          <div className="space-y-1 flex-1">
            <p className="font-medium">{log.description}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{log.actionType}</span>
              {log.ipAddress && (
                <>
                  <span>•</span>
                  <span>IP: {log.ipAddress}</span>
                </>
              )}
            </div>
          </div>

          {/* Right Meta */}
          <div className="flex items-center gap-3">
            {/* Metadata Info Icon */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-accent rounded"
                    aria-label="View metadata">
                    <Info className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto max-w-md" align="end">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Metadata</h4>
                    <div className="rounded-md bg-slate-950 dark:bg-slate-900 p-3 overflow-auto max-h-[300px]">
                      <pre className="text-xs font-mono">
                        <code
                          dangerouslySetInnerHTML={{
                            __html: formatJSON(log.metadata),
                          }}
                        />
                      </pre>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {getStatusBadge(log.status)}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTimeAgo(log.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </CardContent>
  );
}
