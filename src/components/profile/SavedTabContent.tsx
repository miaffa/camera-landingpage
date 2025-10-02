import React from "react";
import { Camera, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockSavedItems } from "@/lib/data/mock-data";

export function SavedTabContent() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {mockSavedItems.map((item) => (
        <Card key={item.id} className="bg-white border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
            <p className="text-sm text-gray-500 mb-2">by {item.owner}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">${item.price}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
