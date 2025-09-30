"use client";

import { useState, useEffect } from "react";

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  isStandalone: boolean;
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: true,
    isStandalone: false,
  });

  useEffect(() => {
    // Check if app is running in standalone mode (installed)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    
    // Check online status
    const isOnline = navigator.onLine;

    setPwaState(prev => ({
      ...prev,
      isStandalone,
      isOnline,
    }));

    // Listen for online/offline events
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaState(prev => ({ ...prev, isInstallable: true }));
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setPwaState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isInstallable: false 
      }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (!pwaState.isInstallable) return false;

    try {
      // This will be handled by the PWAInstallPrompt component
      // which has access to the deferredPrompt
      return true;
    } catch (error) {
      console.error("Error installing PWA:", error);
      return false;
    }
  };

  const updateServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
          window.location.reload();
          return true;
        }
      } catch (error) {
        console.error("Error updating service worker:", error);
      }
    }
    return false;
  };

  return {
    ...pwaState,
    installPWA,
    updateServiceWorker,
  };
}
