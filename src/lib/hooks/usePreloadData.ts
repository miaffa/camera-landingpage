"use client";

import { useCallback } from "react";
import { mutate } from "swr";

// Define the data keys for each tab
const TAB_DATA_KEYS = {
  home: ["/api/posts"],
  marketplace: ["/api/gear/search?limit=20"],
  create: [], // No preloading needed for create page
  bookings: ["/api/bookings"],
  profile: ["/api/app/profile"],
} as const;

type TabName = keyof typeof TAB_DATA_KEYS;

export function usePreloadData() {
  const preloadTabData = useCallback((tabName: TabName) => {
    const dataKeys = TAB_DATA_KEYS[tabName];
    
    if (!dataKeys || dataKeys.length === 0) return; // Skip preloading for tabs that don't need it
    
    // Preload all data keys for this tab in parallel
    dataKeys.forEach(dataKey => {
      // Preload data in the background without blocking UI
      mutate(dataKey, undefined, { revalidate: true });
    });
  }, []);

  // Preload user interactions for posts (used in feed)
  const preloadUserInteractions = useCallback((postIds: string[]) => {
    if (postIds.length === 0) return;
    
    const interactionKey = `/api/posts/user-interactions?postIds=${postIds.join(",")}`;
    mutate(interactionKey, undefined, { revalidate: true });
  }, []);

  return { 
    preloadTabData,
    preloadUserInteractions 
  };
}
