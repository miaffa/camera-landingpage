"use client";

import React, { useState } from "react";
import { Camera, MapPin, Star, Bookmark, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSavedGear } from "@/lib/gear/useSavedGear";
import { GearDetailModal } from "@/components/gear/GearDetailModal";
import { cn } from "@/lib/utils";

interface SavedGearItem {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  pricePerDay: string;
  condition: string;
  location?: string | null;
  images?: string[] | null;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  ownerId?: string;
  ownerName?: string | null;
  ownerEmail?: string | null;
  ownerImage?: string | null;
  savedAt?: Date;
}

export function SavedGearTabContent() {
  const { savedGear, isLoading, error } = useSavedGear();
  const [selectedGear, setSelectedGear] = useState<SavedGearItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGearClick = (gear: SavedGearItem) => {
    setSelectedGear(gear);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGear(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-destructive/10 p-6 mb-4">
          <Camera className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Error loading saved gear</h3>
        <p className="text-muted-foreground max-w-sm">
          There was an error loading your saved gear. Please try again.
        </p>
      </div>
    );
  }

  if (savedGear.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-6 mb-4">
          <Bookmark className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No saved gear yet</h3>
        <p className="text-muted-foreground max-w-sm">
          When you save gear from the marketplace or posts, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedGear.map((gear) => (
          <Card 
            key={gear.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleGearClick(gear)}
          >
            {/* Gear Image */}
            <div className="aspect-square bg-gray-100 relative">
              {gear.images && gear.images.length > 0 ? (
                <img
                  src={gear.images[0]}
                  alt={gear.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              {/* Availability Badge */}
              <div className="absolute top-2 right-2">
                <Badge
                  variant={gear.isAvailable ? "default" : "destructive"}
                  className={cn(
                    "text-xs px-2 py-1",
                    gear.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {gear.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              {/* Gear Name and Category */}
              <div className="mb-2">
                <h3 className="font-semibold text-sm line-clamp-1 mb-1">{gear.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    {gear.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{gear.condition}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-lg font-bold">${parseFloat(gear.pricePerDay).toFixed(0)}</span>
                <span className="text-sm text-gray-600">/day</span>
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={gear.ownerImage || undefined} />
                  <AvatarFallback className="text-xs">
                    {gear.ownerName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-600 truncate">
                  {gear.ownerName || "Unknown"}
                </span>
              </div>

              {/* Location */}
              {gear.location && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{gear.location}</span>
                </div>
              )}

              {/* Action Button */}
              <Button 
                className="w-full mt-3" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGearClick(gear);
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gear Detail Modal */}
      <GearDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        gear={selectedGear}
        mode="modal"
        returnTo="profile"
      />
    </>
  );
}
