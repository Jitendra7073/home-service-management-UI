"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2, Save, X } from "lucide-react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/common/RichTextEditor"),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false,
  },
);

export default function LegalDocsEditor() {
  return (
    <div className="w-full h-fit">
      <div className=" p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold tracking-tight">Legal Documents</h1>
          <p className="text-muted-foreground">
            Manage your site's About Us, Privacy Policy, and Terms & Conditions.
            Updates are live immediately.
          </p>
        </div>

        <Tabs defaultValue="about_us" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="about_us">About Us</TabsTrigger>
            <TabsTrigger value="privacy_policy">Privacy Policy</TabsTrigger>
            <TabsTrigger value="terms_conditions">
              Terms & Conditions
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="about_us">
              <ContentEditor contentKey="about_us" label="About Us" />
            </TabsContent>
            <TabsContent value="privacy_policy">
              <ContentEditor
                contentKey="privacy_policy"
                label="Privacy Policy"
              />
            </TabsContent>
            <TabsContent value="terms_conditions">
              <ContentEditor
                contentKey="terms_conditions"
                label="Terms & Conditions"
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function ContentEditor({
  contentKey,
  label,
}: {
  contentKey: string;
  label: string;
}) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["content", contentKey],
    queryFn: async () => {
      const res = await fetch(`/api/common/content/${contentKey}`);
      if (!res.ok) {
        if (res.status === 404)
          return { success: false, data: { title: label, content: "" } };
        throw new Error("Failed to fetch");
      }
      return res.json();
    },
    staleTime: 0,
  });

  React.useEffect(() => {
    if (data?.data) {
      setFormData({
        title: data.data.title || label,
        content: data.data.content || "",
      });
    } else {
      setFormData({ title: label, content: "" });
    }
  }, [data, label]);

  const updateMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string }) => {
      const res = await fetch(`/api/admin/content/${contentKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      toast.success(`${label} updated successfully!`);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["content", contentKey] });
    },
    onError: () => toast.error("Failed to save changes"),
  });

  if (isLoading) return <Skeleton className="h-[400px] w-full rounded-sm" />;

  const currentData = data?.data || { title: label, content: "" };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>
            {isEditing ? "Editing: " : ""}
            {currentData.title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Last updated:{" "}
            {currentData.updatedAt
              ? new Date(currentData.updatedAt).toLocaleDateString()
              : "Never"}
          </CardDescription>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => {
              setFormData({
                title: currentData.title,
                content: currentData.content,
              });
              setIsEditing(true);
            }}
            variant="outline"
            size="sm"
            className="gap-2">
            <Edit2 className="h-4 w-4" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => updateMutation.mutate(formData)}
              disabled={updateMutation.isPending}
              className="gap-2 bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Terms and Conditions"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
                placeholder="Enter details here..."
              />
            </div>
          </div>
        ) : (
          <div
            className="prose prose-slate dark:prose-invert max-w-none border rounded-sm p-6 bg-muted/5 min-h-[200px]"
            dangerouslySetInnerHTML={{
              __html:
                currentData.content ||
                "<p class='text-muted-foreground italic'>No content yet.</p>",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
