"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserDetails, useUnblockUser } from "@/lib/hooks/useAdminApi";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Ban,
  Shield,
  Loader2,
  Building2,
} from "lucide-react";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  // Fetch user details using custom hook
  const { data: user, isLoading, error } = useUserDetails(userId);

  // Mutation for unblocking user
  const unblockUserMutation = useUnblockUser();

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
      <div className="flex min-h-[600px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  const memberDays = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const getRoleIcon = () => {
    switch (user.role) {
      case "customer":
        return <User className="h-3 w-3" />;
      case "provider":
        return <Building2 className="h-3 w-3" />;
      case "admin":
        return <Shield className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
            {user.isRestricted && (
              <Badge variant="destructive" className="gap-1">
                <Ban className="h-3 w-3" />
                Blocked
              </Badge>
            )}
            <Badge variant="outline" className="gap-1">
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
            disabled={unblockUserMutation.isPending}
          >
            <Shield className="h-4 w-4" />
            Unblock User
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="text-3xl">
                  {initials}
                </AvatarFallback>
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

              {user.address && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <p className="font-medium">{user.address}</p>
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

        {/* Restriction Details */}
        {user.isRestricted && user.restrictionReason && (
          <Card className="border-destructive md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-destructive">Restriction Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                <p className="mb-2 text-sm font-semibold text-destructive">Reason for Restriction</p>
                <p className="text-destructive">{user.restrictionReason}</p>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  This user is currently restricted from accessing the platform.
                  To lift the restriction, click the "Unblock User" button above.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Provider Businesses */}
        {user.role === "provider" && user.businesses && user.businesses.length > 0 && (
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle>Businesses ({user.businesses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {user.businesses.map((business) => (
                  <Card key={business._id}>
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
                            <Badge variant="outline" className="border-yellow-600 text-yellow-700">
                              Pending
                            </Badge>
                          )}
                          {business.isApproved && !business.isRestricted && (
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
                        onClick={() => router.push(`/admin/businesses/${business._id}`)}
                      >
                        View Business Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Summary */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Account Status</p>
                <div className="flex items-center gap-2">
                  {user.isRestricted ? (
                    <>
                      <Ban className="h-5 w-5 text-destructive" />
                      <span className="font-medium text-destructive">Restricted</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium text-emerald-600">Active</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Account Type</p>
                <div className="flex items-center gap-2">
                  {getRoleIcon()}
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Member For</p>
                <p className="font-medium">{memberDays} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
