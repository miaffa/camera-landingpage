import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GearCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface GearCategoryCardProps {
  category: GearCategory;
  onClick: (category: GearCategory) => void;
}

export function GearCategoryCard({ category, onClick }: GearCategoryCardProps) {
  const Icon = category.icon;

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(category)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${category.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base">{category.name}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
