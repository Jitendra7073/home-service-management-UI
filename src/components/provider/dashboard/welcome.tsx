"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const Welcome = () => {
  const { data, isLoading, isPending } = useQuery({
    queryKey: ["welcomeData"],
    queryFn: async () => {
      const response = await fetch("/api/common/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache",
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Failed to fetch profile data");
        return null;
      }

      const result = await response.json();
      return result?.user;
    },
  });

  return (
    <section className="w-full rounded-2xl border bg-gray-50 px-6 py-6 sm:px-8 sm:py-8">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
          Welcome back,
          <span className="ml-2 inline-flex items-center">
            {isLoading || isPending ? (
              <span className="inline-block h-6 w-32 rounded-md bg-gray-200 animate-pulse" />
            ) : (
              <span className="text-blue-700 font-bold">
                {data?.name}
              </span>
            )}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-xl">
          Here’s a quick overview of how your business is performing today.
        </p>
      </div>
    </section>
  );
};

export default Welcome;
