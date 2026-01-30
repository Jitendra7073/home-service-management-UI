"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, X, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { PasswordConfirmDialog } from "@/components/admin/password-confirm-dialog";

// Helper to fetch plans
const fetchPlans = async () => {
  const res = await fetch("/api/admin/plans");
  if (!res.ok) throw new Error("Failed to fetch plans");
  const json = await res.json();
  return json.data || [];
};

export function PlanCommissionManager() {
  const queryClient = useQueryClient();
  const { data: plans, isLoading } = useQuery({
    queryKey: ["admin-plans"],
    queryFn: fetchPlans,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [commissionValue, setCommissionValue] = useState<string>("");
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, commissionRate, password }: any) => {
      const res = await fetch(`/api/admin/plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commissionRate: Number(commissionRate),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      return data;
    },
    onSuccess: () => {
      toast.success("Platform fee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      setEditingId(null);
      setIsPasswordOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message);
      setIsPasswordOpen(false);
    },
  });

  const handleEdit = (plan: any) => {
    setEditingId(plan.id);
    setCommissionValue(plan.commissionRate?.toString() || "10");
  };

  const handleCancel = () => {
    setEditingId(null);
    setCommissionValue("");
  };

  const handleSaveRequest = (planId: string) => {
    if (!commissionValue || isNaN(Number(commissionValue))) {
      toast.error("Please enter a valid number");
      return;
    }
    const val = Number(commissionValue);
    if (val < 0 || val > 50) {
      toast.error("Platform fee must be between 0 and 50");
      return;
    }

    setPendingPlanId(planId);
    setIsPasswordOpen(true);
  };

  const confirmSave = async (password: string) => {
    if (pendingPlanId) {
      updatePlanMutation.mutate({
        id: pendingPlanId,
        commissionRate: commissionValue,
        password,
      });
    }
  };

  if (isLoading)
    return (
      <div className="p-4 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Platform Fees</CardTitle>
        <CardDescription>
          Manage the percentage fee deducted from provider bookings per
          subscription plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>Booking Platform Fee</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans?.map((plan: any) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{plan.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {plan.price === 0 ? "Free" : `₹${plan.price}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{plan.interval}</TableCell>
                <TableCell>
                  {editingId === plan.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        className="w-20"
                        value={commissionValue}
                        onChange={(e) => setCommissionValue(e.target.value)}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  ) : (
                    <span className="font-semibold text-green-700">
                      {plan.commissionRate !== undefined
                        ? plan.commissionRate
                        : 10}
                      %
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === plan.id ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                        title="Cancel">
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() => handleSaveRequest(plan.id)}
                        disabled={updatePlanMutation.isPending}
                        title="Save">
                        {updatePlanMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(plan)}>
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!plans?.length && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground">
                  No plans found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <PasswordConfirmDialog
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        onConfirm={confirmSave}
        title="Confirm Fee Update"
        description="This will change the platform fee percentage for all providers on this plan for future bookings."
      />
    </Card>
  );
}
