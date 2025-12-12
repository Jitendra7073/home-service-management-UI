"use client";

import React from "react";

interface WelcomeProps {
  providerName?: string;
}

const Welcome: React.FC<WelcomeProps> = ({ providerName = "Jitendra" }) => {
  return (
    <div
      className="
        w-full rounded-xl 
        bg-gradient-to-br from-white via-gray-50 to-gray-100 
        border border-gray-200 shadow-sm 
        p-6 sm:p-8 
        flex flex-col gap-4
      "
    >
      {/* TOP TEXT SECTION */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Welcome back, <span className="text-blue-600">{providerName}</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-500 mt-2">
          Here’s a quick overview of how your business is performing today.
        </p>
      </div>
     
    </div>
  );
};

export default Welcome;
