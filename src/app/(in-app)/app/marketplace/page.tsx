"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Star, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingRequestModal } from "@/components/rental/BookingRequestModal";
import useSWR from "swr";
import dynamic from "next/dynamic";

// Lazy load the map component to improve initial page load
const LazyGearMapView = dynamic(() => import("@/components/map/GearMapView").then(mod => ({ default: mod.GearMapView })), {
  loading: () => <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">Loading map...</div>,
  ssr: false
});

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

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const [selectedGear, setSelectedGear] = useState<GearItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  // Fetch all available gear from the API
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch gear");
    }
    const data = await response.json();
    return data || [];
  };

  const { data: gear, isLoading } = useSWR<GearItem[]>(
    "/api/gear/search",
    fetcher
  );

  // Handle gear parameter from URL
  useEffect(() => {
    const gearId = searchParams.get('gear');
    if (gearId && gear && !selectedGear) {
      const gearToSelect = gear.find(g => g.id === gearId);
      if (gearToSelect) {
        setSelectedGear(gearToSelect);
      }
    }
  }, [searchParams, gear, selectedGear]);

  // Memoize the filtered gear to prevent unnecessary filtering on every render
  const filteredGear = useMemo(() => {
    const marketplaceGear = gear || [];
    if (!searchQuery.trim()) return marketplaceGear;
    
    const query = searchQuery.toLowerCase();
    return marketplaceGear.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    );
  }, [gear, searchQuery]);

  // Debounced search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Handle rent button click
  const handleRentClick = useCallback(() => {
    if (selectedGear) {
      setIsBookingModalOpen(true);
    }
  }, [selectedGear]);

  // Handle booking modal close
  const handleCloseBookingModal = useCallback(() => {
    setIsBookingModalOpen(false);
  }, []);

  if (selectedGear) {
    return (
      <>
        <LazyGearMapView
          gear={selectedGear}
          onClose={() => setSelectedGear(null)}
          onRentClick={handleRentClick}
        />
        {isBookingModalOpen && (
          <BookingRequestModal
            isOpen={isBookingModalOpen}
            onClose={handleCloseBookingModal}
            gear={selectedGear}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-sm text-gray-600">Find gear to rent in your area</p>
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search gear, categories, or locations..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {/* Gear Grid */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredGear.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-gray-100 p-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No gear found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or check back later for new listings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredGear.map((gearItem) => (
            <Card
              key={gearItem.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedGear(gearItem)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Gear Image Placeholder */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📷</span>
                  </div>
                  
                  {/* Gear Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 truncate">
                          {gearItem.name}
                        </h3>
                        <p className="text-sm text-gray-600">{gearItem.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${gearItem.pricePerDay}/day
                        </p>
                        <Badge
                          variant={gearItem.isAvailable ? "default" : "destructive"}
                          className={`text-xs ${
                            gearItem.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {gearItem.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {gearItem.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {gearItem.condition}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}