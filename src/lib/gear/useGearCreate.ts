"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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

export function useGearCreate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const createGear = async (gearData: GearData) => {
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create FormData for multipart upload with images
      const formData = new FormData();
      formData.append("name", gearData.name);
      formData.append("category", gearData.category);
      formData.append("description", gearData.description);
      formData.append("price", gearData.price.toString());
      formData.append("condition", gearData.condition);
      formData.append("location", gearData.location);
      formData.append("availability", JSON.stringify(gearData.availability));
      
      // Append image files
      gearData.images.forEach((file, index) => {
        formData.append(`image${index}`, file);
      });

      const response = await fetch("/api/gear", {
        method: "POST",
        body: formData, // Send as FormData for multipart upload
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create gear");
      }

      const newGear = await response.json();
      toast.success("Gear added successfully!");
      return newGear;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create gear";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createGear,
    isLoading,
    error,
  };
}
