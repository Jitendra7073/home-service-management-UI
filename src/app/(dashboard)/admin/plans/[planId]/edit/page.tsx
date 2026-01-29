"use client";

import { use, useEffect, useState } from "react";
import { PlanForm } from "@/components/admin/plans/plan-form";
import { toast } from "sonner";
import { PlanFormSkeleton } from "@/components/skeletons/admin-skeletons";

export default function EditPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = use(params);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch("/api/admin/plans", { cache: "no-store" });
        const data = await res.json();

        if (data.success) {
          const found = data.data.find((p: any) => p.id === planId);
          if (found) {
            setPlan(found);
          } else {
            toast.error("Plan not found");
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load plan details");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  if (loading) {
    return <PlanFormSkeleton />;
  }
  if (!plan) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Plan not found</h2>
        <p className="text-muted-foreground">
          The plan you are looking for does not exist.
        </p>
      </div>
    );
  }

  return <PlanForm initialData={plan} />;
}
