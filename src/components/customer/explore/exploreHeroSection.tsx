"use client";

import React from "react";
import { Zap } from "lucide-react";

interface ExploreHeaderProps {
  totalServices: number;
  filteredCount: number;
  totalProviders: number;
  isVisible?: boolean;
  icons: React.ReactNode;
  heading: string;
  description: string;
}

const ExploreHeader: React.FC<ExploreHeaderProps> = ({
  totalServices,
  filteredCount,
  totalProviders,
  isVisible = true,
  icons,
  heading,
  description,
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-800 text-white py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-gray-700/30 rounded-sm backdrop-blur-md border border-gray-600/50">
            {icons}
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 text-white">
              {heading}
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl">
              {description}
            </p>
          </div>
        </div>

        {isVisible && (
          <div className="flex flex-wrap gap-4 mt-8">
            {/* Total Providers */}
            <div className="px-4 py-2 bg-gray-700/30 backdrop-blur-md rounded-sm border border-gray-600/50 text-sm text-gray-300">
              <span className="font-bold text-white">{totalProviders}</span>{" "}
              Providers Available
            </div>

            {/* Total Services */}
            <div className="px-4 py-2 bg-gray-700/30 backdrop-blur-md rounded-sm border border-gray-600/50 text-sm text-gray-300">
              <span className="font-bold text-white">{totalServices}</span>{" "}
              Services Available
            </div>

            {/* Results After Filtering */}
            <div className="px-4 py-2 bg-gray-700/30 backdrop-blur-md rounded-sm border border-gray-600/50 text-sm text-gray-300">
              <span className="font-bold text-white">{filteredCount}</span>{" "}
              Showing Results
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreHeader;
