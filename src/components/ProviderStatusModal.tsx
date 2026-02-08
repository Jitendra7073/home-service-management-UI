"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Clock } from "lucide-react";

interface ProviderStatusModalProps {
  status: "pending" | "restricted" | "rejected";
  reason?: string;
  isOpen: boolean;
}

export function ProviderStatusModal({ status, reason, isOpen }: ProviderStatusModalProps) {
  // Prevent closing by not providing onOpenChange handler to DialogContent or interacting with overlay

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md [&>button]:hidden interactive-none" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-muted">
            {status === "pending" ? (
              <Clock className="h-6 w-6 text-orange-500" />
            ) : (
              <ShieldAlert className="h-6 w-6 text-destructive" />
            )}
          </div>
          <DialogTitle className="text-center text-xl">
            {status === "pending"
              ? "Account Pending Approval"
              : status === "rejected"
                ? "Account Rejected"
                : "Account Restricted"}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {status === "pending"
              ? "Your provider account is currently under review. You will be notified once an administrator approves your account."
              : status === "rejected"
                ? "Your provider account application has been rejected."
                : "Your provider account has been restricted by an administrator."}
          </DialogDescription>
        </DialogHeader>

        {reason && (status === "restricted" || status === "rejected") && (
          <div className="bg-muted/50 p-4 rounded-sm mt-2">
            <p className="text-sm font-medium text-muted-foreground mb-1">Reason:</p>
            <p className="text-sm">{reason}</p>
          </div>
        )}

        <div className="flex justify-center mt-4">
          {/* Optional: Add a logout button or contact support if needed inside the modal, 
                but user requested 'not removable'. 
                Usually we provide a way to logout. */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
