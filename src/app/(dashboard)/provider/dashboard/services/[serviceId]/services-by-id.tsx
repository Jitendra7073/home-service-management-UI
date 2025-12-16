"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  X,
  Pencil,
  Clock,
  Banknote,
  ShieldCheck,
  Trash2,
  Loader2, // Added Loader
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "@/components/provider/services/create/ImageUpload";
import { uploadToCloudinary } from "@/components/provider/services/create/cloudinary";
import { UploadedImage } from "@/components/provider/services/create/types";
import { TeamList } from "@/components/provider/services/each-service/team-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ServiceData {
  id: string;
  name: string;
  description: string;
  durationInMinutes: number;
  price: number;
  currency: string;
  isActive: boolean;
  coverImage: string;
  images: string[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

const urlToImageState = (url: string): UploadedImage => ({
  preview: url,
  url,
  uploading: false,
  progress: 100,
});

export default function ServiceDashboard({ serviceId }: { serviceId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["individual-service", serviceId],
    enabled: !!serviceId,
    queryFn: async () => {
      const res = await fetch(`/api/provider/service/${serviceId}`);
      if (!res.ok) throw new Error("Failed to fetch service");
      return await res.json();
    },
  });

  const [originalData, setOriginalData] = useState<ServiceData | null>(null);
  const [formData, setFormData] = useState<ServiceData | null>(null);

  const [coverImageState, setCoverImageState] = useState<UploadedImage[]>([]);
  const [galleryImageState, setGalleryImageState] = useState<UploadedImage[]>(
    []
  );

  useEffect(() => {
    if (data?.service) {
      setOriginalData(data.service);
      setFormData(data.service);
    }
  }, [data]);

  useEffect(() => {
    if (isEditing && formData) {
      setCoverImageState(
        formData.coverImage ? [urlToImageState(formData.coverImage)] : []
      );
      setGalleryImageState(formData.images.map(urlToImageState));
    }
  }, [isEditing, formData]);

  if (isLoading || !originalData || !formData) {
    return <div className="p-6">Loading service...</div>;
  }

  const hasChanges = () => {
    if (
      formData.name !== originalData.name ||
      formData.description !== originalData.description ||
      formData.durationInMinutes !== originalData.durationInMinutes ||
      formData.price !== originalData.price ||
      formData.isActive !== originalData.isActive
    )
      return true;

    const currentCover = coverImageState[0]?.url || "";
    const originalCover = originalData.coverImage || "";
    if (currentCover !== originalCover) return true;

    const currentGallery = galleryImageState.map((i) => i.url).sort();
    const originalGallery = [...originalData.images].sort();

    if (currentGallery.length !== originalGallery.length) return true;
    return JSON.stringify(currentGallery) !== JSON.stringify(originalGallery);
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleUpload = async (files: FileList, type: "cover" | "gallery") => {
    const fileArray = Array.from(files);

    const newImages: UploadedImage[] = fileArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
      progress: 0,
    }));

    if (type === "cover") {
      setCoverImageState(newImages);
    } else {
      setGalleryImageState((prev) => [...prev, ...newImages]);
    }

    newImages.forEach(async (imgObj) => {
      try {
        const { url, publicId } = await uploadToCloudinary(
          imgObj.file!,
          (progress) => {
            const setter =
              type === "cover" ? setCoverImageState : setGalleryImageState;
            setter((prev) =>
              prev.map((p) =>
                p.preview === imgObj.preview ? { ...p, progress } : p
              )
            );
          }
        );

        const setter =
          type === "cover" ? setCoverImageState : setGalleryImageState;
        setter((prev) =>
          prev.map((p) =>
            p.preview === imgObj.preview
              ? { ...p, uploading: false, url, publicId }
              : p
          )
        );
      } catch (error) {
        toast.error("Failed to upload image");
        // Remove failed image from state
        const setter =
          type === "cover" ? setCoverImageState : setGalleryImageState;
        setter((prev) => prev.filter((p) => p.preview !== imgObj.preview));
      }
    });
  };

  /* ================= UPDATE ================= */
  const handleSave = async () => {
    if (!hasChanges()) {
      toast.info("No changes to save");
      setIsEditing(false);
      return;
    }

    const allImages = [...coverImageState, ...galleryImageState];
    if (allImages.some((i) => i.uploading)) {
      toast.warning("Please wait for images to finish uploading");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        coverImage: coverImageState[0]?.url || "",
        images: galleryImageState.map((i) => i.url || "").filter(Boolean),
      };

      const res = await fetch(`/api/provider/service/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.msg || "Update failed");

      setOriginalData(payload as ServiceData);
      setIsEditing(false);
      toast.success("Service updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["individual-service", serviceId],
      });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* =================  DELETE ================= */
  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this service? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/provider/service/${serviceId}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.msg || "Delete failed");

      toast.success("Service deleted successfully");
      router.push("/provider/services");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[1400px] px-2 md:px-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {isEditing ? "Edit Service" : originalData.name}
                </h1>
                {!isEditing && (
                  <Badge
                    variant={originalData.isActive ? "default" : "destructive"}
                    className="ml-2">
                    {originalData.isActive ? "Active" : "Inactive"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(originalData);
                  }}
                  className="bg-gray-600 hover:bg-gray-500">
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Pencil className="w-4 h-4 mr-1" />
                  )}
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-500">
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-1" />
                  )}
                  Delete
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  <Pencil className="w-4 h-4 mr-1" /> Edit Details
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3">
          <div className="lg:col-span-2 space-y-4">
            <Card className="rounded-md shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Service Name
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Price ({formData.currency})
                        </label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        className="min-h-[100px]"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Duration (Minutes)
                      </label>
                      <Input
                        type="number"
                        value={formData.durationInMinutes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            durationInMinutes: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div className="flex gap-6 mb-6">
                      <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                        <Clock className="w-4 h-4" />{" "}
                        {
                          (originalData.durationInMinutes / 60)
                            .toFixed(2)
                            .split(".")[0]
                        }
                        H{" "}
                        {
                          (originalData.durationInMinutes / 60)
                            .toFixed(2)
                            .split(".")[1]
                        }
                        M
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                        <Banknote className="w-4 h-4" /> {originalData.currency}{" "}
                        {originalData.price}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      About this service
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {originalData.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-md border-gray-200 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">Media Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-6">
                    <ImageUploader
                      label="Cover Image"
                      single
                      images={coverImageState}
                      onSelect={(files: FileList) =>
                        handleUpload(files, "cover")
                      }
                      onRemove={() => setCoverImageState([])}
                    />
                    <Separator />
                    <ImageUploader
                      label="Gallery Images"
                      images={galleryImageState}
                      onSelect={(files: FileList) =>
                        handleUpload(files, "gallery")
                      }
                      onRemove={(i: number) =>
                        setGalleryImageState((p) => p.filter((_, x) => x !== i))
                      }
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 row-span-2 h-[300px] rounded-md overflow-hidden border">
                      <img
                        src={originalData.coverImage}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                        alt="Cover"
                      />
                    </div>
                    <div className="grid grid-rows-2 gap-4 h-[300px]">
                      {originalData.images.slice(0, 2).map((img, i) => (
                        <div
                          key={i}
                          className="rounded-md overflow-hidden border h-full">
                          <img
                            src={img}
                            className="w-full h-full object-cover"
                            alt="Gallery"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-md border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">Availability Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      className={`w-5 h-5 ${
                        formData.isActive ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-sm">
                        Service is {formData.isActive ? "Live" : "Hidden"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Visible to customers
                      </p>
                    </div>
                  </div>
                  <Switch
                    disabled={!isEditing}
                    checked={formData.isActive}
                    onCheckedChange={(v) =>
                      setFormData({ ...formData, isActive: v })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <TeamList serviceId={originalData.id} isEditing={isEditing} />

            <Card className="bg-gray-50 border-dashed border-gray-200 shadow-none rounded-md">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Service ID</span>
                  <span className="font-mono text-gray-700">
                    {originalData.id.slice(0, 10)}...
                  </span>
                </div>
                <Separator className="bg-gray-200" />
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Created On</span>
                  <span className="text-gray-700">
                    {new Date(originalData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Last Edited</span>
                  <span className="text-gray-700">
                    {new Date(originalData.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
