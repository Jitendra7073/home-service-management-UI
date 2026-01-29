"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { BlockDialog } from "@/components/admin/block-dialog";
import { UserCard } from "@/components/admin/user-card";
import { EmptyState } from "@/components/admin/empty-state";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { User, Building, Shield, Users, Search } from "lucide-react";
import {
  useAdminUsers,
  useRestrictUser,
  useLiftUserRestriction,
} from "@/hooks/use-admin-queries";
import { AdminDataGrid } from "@/components/admin/ui/admin-data-grid";

interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  isRestricted?: boolean;
  restrictionReason?: string;
}

type UserRole = "customer" | "provider" | "admin";

export function UserManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<UserRole>(
    (searchParams.get("role") as UserRole) || "customer",
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Sync URL on state change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentRole = params.get("role");
    const currentQ = params.get("q");

    if (currentRole === activeTab && (currentQ || "") === searchQuery) {
      return;
    }

    params.set("role", activeTab);
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeTab, searchQuery, pathname, router, searchParams]);

  const [page, setPage] = useState(1);
  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery]);

  // Hook for fetching users
  const { data: usersData, isLoading, error } = useAdminUsers();

  const allUsers = (usersData?.data || []) as User[];

  // Client-side Filtering
  const filteredUsers = allUsers.filter((user) => {
    // Role Filter
    if (activeTab !== "admin" && user.role !== activeTab) return false;
    if (activeTab === "admin" && user.role !== "admin") return false;

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = user.name?.toLowerCase().includes(q);
      const matchEmail = user.email?.toLowerCase().includes(q);
      const matchMobile = user.mobile?.includes(q);
      return matchName || matchEmail || matchMobile;
    }
    return true;
  });

  // Client-side Pagination
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const users = paginatedUsers; // For compatibility with rendering

  // Mutations
  const { mutate: restrictUser, isPending: isRestrictPending } =
    useRestrictUser();
  const { mutate: liftRestriction, isPending: isLiftPending } =
    useLiftUserRestriction();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openBlockDialog = (user: any) => {
    setSelectedUser(user);
    setBlockDialogOpen(true);
  };

  const handleBlockUser = async (reason: string) => {
    if (selectedUser) {
      restrictUser({ userId: selectedUser.id, reason });
      setBlockDialogOpen(false);
    }
  };

  const handleUnblockUser = (user: any) => {
    liftRestriction(user.id);
  };

  const isActionPending = isRestrictPending || isLiftPending;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as UserRole)}
        className="space-y-6 gap-0">
        <TabsList className="grid w-full rounded-sm grid-cols-3 px-2 lg:w-[400px]">
          <TabsTrigger value="customer" className="gap-2 rounded-sm">
            <User className="h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="provider" className="gap-2 rounded-sm">
            <Building className="h-4 w-4" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="admin" className="gap-2 rounded-sm">
            <Shield className="h-4 w-4" />
            Admins
          </TabsTrigger>
        </TabsList>

        {(["customer", "provider", "admin"] as const).map((role) => (
          <TabsContent key={role} value={role} className="space-y-4">
            {error ? (
              <EmptyState
                icon={Shield}
                title="Error loading users"
                description={
                  error?.message || "Something went wrong. Please try again."
                }
              />
            ) : (
              <AdminDataGrid
                data={users}
                isLoading={isLoading}
                gridClassName="lg:grid-cols-3"
                emptyState={{
                  icon: Users,
                  title: `No ${role}s found`,
                  description: searchQuery
                    ? "Try adjusting your search query"
                    : "No users registered yet",
                }}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                renderItem={(user) => (
                  <UserCard
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    email={user.email}
                    mobile={user.mobile || ""}
                    role={user.role}
                    isRestricted={user.isRestricted ?? false}
                    restrictionReason={user.restrictionReason || ""}
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
                )}
              />
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
