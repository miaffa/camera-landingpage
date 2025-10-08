"use client";

import { useState, useEffect } from "react";

interface LazyTabContentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

export function LazyTabContent({ 
  children, 
  fallback = <div className="animate-pulse bg-gray-100 h-32 rounded-lg" />,
  delay = 100
}: LazyTabContentProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
