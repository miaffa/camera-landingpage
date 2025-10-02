import React from "react";
import { Plus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Plus className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
      <p className="text-muted-foreground max-w-sm">
        Start by adding your first piece of equipment to begin earning from rentals.
      </p>
    </div>
  );
}
