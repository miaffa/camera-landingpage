import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MessagesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground text-sm">
          Chat with gear owners and renters
        </p>
      </div>
      <Button size="icon" variant="outline">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
