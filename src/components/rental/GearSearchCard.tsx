"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface GearSearchCardProps {
  gear: {
    id: string;
    name: string;
    category: string;
    description?: string;
    pricePerDay: string;
    condition: string;
    location?: string;
    images: string[];
    availableFrom?: Date;
    availableUntil?: Date;
    ownerName?: string;
    ownerImage?: string;
    ownerRating?: {
      average: number;
      totalReviews: number;
    };
  };
  onRentClick?: (gearId: string) => void;
}

export function GearSearchCard({ gear, onRentClick }: GearSearchCardProps) {
  const dailyRate = parseFloat(gear.pricePerDay);
  const isAvailable = gear.availableFrom && gear.availableUntil 
    ? new Date() >= gear.availableFrom && new Date() <= gear.availableUntil
    : true;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          {gear.images && gear.images.length > 0 ? (
            <img
              src={gear.images[0]}
              alt={gear.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Camera className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-gray-900 font-semibold">
              ${dailyRate}/day
            </Badge>
          </div>
          
          {/* Availability Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              className={cn(
                "font-medium",
                isAvailable 
                  ? "bg-green-500 text-white" 
                  : "bg-red-500 text-white"
              )}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {gear.name}
              </h3>
              <p className="text-sm text-gray-600">{gear.category}</p>
            </div>
          </div>

          {/* Description */}
          {gear.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {gear.description}
            </p>
          )}

          {/* Owner Info */}
          <div className="flex items-center gap-2 mb-3">
            {gear.ownerImage ? (
              <img
                src={gear.ownerImage}
                alt={gear.ownerName}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200" />
            )}
            <span className="text-sm text-gray-600">{gear.ownerName}</span>
            {gear.ownerRating && gear.ownerRating.totalReviews > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-500">
                  {gear.ownerRating.average.toFixed(1)} ({gear.ownerRating.totalReviews})
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            {gear.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{gear.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{gear.condition}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Link href={`/gear/${gear.id}`}>
                View Details
              </Link>
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onRentClick?.(gear.id)}
              disabled={!isAvailable}
            >
              Rent Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
