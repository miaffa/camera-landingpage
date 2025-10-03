"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Calendar, MapPin, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
  platformFee: number;
  ownerAmount: number;
  renterAmount: number;
  status: string;
  renterName: string;
  ownerName: string;
  pickupLocation: string;
  returnLocation: string;
}

function PaymentForm({ booking, clientSecret }: { booking: BookingDetails; clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/app/bookings/${booking.id}/success`,
        },
      });

      if (error) {
        toast.error(error.message || "Payment failed");
      } else {
        toast.success("Payment successful!");
        router.push(`/app/bookings/${booking.id}/success`);
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Information</h3>
        <PaymentElement />
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Booking Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Rental Period</span>
            <span className="font-medium">
              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Daily Rate</span>
            <span className="font-medium">${booking.dailyRate}/day</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Total Days</span>
            <span className="font-medium">{booking.totalDays} days</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${booking.ownerAmount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Platform Fee</span>
            <span className="font-medium">${booking.platformFee}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount</span>
            <span>${booking.renterAmount}</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700"
        size="lg"
      >
        {isProcessing ? "Processing..." : `Pay $${booking.renterAmount}`}
      </Button>
    </form>
  );
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const bookingId = params.id as string;

  useEffect(() => {
    const fetchBookingAndCreatePayment = async () => {
      try {
        // Fetch booking details
        const bookingResponse = await fetch(`/api/bookings/${bookingId}`);
        if (!bookingResponse.ok) {
          throw new Error("Failed to fetch booking details");
        }
        const bookingData = await bookingResponse.json();
        setBooking(bookingData);

        // Create payment intent
        const paymentResponse = await fetch(`/api/bookings/${bookingId}/payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json();
          throw new Error(errorData.error || "Failed to create payment intent");
        }

        const paymentData = await paymentResponse.json();
        setClientSecret(paymentData.clientSecret);
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load payment information");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingAndCreatePayment();
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

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Payment Error</h2>
              <p className="text-gray-600 mb-4">{error || "Booking not found"}</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (booking.status !== "approved") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Payment Not Available</h2>
              <p className="text-gray-600 mb-4">
                This booking is not approved for payment. Current status: {booking.status}
              </p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
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
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
            <p className="text-gray-600">Secure payment powered by Stripe</p>
          </div>
        </div>

        {/* Gear Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Rental Details
            </CardTitle>
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
                    <CreditCard className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{booking.gearName}</h3>
                <p className="text-gray-600 capitalize">{booking.gearCategory}</p>
                <Badge variant="secondary" className="mt-1">
                  {booking.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>Owner: {booking.ownerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{booking.totalDays} days</span>
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

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                  },
                }}
              >
                <PaymentForm booking={booking} clientSecret={clientSecret} />
              </Elements>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-sm text-gray-500">
          <p>🔒 Your payment information is secure and encrypted</p>
          <p>Powered by Stripe • PCI DSS compliant</p>
        </div>
      </div>
    </div>
  );
}
