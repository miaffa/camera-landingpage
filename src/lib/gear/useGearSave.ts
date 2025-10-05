"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";

interface UseGearSaveProps {
  gearId: string;
  initialSaved?: boolean;
}

export function useGearSave({ gearId, initialSaved = false }: UseGearSaveProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const saveGear = async () => {
    if (isLoading) return;
    
    console.log('Attempting to save gear:', gearId);
    setIsLoading(true);
    const previousState = isSaved;
    
    // Optimistic update
    setIsSaved(true);
    
    try {
      const response = await fetch(`/api/gear/${gearId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Save response:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        // Revert on error
        setIsSaved(previousState);
        throw new Error(errorData.error || 'Failed to save gear');
      }
    } catch (error) {
      // Revert on error
      setIsSaved(previousState);
      console.error('Error saving gear:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const unsaveGear = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const previousState = isSaved;
    
    // Optimistic update
    setIsSaved(false);
    
    try {
      const response = await fetch(`/api/gear/${gearId}/save`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Revert on error
        setIsSaved(previousState);
        throw new Error('Failed to unsave gear');
      }
    } catch (error) {
      // Revert on error
      setIsSaved(previousState);
      console.error('Error unsaving gear:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSave = () => {
    if (isSaved) {
      unsaveGear();
    } else {
      saveGear();
    }
  };

  return {
    isSaved,
    isLoading,
    saveGear,
    unsaveGear,
    toggleSave,
  };
}
