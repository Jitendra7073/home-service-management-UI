"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Ban, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { AdminDataTable } from "@/components/admin/ui/admin-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { PasswordConfirmDialog } from "@/components/admin/password-confirm-dialog";
import { User, CreditCard, Calendar } from "lucide-react";

interface Subscription {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
  };
  status: string;
  stripeSubscriptionId: string;
  createdAt: string;
  isActive: boolean;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (search) params.append("search", search);

      const res = await fetch(`/api/admin/subscriptions?${params}`);
      const data = await res.json();

      if (res.ok) {
        setSubscriptions(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      } else {
        toast.error(data.message || "Failed to fetch subscriptions");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubscriptions();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleCancel = async (password: string, reason?: string) => {
    if (!confirmCancelId) return;

    try {
      setCancellingId(confirmCancelId);
      const res = await fetch(
        `/api/admin/subscriptions/${confirmCancelId}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, reason }),
        },
      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Subscription canceled successfully");
        fetchSubscriptions();
        setConfirmCancelId(null);
      } else {
        toast.error(data.message || "Failed to cancel subscription");
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error(error);
      // Toast already handled for API error message if data.message exists
      if (!error.message) toast.error("Something went wrong");
      throw error;
    } finally {
      setCancellingId(null);
    }
  };

  const statusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "trialing":
        return <Badge className="bg-green-600">Active</Badge>;
      case "canceled":
      case "cancelled":
        return <Badge variant="destructive">Canceled</Badge>;
      case "incomplete":
      case "past_due":
        return <Badge className="bg-yellow-600">Issue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Subscriptions
          </h2>
        </div>

        <div className="flex items-center  justify-between space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchSubscriptions()}>
              <RefreshCcw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        <AdminDataTable
          title="All Subscriptions"
          columns={[
            { header: "User" },
            { header: "Plan" },
            { header: "Amount" },
            { header: "Status" },
            { header: "Sub ID" },
            { header: "Created At" },
            { header: "Actions", className: "text-right" },
          ]}
          data={subscriptions}
          isLoading={loading}
          emptyMessage="No subscriptions found."
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          renderRow={(sub) => (
            <TableRow key={sub.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{sub.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {sub.user.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>{sub.plan?.name || "Unknown"}</TableCell>
              <TableCell>
                {sub.plan ? `${sub.plan.price} ${sub.plan.currency}` : "-"}
              </TableCell>
              <TableCell>{statusBadge(sub.status)}</TableCell>
              <TableCell
                className="font-mono text-xs truncate max-w-[100px]"
                title={sub.stripeSubscriptionId}>
                {sub.stripeSubscriptionId.slice(0, 14)}...
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {format(new Date(sub.createdAt), "PPP")}
              </TableCell>
              <TableCell className="text-right">
                {(sub.status === "active" || sub.status === "trialing") && (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={cancellingId === sub.id}
                    onClick={() => setConfirmCancelId(sub.id)}>
                    {cancellingId === sub.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Ban className="h-3 w-3 mr-1" />
                    )}
                    Cancel
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )}
        />
      </div>

      {(() => {
        const selectedSub = subscriptions.find((s) => s.id === confirmCancelId);
        if (!selectedSub) return null;

        const planName = selectedSub.plan?.name || "Unknown Plan";
        const planPrice = selectedSub.plan?.price
          ? `${selectedSub.plan.price
          } ${selectedSub.plan.currency?.toUpperCase()}`
          : "Free";
        const startDate = selectedSub.createdAt
          ? format(new Date(selectedSub.createdAt), "PPP")
          : "N/A";
        const userName = selectedSub.user?.name || "Unknown User";
        const userEmail = selectedSub.user?.email || "No Email";

        return (
          <PasswordConfirmDialog
            isOpen={!!confirmCancelId}
            onClose={() => setConfirmCancelId(null)}
            onConfirm={handleCancel}
            title="Cancel Subscription"
            description="Are you sure you want to cancel this subscription? This action cannot be undone."
            requireReason>
            <div className="rounded-sm border bg-muted/40 p-3 text-sm space-y-2 mb-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" /> Provider
                </span>
                <div className="text-right">
                  <div className="font-medium">{userName}</div>
                  <div className="text-xs text-muted-foreground">
                    {userEmail}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" /> Plan
                </span>
                <span className="font-medium">
                  {planName} ({planPrice})
                </span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> Started
                </span>
                <span>{startDate}</span>
              </div>
            </div>
          </PasswordConfirmDialog>
        );
      })()}
    </div>
  );
}
