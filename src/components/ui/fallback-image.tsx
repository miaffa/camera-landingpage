"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FallbackImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackIcon?: React.ReactNode;
  fallbackText?: string;
}

export function FallbackImage({
  src,
  alt,
  width = 400,
  height = 300,
  className,
  fallbackIcon,
  fallbackText,
}: FallbackImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-gray-100 text-gray-400",
          className
        )}
        style={{ width, height }}
      >
        {fallbackIcon || <Camera className="h-8 w-8 mb-2" />}
        {fallbackText && (
          <span className="text-sm text-center px-2">{fallbackText}</span>
        )}
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <ImageIcon className="h-8 w-8 animate-pulse text-gray-400" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "object-cover transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        unoptimized // For external images
      />
    </div>
  );
}
