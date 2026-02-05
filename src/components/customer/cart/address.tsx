"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Trash2, Plus } from "lucide-react";
import React, { useState } from "react";
import AddAddressForm from "./addressForm";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AddressProps {
  selectedAddress: string | null;
  setSelectedAddress: (id: string | null) => void;
}

const Address: React.FC<AddressProps> = ({
  selectedAddress,
  setSelectedAddress,
}) => {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const res = await fetch("/api/common/address");
      return res.json();
    },
    retry: false,
  });

  const addresses = data?.addresses ?? [];

  const deleteAddress = useMutation({
    mutationFn: async (addressId: string) => {
      const res = await fetch(`/api/common/address`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addressId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.msg || "Failed to Delete!");
      }
      if (!data.success) {
        toast.warning(data?.msg);
      }
      if (data.success) {
        toast.success(data?.msg);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
      setSelectedAddress(null);
      setDeleteId(null);
    },
  });

  const formatAddress = (addr: any) =>
    [addr.street, addr.city, addr.state, addr.postalCode, addr.country]
      .filter(Boolean)
      .join(", ");

  if (isLoading) {
    return <div className="h-24 bg-gray-100 animate-pulse rounded-md" />;
  }

  if (isError) {
    return (
      <p className="text-red-600 text-sm">
        Failed to load addresses. Please refresh.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-semibold text-gray-800">
          Select Service Address{" "}
          <span className="text-muted-foreground">({addresses.length}/5)</span>
        </h2>

        {addresses.length !== 5 && (
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Address
          </Button>
        )}
      </div>

      {addresses.length === 0 && (
        <p className="text-sm text-gray-500">
          No address found. Please add one.
        </p>
      )}

      <div
        className={`space-y-3 ${
          addresses.length > 3 && "h-[300px] overflow-y-auto"
        }`}>
        {addresses.map((addr: any) => (
          <div
            key={addr.id}
            onClick={() => setSelectedAddress(addr.id)}
            className={`flex justify-between items-start p-4 rounded-md border cursor-pointer
              ${
                selectedAddress === addr.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-800">
                  <Badge variant="outline">{addr.type}</Badge>
                </span>
              </div>

              <p className="text-sm text-gray-700">{formatAddress(addr)}</p>

              {addr.landmark && addr.landmark !== "N/A" && (
                <p className="text-xs text-gray-500 italic">
                  Landmark: {addr.landmark}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(addr.id);
              }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteId && deleteAddress.mutate(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddAddressForm onSuccess={() => setShowAddDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Address;
