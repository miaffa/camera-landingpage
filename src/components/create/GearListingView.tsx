"use client";

import React, { useState } from "react";
import { Plus, Camera, MapPin, Calendar, MoreVertical, Edit, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUserGear } from "@/lib/gear/useUserGear";
import { GearEditModal } from "./GearEditModal";
import { BookingActions } from "@/components/messages/BookingActions";
import { ConnectOnboarding } from "@/components/stripe/ConnectOnboarding";
import useSWR from "swr";

interface GearItem {
  id: string;
  name: string;
  category: string;
  pricePerDay: string;
  condition: string;
  location: string;
  images: string[];
  isAvailable: boolean;
}

interface BookingRequest {
  id: string;
  gearId: string;
  renterName: string;
  renterEmail: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  renterMessage: string;
  createdAt: string;
}

interface GearListingViewProps {
  onAddGear: () => void;
}


export function GearListingView({ onAddGear }: GearListingViewProps) {
  const { gear, isLoading, mutate: refreshGear } = useUserGear();
  const [editingGear, setEditingGear] = useState<unknown>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch booking requests
  const { data: bookingRequests, mutate: refreshRequests } = useSWR<BookingRequest[]>(
    "/api/bookings/owner-requests",
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) return [];
      return response.json();
    }
  );

  const handleEditGear = (gearItem: unknown) => {
    setEditingGear(gearItem);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingGear(null);
  };

  // Get booking requests for a specific gear item
  const getRequestsForGear = (gearId: string) => {
    return bookingRequests?.filter((request: { gearId: string }) => request.gearId === gearId) || [];
  };

  // Get the most recent request for a gear item
  const getLatestRequest = (gearId: string) => {
    const requests = getRequestsForGear(gearId);
    return requests.length > 0 ? requests[0] : null;
  };

  // Get status for gear item based on requests
  const getGearStatus = (gearItem: GearItem) => {
    const requests = getRequestsForGear(gearItem.id);
    const pendingRequests = requests.filter(r => r.status === "pending");
    const approvedRequests = requests.filter(r => r.status === "approved");
    
    if (approvedRequests.length > 0) {
      return { status: "rented", label: "Rented Out", color: "bg-blue-100 text-blue-800" };
    } else if (pendingRequests.length > 0) {
      return { status: "pending", label: `${pendingRequests.length} Request${pendingRequests.length > 1 ? 's' : ''}`, color: "bg-yellow-100 text-yellow-800" };
    } else if (gearItem.isAvailable) {
      return { status: "available", label: "Available", color: "bg-green-100 text-green-800" };
    } else {
      return { status: "unavailable", label: "Unavailable", color: "bg-red-100 text-red-800" };
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Gear</h2>
            <p className="text-sm text-gray-600">Manage your equipment listings</p>
          </div>
          <Button onClick={onAddGear} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Gear
          </Button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

      return (
        <div className="flex flex-col gap-6">
          {/* Payment Setup Section */}
          <ConnectOnboarding />

          {/* Header with Add Gear Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Gear</h2>
              <p className="text-sm text-gray-600">Manage your equipment listings</p>
            </div>
            <Button onClick={onAddGear} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Gear
            </Button>
          </div>

      {/* Gear List */}
      <div className="flex flex-col gap-4">
        {gear.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-gray-100 p-4">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No gear listed yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by adding your first piece of equipment to rent out
                </p>
                <div className="flex justify-center">
                  <Button onClick={onAddGear} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Gear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          gear.map((gearItem) => {
            const gearStatus = getGearStatus(gearItem);
            const latestRequest = getLatestRequest(gearItem.id);
            const allRequests = getRequestsForGear(gearItem.id);
            
            return (
              <Card key={gearItem.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Gear Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {gearItem.images && gearItem.images.length > 0 ? (
                        <img
                          src={gearItem.images[0]}
                          alt={gearItem.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Gear Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 truncate">
                            {gearItem.name}
                          </h3>
                          <p className="text-sm text-gray-600">{gearItem.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditGear(gearItem)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Gear
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${gearItem.pricePerDay}/day
                            </p>
                            <Badge className={gearStatus.color}>
                              {gearStatus.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        {gearItem.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {gearItem.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {gearItem.condition}
                        </div>
                      </div>

                      {/* Booking Requests Section */}
                      {allRequests.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-700">
                                {allRequests.length} Request{allRequests.length > 1 ? 's' : ''}
                              </span>
                            </div>
                            {latestRequest && latestRequest.status === "pending" && (
                              <BookingActions
                                bookingId={latestRequest.id}
                                status={latestRequest.status}
                                onStatusChange={() => {
                                  refreshRequests();
                                  refreshGear();
                                }}
                              />
                            )}
                            {latestRequest && latestRequest.status === "approved" && (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => window.open(`/app/bookings/${latestRequest.id}/payment`, '_blank')}
                              >
                                Complete Payment
                              </Button>
                            )}
                          </div>
                          
                          {/* Show latest request details */}
                          {latestRequest && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">
                                  From: {latestRequest.renterName}
                                </span>
                                <span className="text-gray-500">
                                  {new Date(latestRequest.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {latestRequest.renterMessage && (
                                <p className="text-xs text-gray-700 mt-1 truncate">
                                  &quot;{latestRequest.renterMessage}&quot;
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                <span>{new Date(latestRequest.startDate).toLocaleDateString()}</span>
                                <span>-</span>
                                <span>{new Date(latestRequest.endDate).toLocaleDateString()}</span>
                                <span className="font-medium">${latestRequest.totalAmount}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Gear Edit Modal */}
      {editingGear && (
        <GearEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          gear={editingGear}
        />
      )}
    </div>
  );
}
