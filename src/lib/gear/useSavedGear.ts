"use client";

import useSWR from "swr";

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

export function useSavedGear() {
  const { data, error, isLoading, mutate } = useSWR<SavedGearItem[]>(
    "/api/gear/saved"
  );

  return {
    savedGear: data || [],
    isLoading,
    error,
    mutate,
  };
}
