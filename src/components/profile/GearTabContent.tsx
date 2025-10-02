import React from "react";
import { Camera, Plus, Star, MapPin, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockGearListings } from "@/lib/data/mock-data";

export function GearTabContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Expand Your Inventory CTA */}
      <Card className="bg-gradient-to-br from-blue-50 to-pink-50 border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expand Your Inventory</h3>
              <p className="text-gray-600 mb-4">Add new gear to boost your rental income</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Gear
              </Button>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gear Listings Grid */}
      <div className="grid grid-cols-1 gap-4">
        {mockGearListings.map((gear) => (
          <Card key={gear.id} className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          {gear.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{gear.status}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{gear.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{gear.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {gear.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {gear.rating}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">${gear.price}</div>
                        <div className="text-xs text-gray-500">per day</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
