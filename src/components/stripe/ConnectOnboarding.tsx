"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ConnectStatus {
  hasAccount: boolean;
  accountId: string | null;
  status: string | null;
  onboardingComplete: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

export function ConnectOnboarding() {
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  // Fetch current status
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/stripe/connect/account-status");
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
      toast.error("Failed to load payment status");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Create Connect account
  const createAccount = useCallback(async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/stripe/connect/create-account", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Payment account created! Complete setup to start receiving payments.");
        await fetchStatus();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create payment account");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Failed to create payment account");
    } finally {
      setIsCreating(false);
    }
  }, [fetchStatus]);

  // Start onboarding
  const startOnboarding = useCallback(async () => {
    setIsOnboarding(true);
    try {
      const response = await fetch("/api/stripe/connect/onboarding-link", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        // Open Stripe onboarding in new window
        window.open(data.url, "_blank", "noopener,noreferrer");
        toast.success("Opening payment setup...");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to start onboarding");
      }
    } catch (error) {
      console.error("Error starting onboarding:", error);
      toast.error("Failed to start payment setup");
    } finally {
      setIsOnboarding(false);
    }
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading payment status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status?.hasAccount) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Payment Setup Required
          </CardTitle>
          <CardDescription>
            Set up your payment account to start receiving money from gear rentals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">To receive payments, you need to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Create a Stripe Connect account</li>
                <li>Add your bank account details</li>
                <li>Complete identity verification</li>
              </ul>
            </div>
            <Button 
              onClick={createAccount} 
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Set Up Payments"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status.onboardingComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Complete Payment Setup
          </CardTitle>
          <CardDescription>
            Finish setting up your payment account to start receiving money.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Pending</Badge>
              <span className="text-sm text-gray-600">
                Account created but setup incomplete
              </span>
            </div>
            <Button 
              onClick={startOnboarding} 
              disabled={isOnboarding}
              className="w-full"
            >
              {isOnboarding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Opening Setup...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Complete Setup
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Payment Account Active
        </CardTitle>
        <CardDescription>
          Your payment account is set up and ready to receive money.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Account Status</span>
            <Badge variant="default" className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Charges Enabled</span>
            <Badge variant={status.chargesEnabled ? "default" : "secondary"}>
              {status.chargesEnabled ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Payouts Enabled</span>
            <Badge variant={status.payoutsEnabled ? "default" : "secondary"}>
              {status.payoutsEnabled ? "Yes" : "No"}
            </Badge>
          </div>
          <Button 
            onClick={startOnboarding} 
            variant="outline" 
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Manage Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
