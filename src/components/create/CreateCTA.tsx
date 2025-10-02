import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateCTAProps {
  onStartListing: () => void;
}

export function CreateCTA({ onStartListing }: CreateCTAProps) {
  return (
    <Button className="w-full" size="lg" onClick={onStartListing}>
      <Plus className="h-4 w-4 mr-2" />
      Start Listing Gear
    </Button>
  );
}
