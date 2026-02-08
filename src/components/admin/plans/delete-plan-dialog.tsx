"use client";

import { useState } from "react";
import { PasswordConfirmDialog } from "@/components/admin/password-confirm-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

interface DeletePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  allPlans: any[];
  onSuccess: () => void;
}

export function DeletePlanDialog({
  isOpen,
  onClose,
  plan,
  allPlans,
  onSuccess,
}: DeletePlanDialogProps) {
  const [needsMigration, setNeedsMigration] = useState(false);
  const [migrateTo, setMigrateTo] = useState("");
  const [subscriberCount, setSubscriberCount] = useState(0);

  const availablePlans = allPlans.filter((p) => p.id !== plan?.id);

  const handleConfirm = async (password: string) => {
    if (needsMigration && !migrateTo) {
      toast.error("Please select a plan to migrate users to.");
      throw new Error("Migration plan required");
    }

    try {
      const res = await fetch(`/api/admin/plans/${plan.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          migrateToPlanId: needsMigration ? migrateTo : undefined,
        }),
      });

      const data = await res.json();

      if (res.status === 409 && data.data?.count) {
        setNeedsMigration(true);
        setSubscriberCount(data.data.count);
        toast.warning(`Action Blocked: This plan has active subscribers.`);
        // We throw to stop the loading state in the dialog and allow user to retry with migration
        throw new Error("Migration required");
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete plan");
      }

      toast.success("Plan deleted successfully");
      onSuccess();
      handleClose();
    } catch (error: any) {
      // If it's our controlled error, we already toasted or handled state
      if (error.message !== "Migration required") {
        console.error(error);
        toast.error(error.message);
      }
      throw error; // Propagate to stop loading spinner
    }
  };

  const handleClose = () => {
    setNeedsMigration(false);
    setMigrateTo("");
    setSubscriberCount(0);
    onClose();
  };

  return (
    <PasswordConfirmDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={
        needsMigration
          ? `Migrate & Delete: ${plan?.name}`
          : `Delete Plan: ${plan?.name}`
      }
      description={
        needsMigration
          ? "Please select a plan to migrate existing subscribers to before deleting."
          : "This action cannot be undone. Are you sure you want to delete this plan?"
      }>
      {needsMigration && (
        <div className="rounded-sm bg-amber-50 p-3 text-sm text-amber-800 border border-amber-200 mb-4">
          <div className="flex items-center gap-2 mb-2 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            Active Subscribers Found
          </div>
          <p className="mb-3">
            This plan has <strong>{subscriberCount}</strong> subscribers. You
            cannot delete it without migrating them.
          </p>

          <div className="space-y-1">
            <Label className="text-amber-900">Migrate Users To:</Label>
            <Select value={migrateTo} onValueChange={setMigrateTo}>
              <SelectTrigger className="bg-white border-amber-300 focus:ring-amber-500">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {availablePlans.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.interval})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </PasswordConfirmDialog>
  );
}
