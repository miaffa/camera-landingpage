import React from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationFilter() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="h-4 w-4" />
      <span>Louisville, KY</span>
      <Button variant="ghost" size="sm" className="h-auto p-1">
        Change
      </Button>
    </div>
  );
}
