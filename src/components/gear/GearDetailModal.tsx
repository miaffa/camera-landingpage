"use client";

import React, { useState, useEffect } from "react";
import { X, Star, MapPin, Calendar, User, Camera, ExternalLink, ArrowLeft, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookingRequestModal } from "@/components/rental/BookingRequestModal";
import { MapboxMap } from "@/components/map/MapboxMap";
import { useGearSave } from "@/lib/gear/useGearSave";
import { cn } from "@/lib/utils";

interface GearItem {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  pricePerDay: string;
  condition: string;
  location?: string | null;
  images?: string[] | null;
  availableFrom?: Date | null;
  availableUntil?: Date | null;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  ownerId?: string;
  ownerName?: string | null;
  ownerEmail?: string | null;
  ownerImage?: string | null;
  ownerRating?: {
    average: number;
    totalReviews: number;
  };
  recentBookings?: Array<{
    id: string;
    startDate: Date;
    endDate: Date;
    status: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string | null;
    communicationRating: number;
    gearConditionRating: number;
    timelinessRating: number;
    createdAt: Date;
    reviewerName: string | null;
    reviewerImage: string | null;
  }>;
  latitude?: number;
  longitude?: number;
}

interface GearDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gear: GearItem | null;
  mode?: "modal" | "fullscreen";
  returnTo?: "post" | "marketplace" | "profile";
}

// Geocode location string to coordinates using OpenStreetMap Nominatim
const getCoordinates = async (location: string) => {
  try {
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
    
    return {
      latitude: 37.7749,
      longitude: -122.4194,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      latitude: 37.7749,
      longitude: -122.4194,
    };
  }
};

export function GearDetailModal({ 
  isOpen, 
  onClose, 
  gear, 
  mode = "modal",
  returnTo = "post"
}: GearDetailModalProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the gear save hook
  const { isSaved, isLoading: isSaving, toggleSave } = useGearSave({
    gearId: gear?.id || "",
    initialSaved: false, // We'll need to check this from the API
  });

  useEffect(() => {
    if (gear?.location) {
      const fetchCoordinates = async () => {
        setIsLoading(true);
        try {
          const coords = await getCoordinates(gear.location!);
          setCoordinates(coords);
        } catch (error) {
          console.error('Failed to geocode location:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCoordinates();
    }
  }, [gear?.location]);

  const handleRentClick = () => {
    if (gear) {
      setIsBookingModalOpen(true);
    }
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };


  if (!isOpen || !gear) {
    return null;
  }

  // Modal mode (bottom sheet like comments)
  if (mode === "modal") {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
        
        {/* Bottom Sheet */}
        <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out max-h-[90vh] flex flex-col">
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header - Compact like old design */}
          <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={gear.ownerImage || undefined} />
                <AvatarFallback>
                  {gear.ownerName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-bold">{gear.name}</h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{gear.ownerRating?.average.toFixed(1) || "0.0"} • {gear.location || "Location not specified"}</span>
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

          {/* Content - Scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* Gear Image */}
            <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
              {gear.images && gear.images.length > 0 ? (
                <img
                  src={gear.images[0]}
                  alt={gear.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">📷</span>
              )}
            </div>

            {/* Gear Details - Compact like old design */}
            <div className="p-4 space-y-4">
              {/* Price and Availability */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">${parseFloat(gear.pricePerDay).toFixed(0)}</span>
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
                <span>{gear.location || "Location not specified"}</span>
              </div>

              {/* Action Buttons - Like old design */}
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1" 
                  onClick={handleRentClick}
                  disabled={!gear.isAvailable}
                  size="lg"
                >
                  {gear.isAvailable ? "Rent Now" : "Not Available"}
                </Button>
                <Button variant="outline" className="flex-1" size="lg">
                  Contact Owner
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={toggleSave}
                  disabled={isSaving}
                  className={isSaved ? "bg-blue-50 text-blue-600 border-blue-200" : ""}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Map Section - Like old design */}
            {gear.location && (
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
            )}
          </div>
        </div>

        {/* Booking Modal */}
        {isBookingModalOpen && (
          <BookingRequestModal
            isOpen={isBookingModalOpen}
            onClose={handleCloseBookingModal}
            gear={gear}
          />
        )}
      </>
    );
  }

  // Fullscreen mode (for marketplace)
  return (
    <>
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header - Like old design */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={gear.ownerImage || undefined} />
              <AvatarFallback>
                {gear.ownerName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-bold">{gear.name}</h1>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{gear.ownerRating?.average.toFixed(1) || "0.0"} • {gear.location || "Location not specified"}</span>
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

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Gear Image */}
          <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
            {gear.images && gear.images.length > 0 ? (
              <img
                src={gear.images[0]}
                alt={gear.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">📷</span>
            )}
          </div>

          {/* Gear Details - Compact like old design */}
          <div className="p-4 space-y-4">
            {/* Price and Availability */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">${parseFloat(gear.pricePerDay).toFixed(0)}</span>
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
              <span>{gear.location || "Location not specified"}</span>
            </div>

            {/* Action Buttons - Like old design */}
            <div className="flex gap-2 pt-2">
              <Button 
                className="flex-1" 
                onClick={handleRentClick}
                disabled={!gear.isAvailable}
                size="lg"
              >
                {gear.isAvailable ? "Rent Now" : "Not Available"}
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                Contact Owner
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={toggleSave}
                disabled={isSaving}
                className={isSaved ? "bg-blue-50 text-blue-600 border-blue-200" : ""}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Map Section - Like old design */}
          {gear.location && (
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
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingRequestModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          gear={gear}
        />
      )}
    </>
  );
}
