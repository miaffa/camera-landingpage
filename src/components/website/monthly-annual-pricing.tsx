"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MonthlyAnnualPricing = () => {
  const [isAnnually, setIsAnnually] = useState(false);
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto mb-20 max-w-(--breakpoint-md) text-center">
          <p className="text-primary font-medium mb-4">Photographer Pricing</p>
          <h2 className="mb-4 text-4xl tracking-tight font-bold lg:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose the perfect plan for your photography business. No hidden fees.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-base font-medium">Billing cycle</span>
          <div className="flex h-12 items-center rounded-md bg-muted p-1 text-lg">
            <RadioGroup
              defaultValue="monthly"
              className="h-full grid-cols-2"
              onValueChange={(value) => {
                setIsAnnually(value === "annually");
              }}
            >
              <div className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white'>
                <RadioGroupItem
                  value="monthly"
                  id="monthly"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="monthly"
                  className="flex h-full cursor-pointer items-center justify-center px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                >
                  Monthly
                </Label>
              </div>
              <div className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white'>
                <RadioGroupItem
                  value="annually"
                  id="annually"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="annually"
                  className="flex h-full cursor-pointer items-center justify-center gap-1 px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                >
                  Yearly
                  <Badge
                    variant="outline"
                    className="border-blue-200 bg-blue-100 px-1.5 text-blue-600"
                  >
                    -20%
                  </Badge>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="mt-12 grid max-w-(--breakpoint-md) gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-2 border-gray-400 p-8 hover:border-primary transition-colors">
              <div className="flex h-full flex-col justify-between gap-6">
                <div>
                  <h3 className="mb-4 text-2xl font-bold">Starter Plan</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">
                      {isAnnually ? "$19" : "$29"}
                    </span>
                    <span className="ml-2 font-medium text-muted-foreground">
                      per month
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Perfect for hobbyist photographers just starting out.
                  </p>
                  <p className="mb-4 mt-8 font-bold text-lg">Includes</p>
                  <ul className="flex flex-col gap-4">
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Up to 10 equipment listings</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Basic rental management</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Photo sharing</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Email support</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">
                        Basic analytics
                      </span>
                    </li>
                  </ul>
                </div>
                <Button size="lg" className="mt-8">
                  Start free trial
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-gray-400 border-2 p-8 hover:border-primary transition-colors">
              <div className="flex h-full flex-col justify-between gap-6">
                <div>
                  <h3 className="mb-4 text-2xl font-bold">Professional Plan</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">
                      {isAnnually ? "$49" : "$69"}
                    </span>
                    <span className="ml-2 font-medium text-muted-foreground">
                      per month
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Perfect for professional photographers. Get all the features
                    you need.
                  </p>
                  <p className="mb-4 mt-8 font-bold text-lg">
                    Everything in Starter, plus
                  </p>
                  <ul className="flex flex-col gap-4">
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Up to 50 equipment listings</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Custom branding</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Advanced analytics</span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-5 shrink-0 text-primary" />
                      <span className="font-medium">Priority support</span>
                    </li>
                  </ul>
                </div>
                <Button size="lg" className="mt-8">
                  Start free trial
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
