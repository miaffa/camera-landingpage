"use client";

import useSWR from "swr";

interface GearSearchResult {
  id: string;
  name: string;
  category: string;
  pricePerDay: string;
  condition: string;
  location: string | null;
  images: string[] | null;
  isAvailable: boolean;
  ownerName: string | null;
}

interface UseGearSearchResult {
  gear: GearSearchResult[];
  isLoading: boolean;
  error: Error | undefined;
  searchGear: (query: string) => GearSearchResult[];
}

export function useGearSearch(): UseGearSearchResult {
  const { data, error, isLoading } = useSWR(
    "/api/gear/search?limit=50", // Get more items for search
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch gear data');
      }
      return response.json();
    }
  );

  const searchGear = (query: string): GearSearchResult[] => {
    // Handle both old format (array) and new format (paginated response)
    const gearData = Array.isArray(data) ? data : data?.data || [];
    
    if (!gearData || !query.trim()) return gearData;
    
    const lowercaseQuery = query.toLowerCase();
    return gearData.filter((gear: GearSearchResult) =>
      gear.name.toLowerCase().includes(lowercaseQuery) ||
      gear.category.toLowerCase().includes(lowercaseQuery) ||
      (gear.ownerName && gear.ownerName.toLowerCase().includes(lowercaseQuery))
    );
  };

  // Handle both old format (array) and new format (paginated response)
  const gearData = Array.isArray(data) ? data : data?.data || [];

  return {
    gear: gearData,
    isLoading,
    error,
    searchGear,
  };
}
