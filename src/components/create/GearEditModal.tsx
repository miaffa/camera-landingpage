"use client";

import React, { useState, useEffect } from "react";
import { X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGearEdit } from "@/lib/gear/useGearEdit";

interface GearEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  gear: {
    id: string;
    name: string;
    category: string;
    description: string;
    pricePerDay: string;
    condition: string;
    location: string;
    images: string[];
    availableFrom?: string;
    availableUntil?: string;
    isAvailable: boolean;
  };
}

const categories = [
  "Camera",
  "Lens", 
  "Drone",
  "Lighting",
  "Audio",
  "Accessories",
  "Other"
];

const conditions = [
  "Excellent",
  "Good", 
  "Fair",
  "Poor"
];

export function GearEditModal({ isOpen, onClose, gear }: GearEditModalProps) {
  const [gearData, setGearData] = useState({
    name: "",
    category: "",
    description: "",
    price: 45,
    condition: "Excellent",
    location: "",
    images: [] as File[],
    existingImages: [] as string[],
    removedImages: [] as string[],
    availability: {
      startDate: "",
      endDate: "",
      available: true,
    },
  });

  const { editGear, isLoading, error } = useGearEdit();

  // Initialize form data when gear changes
  useEffect(() => {
    if (gear) {
      setGearData({
        name: gear.name,
        category: gear.category,
        description: gear.description,
        price: parseFloat(gear.pricePerDay),
        condition: gear.condition,
        location: gear.location,
        images: [],
        existingImages: gear.images,
        removedImages: [],
        availability: {
          startDate: gear.availableFrom ? new Date(gear.availableFrom).toISOString().split('T')[0] : "",
          endDate: gear.availableUntil ? new Date(gear.availableUntil).toISOString().split('T')[0] : "",
          available: gear.isAvailable,
        },
      });
    }
  }, [gear]);

  const handleInputChange = (field: keyof typeof gearData, value: unknown) => {
    setGearData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvailabilityChange = (field: keyof typeof gearData['availability'], value: unknown) => {
    setGearData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [field]: value,
      },
    }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setGearData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveNewImage = (index: number) => {
    setGearData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveExistingImage = (index: number) => {
    const imageToRemove = gearData.existingImages[index];
    setGearData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
      removedImages: [...prev.removedImages, imageToRemove],
    }));
  };

  const handleSave = async () => {
    try {
      await editGear(gear.id, gearData);
      onClose();
    } catch (err) {
      console.error("Failed to update gear:", err);
    }
  };

  const handleClose = () => {
    // Reset form data when closing
    if (gear) {
      setGearData({
        name: gear.name,
        category: gear.category,
        description: gear.description,
        price: parseFloat(gear.pricePerDay),
        condition: gear.condition,
        location: gear.location,
        images: [],
        existingImages: gear.images,
        removedImages: [],
        availability: {
          startDate: gear.availableFrom ? new Date(gear.availableFrom).toISOString().split('T')[0] : "",
          endDate: gear.availableUntil ? new Date(gear.availableUntil).toISOString().split('T')[0] : "",
          available: gear.isAvailable,
        },
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Gear
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gearName">Gear Name</Label>
                  <Input
                    id="gearName"
                    placeholder="e.g., Canon EOS R5"
                    value={gearData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={gearData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your gear, its features, and what makes it special..."
                    value={gearData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="min-h-[100px] resize-none"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price per Day ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={gearData.price}
                      onChange={(e) => handleInputChange("price", Number(e.target.value))}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={gearData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={gearData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="images">Upload New Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="mb-4"
                  disabled={isLoading}
                />
                
                {/* Existing Images */}
                {gearData.existingImages.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Current Images</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {gearData.existingImages.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={imageUrl}
                            alt={`Gear ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemoveExistingImage(index)}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {gearData.images.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">New Images</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {gearData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`New Gear ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemoveNewImage(index)}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="availability" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Available From</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={gearData.availability.startDate}
                      onChange={(e) => handleAvailabilityChange("startDate", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Available Until</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={gearData.availability.endDate}
                      onChange={(e) => handleAvailabilityChange("endDate", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!gearData.name || !gearData.category || isLoading}
            >
              {isLoading ? "Updating..." : "Update Gear"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
