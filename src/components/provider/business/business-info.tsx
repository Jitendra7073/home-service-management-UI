"use client";

/* 
   IMPORTS
    */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Pencil,
  Trash2,
  Mail,
  Phone,
  Globe,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import ManageBusinessSkeleton from "./businessSkeleton";

const BUSINESS_QUERY_KEY = ["provider-business"];

function LabelAndValue({ label, value, icon: Icon }: any) {
  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-1">
      <div className="flex items-center gap-2 text-gray-600">
        {Icon && <Icon className="w-4 h-4" />}
        <Label>{label}</Label>
      </div>
      <p className="text-gray-900">{value || "-"}</p>
    </div>
  );
}

function SlotCard({ slot, onDelete }: any) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span>{slot.time}</span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onDelete(slot)}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    </div>
  );
}

// EDIT BUSINESS
function EditBusinessDialog({ open, onOpenChange, business, onSave }: any) {
  const [form, setForm] = useState(business);

  useEffect(() => {
    setForm(business);
  }, [business]);

  if (!business) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Business</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={form.businessName}
            onChange={(e) =>
              setForm({ ...form, businessName: e.target.value })
            }
            placeholder="Business Name"
          />

          <Input
            value={form.contactEmail}
            onChange={(e) =>
              setForm({ ...form, contactEmail: e.target.value })
            }
            placeholder="Email"
          />

          <Input
            value={form.phoneNumber}
            onChange={(e) =>
              setForm({ ...form, phoneNumber: e.target.value })
            }
            placeholder="Phone"
          />

          <Input
            value={form.websiteURL || ""}
            onChange={(e) =>
              setForm({ ...form, websiteURL: e.target.value })
            }
            placeholder="Website"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(form)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
// DELETE CONFIRMATION
function DeleteDialog({ open, onOpenChange, title, description, onConfirm }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function BusinessInfo() {
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ---------------- FETCH ---------------- */
  const { data, isLoading } = useQuery({
    queryKey: BUSINESS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/provider/business");
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  /* ---------------- MUTATIONS ---------------- */

  const editBusiness = useMutation({
    mutationFn: async (payload: any) => {
      await fetch("/api/provider/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(BUSINESS_QUERY_KEY);
      toast.success("Business updated");
      setEditBusinessOpen(false);
    },
  });

  const deleteSlot = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/provider/slots`, { method: "DELETE", body: JSON.stringify({ id }) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(BUSINESS_QUERY_KEY);
      toast.success("Slot deleted");
      setDeleteSlotOpen(false);
      setSelectedSlot(null);
    },
  });

  const deleteBusiness = useMutation({
    mutationFn: async () => {
      const sure = confirm("Are you sure want to delete you business this action must not undone and delete you account premanently!\nDo you want to DELETE your account ?")
      if (!sure) return;
      await fetch("/api/provider/business", { method: "DELETE" });
      toast.success("Business deleted");
    },
    onSuccess: () => {
      router.push("/provider/dashboard");
    },
  });

  const [editBusinessOpen, setEditBusinessOpen] = useState(false);
  const [deleteSlotOpen, setDeleteSlotOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  if (isLoading) return <ManageBusinessSkeleton/>;
  if (!data?.business) return <p className="p-10">No business found</p>;

  const { business, category, slots = [] } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">Manage Business Profile</h1>

      <section className="bg-white sm:p-6 sm:border rounded-lg space-y-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Business Details</h2>
          <Button onClick={() => setEditBusinessOpen(true)}>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelAndValue label="Name" value={business.businessName} />
          <LabelAndValue icon={Mail} label="Email" value={business.contactEmail} />
          <LabelAndValue icon={Phone} label="Phone" value={business.phoneNumber} />
          <LabelAndValue icon={Globe} label="Website" value={business.websiteURL} />
          <LabelAndValue label="Category" value={category?.name} />
        </div>
      </section>

      <section className="bg-white sm:p-6 sm:border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Time Slots</h2>

        <div className="grid grid-colo-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.isArray(slots) &&
            slots.map((slot: any) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                onDelete={(s: any) => {
                  setSelectedSlot(s);
                  setDeleteSlotOpen(true);
                }}
              />
            ))}
        </div>
      </section>

      <EditBusinessDialog
        open={editBusinessOpen}
        onOpenChange={setEditBusinessOpen}
        business={business}
        onSave={(data: any) => editBusiness.mutate(data)}
      />

      <DeleteDialog
        open={deleteSlotOpen}
        onOpenChange={setDeleteSlotOpen}
        title="Delete Slot?"
        description="Are you sure to delete this slot because this action can't be undone!"
        onConfirm={() => {
          if (!selectedSlot) return;
          deleteSlot.mutate(selectedSlot.id);
        }}
      />

      <Button
        variant="destructive"
        className="mb-6"
        onClick={() => deleteBusiness.mutate()}
      >
        Delete Business
      </Button>
    </div>
  );
}
