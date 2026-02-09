"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Bank Account validation schema
const bankAccountSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(5, "Account number is required"),
  ifscCode: z.string().min(4, "IFSC/Routing code is required"),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  upiId: z.string().optional(),
});

interface StaffBankAccountFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultValues?: z.infer<typeof bankAccountSchema>;
  isEditing?: boolean;
}

export function StaffBankAccountForm({
  onSuccess,
  onCancel,
  defaultValues,
  isEditing = false,
}: StaffBankAccountFormProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof bankAccountSchema>>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: defaultValues || {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      upiId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof bankAccountSchema>) => {
    setIsSubmitting(true);

    try {
      const isProvider = window.location.pathname.includes("/provider/");
      const endpoint = isProvider
        ? "/api/provider/bank-account"
        : "/api/staff/bank-account";

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.msg || "Failed to save bank details");
        return;
      }

      toast.success("Bank details saved successfully!");
      if (!isEditing) {
        form.reset();
      }

      // Invalidate queries for both staff and provider to be safe
      queryClient.invalidateQueries({ queryKey: ["staff-bank-account"] });
      queryClient.invalidateQueries({ queryKey: ["provider-bank-account"] }); // if we use different keys

      onSuccess?.();
    } catch (error) {
      console.error("Error saving bank account:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <CardTitle>
            {isEditing ? "Edit Bank Details" : "Add Bank Details"}
          </CardTitle>
        </div>
        <CardDescription>
          Enter your bank account details to receive payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. HDFC Bank" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountHolderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC / Routing Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. HDFC0001234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPI ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. john@upi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Security Notice */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-sm">
              <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800">
                Your bank details are stored securely and used only for payouts.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1">
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    Saving...
                  </>
                ) : (
                  "Save Bank Details"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
