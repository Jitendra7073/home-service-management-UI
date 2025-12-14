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
      const data = await response.json();
      return data?.user;
    },
  })
  return (
    <div
      className="
        w-full rounded-xl 
        bg-gray-100
        border-2 border-gray-200 
        p-6 sm:p-8 
        flex flex-col gap-4
      "
    >
      {/* TOP TEXT SECTION */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          <div className="flex items-center gap-2">
            <span className="text-gray-900">Welcome back,</span>

            {isLoading || isPending ? (
              <div className="h-7 w-30 bg-gray-200 rounded-sm animate-pulse" />
            ) : (
              <span className="text-blue-900 font-bold">{data?.name}</span>
            )}
          </div>


        </h1>

        <p className="text-sm sm:text-base text-gray-500 mt-2">
          Here’s a quick overview of how your business is performing today.
        </p>
      </div>

    </div>
  );
};

export default Welcome;
