"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const AddressSchema = z.object({
  street: z.string().min(2, "Street is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  type: z.string().default("HOME"),
  landmark: z.string().optional(),
});

type AddressFormValues = z.infer<typeof AddressSchema>;

const AddressForm = ({ onNext }: { onNext: () => void }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      type: "HOME",
      landmark: "",
    },
  });

  async function onSubmit(values: AddressFormValues) {
    try {
      setLoading(true);

      const res = await fetch("/api/common/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || "Unable to create address");
        return;
      }

      toast.success(data.msg || "Address created successfully");

      // Call onNext which will handle navigation
      onNext();
    } catch (error) {
      console.error("Address error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  const mapImg = `/images/p/world.png`;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg md:shadow-md overflow-hidden sm:border">
      {/* MAP HEADER */}
      <div className="relative w-full h-70">
        <img
          src={mapImg}
          alt="Map Preview"
          className="h-full w-full object-cover"
        />
        <h2 className="absolute bottom-3 left-4 sm:left-6 text-lg sm:text-xl font-semibold text-black">
          Set Your Address
        </h2>
      </div>

      {/* FORM CONTENT */}
      <div className="p-4 sm:p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Street Address */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. MG Road, Near Park" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State / Province" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Postal Code */}
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="ZIP / Postal Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              {/* Address type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select address type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Type</SelectLabel>
                        <SelectItem value="HOME">Home</SelectItem>
                        <SelectItem value="OFFICE">Office</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Landmark */}
            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landmark (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Near ABC Mall" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NEXT BUTTON */}
            <div className="sm:col-span-2 mt-3 sm:mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base">
                <span>{loading ? "Saving..." : "Next"}</span>
                {!loading && <ArrowRight />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddressForm;
