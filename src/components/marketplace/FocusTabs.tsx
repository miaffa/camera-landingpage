import React from "react";
import { Camera, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FocusTabsProps {
  searchFocus: "gear" | "people";
  onFocusChange: (focus: "gear" | "people") => void;
  showTabs: boolean;
}

export function FocusTabs({ searchFocus, onFocusChange, showTabs }: FocusTabsProps) {
  if (!showTabs) return null;

  return (
    <div className="flex gap-2">
      <Button
        variant={searchFocus === "gear" ? "default" : "outline"}
        size="sm"
        className={`flex items-center gap-2 ${
          searchFocus === "gear" 
            ? "bg-blue-600 text-white border-blue-600" 
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
        }`}
        onClick={() => onFocusChange("gear")}
      >
        <Camera className="h-4 w-4" />
        Gear
      </Button>
      <Button
        variant={searchFocus === "people" ? "default" : "outline"}
        size="sm"
        className={`flex items-center gap-2 ${
          searchFocus === "people" 
            ? "bg-blue-600 text-white border-blue-600" 
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
        }`}
        onClick={() => onFocusChange("people")}
      >
        <Users className="h-4 w-4" />
        People
      </Button>
    </div>
  );
}
