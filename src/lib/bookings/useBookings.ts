"use client";

import useSWR from "swr";
import { Booking } from "@/db/schema/bookings";

// Extended booking type that includes joined gear data
export type BookingWithGear = Booking & {
  gearName: string;
  gearCategory: string;
  gearImages: string[];
  gearCondition: string;
};

interface UseBookingsOptions {
  type?: "rented" | "owned" | "all";
  status?: string;
}

export function useBookings(options: UseBookingsOptions = {}) {
  const { type = "all", status } = options;
  
  const params = new URLSearchParams();
  if (type !== "all") params.append("type", type);
  if (status) params.append("status", status);
  
  const queryString = params.toString();
  const url = queryString ? `/api/bookings?${queryString}` : "/api/bookings";
  
  const { data, error, isLoading, mutate } = useSWR<BookingWithGear[]>(url);
  
  return {
    bookings: data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useBooking(bookingId: string) {
  const { data, error, isLoading, mutate } = useSWR<Booking & { messages: unknown[] }>(
    bookingId ? `/api/bookings/${bookingId}` : null
  );
  
  return {
    booking: data,
    isLoading,
    error,
    mutate,
  };
}

export function useGearSearch(params: {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });
  
  const queryString = searchParams.toString();
  const url = queryString ? `/api/gear/search?${queryString}` : "/api/gear/search";
  
  const { data, error, isLoading, mutate } = useSWR(url);
  
  return {
    results: data?.results || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}

export function useGearDetails(gearId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    gearId ? `/api/gear/${gearId}` : null
  );
  
  return {
    gear: data,
    isLoading,
    error,
    mutate,
  };
}
