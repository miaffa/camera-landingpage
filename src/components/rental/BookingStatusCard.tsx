"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle, 
  CreditCard, 
  Package, 
  ArrowRight, 
  Star,
  MessageSquare,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

interface BookingStatusCardProps {
  booking: {
    id: string;
    status: "pending" | "approved" | "paid" | "active" | "returned" | "completed" | "cancelled" | "disputed";
    startDate: Date;
    endDate: Date;
    totalDays: number;
    totalAmount: string;
    renterAmount: string;
    renterMessage?: string;
    ownerMessage?: string;
    pickupLocation?: string;
    returnLocation?: string;
    createdAt: Date;
    gearName: string;
    gearCategory: string;
    gearImages: string[];
    ownerName?: string;
    ownerImage?: string;
  };
  userRole: "renter" | "owner";
  onAction?: (action: string, bookingId: string) => void;
}

const statusConfig = {
  pending: {
    label: "Pending Approval",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    description: "Waiting for owner to approve your request"
  },
  approved: {
    label: "Approved",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
    description: "Owner approved! Complete payment to confirm rental"
  },
  paid: {
    label: "Payment Complete",
    color: "bg-green-100 text-green-800",
    icon: CreditCard,
    description: "Ready for pickup"
  },
  active: {
    label: "Active Rental",
    color: "bg-purple-100 text-purple-800",
    icon: Package,
    description: "Currently renting this gear"
  },
  returned: {
    label: "Returned",
    color: "bg-orange-100 text-orange-800",
    icon: ArrowRight,
    description: "Gear returned, waiting for verification"
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: Star,
    description: "Rental completed successfully"
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: X,
    description: "This rental was cancelled"
  },
  disputed: {
    label: "Disputed",
    color: "bg-red-100 text-red-800",
    icon: X,
    description: "This rental is under dispute"
  }
};

export function BookingStatusCard({ booking, userRole, onAction }: BookingStatusCardProps) {
  const statusInfo = statusConfig[booking.status];
  const StatusIcon = statusInfo.icon;
  const isRenter = userRole === "renter";
  const isOwner = userRole === "owner";

  const getActionButton = () => {
    switch (booking.status) {
      case "pending":
        if (isOwner) {
          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onAction?.("approve", booking.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction?.("reject", booking.id)}
              >
                Reject
              </Button>
            </div>
          );
        }
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAction?.("cancel", booking.id)}
          >
            Cancel Request
          </Button>
        );

      case "approved":
        if (isRenter) {
          return (
            <Button
              size="sm"
              onClick={() => onAction?.("pay", booking.id)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Complete Payment
            </Button>
          );
        }
        return (
          <span className="text-sm text-gray-600">
            Waiting for payment
          </span>
        );

      case "paid":
        if (isOwner) {
          return (
            <Button
              size="sm"
              onClick={() => onAction?.("confirm-pickup", booking.id)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Confirm Pickup
            </Button>
          );
        }
        return (
          <span className="text-sm text-gray-600">
            Ready for pickup
          </span>
        );

      case "active":
        if (isRenter) {
          return (
            <Button
              size="sm"
              onClick={() => onAction?.("return", booking.id)}
              variant="outline"
            >
              Mark as Returned
            </Button>
          );
        }
        return (
          <span className="text-sm text-gray-600">
            Rental in progress
          </span>
        );

      case "returned":
        if (isOwner) {
          return (
            <Button
              size="sm"
              onClick={() => onAction?.("complete", booking.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Rental
            </Button>
          );
        }
        return (
          <span className="text-sm text-gray-600">
            Waiting for owner verification
          </span>
        );

      case "completed":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAction?.("review", booking.id)}
          >
            Leave Review
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Gear Image */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
              {booking.gearImages && booking.gearImages.length > 0 ? (
                <img
                  src={booking.gearImages[0]}
                  alt={booking.gearName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>

            <div>
              <CardTitle className="text-lg">{booking.gearName}</CardTitle>
              <p className="text-sm text-gray-600">{booking.gearCategory}</p>
            </div>
          </div>

          <Badge className={cn("font-medium", statusInfo.color)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Description */}
        <p className="text-sm text-gray-600">{statusInfo.description}</p>

        {/* Rental Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Start Date:</span>
            <p className="font-medium">{format(booking.startDate, "MMM dd, yyyy")}</p>
          </div>
          <div>
            <span className="text-gray-500">End Date:</span>
            <p className="font-medium">{format(booking.endDate, "MMM dd, yyyy")}</p>
          </div>
          <div>
            <span className="text-gray-500">Duration:</span>
            <p className="font-medium">{booking.totalDays} day{booking.totalDays !== 1 ? 's' : ''}</p>
          </div>
          <div>
            <span className="text-gray-500">Total:</span>
            <p className="font-medium">${parseFloat(booking.renterAmount).toFixed(2)}</p>
          </div>
        </div>

        {/* Messages */}
        {(booking.renterMessage || booking.ownerMessage) && (
          <div className="space-y-2">
            {booking.renterMessage && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Renter Message:</p>
                <p className="text-sm text-blue-800">{booking.renterMessage}</p>
              </div>
            )}
            {booking.ownerMessage && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-900">Owner Response:</p>
                <p className="text-sm text-green-800">{booking.ownerMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Pickup/Return Locations */}
        {(booking.pickupLocation || booking.returnLocation) && (
          <div className="space-y-2">
            {booking.pickupLocation && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Pickup:</span>
                <span className="font-medium">{booking.pickupLocation}</span>
              </div>
            )}
            {booking.returnLocation && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Return:</span>
                <span className="font-medium">{booking.returnLocation}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAction?.("message", booking.id)}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Message
            </Button>
            <Button
              size="sm"
              variant="ghost"
              asChild
            >
              <Link href={`/bookings/${booking.id}`}>
                View Details
              </Link>
            </Button>
          </div>

          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  );
}
