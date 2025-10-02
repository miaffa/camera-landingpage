import React from "react";
import { Camera, Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GearItem {
  id: string;
  name: string;
  price: number;
  category: string;
  status: string;
  rating: number;
  image: string;
  location: string;
}

interface GearListingProps {
  gear: GearItem[];
}

export function GearListing({ gear }: GearListingProps) {
  if (!gear || gear.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Camera className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Gear Used</span>
      </div>
      
      <div className="space-y-2">
        {gear.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <Camera className="h-6 w-6 text-gray-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  {item.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {item.rating}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {item.location}
                </div>
                <span className="text-gray-400">•</span>
                <span className="capitalize">{item.category}</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-gray-900">${item.price}</div>
              <div className="text-xs text-gray-500">per day</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
