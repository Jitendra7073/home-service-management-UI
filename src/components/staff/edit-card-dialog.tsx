"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Edit, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Card validation schema
const cardSchema = z
  .object({
    cardholderName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),
    expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Invalid month"),
    expiryYear: z.string().min(4).max(4),
    cardType: z.enum(["visa", "mastercard", "amex", "discover", "rupay"]),
  })
  .refine(
    (data) => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const cardYear = parseInt(data.expiryYear);
      const cardMonth = parseInt(data.expiryMonth);

      if (cardYear < currentYear) return false;
      if (cardYear === currentYear && cardMonth < currentMonth) return false;
      return true;
    },
    {
      message: "Card has expired or invalid expiry date",
      path: ["expiryYear"],
    },
  );

interface EditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: {
    id: string;
    cardholderName: string;
    lastFourDigits: string;
    expiryMonth: number;
    expiryYear: number;
    cardType: string;
    isDefault: boolean;
  };
  onSuccess: () => void;
}

export function EditCardDialog({
  open,
  onOpenChange,
  card,
  onSuccess,
}: EditCardDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardholderName: card.cardholderName,
      expiryMonth: String(card.expiryMonth).padStart(2, "0"),
      expiryYear: String(card.expiryYear),
      cardType: card.cardType as
        | "visa"
        | "mastercard"
        | "amex"
        | "discover"
        | "rupay",
    },
  });

  const onSubmit = async (values: z.infer<typeof cardSchema>) => {
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/common/cards/${card.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardholderName: values.cardholderName,
          expiryMonth: parseInt(values.expiryMonth, 10),
          expiryYear: parseInt(values.expiryYear, 10),
          cardType: values.cardType,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.msg || "Failed to update card");
        return;
      }

      toast.success("Card details updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["staff-cards"] });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Edit Card Details</DialogTitle>
              <DialogDescription>
                Update card information ending in {card.lastFourDigits}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Cardholder Name */}
            <FormField
              control={form.control}
              name="cardholderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Card Type (Read-only) */}
            <FormField
              control={form.control}
              name="cardType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="visa">Visa</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                      <SelectItem value="amex">American Express</SelectItem>
                      <SelectItem value="discover">Discover</SelectItem>
                      <SelectItem value="rupay">RuPay</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expiry Date */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Month *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem
                            key={i + 1}
                            value={String(i + 1).padStart(2, "0")}>
                            {String(i + 1).padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Year *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <CreditCard className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800">
                Card number and CVV cannot be modified for security reasons.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
