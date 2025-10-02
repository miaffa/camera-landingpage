import React from "react";
import { GearCategoryCard } from "./GearCategoryCard";
import { gearCategories } from "@/lib/data/create-data";

interface GearCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface GearCategoriesGridProps {
  onCategoryClick: (category: GearCategory) => void;
}

export function GearCategoriesGrid({ onCategoryClick }: GearCategoriesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {gearCategories.map((category) => (
        <GearCategoryCard
          key={category.id}
          category={category}
          onClick={onCategoryClick}
        />
      ))}
    </div>
  );
}
