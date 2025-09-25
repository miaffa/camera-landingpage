"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to main dashboard with create tab active
    router.replace('/app?tab=create');
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}