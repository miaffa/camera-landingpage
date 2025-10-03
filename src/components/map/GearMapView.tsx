"use client";

import React, { useState, useCallback } from "react";
import { MapPin, Star, X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapboxMap } from "./MapboxMap";

interface GearItem {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerDay: string;
  condition: string;
  location: string;
  images: string[];
  isAvailable: boolean;
  latitude?: number;
  longitude?: number;
}

interface GearMapViewProps {
  gear: GearItem;
  onClose: () => void;
}

// Mock coordinates for demonstration - in real app, you'd geocode the location
const getCoordinates = (location: string) => {
  // For demo purposes, return SF coordinates
  // In production, you'd use a geocoding service
  return {
    latitude: 37.7749,
    longitude: -122.4194,
  };
};

export function GearMapView({ gear, onClose }: GearMapViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const coordinates = getCoordinates(gear.location);

  const handleMapClick = useCallback((event: any) => {
    // Handle map interactions if needed
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">U</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">{gear.name}</h1>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>4.5 • {gear.location}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Store
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 min-h-0">
        <MapboxMap 
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          zoom={14}
          className="w-full h-full"
        />

        {/* Location Info Overlay */}
        <div className="absolute top-4 left-4 right-4">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">{gear.location}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-4 left-4">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">${gear.pricePerDay}</span>
                <span className="text-sm text-gray-600">/day</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Expandable Description Section */}
      <div className="bg-white border-t flex-shrink-0">
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="font-medium">Description</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
          
          {isExpanded && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {gear.category}
                </Badge>
                <Badge
                  variant={gear.isAvailable ? "default" : "destructive"}
                  className={cn(
                    gear.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {gear.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">About this gear</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {gear.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {gear.location}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {gear.condition}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Contact Owner</Button>
                <Button variant="outline" className="flex-1">
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
