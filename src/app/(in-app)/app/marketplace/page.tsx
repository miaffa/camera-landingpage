"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, MapPin, Star, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BookingRequestModal } from "@/components/rental/BookingRequestModal";
import { GearDetailModal } from "@/components/gear/GearDetailModal";
import useSWR from "swr";

// Lazy load the map component to improve initial page load
// const LazyGearMapView = dynamic(() => import("@/components/map/GearMapView").then(mod => ({ default: mod.GearMapView })), {
//   loading: () => <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">Loading map...</div>,
//   ssr: false
// });

interface GearItem {
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
  latitude?: number;
  longitude?: number;
}

interface FilterState {
  category: string;
  priceRange: [number, number];
  condition: string[];
  location: string;
  availability: boolean | null;
}

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedGear, setSelectedGear] = useState<GearItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 1000],
    condition: [],
    location: "all",
    availability: null,
  });
  // Fetch all available gear from the API
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch gear");
    }
    const data = await response.json();
    return data || [];
  };

  const { data: gearResponse, isLoading } = useSWR<{
    data: GearItem[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
      totalPages: number;
      currentPage: number;
    };
  }>("/api/gear/search?limit=20", fetcher);

  const gear = gearResponse?.data || [];

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
    let filtered = marketplaceGear;

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.location && item.location.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    // Apply price range filter
    filtered = filtered.filter((item) => {
      const price = parseFloat(item.pricePerDay);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply condition filter
    if (filters.condition.length > 0) {
      filtered = filtered.filter((item) => filters.condition.includes(item.condition));
    }

    // Apply location filter
    if (filters.location && filters.location !== "all") {
      filtered = filtered.filter((item) => 
        item.location && item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply availability filter
    if (filters.availability !== null) {
      filtered = filtered.filter((item) => item.isAvailable === filters.availability);
    }

    return filtered;
  }, [gear, searchQuery, filters]);

  // Debounced search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Filter handlers
  const handleFilterChange = useCallback((key: keyof FilterState, value: string | [number, number] | string[] | boolean | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleConditionToggle = useCallback((condition: string) => {
    setFilters(prev => ({
      ...prev,
      condition: prev.condition.includes(condition)
        ? prev.condition.filter(c => c !== condition)
        : [...prev.condition, condition]
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: "all",
      priceRange: [0, 1000],
      condition: [],
      location: "all",
      availability: null,
    });
  }, []);

  // Get unique categories and conditions for filter options
  const categories = useMemo(() => {
    const cats = new Set(gear?.map(item => item.category) || []);
    return Array.from(cats).sort();
  }, [gear]);

  const conditions = useMemo(() => {
    const conds = new Set(gear?.map(item => item.condition) || []);
    return Array.from(conds).sort();
  }, [gear]);

  const locations = useMemo(() => {
    const locs = new Set(gear?.map(item => item.location).filter(Boolean) || []);
    return Array.from(locs).sort();
  }, [gear]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.category !== "all" ||
           filters.priceRange[0] !== 0 ||
           filters.priceRange[1] !== 1000 ||
           filters.condition.length > 0 ||
           filters.location !== "all" ||
           filters.availability !== null;
  }, [filters]);

  // Handle rent button click
  // const handleRentClick = useCallback(() => {
  //   if (selectedGear) {
  //     setIsBookingModalOpen(true);
  //   }
  // }, [selectedGear]);

  // Handle booking modal close
  const handleCloseBookingModal = useCallback(() => {
    setIsBookingModalOpen(false);
  }, []);

  // Handle gear close - clear URL parameter and selected gear
  const handleCloseGear = useCallback(() => {
    setSelectedGear(null);
    // Clear the gear parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('gear');
    router.replace(url.pathname + url.search);
  }, [router]);

  if (selectedGear) {
    return (
      <>
        <GearDetailModal
          isOpen={true}
          onClose={handleCloseGear}
          gear={selectedGear}
          mode="fullscreen"
          returnTo="marketplace"
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
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Clear all
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </Label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                    max={1000}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>

                {/* Condition Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Condition</Label>
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={filters.condition.includes(condition)}
                          onCheckedChange={() => handleConditionToggle(condition)}
                        />
                        <Label
                          htmlFor={condition}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Location</Label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) => handleFilterChange('location', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location || ""}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Availability</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="available"
                        checked={filters.availability === true}
                        onCheckedChange={(checked) => 
                          handleFilterChange('availability', checked ? true : null)
                        }
                      />
                      <Label htmlFor="available" className="text-sm font-normal cursor-pointer">
                        Available only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="unavailable"
                        checked={filters.availability === false}
                        onCheckedChange={(checked) => 
                          handleFilterChange('availability', checked ? false : null)
                        }
                      />
                      <Label htmlFor="unavailable" className="text-sm font-normal cursor-pointer">
                        Unavailable only
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
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

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.category && filters.category !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('category', 'all')}
              />
            </Badge>
          )}
          {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: ${filters.priceRange[0]}-${filters.priceRange[1]}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('priceRange', [0, 1000])}
              />
            </Badge>
          )}
          {filters.condition.map((condition) => (
            <Badge key={condition} variant="secondary" className="flex items-center gap-1">
              {condition}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleConditionToggle(condition)}
              />
            </Badge>
          ))}
          {filters.location && filters.location !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {filters.location}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('location', 'all')}
              />
            </Badge>
          )}
          {filters.availability !== null && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.availability ? 'Available' : 'Unavailable'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange('availability', null)}
              />
            </Badge>
          )}
        </div>
      )}

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