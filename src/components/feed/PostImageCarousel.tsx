"use client"

import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostImageCarouselProps {
  images: string[];
  className?: string;
}

function PostImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center`}>
        <div className="text-center">
          <Camera className="h-16 w-16 text-blue-400 mx-auto mb-2" />
          <p className="text-sm text-blue-600 font-medium">Photo Shared</p>
        </div>
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

export function PostImageCarousel({ images, className }: PostImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextImage(); // Swipe left - next image
      } else {
        prevImage(); // Swipe right - previous image
      }
    }
    
    setIsDragging(false);
  };

  // Mouse drag handling for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const endX = e.clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // Minimum drag distance
      if (diff > 0) {
        nextImage(); // Drag left - next image
      } else {
        prevImage(); // Drag right - previous image
      }
    }
    
    setIsDragging(false);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Main Image Display */}
      <div 
        className="relative aspect-square bg-gray-100 flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <PostImage 
          src={images[currentIndex]} 
          alt={`Post image ${currentIndex + 1}`} 
          className="w-full h-full object-cover select-none"
        />

        {/* Navigation Arrows (only show if multiple images) */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/20 hover:bg-black/40 text-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/20 hover:bg-black/40 text-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1}/{images.length}
          </div>
        )}

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentIndex 
                    ? "bg-white" 
                    : "bg-white/50 hover:bg-white/70"
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
