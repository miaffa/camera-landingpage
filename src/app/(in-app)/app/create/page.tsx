"use client";

import React from "react";
import { Plus, Camera, Video, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatePage() {
  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">List Your Gear</h1>
        <p className="text-muted-foreground">
          Share your camera equipment and start earning from rentals
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Camera className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Camera</CardTitle>
                <CardDescription>DSLR, Mirrorless, Film cameras</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Video Equipment</CardTitle>
                <CardDescription>Camcorders, gimbals, lighting</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Mic className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Audio Equipment</CardTitle>
                <CardDescription>Microphones, recorders, accessories</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* CTA Button */}
      <Button className="w-full" size="lg">
        <Plus className="h-4 w-4 mr-2" />
        Start Listing Gear
      </Button>

      {/* Placeholder Content */}
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Plus className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Start by adding your first piece of equipment to begin earning from rentals.
        </p>
      </div>
    </div>
  );
}
