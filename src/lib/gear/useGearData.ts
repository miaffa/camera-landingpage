"use client";

import useSWR from "swr";

interface GearData {
  id: string;
  name: string;
  category: string;
  description: string | null;
  pricePerDay: string;
  condition: string;
  location: string | null;
  images: string[] | null;
  availableFrom: Date | null;
  availableUntil: Date | null;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  ownerName: string | null;
  ownerEmail: string | null;
  ownerImage: string | null;
}

interface UseGearDataResult {
  gearData: Record<string, GearData>;
  isLoading: boolean;
  error: any;
}

export function useGearData(gearIds: string[]): UseGearDataResult {
  const validGearIds = gearIds.filter(id => id && typeof id === 'string');
  
  const { data, error, isLoading } = useSWR(
    validGearIds.length > 0 ? `/api/gear/batch?ids=${validGearIds.join(',')}` : null,
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch gear data');
      }
      return response.json();
    }
  );

  return {
    gearData: data || {},
    isLoading,
    error,
  };
}
