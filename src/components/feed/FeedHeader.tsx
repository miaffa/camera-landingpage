import React from "react";
import { Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeedHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-black">Home</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-5 w-5 text-black" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-5 w-5 text-black" />
        </Button>
      </div>
    </div>
  );
}
