"use client";

import { Booking } from "@/db/schema/bookings";

interface CreateBookingData {
  gearId: string;
  startDate: string;
  endDate: string;
  renterMessage?: string;
  pickupLocation?: string;
  returnLocation?: string;
}

interface UpdateBookingStatusData {
  bookingId: string;
  status: "pending" | "approved" | "paid" | "active" | "returned" | "completed" | "cancelled" | "disputed";
  message?: string;
}

interface SendMessageData {
  message: string;
  attachments?: string[];
  messageType?: "text" | "image" | "system";
}

interface CreateReviewData {
  rating: number;
  comment?: string;
  communicationRating?: number;
  gearConditionRating?: number;
  timelinessRating?: number;
}

interface CreatePaymentIntentData {
  paymentMethodId?: string;
}

// Booking API functions
export async function createBooking(data: CreateBookingData): Promise<Booking> {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create booking");
  }

  return response.json();
}

export async function updateBookingStatus(data: UpdateBookingStatusData): Promise<Booking> {
  const response = await fetch("/api/bookings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update booking status");
  }

  return response.json();
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  const response = await fetch(`/api/bookings/${bookingId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to cancel booking");
  }

  return response.json();
}

// Message API functions
export async function sendMessage(bookingId: string, data: SendMessageData): Promise<unknown> {
  const response = await fetch(`/api/bookings/${bookingId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send message");
  }

  return response.json();
}

// Payment API functions
export async function createPaymentIntent(bookingId: string, data: CreatePaymentIntentData = {}): Promise<{
  clientSecret: string;
  paymentIntentId: string;
}> {
  const response = await fetch(`/api/bookings/${bookingId}/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create payment intent");
  }

  return response.json();
}

export async function confirmPayment(bookingId: string): Promise<Booking> {
  const response = await fetch(`/api/bookings/${bookingId}/payment`, {
    method: "PUT",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to confirm payment");
  }

  return response.json();
}

// Review API functions
export async function createReview(bookingId: string, data: CreateReviewData): Promise<unknown> {
  const response = await fetch(`/api/bookings/${bookingId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create review");
  }

  return response.json();
}

export async function getReviews(bookingId: string): Promise<unknown[]> {
  const response = await fetch(`/api/bookings/${bookingId}/review`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch reviews");
  }

  return response.json();
}
