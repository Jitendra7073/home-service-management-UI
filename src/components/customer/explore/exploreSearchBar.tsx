"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="relative group pb-5 sm:pb-10">
      <div className="flex items-center border bg-white rounded-md px-4 sm:px-6 py-3 sm:py-4 gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search services by name or category..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
        />
      </div>
    </div>
  );
};

export default SearchBar;
