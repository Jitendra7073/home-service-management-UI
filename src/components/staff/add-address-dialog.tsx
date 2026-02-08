"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import AddAddressForm from "@/components/customer/cart/addressForm";
import { Button } from "@/components/ui/button";

interface StaffAddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function StaffAddAddressDialog({
  open,
  onOpenChange,
  onSuccess,
}: StaffAddAddressDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    setIsSubmitting(false);
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-sm">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>Enter your address details</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <AddAddressForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
