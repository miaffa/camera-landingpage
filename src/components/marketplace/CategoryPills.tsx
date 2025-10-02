import React from "react";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data/marketplace-data";

interface CategoryPillsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showPills: boolean;
}

export function CategoryPills({ selectedCategory, onCategoryChange, showPills }: CategoryPillsProps) {
  if (!showPills) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-2 whitespace-nowrap ${
                isActive 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              <Icon className="h-4 w-4" />
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
