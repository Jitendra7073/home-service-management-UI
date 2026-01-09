"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ImageUploader } from "./ImageUpload";
import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinary";
import { ServiceFormData, UploadedImage } from "./types";
import { Loader2 } from "lucide-react";
import { useAtom } from "jotai";
import { ServiceModelState } from "@/global-states/state";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const MAX_GALLERY_IMAGES = 10;

const INITIAL_FORM: ServiceFormData = {
  name: "",
  description: "",
  durationInMinutes: 0,
  price: 0,
  totalBookingAllow: 0,
  currency: "INR",
  isActive: true,
};

// Require field symbol
const RequireField = () => {
  return <span className="text-red-500 -ml-1">*</span>;
};

export default function AddServiceModal() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ServiceFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coverImage, setCoverImage] = useState<UploadedImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);
  const [open, setOpen] = useAtom(ServiceModelState);

  const onClose = () => {
    setOpen(false);
  };

  /* VALIDATION */
  const validateForm = () => {
    const e: Record<string, string> = {};
    if (form.name.length < 5) e.name = "Minimum 5 characters required";
    if (form.description.length < 10) e.description = "Min 10 chars required";
    if (form.durationInMinutes <= 0)
      e.durationInMinutes = "Enter a valid duration";
    if (form.totalBookingAllow <= 0)
      e.totalBookingAllow = "Enter a valid number.";
    if (form.price <= 0) e.price = "Enter a valid price";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) return "Invalid file type";
    if (file.size > MAX_FILE_SIZE) return "File too large (Max 5MB)";
    return null;
  };

  /* IMAGE HANDLERS */
  const handleUpload = async (
    files: FileList,
    targetState: "cover" | "gallery"
  ) => {
    const fileArray = Array.from(files);

    if (
      targetState === "gallery" &&
      galleryImages.length + fileArray.length > MAX_GALLERY_IMAGES
    ) {
      toast.error(`Maximum ${MAX_GALLERY_IMAGES} images allowed`);
      return;
    }

    const newImages: UploadedImage[] = fileArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
      progress: 0,
    }));

    if (targetState === "cover") {
      setCoverImage(newImages);
    } else {
      setGalleryImages((prev) => [...prev, ...newImages]);
    }

    newImages.forEach(async (imgObj) => {
      const error = validateFile(imgObj.file!);
      if (error) {
        updateImageState(targetState, imgObj.preview, {
          uploading: false,
          error,
        });
        return;
      }

      try {
        const { url, publicId } = await uploadToCloudinary(
          imgObj.file!,
          (p: any) => {
            updateImageState(targetState, imgObj.preview, { progress: p });
          }
        );

        updateImageState(targetState, imgObj.preview, {
          uploading: false,
          url,
          publicId,
        });
      } catch (err) {
        updateImageState(targetState, imgObj.preview, {
          uploading: false,
          error: "Upload failed",
        });
      }
    });
  };

  const updateImageState = (
    target: "cover" | "gallery",
    previewUrl: string,
    updates: Partial<UploadedImage>
  ) => {
    const setter = target === "cover" ? setCoverImage : setGalleryImages;
    setter((prev) =>
      prev.map((img) =>
        img.preview === previewUrl ? { ...img, ...updates } : img
      )
    );
  };

  const handleRemoveImage = async (
    target: "cover" | "gallery",
    index: number
  ) => {
    const images = target === "cover" ? coverImage : galleryImages;
    const imageToRemove = images[index];

    if (imageToRemove.publicId) {
      await deleteFromCloudinary(imageToRemove.publicId);
    }

    URL.revokeObjectURL(imageToRemove.preview);

    const setter = target === "cover" ? setCoverImage : setGalleryImages;
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  /* CLEANUP LOGIC */
  const handleCleanupAndClose = async () => {
    const allImages = [...coverImage, ...galleryImages];
    const uploadedImages = allImages.filter((img) => img.publicId);

    if (uploadedImages.length > 0) {
      toast.info("Cleaning up uploaded files...");
      await Promise.all(
        uploadedImages.map((img) => deleteFromCloudinary(img.publicId!))
      );
    }
    resetForm();
    onClose();
  };

  const resetForm = () => {
    [...coverImage, ...galleryImages].forEach((img) =>
      URL.revokeObjectURL(img.preview)
    );

    setForm(INITIAL_FORM);
    setCoverImage([]);
    setGalleryImages([]);
    setErrors({});
    setLoading(false);
  };

  /* SUBMIT */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const allImgs = [...coverImage, ...galleryImages];
    if (allImgs.some((i) => i.uploading))
      return toast.error("Wait for uploads to finish");
    if (allImgs.some((i) => i.error))
      return toast.error("Remove failed uploads first");

    try {
      setLoading(true);

      const payload = {
        ...form,
        coverImage: coverImage[0]?.url || null,
        images: galleryImages.map((i) => i.url),
      };

      const res = await fetch("/api/provider/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.msg);
        return;
      }
      if (data.success === false) {
        toast.warning(data?.msg);
      }
      if (data.success === true) {
        toast.success(data?.msg || "Service created successfully");
      }

      resetForm(); // Normal reset, don't delete images
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && handleCleanupAndClose()}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>

        {/* <div className="flex items-center justify-between border p-3 rounded-md">
          <Label>Service Active Status</Label>
          <Switch
            checked={form.isActive}
            onCheckedChange={(v) => setForm({ ...form, isActive: v })}
          />
        </div> */}

        <ImageUploader
          label="Cover Image"
          single
          images={coverImage}
          onSelect={(files: any) => handleUpload(files, "cover")}
          onRemove={(i: any) => handleRemoveImage("cover", i)}
        />

        <ImageUploader
          label={`Gallery Images (Max ${MAX_GALLERY_IMAGES})`}
          images={galleryImages}
          onSelect={(files: any) => handleUpload(files, "gallery")}
          onRemove={(i: any) => handleRemoveImage("gallery", i)}
        />

        <div className="space-y-4">
          <Field label="Service Name" error={errors.name} required>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. AC Repair"
            />
          </Field>

          <Field label="Description" error={errors.description} required>
            <div className="relative">
              <Textarea
                value={form.description}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 200) {
                    setForm({ ...form, description: val });
                  }
                }}
                rows={4}
                placeholder="Details about the service... (Max 200 characters)"
              />
              <div
                className={`text-xs text-right mt-1 ${
                  form.description.length >= 200
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}>
                {form.description.length}/200 characters
              </div>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price" error={errors.price} required>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </Field>
            <Field
              label="Max customers per slot"
              error={errors.totalBookingAllow}
              required>
              <Input
                type="number"
                value={form.totalBookingAllow}
                onChange={(e) =>
                  setForm({
                    ...form,
                    totalBookingAllow: Number(e.target.value),
                  })
                }
              />
            </Field>
          </div>

          <div className="grid grid-col-1 md:grid-cols-2 gap-4">
            <Field
              label="Estimated Timeline"
              error={errors.durationInMinutes}
              required>
              <Input
                type="number"
                min={10}
                step={5}
                placeholder="e.g. 30"
                value={form.durationInMinutes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    durationInMinutes: Number(e.target.value),
                  })
                }
              />
            </Field>
            <Field label="Currency" required>
              <Select
                value={form.currency}
                onValueChange={(v) => setForm({ ...form, currency: v })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <p className="mt-1 rounded-md border border-blue-200 bg-blue-50 px-3 py-2  text-sm text-blue-700">
            Actual service time may vary based on site conditions and service
            complexity.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
          <Button
            variant="outline"
            onClick={handleCleanupAndClose}
            disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            Create Service
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Small helper component for Inputs
function Field({
  label,
  required,
  children,
  error,
}: {
  label: string;
  required: boolean;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label} {required && <RequireField />}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
