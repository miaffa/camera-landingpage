"use client";

import React, { useCallback, useState, useEffect } from "react";
import { MapPin, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  onRentClick?: () => void;
}

// Geocode location string to coordinates using OpenStreetMap Nominatim
const getCoordinates = async (location: string) => {
  try {
    // Use OpenStreetMap Nominatim API (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    
    // Fallback to default coordinates if geocoding fails
    console.warn(`Could not geocode location: ${location}`);
    return {
      latitude: 37.7749,
      longitude: -122.4194,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    // Fallback to default coordinates
    return {
      latitude: 37.7749,
      longitude: -122.4194,
    };
  }
};

export function GearMapView({ gear, onClose, onRentClick }: GearMapViewProps) {
  const [coordinates, setCoordinates] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {
      setIsLoading(true);
      try {
        const coords = await getCoordinates(gear.location);
        setCoordinates(coords);
      } catch (error) {
        console.error('Failed to geocode location:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordinates();
  }, [gear.location]);

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

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Gear Image */}
        <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
          <span className="text-4xl">📷</span>
        </div>

        {/* Gear Details */}
        <div className="p-4 space-y-4">
          {/* Price and Availability */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">${gear.pricePerDay}</span>
              <span className="text-lg text-gray-600">/day</span>
            </div>
            <Badge
              variant={gear.isAvailable ? "default" : "destructive"}
              className={cn(
                "text-sm px-3 py-1",
                gear.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {gear.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>

          {/* Category and Condition */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {gear.category}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{gear.condition}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About this gear</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {gear.description || "No description provided."}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{gear.location}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              className="flex-1" 
              onClick={onRentClick}
              disabled={!gear.isAvailable}
              size="lg"
            >
              {gear.isAvailable ? "Rent Now" : "Not Available"}
            </Button>
            <Button variant="outline" className="flex-1" size="lg">
              Contact Owner
            </Button>
            <Button variant="outline" size="lg">
              Save
            </Button>
          </div>
        </div>

        {/* Map Section - Smaller at bottom */}
        <div className="border-t bg-gray-50 pb-20">
          <div className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </h3>
            <div className="h-48 w-full rounded-lg overflow-hidden border relative">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading location...</p>
                  </div>
                </div>
              ) : (
                <MapboxMap 
                  latitude={coordinates.latitude}
                  longitude={coordinates.longitude}
                  zoom={12}
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
