"use client";

import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <WifiOff className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">You&apos;re offline</h1>
          <p className="text-muted-foreground max-w-md">
            It looks like you&apos;re not connected to the internet. Check your connection and try again.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>Some features may be available offline:</p>
            <ul className="mt-2 space-y-1">
              <li>• Cached gear listings and photos</li>
              <li>• Previously viewed profiles</li>
              <li>• Basic app functionality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
