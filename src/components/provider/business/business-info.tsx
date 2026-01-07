"use client";

/* ---------------- IMPORTS ---------------- */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import "rsuite/dist/rsuite-no-reset.min.css";

import {
  Pencil,
  Trash2,
  Mail,
  Phone,
  Globe,
  Clock,
  Loader2,
  PlusCircle,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimePicker } from "rsuite";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import ManageBusinessSkeleton from "./businessSkeleton";

/* ---------------- REUSABLE ---------------- */
function LabelAndValue({ label, value, icon: Icon }: any) {
  return (
    <div className="p-4 border rounded-md bg-gray-50 space-y-1">
      <div className="flex items-center gap-2 text-gray-600">
        {Icon && <Icon className="w-4 h-4" />}
        <Label>{label}</Label>
      </div>
      <p className="text-gray-900">{value || "-"}</p>
    </div>
  );
}

/* ---------------- SLOT CARD ---------------- */
function SlotCard({ slot, onDelete, isDeleting }: any) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-md bg-gray-50">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span>{slot.time}</span>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={() => onDelete(slot)}
        disabled={isDeleting}>
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4 text-red-600" />
        )}
      </Button>
    </div>
  );
}

/* ---------------- EDIT BUSINESS ---------------- */
function EditBusinessDialog({
  open,
  onOpenChange,
  business,
  onSave,
  isSaving,
}: any) {
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
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            placeholder="Business Name"
            disabled={isSaving}
          />

          <Input
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            placeholder="Email"
            disabled={isSaving}
          />

          <Input
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            placeholder="Phone"
            disabled={isSaving}
          />

          <Input
            value={form.websiteURL || ""}
            onChange={(e) => setForm({ ...form, websiteURL: e.target.value })}
            placeholder="Website"
            disabled={isSaving}
          />
        </div>

        <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="flex-1">
              Cancel
            </Button>

            <Button
              onClick={() => onSave(form)}
              disabled={isSaving}
              className="flex-1">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- CREATE SLOT ---------------- */
function CreateSlotDialog({
  open,
  onOpenChange,
  onSave,
  isSaving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { time: string }) => void;
  isSaving: boolean;
}) {
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (!open) return;

    setSelectedTime("");

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    let h: number | string = date.getHours();
    const m = date.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h.toString().padStart(2, "0")}:${m} ${ampm}`;
  };

  const handleSave = () => {
    if (!selectedTime) {
      toast.error("Please select a time slot");
      return;
    }
    onSave({ time: selectedTime });
  };

  const Required = () => <span className="text-red-500">*</span>;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[40]"
        />
      )}

      <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
        <DialogContent className="max-w-md z-[50]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add New Time Slot
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4 overflow-visible">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select Time <Required />
              </Label>

              <TimePicker
                format="hh:mm aa"
                showMeridiem
                container={() => document.body}
                style={{ width: "100%" }}
                placeholder="Select time"
                value={
                  selectedTime ? new Date(`1970-01-01 ${selectedTime}`) : null
                }
                onChange={(date) => setSelectedTime(formatTime(date))}
                onClean={() => setSelectedTime("")}
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-700">
                <span className="font-medium">Note:</span> This slot will be
                available for customers to book appointments.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="flex-1">
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving || !selectedTime}
              className="flex-1">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Slot
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ---------------- DELETE CONFIRM ---------------- */
function DeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isDeleting,
}: any) {
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
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
      <style jsx global>{`
        .rs-picker-popup {
          z-index: 9999 !important;
          pointer-events: auto !important;
        }

        .rs-picker-menu {
          max-height: 260px;
          overflow-y: auto !important;
        }
      `}</style>
    </Dialog>
  );
}

/* ---------------- PAGE ---------------- */
export default function BusinessInfo() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editBusinessOpen, setEditBusinessOpen] = useState(false);
  const [createSlotOpen, setCreateSlotOpen] = useState(false);
  const [deleteSlotOpen, setDeleteSlotOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["provider-business"],
    queryFn: async () => {
      const res = await fetch("/api/provider/business");
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  const editBusiness = useMutation({
    mutationFn: async (payload: any) => {
      await fetch("/api/provider/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-business"] });
      toast.success("Business updated");
      setEditBusinessOpen(false);
    },
  });

  const deleteSlot = useMutation({
    mutationFn: async (id: string) => {
      await fetch("/api/provider/slots", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-business"] });
      toast.success("Slot deleted");
      setDeleteSlotOpen(false);
      setSelectedSlot(null);
    },
  });

  const deleteBusiness = useMutation({
    mutationFn: async () => {
      const sure = confirm(
        "This will permanently delete your business and account. Continue?"
      );
      if (!sure) throw new Error("Cancelled");
      await fetch("/api/provider/business", { method: "DELETE" });
    },
    onSuccess: () => {
      toast.success("Business deleted");
      router.push("/provider/dashboard");
    },
  });

  const createSlot = useMutation({
    mutationFn: async (data: { time: string }) => {
      const res = await fetch("/api/provider/slots/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create slot");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-business"] });
      toast.success("Slot created successfully");
      setCreateSlotOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create slot");
    },
  });

  if (isLoading) return <ManageBusinessSkeleton />;
  if (!data?.business) return <p className="p-10">No business found</p>;

  const { business, category, slots = [] } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-10 px-4 md:px-2">
      <h1 className="text-3xl font-bold">Manage Business Profile</h1>

      {/* BUSINESS DETAILS */}
      <section className="bg-white sm:p-6 sm:border rounded-md space-y-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Business Details</h2>
          <Button onClick={() => setEditBusinessOpen(true)}>
            <Pencil className="w-4 h-4 mr-1" /> Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelAndValue label="Name" value={business.businessName} />
          <LabelAndValue
            icon={Mail}
            label="Email"
            value={business.contactEmail}
          />
          <LabelAndValue
            icon={Phone}
            label="Phone"
            value={business.phoneNumber}
          />
          <LabelAndValue
            icon={Globe}
            label="Website"
            value={business.websiteURL}
          />
          <LabelAndValue label="Category" value={category?.name} />
        </div>
      </section>

      {/* SLOTS */}
      <section className="bg-white sm:p-6 sm:border rounded-md space-y-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Time Slots</h2>
          <Button onClick={() => setCreateSlotOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-1" /> Add New Slot
          </Button>
        </div>

        <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-4">
          {slots.map((slot: any) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              isDeleting={deleteSlot.isPending && selectedSlot?.id === slot.id}
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
        isSaving={editBusiness.isPending}
      />

      <CreateSlotDialog
        open={createSlotOpen}
        onOpenChange={setCreateSlotOpen}
        onSave={(data) => createSlot.mutate(data)}
        isSaving={createSlot.isPending}
      />

      <DeleteDialog
        open={deleteSlotOpen}
        onOpenChange={setDeleteSlotOpen}
        title="Delete Slot?"
        description="This action cannot be undone."
        onConfirm={() => selectedSlot && deleteSlot.mutate(selectedSlot.id)}
        isDeleting={deleteSlot.isPending}
      />

       {/* DELETE BUSINESS */}
      <Button
        variant="destructive"
        className="mb-6"
        onClick={() => deleteBusiness.mutate()}
        disabled={deleteBusiness.isPending}
      >
        {deleteBusiness.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Delete Business
      </Button>
    </div>
  );
}
