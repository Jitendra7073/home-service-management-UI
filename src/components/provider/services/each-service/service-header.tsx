"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Save, Share2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServiceHeaderProps {
  isEditing: boolean;
  loading: boolean;
  serviceName: string;
  isActive: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ServiceHeader({
  isEditing,
  loading,
  serviceName,
  isActive,
  onToggleEdit,
  onSave,
  onCancel,
}: ServiceHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
      {/* LEFT SIDE: Back Button & Title */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isEditing ? "Edit Service" : serviceName}
            </h1>
            {!isEditing && (
              <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-600 hover:bg-green-700" : ""}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground hidden md:block">
            Manage service details, pricing, and team allocation.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Actions */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Button variant="ghost" onClick={onCancel} disabled={loading}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={onSave} disabled={loading} className="min-w-[140px]">
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button onClick={onToggleEdit}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
          </>
        )}
      </div>
    </div>
  );
}