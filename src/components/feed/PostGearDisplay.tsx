"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Camera, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGearData } from "@/lib/gear/useGearData";

interface PostGearDisplayProps {
  gearIds: string[];
  onRentGear?: (gearId: string) => void;
}

export function PostGearDisplay({ gearIds, onRentGear }: PostGearDisplayProps) {
  const { gearData, isLoading } = useGearData(gearIds);
  const router = useRouter();
  
  if (!gearIds || gearIds.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-3 mt-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Camera className="h-4 w-4" />
          <span>Gear Used</span>
        </div>
        <div className="space-y-2">
          {gearIds.map((id) => (
            <Card key={id} className="border-pink-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const handleRentClick = (gearId: string) => {
    if (onRentGear) {
      onRentGear(gearId);
    } else {
      // Navigate to marketplace with the specific gear selected
      router.push(`/app/marketplace?gear=${gearId}`);
    }
  };

  const availableGear = gearIds
    .filter(id => gearData[id])
    .map(id => gearData[id]);

  if (availableGear.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Camera className="h-4 w-4" />
        <span>Gear Used</span>
      </div>
      
      <div className="space-y-2">
        {availableGear.map((gear) => (
          <Card key={gear.id} className="border-pink-200 hover:border-pink-300 transition-colors">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    {gear.images && gear.images.length > 0 ? (
                      <img
                        src={gear.images[0]}
                        alt={gear.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Camera className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{gear.name}</h4>
                      <p className="text-sm text-red-600 font-semibold">
                        ${parseFloat(gear.pricePerDay).toFixed(0)}/day
                      </p>
                      {gear.category && (
                        <p className="text-xs text-gray-500 capitalize">{gear.category}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRentClick(gear.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 flex-shrink-0"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Rent
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
