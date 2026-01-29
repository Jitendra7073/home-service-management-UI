"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface PasswordConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  title?: string;
  description?: string;
}

export function PasswordConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Please enter your password to confirm this action.",
  requireReason = false,
  children,
}: PasswordConfirmDialogProps & {
  requireReason?: boolean;
  children?: React.ReactNode;
  onConfirm: (password: string, reason?: string) => Promise<void>;
}) {
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    if (requireReason && !reason) return;

    setLoading(true);
    try {
      await onConfirm(password, requireReason ? reason : undefined);
      // Close handled by parent usually, but we reset here
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setPassword("");
      setReason("");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !loading) onClose();
      }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children && <div className="py-2">{children}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {requireReason && (
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="reason"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please enter a reason..."
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="showPassword"
                  className="text-xs text-gray-500 cursor-pointer">
                  Show
                </label>
              </div>
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoFocus={!requireReason}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!password || (requireReason && !reason) || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
