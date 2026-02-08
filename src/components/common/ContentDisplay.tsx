"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentDisplayProps {
  contentKey: string;
}

export default function ContentDisplay({ contentKey }: ContentDisplayProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["content", contentKey],
    queryFn: async () => {
      const res = await fetch(`/api/common/content/${contentKey}`);
      if (!res.ok) throw new Error("Failed to fetch content");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto p-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Content Unavailable
        </h2>
        <p className="text-muted-foreground mt-2">
          We couldn't load this information right now. Please try again later.
        </p>
      </div>
    );
  }

  const { title, content, updatedAt } = data.data;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6 bg-card rounded-sm shadow-sm border mt-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: {new Date(updatedAt).toLocaleDateString()}
        </p>
      </div>

      <div
        className="prose prose-slate dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }} // Assuming rich text or markdown rendered content
      />
    </div>
  );
}
