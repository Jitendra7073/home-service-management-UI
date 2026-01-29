"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, Plus, X, ArrowLeft } from "lucide-react";
import { PasswordConfirmDialog } from "@/components/admin/password-confirm-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import { AVAILABLE_ANALYSIS, AVAILABLE_CHART } from "@/lib/plan-features";
import Link from "next/link";

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

export function PlanForm({ initialData }: { initialData?: Plan }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPasswordConfirmOpen, setIsPasswordConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    interval: "month",
    trialPeriodDays: "0",
    isActive: true,
    maxServices: "5",
    maxBookings: "100",
    benefits: [] as string[],
    allowedRoutes: [] as string[],
    allowedGraphs: [] as string[],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price.toString(),
        interval: initialData.interval,
        trialPeriodDays: initialData.trialPeriodDays?.toString() || "0",
        isActive: initialData.isActive,
        maxServices: initialData.maxServices?.toString() || "5",
        maxBookings: initialData.maxBookings?.toString() || "100",
        benefits: initialData.benefits || [],
        allowedRoutes: initialData.features?.allowedRoutes || [],
        allowedGraphs: initialData.features?.allowedGraphs || [],
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
        allowedRoutes: [],
        allowedGraphs: [],
      });
    }
  }, [initialData]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || Number(formData.price) < 0) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsPasswordConfirmOpen(true);
  };

  const handleConfirmedSubmit = async (password: string) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/admin/plans/${initialData.id}`
        : "/api/admin/plans";
      const method = initialData ? "PUT" : "POST";

      const payload: any = {
        name: formData.name,
        price: Number(formData.price),
        trialPeriodDays: Number(formData.trialPeriodDays),
        password,
        maxServices: Number(formData.maxServices),
        maxBookings: Number(formData.maxBookings),
        benefits: formData.benefits.filter((b) => b.trim() !== ""),
        features: {
          allowedRoutes: formData.allowedRoutes,
          allowedGraphs: formData.allowedGraphs,
        },
      };

      if (initialData) {
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
        initialData ? "Plan updated successfully" : "Plan created successfully",
      );
      setIsPasswordConfirmOpen(false);
      router.push("/admin/plans");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
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
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/plans">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          {initialData ? "Edit Subscription Plan" : "Create New Plan"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="plan-form"
            onSubmit={handleFormSubmit}
            className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
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

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="interval">Billing Interval</Label>
                <Select
                  value={formData.interval}
                  onValueChange={(val) =>
                    setFormData({ ...formData, interval: val })
                  }
                  disabled={!!initialData}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                {initialData && (
                  <p className="text-xs text-muted-foreground">
                    Interval cannot be changed for existing plans.
                  </p>
                )}
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

            <div className="flex items-center justify-between rounded-md border p-4 shadow-sm">
              <div className="space-y-0.5">
                <Label>Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Activate or deactivate this plan. Inactive plans are hidden
                  from new users.
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

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Usage Limits</h3>
              <div className="grid grid-cols-2 gap-6">
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Plan Benefits</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBenefit}>
                  <Plus className="h-4 w-4 mr-2" /> Add Benefit
                </Button>
              </div>
              <div className="space-y-3">
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
                {formData.benefits.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No benefits added yet.
                  </p>
                )}
              </div>
            </div>

            <hr />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                Access Control & Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Allow Analysis</Label>
                  <MultiSelect
                    options={AVAILABLE_ANALYSIS}
                    selected={formData.allowedRoutes}
                    onChange={(val) =>
                      setFormData({ ...formData, allowedRoutes: val })
                    }
                    placeholder="Select allowed pages..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Which Analysis can providers with this plan access?
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Allowed Charts</Label>
                  <MultiSelect
                    options={AVAILABLE_CHART}
                    selected={formData.allowedGraphs}
                    onChange={(val) =>
                      setFormData({ ...formData, allowedGraphs: val })
                    }
                    placeholder="Select allowed graphs..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Which Charts can providers with this plan access?
                  </p>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t p-6">
          <Link href="/admin/plans">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" form="plan-form" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Plan"}
          </Button>
        </CardFooter>
      </Card>

      <PasswordConfirmDialog
        isOpen={isPasswordConfirmOpen}
        onClose={() => setIsPasswordConfirmOpen(false)}
        onConfirm={handleConfirmedSubmit}
        title="Confirm Action"
        description="Please verify your identity to modify subscription plans."
      />
    </div>
  );
}
