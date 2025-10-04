import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImagePreviewProps {
  images: File[];
  onRemoveImage: (index: number) => void;
}

export function ImagePreview({ images, onRemoveImage }: ImagePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Clean up object URLs on unmount or when images change
  useEffect(() => {
    if (images && images.length > 0) {
      const urls = images.map(file => {
        if (file && file instanceof File) {
          return URL.createObjectURL(file);
        }
        return '';
      }).filter(url => url !== '');
      setImageUrls(urls);
    } else {
      setImageUrls([]);
    }

    // Cleanup function to revoke URLs when component unmounts or images change
    return () => {
      imageUrls.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [images, imageUrls]);

  // Reset current index when images change
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images.length]);

  if (!images || images.length === 0 || imageUrls.length === 0) return null;

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

  return (
    <div className="space-y-3">
      {/* Main Image Display */}
      <div className="flex justify-center">
        <div 
          ref={containerRef}
          className="relative aspect-square w-80 h-80 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
            {imageUrls[currentIndex] && (
              <Image 
                src={imageUrls[currentIndex]} 
                alt={`Preview ${currentIndex + 1}`}
                fill
                className="object-cover select-none"
                draggable={false}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            )}
        
        {/* Remove Button */}
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={() => onRemoveImage(currentIndex)}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Navigation Arrows (only show if multiple images) */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
            {currentIndex + 1} / {images.length}
          </div>
        )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? "border-blue-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
                      {imageUrls[index] && (
                        <Image
                          src={imageUrls[index]}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        />
                      )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
