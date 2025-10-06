"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { Next13ProgressBar } from "next13-progressbar";
import { SWRConfig } from "swr";
import { fetcher } from "@/lib/swr/fetcher";
import { ThemeProvider } from "next-themes";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <Suspense>
        <SessionProvider>
          <SWRConfig 
            value={{ 
              fetcher,
              revalidateOnFocus: false, // Disable focus revalidation
              revalidateOnReconnect: false, // Disable reconnect revalidation
              revalidateIfStale: false, // Don't revalidate if data exists
              revalidateOnMount: true, // Only revalidate on initial mount
              dedupingInterval: 30000, // Increase to 30 seconds
              focusThrottleInterval: 60000, // Throttle focus events to 1 minute
              keepPreviousData: true, // Keep previous data while loading new
              errorRetryCount: 3, // Retry failed requests 3 times
              errorRetryInterval: 5000, // Wait 5 seconds between retries
            }}
          >
            <Next13ProgressBar
              height="4px"
              color="hsl(var(--primary))"
              options={{ showSpinner: true }}
              showOnShallow
            />

            {children}
            <Toaster position="top-center" richColors />
          </SWRConfig>
        </SessionProvider>
      </Suspense>
    </ThemeProvider>
  );
}

export default Providers;
