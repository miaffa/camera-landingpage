"use client";

import React, { useState, useRef, useCallback } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PhotoCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function PhotoCropper({ imageSrc, onCropComplete, onCancel, isOpen }: PhotoCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect] = useState<number | undefined>(1); // Square aspect ratio
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        1, // Square aspect ratio
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }, []);

  // Update preview canvas when crop changes
  const updatePreview = useCallback(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    // Set canvas size to preview size
    const size = 64; // 64px preview
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Create circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.clip();

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingQuality = "high";

    // Calculate source coordinates
    const sourceX = (crop.x * scaleX);
    const sourceY = (crop.y * scaleY);
    const sourceWidth = (crop.width * scaleX);
    const sourceHeight = (crop.height * scaleY);
    
    // Draw the cropped image
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      size,
      size
    );

    ctx.restore();
  }, [completedCrop]);

  // Update preview when crop or scale/rotate changes
  React.useEffect(() => {
    updatePreview();
  }, [updatePreview, scale, rotate]);

  const onDownloadCropClick = useCallback(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Set canvas size to crop size (square for circular crop)
    const size = Math.min(crop.width, crop.height);
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Create circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.clip();

    // Reset transform and apply scale/rotation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingQuality = "high";

    // Calculate source coordinates (accounting for scale and rotation)
    const sourceX = (crop.x * scaleX);
    const sourceY = (crop.y * scaleY);
    const sourceWidth = (crop.width * scaleX);
    const sourceHeight = (crop.height * scaleY);
    
    // Draw the cropped image directly
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      size,
      size
    );

    ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, "image/jpeg", 0.9);
  }, [completedCrop, onCropComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Crop Your Photo</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="mb-4 relative">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minWidth={100}
              minHeight={100}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
                className="max-h-[400px] w-auto"
              />
            </ReactCrop>
            
            {/* Circular mask overlay */}
            {completedCrop && (
              <div 
                className="absolute pointer-events-none"
                style={{
                  left: completedCrop.x,
                  top: completedCrop.y,
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              >
                {/* Circular border */}
                <div 
                  className="absolute border-2 border-white rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: Math.min(completedCrop.width, completedCrop.height),
                    height: Math.min(completedCrop.width, completedCrop.height),
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
            )}
          </div>

          {/* Preview of circular crop */}
          {completedCrop && (
            <div className="mb-4 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                  <canvas
                    ref={previewCanvasRef}
                    className="w-full h-full"
                    style={{ display: 'block' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label htmlFor="scale" className="text-sm font-medium">
                Scale:
              </label>
              <input
                id="scale"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="rotate" className="text-sm font-medium">
                Rotate:
              </label>
              <input
                id="rotate"
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotate}
                onChange={(e) => setRotate(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600">{rotate}°</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onDownloadCropClick} disabled={!completedCrop}>
              Use This Photo
            </Button>
          </div>
        </div>

        {/* Hidden canvas for processing */}
        <canvas
          ref={previewCanvasRef}
          style={{
            display: "none",
          }}
        />
      </div>
    </div>
  );
}
