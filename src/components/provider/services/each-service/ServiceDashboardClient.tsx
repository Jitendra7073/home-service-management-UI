"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ServiceData } from "./types";
import { UploadedImage } from "@/components/provider/services/create/types"; // From your previous files
import { ServiceStats } from "./ServiceStats";  
import { ServiceHeader } from "./service-header";
import { ReviewsList } from "./review-list";    

// UI imports...
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/provider/services/create/ImageUpload";

interface ClientProps {
  initialData: ServiceData;
}

export default function ServiceDashboardClient({ initialData }: ClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Maintain "Source of Truth" vs "Form State"
  const [data, setData] = useState<ServiceData>(initialData);
  const [formData, setFormData] = useState<ServiceData>(initialData);

  // Image State (Only needed during edit)
  const [coverImages, setCoverImages] = useState<UploadedImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);

  /* --- HANDLERS --- */
  
  const toggleEdit = () => {
    if (!isEditing) {
      // Entering Edit Mode: Initialize Image State
      setCoverImages([{ preview: data.coverImage, url: data.coverImage, uploading: false, progress: 100 }]);
      setGalleryImages(data.images.map(url => ({ preview: url, url, uploading: false, progress: 100 })));
      setFormData(data);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
        // Prepare Payload
        const payload = {
            ...formData,
            coverImage: coverImages[0]?.url || "",
            images: galleryImages.map(img => img.url).filter(Boolean) as string[],
        };

        const res = await fetch(`/api/services/${data.id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });

        if(!res.ok) throw new Error("Update failed");

        // Optimistic Update
        const updated = await res.json();
        setData(updated); // Update local view
        setIsEditing(false);
        toast.success("Service updated");
        router.refresh(); // Tells Next.js to re-fetch server data in background
    } catch (e) {
        toast.error("Failed to save changes");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-8">
      
      {/* 1. HEADER COMPONENT */}
      <ServiceHeader 
        isEditing={isEditing} 
        loading={loading}
        serviceName={data.name} 
        isActive={data.isActive}
        onToggleEdit={toggleEdit}
        onSave={handleSave}
        onCancel={() => { setIsEditing(false); setFormData(data); }}
      />

      {/* 2. STATS COMPONENT (Only view mode) */}
      {!isEditing && <ServiceStats data={data} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader><CardTitle>Service Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                   <div className="grid grid-cols-2 gap-4">
                     <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Service Name" />
                     <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} placeholder="Price" />
                   </div>
                   <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </>
              ) : (
                <div className="prose">
                  <p>{data.description}</p>
                  <div className="flex gap-4 mt-4 font-medium text-gray-600">
                    <span>{data.currency} {data.price}</span>
                    <span>{data.durationInMinutes} mins</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* MEDIA GALLERY */}
          <Card>
             <CardHeader><CardTitle>Media</CardTitle></CardHeader>
             <CardContent>
                {isEditing ? (
                    <div className="space-y-4">
                        <ImageUploader label="Cover" single images={coverImages} onSelect={()=>{}} onRemove={()=>{}} />
                        <ImageUploader label="Gallery" images={galleryImages} onSelect={()=>{}} onRemove={()=>{}} />
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        <img src={data.coverImage} className="rounded-md w-full h-32 object-cover" />
                        {data.images.map((url, i) => <img key={i} src={url} className="rounded-md w-full h-32 object-cover" />)}
                    </div>
                )}
             </CardContent>
          </Card>

          {/* REVIEWS COMPONENT */}
          {!isEditing && <ReviewsList reviews={data.reviews} />}
        </div>
      </div>
    </div>
  );
}