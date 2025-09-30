"use client";

import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MonthlyAnnualPricing = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto mb-20 max-w-(--breakpoint-md) text-center">
          <p className="text-primary font-medium mb-4">Louisville Launch Special</p>
          <h2 className="mb-4 text-4xl tracking-tight font-bold lg:text-5xl">
            Fair Commission, No Hidden Fees
          </h2>
          <p className="text-muted-foreground text-lg">
            We only make money when you do. Simple 10% commission split between renter and owner.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-base font-medium">Choose your role</span>
          <div className="flex h-12 items-center rounded-md bg-muted p-1 text-lg">
            <RadioGroup
              defaultValue="renter"
              className="h-full grid-cols-2"
            >
              <div className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white'>
                <RadioGroupItem
                  value="renter"
                  id="renter"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="renter"
                  className="flex h-full cursor-pointer items-center justify-center px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                >
                  Renter
                </Label>
              </div>
              <div className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white'>
                <RadioGroupItem
                  value="owner"
                  id="owner"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="owner"
                  className="flex h-full cursor-pointer items-center justify-center gap-1 px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                >
                  Gear Owner
                  <Badge
                    variant="outline"
                    className="border-green-200 bg-green-100 px-1.5 text-green-600"
                  >
                    Earn
                  </Badge>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="mt-12 grid max-w-(--breakpoint-md) gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-2 border-gray-400 p-8 hover:border-primary transition-colors">
              <div className="flex h-full flex-col justify-between gap-6">
                <div>
                  <h3 className="mb-4 text-2xl font-bold">Rent Gear</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">5%</span>
                    <span className="ml-2 font-medium text-muted-foreground">
                      commission
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Access professional camera gear from local creators. Pay only when you rent.
                  </p>
                  <p className="mb-4 mt-8 font-bold text-lg">What you get</p>
                  <ul className="flex flex-col gap-4">
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Access to local gear</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Insurance coverage</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Secure payments</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">In-app messaging</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Social feed access</span>
                    </li>
                  </ul>
                </div>
                <Button size="lg" className="mt-8">
                  Start Renting
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-gray-400 border-2 p-8 hover:border-primary transition-colors">
              <div className="flex h-full flex-col justify-between gap-6">
                <div>
                  <h3 className="mb-4 text-2xl font-bold">List Your Gear</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">5%</span>
                    <span className="ml-2 font-medium text-muted-foreground">
                      commission
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Monetize your idle camera equipment. Earn passive income from your gear.
                  </p>
                  <p className="mb-4 mt-8 font-bold text-lg">What you get</p>
                  <ul className="flex flex-col gap-4">
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Easy gear listing</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Damage protection</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Secure payments</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Booking management</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Social showcase</span>
                    </li>
                  </ul>
                </div>
                <Button size="lg" className="mt-8">
                  List Your Gear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyAnnualPricing;
