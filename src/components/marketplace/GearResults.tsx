import React from "react";
import { Search, Camera, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/data/marketplace-data";

interface Gear {
  id: string;
  title: string;
  price: number;
  category: string;
  status: string;
  rating: number;
  image: string;
  location: string;
}

interface GearResultsProps {
  gear: Gear[];
  searchQuery: string;
  selectedCategory: string;
}

export function GearResults({ gear, searchQuery, selectedCategory }: GearResultsProps) {
  if (gear.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No gear found</h3>
        <p className="text-muted-foreground max-w-sm">
          {searchQuery 
            ? `No results for "${searchQuery}" in ${categories.find(c => c.id === selectedCategory)?.name || 'All'} category.`
            : `No gear available in ${categories.find(c => c.id === selectedCategory)?.name || 'All'} category.`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {gear.map((item) => (
        <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      {item.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      {item.rating}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">${item.price}</div>
                  <div className="text-xs text-gray-500">per day</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
