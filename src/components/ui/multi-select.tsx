"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MultiSelectProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected = [],
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectProps) {
  const handleSelect = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, value]);
    } else {
      onChange(selected.filter((item) => item !== value));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between h-auto min-h-[40px] ${className}`}>
          <div className="flex flex-wrap gap-1 items-center text-left">
            {selected.length === 0 && (
              <span className="text-muted-foreground font-normal">
                {placeholder}
              </span>
            )}
            {selected.map((val) => {
              const label = options.find((o) => o.value === val)?.label || val;
              return (
                <Badge key={val} variant="secondary" className="mr-1 mb-1">
                  {label}
                </Badge>
              );
            })}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[300px] max-h-[300px] overflow-y-auto"
        align="start">
        <DropdownMenuLabel>{placeholder}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            onCheckedChange={(checked) => handleSelect(option.value, checked)}>
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
