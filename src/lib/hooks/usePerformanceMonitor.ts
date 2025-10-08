"use client";

import { useEffect, useRef } from "react";

export function usePerformanceMonitor(componentName: string) {
  const startTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = Date.now() - startTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${componentName} - Render #${renderCount.current} - Time: ${renderTime}ms`);
    }
  });

  const logNavigation = (from: string, to: string, time: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 Navigation: ${from} → ${to} - ${time}ms`);
    }
  };

  const logDataFetch = (endpoint: string, time: number, cached: boolean = false) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📡 Data Fetch: ${endpoint} - ${time}ms ${cached ? '(cached)' : '(fresh)'}`);
    }
  };

  return {
    logNavigation,
    logDataFetch,
  };
}
