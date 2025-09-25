"use client";

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
      defaultTheme="light"
      enableSystem
    >
      <Suspense>
        <SWRConfig value={{ fetcher }}>
          <Next13ProgressBar
            height="4px"
            color="var(--primary)"
            options={{ showSpinner: true }}
            showOnShallow
          />

          {children}
          <Toaster position="top-center" richColors />
        </SWRConfig>
      </Suspense>
    </ThemeProvider>
  );
}

export default Providers;
