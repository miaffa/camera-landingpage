"use client";

import React, { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

interface MapboxMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
}

export function MapboxMap({ latitude, longitude, zoom = 14, className = "" }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<unknown>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Only load Mapbox if token is available
    if (!mapboxToken) {
      return;
    }

    // Dynamic import to avoid SSR issues
    import("mapbox-gl").then((mapboxgl) => {
      mapboxgl.default.accessToken = mapboxToken;

      if (map.current) return; // Initialize map only once

      map.current = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [longitude, latitude],
        zoom: zoom,
      });

      // Add marker
      new mapboxgl.default.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map.current as mapboxgl.Map);
    });

    return () => {
      if (map.current) {
        (map.current as mapboxgl.Map).remove();
      }
    };
  }, [latitude, longitude, zoom]);

  // Get the Mapbox token from environment
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
  // Fallback UI when no token
  if (!mapboxToken) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center relative ${className}`}>
        {/* Mock map background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-gray-200"></div>
            ))}
          </div>
        </div>
        
        {/* Location Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <MapPin className="h-8 w-8 text-blue-600 drop-shadow-lg" />
        </div>
        
        {/* Map Info */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Interactive Map View</p>
            <p className="text-xs text-gray-500">
              Add Mapbox token for full functionality
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
