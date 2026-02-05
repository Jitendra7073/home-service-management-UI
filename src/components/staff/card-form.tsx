"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card as CardComponent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Card validation schema
const cardSchema = z
  .object({
    cardNumber: z
      .string()
      .min(13, "Card number must be at least 13 digits")
      .max(19, "Card number must not exceed 19 digits")
      .regex(
        /^[0-9\s-]+$/,
        "Card number can only contain digits, spaces, and dashes",
      ),
    cardholderName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),
    expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Invalid month"),
    expiryYear: z.string().min(4).max(4),
    cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
    cardType: z.enum(["visa", "mastercard", "amex", "discover", "rupay"]),
    isDefault: z.boolean(),
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

// Luhn algorithm for card validation
function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/[\s-]/g, "");
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Detect card type
function detectCardType(cardNumber: string): string {
  const cleaned = cardNumber.replace(/[\s-]/g, "");

  if (/^4/.test(cleaned)) return "visa";
  if (/^5[1-5]/.test(cleaned) || /^2[2-7][2-2][0-1]/.test(cleaned))
    return "mastercard";
  if (/^3[47]/.test(cleaned)) return "amex";
  if (/^6011|^65\d{2}/.test(cleaned) || /^6[4-9]\d{2}/.test(cleaned))
    return "discover";
  if (/^(60|65|81|82|508|353|356)/.test(cleaned)) return "rupay";

  return "unknown";
}

interface StaffCardFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StaffCardForm({ onSuccess, onCancel }: StaffCardFormProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardType: "visa",
      isDefault: false,
    },
  });

  // Card type configuration
  const CARD_TYPE_CONFIG = {
    visa: {
      color: "from-blue-500 to-blue-600",
      text: "VISA",
      icon: "💳",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    mastercard: {
      color: "from-orange-500 to-orange-600",
      text: "MASTERCARD",
      icon: "💳",
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
    amex: {
      color: "from-green-500 to-green-600",
      text: "AMEX",
      icon: "💳",
      gradient: "bg-gradient-to-br from-green-500 to-green-600",
    },
    discover: {
      color: "from-purple-500 to-purple-600",
      text: "DISCOVER",
      icon: "💳",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    rupay: {
      color: "from-indigo-500 to-indigo-600",
      text: "RUPAY",
      icon: "💳",
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    },
    unknown: {
      color: "from-gray-400 to-gray-500",
      text: "CARD",
      icon: "💳",
      gradient: "bg-gradient-to-br from-gray-400 to-gray-500",
    },
  };

  const detectedCardType = detectCardType(
    cardNumber,
  ) as keyof typeof CARD_TYPE_CONFIG;
  const cardConfig =
    CARD_TYPE_CONFIG[detectedCardType] || CARD_TYPE_CONFIG.unknown;

  const onSubmit = async (values: z.infer<typeof cardSchema>) => {
    // Validate card number with Luhn algorithm
    if (!validateCardNumber(values.cardNumber)) {
      form.setError("cardNumber", {
        type: "manual",
        message: "Invalid card number",
      });
      return;
    }

    // Detect card type
    const detectedType = detectCardType(values.cardNumber);
    if (detectedType === "unknown") {
      form.setError("cardNumber", {
        type: "manual",
        message: "Unsupported card type",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/common/cards", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardNumber: values.cardNumber.replace(/[\s-]/g, ""),
          cardholderName: values.cardholderName,
          expiryMonth: parseInt(values.expiryMonth, 10),
          expiryYear: parseInt(values.expiryYear, 10),
          cvv: values.cvv,
          cardType: detectedType,
          isDefault: values.isDefault,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.msg || "Failed to save card details");
        return;
      }

      toast.success("Card details saved successfully!");
      form.reset();
      setCardNumber("");
      queryClient.invalidateQueries({ queryKey: ["staff-cards"] });
      queryClient.invalidateQueries({ queryKey: ["staff-profile-completion"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error saving card:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // Max 19 digits
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  const expiryMonth = form.watch("expiryMonth");
  const expiryYear = form.watch("expiryYear");

  return (
    <CardComponent>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          <CardTitle>Add Card Details</CardTitle>
        </div>
        <CardDescription>
          Your card details are encrypted and stored securely. We never store
          your CVV.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Live Card Preview */}
          <div className="order-1 lg:order-1">
            <div className="sticky top-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Card Preview
              </h3>
              <div
                className={`w-full h-44 rounded-xl bg-gradient-to-br ${cardConfig.color} p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-lg`}>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-15 rounded-full -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16" />

                {/* Card Content */}
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="text-sm opacity-90 mb-2">
                      {cardConfig.icon}
                    </div>
                    <div className="font-mono text-xl tracking-wider">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {cardConfig.text}
                  </Badge>
                </div>

                <div className="relative z-10">
                  <div className="text-sm opacity-90 font-medium">
                    {cardholderName || "Cardholder Name"}
                  </div>
                  <div className="text-xs mt-1 opacity-80">
                    {expiryMonth && expiryYear
                      ? `${expiryMonth}/${String(expiryYear).slice(2)}`
                      : "MM/YY"}
                  </div>
                </div>
              </div>

              {/* Detected Card Type Badge */}
              {detectedCardType !== "unknown" && cardNumber && (
                <div className="mt-3 flex items-center justify-center p-2 bg-green-50 border border-green-200 rounded-lg">
                  <CreditCard className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-xs text-green-800 font-medium">
                    {cardConfig.text} card detected
                  </span>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800">
                  Your card details are encrypted with AES-256 encryption and
                  stored securely. We never display your full card number.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form Fields */}
          <div className="order-2 lg:order-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4">
                {/* Card Number */}
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="text-base"
                          value={cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            setCardNumber(formatted);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cardholder Name */}
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="text-base"
                          {...field}
                          onChange={(e) => {
                            setCardholderName(e.target.value);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Card Type - Hidden, auto-detected */}
                <FormField
                  control={form.control}
                  name="cardType"
                  render={({ field }) => <input type="hidden" {...field} />}
                />

                {/* Expiry Date & CVV */}
                <div className="grid grid-cols-3 gap-4">
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
                                {String(year).slice(2)}
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
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="123"
                            maxLength={4}
                            className="text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Default Card Checkbox */}
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3 bg-gray-50">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          Set as default payment method
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

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
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2 w-4 h-4" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Save Card Securely
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </CardComponent>
  );
}
