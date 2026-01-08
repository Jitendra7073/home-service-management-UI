"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle, Info, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BusinessStatusBannerProps {
  business: {
    isApproved: boolean;
    isRejected: boolean;
    isRestricted: boolean;
    isActive: boolean;
    rejectionReason?: string;
    restrictionReason?: string;
  };
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function BusinessStatusBanner({ business }: BusinessStatusBannerProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestUnrestrict = async () => {
    if (!requestMessage.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/provider/request-unrestrict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: requestMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to submit request");

      toast.success("Request submitted successfully to admin");
      setIsDialogOpen(false);
      setRequestMessage("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPublished =
    business.isActive &&
    !business.isRestricted &&
    business.isApproved &&
    !business.isRejected;

  if (business.isRestricted) {
    return (
      <Alert
        variant="destructive"
        className="mb-4 border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive">
        <Ban className="h-4 w-4" />
        <AlertTitle>Business Restricted</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            Your business has been restricted.{" "}
            {business.restrictionReason &&
              `Reason: ${business.restrictionReason}`}
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-background text-destructive hover:bg-background/90">
                Request Access
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Request to Remove Restriction</DialogTitle>
                <DialogDescription>
                  Please explain why your restriction should be lifted. The
                  admin will review your request.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="message">Message to Admin</Label>
                  <Textarea
                    id="message"
                    placeholder="E.g., I have updated my business documents..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleRequestUnrestrict}
                  disabled={isSubmitting || !requestMessage.trim()}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </AlertDescription>
      </Alert>
    );
  }

  if (business.isRejected) {
    return (
      <Alert
        variant="destructive"
        className="mb-4 border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Application Rejected</AlertTitle>
        <AlertDescription>
          Your business application was rejected.{" "}
          {business.rejectionReason && `Reason: ${business.rejectionReason}`}
          <br />
          Please update your business details and re-submit (contact support if
          needed).
        </AlertDescription>
      </Alert>
    );
  }

  if (!business.isApproved) {
    return (
      <Alert className="mb-4 border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:border-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-200">
        <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertTitle className="text-yellow-800 dark:text-yellow-300">
          Approval Pending
        </AlertTitle>
        <AlertDescription>
          Your business is currently under review. It will not be visible to
          customers until approved by an administrator.
        </AlertDescription>
      </Alert>
    );
  }

  if (isPublished) {
    return (
      <Alert className="mb-4 border-emerald-500/50 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-200">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <AlertTitle className="text-emerald-800 dark:text-emerald-300">
          Published
        </AlertTitle>
        <AlertDescription>
          Your business is live and visible to customers.
        </AlertDescription>
      </Alert>
    );
  }

  if (!business.isActive) {
    return (
      <Alert className="mb-4 border-slate-500/50 bg-slate-50 text-slate-900 dark:border-slate-500 dark:bg-slate-900/20 dark:text-slate-200">
        <Info className="h-4 w-4" />
        <AlertTitle>Inactive</AlertTitle>
        <AlertDescription>
          Your business is currently inactive and hidden from customers. Go to
          settings to activate it.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
