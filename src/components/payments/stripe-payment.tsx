'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge'; // TODO: Implement badge functionality
import { CreditCard, Shield, Clock } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentProps {
  rentalRequest: {
    id: string;
    gearName: string;
    totalCost: number;
    startDate: string;
    endDate: string;
    ownerName: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StripePayment({ rentalRequest, onSuccess, onCancel }: StripePaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!stripePromise) {
      setError('Stripe not configured');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rentalRequestId: rentalRequest.id,
          amount: Math.round(rentalRequest.totalCost * 100), // Convert to cents
        }),
      });

      const { clientSecret, error: apiError } = await response.json();

      if (apiError) {
        throw new Error(apiError);
      }

      const stripe = await stripePromise;
      const { error: stripeError } = await stripe!.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/rental/${rentalRequest.id}/success`,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Complete Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">{rentalRequest.gearName}</h3>
          <p className="text-sm text-muted-foreground">
            Rented from {rentalRequest.ownerName}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(rentalRequest.startDate).toLocaleDateString()} - 
              {new Date(rentalRequest.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold">${rentalRequest.totalCost.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Secured by Stripe</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
