'use client';

import { useState } from 'react';
import { Calendar, MapPin, Shield } from 'lucide-react';
import StripePayment from '@/components/payments/stripe-payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface GearItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  owner: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
  };
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  availability: string[];
}

interface RentalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  gear: GearItem;
  onRequestSent: (request: unknown) => void;
}

export default function RentalRequestModal({
  isOpen,
  onClose,
  gear,
  onRequestSent
}: RentalRequestModalProps) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [pickupLocation] = useState(gear.location.address);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryRequested, setDeliveryRequested] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [rentalRequest, setRentalRequest] = useState<unknown>(null);

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * gear.price;
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }

    if (startDate >= endDate) {
      alert('End date must be after start date');
      return;
    }

    setIsSubmitting(true);

    try {
      const request = {
        gearId: gear.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        pickupLocation,
        deliveryAddress: deliveryRequested ? deliveryAddress : null,
        deliveryRequested,
        message: message.trim() || null,
        totalCost: calculateTotal(),
      };

      // Create rental request via API
      const response = await fetch('/api/rental-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to create rental request');
      }

      const createdRequest = await response.json();
      setRentalRequest(createdRequest);
      setShowPayment(true);
      onClose();
    } catch (error) {
      console.error('Error creating rental request:', error);
      alert('Failed to send rental request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Show payment step if rental request was created
  if (showPayment && rentalRequest) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Complete Payment</h2>
              <Button variant="ghost" onClick={onClose}>
                ×
              </Button>
            </div>
            <StripePayment
              rentalRequest={{
                id: (rentalRequest as { id?: string }).id || '',
                gearName: gear.name,
                totalCost: (rentalRequest as { totalCost?: number }).totalCost || 0,
                startDate: (rentalRequest as { startDate?: string }).startDate || '',
                endDate: (rentalRequest as { endDate?: string }).endDate || '',
                ownerName: gear.owner.name,
              }}
              onSuccess={() => {
                onRequestSent(rentalRequest);
                onClose();
              }}
              onCancel={() => {
                setShowPayment(false);
                setRentalRequest(null);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Request Rental</h2>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>

          {/* Gear Info */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={gear.images[0]}
                  alt={gear.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-black">{gear.name}</h3>
                  <p className="text-2xl font-bold text-black">${gear.price}/day</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={gear.owner.avatar} />
                      <AvatarFallback className="bg-gray-200 text-xs">
                        {gear.owner.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{gear.owner.name}</span>
                    {gear.owner.isVerified && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">Verified</Badge>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Shield className="w-4 h-4 mr-1" />
                      {gear.owner.rating} ({gear.owner.reviewCount} reviews)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rental Details */}
          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <Label className="text-base font-medium text-black mb-3 block">
                Rental Period
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Calendar className="w-4 h-4 mr-2" />
                        {startDate ? format(startDate, 'PPP') : 'Select start date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Calendar className="w-4 h-4 mr-2" />
                        {endDate ? format(endDate, 'PPP') : 'Select end date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < (startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <Label className="text-base font-medium text-black mb-3 block">
                Pickup Location
              </Label>
              <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{pickupLocation}</span>
              </div>
            </div>

            {/* Delivery Option */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="delivery"
                  checked={deliveryRequested}
                  onChange={(e) => setDeliveryRequested(e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="delivery" className="text-base font-medium text-black">
                  Request delivery
                </Label>
              </div>
              {deliveryRequested && (
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Delivery Address</Label>
                  <Textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter delivery address..."
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Message */}
            <div>
              <Label className="text-base font-medium text-black mb-3 block">
                Message to Owner
              </Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the owner about your rental needs..."
                className="w-full"
                rows={3}
              />
            </div>

            {/* Cost Breakdown */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-black mb-3">Cost Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ${gear.price} × {calculateDays()} days
                    </span>
                    <span className="text-black">${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform fee (10%)</span>
                    <span className="text-black">${(calculateTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-black">Total</span>
                      <span className="text-black">${(calculateTotal() * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!startDate || !endDate || isSubmitting}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
