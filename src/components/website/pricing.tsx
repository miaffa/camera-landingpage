"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    description: "Perfect for hobbyist photographers",
    price: { monthly: 19, annually: 190 },
    features: [
      "Up to 10 equipment listings",
      "Basic rental management",
      "Photo sharing",
      "Email support",
      "Mobile app access",
      "Basic analytics"
    ],
    limitations: [
      "No custom branding",
      "Limited integrations",
      "Basic reporting"
    ],
    popular: false,
    cta: "Start Free Trial"
  },
  {
    name: "Professional",
    description: "Ideal for professional photographers",
    price: { monthly: 49, annually: 490 },
    features: [
      "Up to 50 equipment listings",
      "Custom branding",
      "Advanced analytics",
      "Priority support",
      "Social media integration",
      "Equipment insurance",
      "Review management",
      "User verification"
    ],
    limitations: [
      "No white-label option",
      "Limited API access"
    ],
    popular: true,
    cta: "Start Free Trial"
  },
  {
    name: "Enterprise",
    description: "For photography studios and agencies",
    price: { monthly: 99, annually: 990 },
    features: [
      "Unlimited equipment listings",
      "White-label solution",
      "Advanced integrations",
      "Dedicated account manager",
      "Custom reporting",
      "Multi-location support",
      "API access",
      "Custom development"
    ],
    limitations: [],
    popular: false,
    cta: "Contact Sales"
  }
];

export function Pricing() {
  return (
    <section className="py-16 sm:py-24" aria-label="Pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your photography business needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price.monthly}</span>
                  <span className="text-muted-foreground">/month</span>
                  <div className="text-sm text-muted-foreground">
                    or ${plan.price.annually}/year (save 17%)
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <li key={`limitation-${index}`} className="flex items-start">
                      <X className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  asChild 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href={plan.name === "Enterprise" ? "/contact" : "/naming-contest"}>
                    {plan.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="rounded-lg bg-muted/50 p-8">
            <h3 className="text-xl font-semibold">Just Want to Rent?</h3>
            <p className="mt-2 text-muted-foreground">
              Be the first to try our mobile app! Discover and rent camera gear from photographers near you.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/naming-contest">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
