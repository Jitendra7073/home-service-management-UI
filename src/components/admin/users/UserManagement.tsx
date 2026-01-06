"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { BlockDialog } from "@/components/admin/block-dialog";
import { UserCard } from "@/components/admin/user-card";
import { EmptyState } from "@/components/admin/empty-state";
import {
  useAdminUsers,
  useRestrictUser,
  useLiftUserRestriction,
} from "@/hooks/use-admin-queries";
import { useRouter } from "next/navigation";
import {
  User,
  Building,
  Shield,
  Users,
  Search,
  Loader2,
} from "lucide-react";

type UserRole = "customer" | "provider" | "admin";

export function UserManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UserRole>("customer");
  const [searchQuery, setSearchQuery] = useState("");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Fetch users using custom hook
  const { data: response, isLoading, error, isError } = useAdminUsers({
    role: activeTab,
    limit: 100,
  });

  const users = response?.data || [];

  // Mutations
  const restrictUserMutation = useRestrictUser();
  const liftRestrictionMutation = useLiftUserRestriction();

  const handleBlockUser = async (reason: string) => {
    if (!selectedUser) return;

    await restrictUserMutation.mutateAsync({
      userId: selectedUser.id,
      reason,
    });

    setBlockDialogOpen(false);
    setSelectedUser(null);
  };

  const handleUnblockUser = async (user: any) => {
    await liftRestrictionMutation.mutateAsync(user.id);
  };

  const openBlockDialog = (user: any) => {
    setSelectedUser(user);
    setBlockDialogOpen(true);
  };

  const getFilteredUsers = () => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user: any) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.mobile?.includes(query)
    );
  };

  const isActionPending =
    restrictUserMutation.isPending || liftRestrictionMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">
            Manage all users on the platform
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserRole)}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="customer" className="gap-2">
            <User className="h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="provider" className="gap-2">
            <Building className="h-4 w-4" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="admin" className="gap-2">
            <Shield className="h-4 w-4" />
            Admins
          </TabsTrigger>
        </TabsList>

        {(["customer", "provider", "admin"] as const).map((role) => (
          <TabsContent key={role} value={role} className="space-y-4">
            {isLoading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : isError ? (
              <EmptyState
                icon={Shield}
                title="Error loading users"
                description={error?.message || "Something went wrong. Please try again."}
              />
            ) : getFilteredUsers().length === 0 ? (
              <EmptyState
                icon={Users}
                title={`No ${role}s found`}
                description={
                  searchQuery
                    ? "Try adjusting your search query"
                    : "No users registered yet"
                }
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredUsers().map((user: any) => (
                  <UserCard
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    email={user.email}
                    mobile={user.mobile}
                    role={user.role}
                    isRestricted={user.isRestricted}
                    restrictionReason={user.restrictionReason}
                    onViewDetails={() => router.push(`/admin/users/${user.id}`)}
                    onBlock={
                      role !== "admin" && !user.isRestricted
                        ? () => openBlockDialog(user)
                        : undefined
                    }
                    onUnblock={
                      role !== "admin" && user.isRestricted
                        ? () => handleUnblockUser(user)
                        : undefined
                    }
                    isBlocking={isActionPending}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Block User Dialog */}
      <BlockDialog
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        onConfirm={handleBlockUser}
        title="Block User"
        entityName={selectedUser?.name || ""}
      />
    </div>
  );
}
