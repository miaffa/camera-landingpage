"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";

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
}

export function useUserGear() {
  const { data: session } = useSession();
  
  const fetcher = async (url: string): Promise<GearItem[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch gear");
    }
    return response.json();
  };

  const { data: gear, error, isLoading, mutate } = useSWR<GearItem[]>(
    session?.user?.id ? "/api/gear" : null,
    fetcher
  );

  return {
    gear: gear || [],
    isLoading,
    error,
    mutate,
  };
}
