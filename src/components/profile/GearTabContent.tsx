"use client";

import React, { useState } from "react";
import { Camera, Plus, Star, MapPin, MoreVertical, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GearCreationModal } from "@/components/create/GearCreationModal";
import { GearEditModal } from "@/components/create/GearEditModal";
import { useUserGear } from "@/lib/gear/useUserGear";
import { useGearCreate } from "@/lib/gear/useGearCreate";

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
  availableFrom?: string;
  availableUntil?: string;
}

export function GearTabContent() {
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);
  const [editingGear, setEditingGear] = useState<GearItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { gear, isLoading, mutate } = useUserGear();
  const { createGear } = useGearCreate();

  const handleAddGear = () => {
    setIsGearModalOpen(true);
  };

  const handleSaveGear = async (gearData: unknown) => {
    try {
      const data = gearData as { name: string; category: string; description: string; pricePerDay: number; condition: string; location: string; images: string[]; isAvailable: boolean; availability: { availableFrom: string; availableUntil: string } };
      await createGear({
        name: data.name,
        category: data.category,
        description: data.description,
        price: data.pricePerDay,
        condition: data.condition,
        location: data.location,
        images: data.images as unknown as File[],
        availability: {
          startDate: data.availability.availableFrom,
          endDate: data.availability.availableUntil,
          available: data.isAvailable
        }
      });
      // Refresh the gear list
      mutate();
    } catch (err) {
      console.error("Failed to save gear:", err);
    }
  };

  const handleEditGear = (gearItem: GearItem) => {
    setEditingGear(gearItem);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingGear(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Expand Your Inventory CTA */}
      <Card className="bg-gradient-to-br from-blue-50 to-pink-50 border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expand Your Inventory</h3>
              <p className="text-gray-600 mb-4">Add new gear to boost your rental income</p>
              <Button onClick={handleAddGear} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Gear
              </Button>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gear Listings Grid */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
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
          ))
        ) : gear.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-gray-100 p-4">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No gear listed yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by adding your first piece of equipment to rent out
                </p>
                <Button onClick={handleAddGear} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Gear
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : gear.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-gray-100 p-4">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No gear listed yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by adding your first piece of equipment to rent out
                </p>
                <Button onClick={handleAddGear} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Gear
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          gear.map((gearItem) => (
            <Card key={gearItem.id} className="bg-white border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {gearItem.images && gearItem.images.length > 0 ? (
                    <img
                      src={gearItem.images[0]}
                      alt={gearItem.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          {gearItem.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {gearItem.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{gearItem.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{gearItem.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {gearItem.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {gearItem.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {gearItem.condition}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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
                        <div className="font-bold text-gray-900">${gearItem.pricePerDay}</div>
                        <div className="text-xs text-gray-500">per day</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Gear Creation Modal */}
      <GearCreationModal
        isOpen={isGearModalOpen}
        onClose={() => setIsGearModalOpen(false)}
        onSave={handleSaveGear}
      />

      {/* Gear Edit Modal */}
      {editingGear && (
        <GearEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          gear={{
            ...editingGear,
            pricePerDay: editingGear?.pricePerDay?.toString() || "0",
            availableFrom: editingGear?.availableFrom || "",
            availableUntil: editingGear?.availableUntil || ""
          }}
        />
      )}
    </div>
  );
}
