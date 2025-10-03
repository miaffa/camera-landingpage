"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Calendar, MapPin, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface BookingDetails {
  id: string;
  gearName: string;
  gearCategory: string;
  gearImages: string[];
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  totalAmount: number;
  status: string;
  ownerName: string;
  pickupLocation: string;
  returnLocation: string;
}

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bookingId = params.id as string;

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch booking details");
        }
        const bookingData = await response.json();
        setBooking(bookingData);
      } catch (err) {
        console.error("Error fetching booking:", err);
        toast.error("Failed to load booking details");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Booking Not Found</h2>
              <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
              <Button onClick={() => router.push("/app")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="text-gray-600 mt-2">
              Your rental has been confirmed. You'll receive a confirmation email shortly.
            </p>
          </div>
        </div>

        {/* Booking Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                {booking.gearImages && booking.gearImages.length > 0 ? (
                  <img
                    src={booking.gearImages[0]}
                    alt={booking.gearName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{booking.gearName}</h3>
                <p className="text-gray-600 capitalize">{booking.gearCategory}</p>
                <Badge className="mt-1 bg-green-100 text-green-800">
                  {booking.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Duration:</span>
                <span className="font-medium">{booking.totalDays} days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Daily Rate:</span>
                <span className="font-medium">${booking.dailyRate}/day</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Total Paid:</span>
                <span className="font-medium">${booking.totalAmount}</span>
              </div>
              {booking.pickupLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>Pickup: {booking.pickupLocation}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Contact the Owner</p>
                  <p className="text-sm text-gray-600">
                    Message {booking.ownerName} to arrange pickup details and any questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Pick Up Your Gear</p>
                  <p className="text-sm text-gray-600">
                    Meet at the agreed location and time to collect your rental.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Enjoy Your Rental</p>
                  <p className="text-sm text-gray-600">
                    Use your gear and return it in the same condition.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push(`/app/messages`)}
            className="flex-1"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Owner
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/app/bookings`)}
            className="flex-1"
          >
            View All Bookings
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/app")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
