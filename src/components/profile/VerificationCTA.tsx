import React from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VerificationCTAProps {
  isEmailVerified: boolean;
}

export function VerificationCTA({ isEmailVerified }: VerificationCTAProps) {
  if (isEmailVerified) return null;

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <Shield className="h-6 w-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Verified</h3>
            <p className="text-sm text-gray-600 mb-4">
              Verify your identity to build trust and unlock more features
            </p>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg">
              <Shield className="h-4 w-4 mr-2" />
              Start Verification
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
