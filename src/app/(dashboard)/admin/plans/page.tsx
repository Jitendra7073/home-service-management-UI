"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminDataTable } from "@/components/admin/ui/admin-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { DeletePlanDialog } from "@/components/admin/plans/delete-plan-dialog";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  isActive: boolean;
  stripePriceId: string;
  trialPeriodDays: number;
  maxServices: number;
  maxBookings: number;
  benefits: string[];
  features?: any;
  _count?: {
    subscriptions: number;
  };
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletePlan, setDeletePlan] = useState<Plan | null>(null);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/admin/plans", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setPlans(data.data);
      } else {
        toast.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Subscription Plans
          </h2>

          <Link href="/admin/plans/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Plan
            </Button>
          </Link>
        </div>

        <AdminDataTable
          title="Manage Plans"
          columns={[
            { header: "Plan Name" },
            { header: "Price" },
            { header: "Interval" },
            { header: "Status" },
            { header: "Subscribers" },
            { header: "Actions", className: "text-right" },
          ]}
          data={plans}
          isLoading={loading}
          emptyMessage="No plans found."
          renderRow={(plan: Plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>

              <TableCell>₹{plan.price}</TableCell>

              <TableCell className="capitalize">{plan.interval}</TableCell>

              <TableCell>
                {plan.isActive ? (
                  <Badge className="bg-green-700 hover:bg-green-600 rounded-sm w-15 text-center">
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-red-700 hover:bg-red-600 rounded-sm w-15 text-center">
                    Inactive
                  </Badge>
                )}
              </TableCell>

              <TableCell>{plan._count?.subscriptions || 0}</TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/plans/${plan.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletePlan(plan)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        />
      </div>

      <DeletePlanDialog
        isOpen={!!deletePlan}
        onClose={() => setDeletePlan(null)}
        plan={deletePlan}
        allPlans={plans}
        onSuccess={() => {
          fetchPlans();
          setDeletePlan(null);
        }}
      />
    </div>
  );
}
