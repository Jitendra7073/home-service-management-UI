"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// ------------------------------
// Zod Schema
// ------------------------------
const BusinessSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessCategoryId: z.string().min(1, "Category is required"),
  contactEmail: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  websiteURL: z.string().url().optional().or(z.literal("")),
  socialLinks: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

type BusinessFormValues = z.infer<typeof BusinessSchema>;

export default function BusinessProfileForm({
  onNext,
}: {
  onNext: (data: BusinessFormValues) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [openSocialModal, setOpenSocialModal] = useState(false);

  // Local social profile rows
  const [socialFields, setSocialFields] = useState([
    { key: "Instagram", value: "" },
  ]);

  type SocialError = { key: string; value: string };

  const [socialErrors, setSocialErrors] = useState<SocialError[]>([]);

  // Fetch categories
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/common/businessCategories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const categories = data?.categories || [];

  // Form setup
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(BusinessSchema),
    defaultValues: {
      businessName: "",
      businessCategoryId: "",
      contactEmail: "",
      phoneNumber: "",
      websiteURL: "",
      socialLinks: [],
    },
  });

  // Add new key:value field
  const addSocialField = () => {
    setSocialFields([...socialFields, { key: "", value: "" }]);
  };

  // Validate modal fields before saving
  const validateSocialFields = () => {
    let errors = socialFields.map(() => ({ key: "", value: "" }));

    const urlMap = new Map();

    socialFields.forEach((item, index) => {
      const hasKey = item.key.trim() !== "";
      const hasValue = item.value.trim() !== "";

      // Case 1: One filled but not the other
      if (hasKey && !hasValue) errors[index].value = "URL is required";
      if (!hasKey && hasValue) errors[index].key = "Platform is required";

      // Case 2: Validate key
      if (hasKey && item.key.trim().length < 2) {
        errors[index].key = "Platform must be at least 2 characters";
      }

      // Case 3: Validate URL format only if filled
      if (hasValue) {
        try {
          new URL(item.value);
        } catch {
          errors[index].value = "Invalid URL format";
        }
      }
    });

    // Case 4: Check for duplicate URLs
    socialFields.forEach((item, index) => {
      const url = item.value.trim();

      if (url) {
        if (urlMap.has(url)) {
          const existingIndex = urlMap.get(url);

          // Mark both entries as errors
          errors[index].value = "Duplicate URL not allowed";
          errors[existingIndex].value = "Duplicate URL not allowed";
        } else {
          urlMap.set(url, index);
        }
      }
    });

    setSocialErrors(errors);

    // Ensure no field has errors
    return errors.every((e) => e.key === "" && e.value === "");
  };

  // Save modal → push into RHF form
  const saveSocialLinks = () => {
    if (!validateSocialFields()) return;

    // Remove rows where both fields are empty
    const cleaned = socialFields.filter(
      (row) => row.key.trim() !== "" && row.value.trim() !== ""
    );

    form.setValue("socialLinks", cleaned);
    setOpenSocialModal(false);
  };

  const socialLinks = form.watch("socialLinks") ?? [];

  async function onSubmit(values: BusinessFormValues) {
    try {
      setLoading(true);

      const payload: any = { ...values };

      if (!payload.websiteURL || payload.websiteURL.trim() === "") {
        delete payload.websiteURL;
      }

      if (
        Array.isArray(payload.socialLinks) &&
        payload.socialLinks.length === 0
      ) {
        delete payload.socialLinks;
      }

      const res = await fetch("/api/provider/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || "Unable to create business");
        return;
      }

      toast.success(data.msg || "Business created successfully");

      onNext(payload);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  const headerImage = "/images/p/business-profile.avif";

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md border overflow-hidden">
      {/* HEADER */}
      <div className="relative w-full h-36 sm:h-44 md:h-70">
        <img src={headerImage} className="w-full h-full object-contain" />
        <h2 className="absolute bottom-3 left-4 sm:left-6 text-lg sm:text-xl font-semibold text-black">
          Business Profile
        </h2>
      </div>

      {/* FORM */}
      <div className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Business Name */}
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>
                    Business Name <Required />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jitendra Cleaning Services"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="businessCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <Required />
                  </FormLabel>

                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        categories.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contact Email <Required />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <Required />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+91 9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website */}
            <FormField
              control={form.control}
              name="websiteURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourbusiness.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* SOCIAL LINKS MODAL */}
            <FormItem className="sm:col-span-2">
              <FormLabel>Social Profiles</FormLabel>

              <Dialog open={openSocialModal} onOpenChange={setOpenSocialModal}>
                <DialogTrigger asChild>
                  <Input
                    readOnly
                    onClick={() => setOpenSocialModal(true)}
                    className="cursor-pointer"
                    placeholder="Add your social links"
                    value={
                      socialLinks.length
                        ? socialLinks.length > 1
                          ? `${socialLinks.length} profiles added`
                          : `${socialLinks.length} profile added`
                        : "Add your social links"
                    }
                  />
                </DialogTrigger>

                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Manage Social Profiles</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 max-h-[350px] overflow-y-auto">
                    {socialFields.map((row, index) => (
                      <div key={index} className="grid grid-cols-2 gap-3">
                        {/* PLATFORM NAME */}
                        <div>
                          <Input
                            placeholder="Instagram"
                            value={row.key}
                            onChange={(e) => {
                              const newItems = [...socialFields];
                              newItems[index].key = e.target.value;
                              setSocialFields(newItems);
                            }}
                          />
                          {socialErrors[index]?.key && (
                            <p className="text-red-600 text-xs mt-1">
                              {socialErrors[index].key}
                            </p>
                          )}
                        </div>

                        {/* URL */}
                        <div>
                          <Input
                            placeholder="https://profile.com"
                            value={row.value}
                            onChange={(e) => {
                              const newItems = [...socialFields];
                              newItems[index].value = e.target.value;
                              setSocialFields(newItems);
                            }}
                          />
                          {socialErrors[index]?.value && (
                            <p className="text-red-600 text-xs mt-1">
                              {socialErrors[index].value}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSocialField}
                      className="w-full">
                      + Add More
                    </Button>
                  </div>

                  <DialogFooter>
                    <Button onClick={saveSocialLinks}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </FormItem>

            {/* SUBMIT */}
            <div className="sm:col-span-2 mt-4">
              <Button disabled={loading} type="submit" className="w-full h-12">
                {loading ? "Saving..." : "Next"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

const Required = () => {
  return <span className="text-red-400 -ml-1">*</span>;
};
