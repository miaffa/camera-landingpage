"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingStatusCard } from "@/components/rental/BookingStatusCard";
import { useBookings } from "@/lib/bookings/useBookings";
import { updateBookingStatus, cancelBooking } from "@/lib/bookings/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "paid", label: "Paid" },
  { value: "active", label: "Active" },
  { value: "returned", label: "Returned" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activeTab, setActiveTab] = useState("rented");

  const { bookings: rentedBookings, isLoading: rentedLoading } = useBookings({
    type: "rented",
    status: selectedStatus || undefined,
  });

  const { bookings: ownedBookings, isLoading: ownedLoading } = useBookings({
    type: "owned",
    status: selectedStatus || undefined,
  });

  const handleBookingAction = async (action: string, bookingId: string) => {
    try {
      switch (action) {
        case "approve":
          await updateBookingStatus({
            bookingId,
            status: "approved",
            message: "Booking approved! Please complete payment to confirm rental.",
          });
          toast.success("Booking approved successfully!");
          break;

        case "reject":
          await updateBookingStatus({
            bookingId,
            status: "cancelled",
            message: "Booking request declined.",
          });
          toast.success("Booking request declined.");
          break;

        case "cancel":
          await cancelBooking(bookingId);
          toast.success("Booking cancelled successfully!");
          break;

        case "pay":
          // Navigate to payment page
          router.push(`/bookings/${bookingId}/payment`);
          break;

        case "confirm-pickup":
          await updateBookingStatus({
            bookingId,
            status: "active",
            message: "Gear picked up successfully!",
          });
          toast.success("Pickup confirmed!");
          break;

        case "return":
          await updateBookingStatus({
            bookingId,
            status: "returned",
            message: "Gear returned for verification.",
          });
          toast.success("Return marked successfully!");
          break;

        case "complete":
          await updateBookingStatus({
            bookingId,
            status: "completed",
            message: "Rental completed successfully!",
          });
          toast.success("Rental completed!");
          break;

        case "review":
          // Navigate to review page
          router.push(`/bookings/${bookingId}/review`);
          break;

        case "message":
          // Navigate to messages
          router.push(`/bookings/${bookingId}/messages`);
          break;

        default:
          console.log("Unknown action:", action);
      }
    } catch (error) {
      console.error("Error handling booking action:", error);
      toast.error(error instanceof Error ? error.message : "Action failed");
    }
  };

  const renderBookings = (bookings: any[], isLoading: boolean, userRole: "renter" | "owner") => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      );
    }

    if (bookings.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600 mb-4">
            {userRole === "renter" 
              ? "You haven't rented any gear yet. Start by browsing available equipment!"
              : "You don't have any rental requests yet. List your gear to get started!"
            }
          </p>
          {userRole === "renter" && (
            <Button asChild>
              <a href="/gear">Browse Gear</a>
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {bookings.map((booking) => (
          <BookingStatusCard
            key={booking.id}
            booking={booking}
            userRole={userRole}
            onAction={handleBookingAction}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Manage your gear rentals and requests</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rented">Rented Gear</TabsTrigger>
          <TabsTrigger value="owned">My Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="rented" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Gear You're Renting</h2>
              <span className="text-sm text-gray-600">
                {rentedBookings.length} booking{rentedBookings.length !== 1 ? 's' : ''}
              </span>
            </div>
            {renderBookings(rentedBookings, rentedLoading, "renter")}
          </div>
        </TabsContent>

        <TabsContent value="owned" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Gear Rentals</h2>
              <span className="text-sm text-gray-600">
                {ownedBookings.length} booking{ownedBookings.length !== 1 ? 's' : ''}
              </span>
            </div>
            {renderBookings(ownedBookings, ownedLoading, "owner")}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
