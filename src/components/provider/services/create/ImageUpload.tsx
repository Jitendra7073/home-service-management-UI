"use client";
import { Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { UploadedImage } from "./types";
import { useState } from "react";

interface ImagePreviewProps {
  image: UploadedImage;
  onRemove: () => void;
}

export function ImagePreview({ image, onRemove }: ImagePreviewProps) {
  const [removing, setRemoving] = useState(false);
  const handleRemoveImage = async () => {
  if (image.uploading) return;
  setRemoving(true);
  await onRemove();
  setRemoving(false);
};

  return (
    <div className="relative border rounded-md overflow-hidden bg-gray-50">
      <img
        src={image.preview}
        alt="Preview"
        className={`h-28 w-full object-cover transition duration-300 ${
          image.uploading ? "opacity-40 blur-[1px]" : "opacity-100"
        }`}
      />

      {image.uploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
        </div>
      )}

      {image.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="text-xs text-red-200 font-bold px-2 text-center">
            {image.error}
          </p>
        </div>
      )}

      {!image.uploading && (
        <button
          type="button"
          onClick={() => handleRemoveImage()}
          className={`absolute top-1 flex item-center justify-center right-1 bg-black/60  text-white rounded p-1 transition-colors ${
            removing ? "bg-red-600" : "hover:bg-red-600"
          }`}>
         {removing ? 
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          :
          <X size={14} />
          }
        </button>
      )}
    </div>
  );
}

interface ImageUploaderProps {
  label: string;
  single?: boolean;
  images: UploadedImage[];
  onSelect: (files: FileList) => void;
  onRemove: (index: number) => void;
}

export function ImageUploader({
  label,
  single,
  images,
  onSelect,
  onRemove,
}: ImageUploaderProps) {
  const hasImage = single && images.length > 0;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {!hasImage && (
        <label className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="file"
            hidden
            multiple={!single}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={(e) => e.target.files && onSelect(e.target.files)}
          />
          <span className="text-sm text-gray-500 font-medium">
            Click to upload {single ? "cover" : "images"}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            JPG, PNG, WEBP (Max 5MB)
          </span>
        </label>
      )}

      {images.length > 0 && (
        <div
          className={`grid ${
            single ? "grid-cols-1" : "grid-cols-3"
          } gap-3 mt-3`}>
          {images.map((img, i) => (
            <ImagePreview key={i} image={img} onRemove={() => onRemove(i)} />
          ))}
        </div>
      )}
    </div>
  );
}
