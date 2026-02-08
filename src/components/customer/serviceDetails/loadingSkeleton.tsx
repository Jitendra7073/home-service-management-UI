"use client";

function ServiceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-muted/50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">
          {/* HERO SECTION */}
          <div className="bg-muted rounded-sm p-8 h-64 border border-border">
            <div className="h-10 w-2/3 bg-muted-foreground/20 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-muted-foreground/20 rounded"></div>

            <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/40">
              {Array(4)
                .fill("")
                .map((_, i) => (
                  <div key={i} className="bg-gray-300 h-16 rounded-sm"></div>
                ))}
            </div>
          </div>

          {/* BUSINESS INFO */}
          <div className="bg-white rounded-sm p-8 border border-gray-200">
            <div className="h-7 w-56 bg-gray-300 rounded mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-4 w-44 bg-gray-300 rounded"></div>
                <div className="h-4 w-64 bg-gray-200 rounded"></div>
                <div className="h-4 w-56 bg-gray-200 rounded"></div>
              </div>

              <div className="h-32 bg-gray-200 rounded-sm"></div>
            </div>
          </div>

          {/* DATE SELECTOR */}
          <div className="bg-white rounded-sm p-8 border border-gray-200">
            <div className="h-7 w-48 bg-gray-300 rounded mb-6"></div>

            <div className="flex gap-3 overflow-x-auto">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-28 min-w-[7rem] bg-muted rounded-sm border border-border"></div>
                ))}
            </div>
          </div>

          {/* TIME SLOTS GRID */}
          <div className="bg-card rounded-sm p-8 border border-border">
            <div className="h-7 w-40 bg-muted-foreground/20 rounded mb-6"></div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array(8)
                .fill("")
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted rounded-sm border border-border"></div>
                ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - SUMMARY */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-sm p-6 border border-gray-200 sticky top-24 space-y-6">
            <div className="h-7 w-40 bg-gray-300 rounded"></div>

            {/* Summary Fields */}
            <div className="space-y-3">
              <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
            </div>

            {/* Quantity */}
            <div className="h-10 bg-muted-foreground/20 rounded-sm mt-4"></div>

            {/* Selected slot box */}
            <div className="h-16 bg-muted-foreground/20 rounded-sm"></div>

            {/* Price rows */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
              <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
            </div>

            {/* Total */}
            <div className="h-12 bg-gray-300 rounded-sm"></div>

            {/* Benefits box */}
            <div className="h-16 bg-muted rounded-sm border border-border"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetailSkeleton;
