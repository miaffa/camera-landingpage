"use client";

import React, { useState, useEffect } from "react";
import { X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface GearCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gearData: GearData) => void;
}

interface GearData {
  name: string;
  category: string;
  description: string;
  price: number;
  condition: string;
  location: string;
  images: File[];
  availability: {
    startDate: string;
    endDate: string;
    available: boolean;
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

export function GearCreationModal({ isOpen, onClose, onSave }: GearCreationModalProps) {
  const [gearData, setGearData] = useState<GearData>({
    name: "",
    category: "",
    description: "",
    price: 45,
    condition: "Excellent",
    location: "",
    images: [],
    availability: {
      startDate: "",
      endDate: "",
      available: true,
    },
  });
  const [paymentSetupComplete, setPaymentSetupComplete] = useState<boolean | null>(null);

  // Check payment setup status when modal opens
  useEffect(() => {
    if (isOpen) {
      const checkPaymentStatus = async () => {
        try {
          const response = await fetch("/api/stripe/connect/account-status");
          if (response.ok) {
            const data = await response.json();
            setPaymentSetupComplete(data.onboardingComplete);
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      };
      checkPaymentStatus();
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof GearData, value: unknown) => {
    setGearData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvailabilityChange = (field: keyof GearData['availability'], value: unknown) => {
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

  const handleRemoveImage = (index: number) => {
    setGearData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSave(gearData);
    onClose();
  };

  const handleClose = () => {
    // Reset form data when closing
    setGearData({
      name: "",
      category: "",
      description: "",
      price: 45,
      condition: "Excellent",
      location: "",
      images: [],
      availability: {
        startDate: "",
        endDate: "",
        available: true,
      },
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Add New Gear
          </DialogTitle>
        </DialogHeader>

        {/* Payment Setup Warning */}
        {paymentSetupComplete === false && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to set up payments before listing gear. Complete payment setup to start receiving money from rentals.
            </AlertDescription>
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
              />
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="images">Upload Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="mb-4"
              />
              
              {gearData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {gearData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Gear ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
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
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Available Until</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={gearData.availability.endDate}
                    onChange={(e) => handleAvailabilityChange("endDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!gearData.name || !gearData.category}>
            Add Gear
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
