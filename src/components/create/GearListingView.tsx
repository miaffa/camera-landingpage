"use client";

import React, { useState } from "react";
import { Plus, Camera, MapPin, Calendar, MoreVertical, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useUserGear } from "@/lib/gear/useUserGear";
import { GearEditModal } from "./GearEditModal";

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

interface GearListingViewProps {
  onAddGear: () => void;
}


export function GearListingView({ onAddGear }: GearListingViewProps) {
  const { gear, isLoading } = useUserGear();
  const [editingGear, setEditingGear] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditGear = (gearItem: any) => {
    setEditingGear(gearItem);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingGear(null);
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
          gear.map((gearItem) => (
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
                          <span className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                            gearItem.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}>
                            {gearItem.isAvailable ? "Available" : "Unavailable"}
                          </span>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
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
