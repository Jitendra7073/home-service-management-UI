"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { PasswordConfirmDialog } from "@/components/admin/password-confirm-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  trialPeriodDays: number;
  isActive: boolean;
  maxServices: number;
  maxBookings: number;
  benefits: string[];
  features?: {
    allowedRoutes?: string[];
    allowedGraphs?: string[];
    [key: string]: any;
  };
}

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: Plan | null;
  onSuccess: () => void;
}

export function PlanModal({
  isOpen,
  onClose,
  plan,
  onSuccess,
}: PlanModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    interval: "month",
    trialPeriodDays: "0",
    isActive: true,
    maxServices: "5",
    maxBookings: "100",
    benefits: [] as string[],
    allowedRoutes: "",
    allowedGraphs: "",
  });
  const [isPasswordConfirmOpen, setIsPasswordConfirmOpen] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        price: plan.price.toString(),
        interval: plan.interval,
        trialPeriodDays: plan.trialPeriodDays?.toString() || "0",
        isActive: plan.isActive,
        maxServices: plan.maxServices?.toString() || "5",
        maxBookings: plan.maxBookings?.toString() || "100",
        benefits: plan.benefits || [],
        allowedRoutes: plan.features?.allowedRoutes?.join(", ") || "",
        allowedGraphs: plan.features?.allowedGraphs?.join(", ") || "",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        interval: "month",
        trialPeriodDays: "0",
        isActive: true,
        maxServices: "5",
        maxBookings: "100",
        benefits: ["Priority Support", "Basic Analytics"],
        allowedRoutes: "/dashboard, /services, /bookings",
        allowedGraphs: "revenue, bookings",
      });
    }
  }, [plan, isOpen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || Number(formData.price) <= 0) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsPasswordConfirmOpen(true);
  };

  const handleConfirmedSubmit = async (password: string) => {
    try {
      const url = plan ? `/api/admin/plans/${plan.id}` : "/api/admin/plans";
      const method = plan ? "PUT" : "POST";

      const payload: any = {
        name: formData.name,
        price: Number(formData.price),
        trialPeriodDays: Number(formData.trialPeriodDays),
        password,
        maxServices: Number(formData.maxServices),
        maxBookings: Number(formData.maxBookings),
        benefits: formData.benefits.filter((b) => b.trim() !== ""),
        features: {
          allowedRoutes: formData.allowedRoutes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          allowedGraphs: formData.allowedGraphs
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      };

      if (plan) {
        payload.isActive = formData.isActive;
      } else {
        payload.interval = formData.interval;
        payload.active = formData.isActive;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(
        plan ? "Plan updated successfully" : "Plan created successfully",
      );
      onSuccess();
      onClose();
      setIsPasswordConfirmOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      throw error;
    }
  };

  const addBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ""] });
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = [...formData.benefits];
    newBenefits.splice(index, 1);
    setFormData({ ...formData, benefits: newBenefits });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{plan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6">
            <form
              id="plan-form"
              onSubmit={handleFormSubmit}
              className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Premium Plan"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (INR)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g. 999"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interval">Billing Interval</Label>
                  <Select
                    value={formData.interval}
                    onValueChange={(val) =>
                      setFormData({ ...formData, interval: val })
                    }
                    disabled={!!plan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trialPeriodDays">Trial Period (Days)</Label>
                  <Input
                    id="trialPeriodDays"
                    type="number"
                    min="0"
                    placeholder="e.g. 7"
                    value={formData.trialPeriodDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trialPeriodDays: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-sm border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label>Active Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Activate or deactivate this plan
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(val) =>
                    setFormData({ ...formData, isActive: val })
                  }
                />
              </div>

              <hr />

              {/* Limits */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Usage Limits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxServices">
                      Max Services (-1 for unlimited)
                    </Label>
                    <Input
                      id="maxServices"
                      type="number"
                      value={formData.maxServices}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxServices: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxBookings">
                      Max Bookings/Month (-1 for unlimited)
                    </Label>
                    <Input
                      id="maxBookings"
                      type="number"
                      value={formData.maxBookings}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxBookings: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <hr />

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Plan Benefits (Displayed to User)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBenefit}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) =>
                        handleBenefitChange(index, e.target.value)
                      }
                      placeholder="e.g. 24/7 Support"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBenefit(index)}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

              <hr />

              {/* Advanced Features */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm">
                  Access Control (Comma Separated)
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="allowedRoutes">Allowed Routes/Pages</Label>
                  <Input
                    id="allowedRoutes"
                    placeholder="/dashboard, /analytics, /staff"
                    value={formData.allowedRoutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        allowedRoutes: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Endpoints or Next.js routes allowed for this plan.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedGraphs">Allowed Graphs/Tables</Label>
                  <Input
                    id="allowedGraphs"
                    placeholder="revenue_chart, bookings_table"
                    value={formData.allowedGraphs}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        allowedGraphs: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Internal identifiers for frontend widgets.
                  </p>
                </div>
              </div>
            </form>
          </ScrollArea>

          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" form="plan-form" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {plan ? "Update Plan" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PasswordConfirmDialog
        isOpen={isPasswordConfirmOpen}
        onClose={() => setIsPasswordConfirmOpen(false)}
        onConfirm={handleConfirmedSubmit}
        title="Security Verification"
        description="Please confirm your password to save changes."
      />
    </>
  );
}
