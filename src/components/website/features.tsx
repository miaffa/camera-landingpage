"use client";

import { 
  Smartphone, 
  BarChart3, 
  Users, 
  Star, 
  Clock, 
  Shield,
  Zap,
  Heart
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Digital Menu Creation",
    description: "Transform your paper menus into beautiful, interactive digital experiences that work on any device.",
    benefits: ["Easy drag-and-drop editor", "Real-time updates", "Mobile-optimized"]
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Get instant insights into which dishes are popular, customer preferences, and dining trends.",
    benefits: ["Live popularity rankings", "Customer feedback", "Sales analytics"]
  },
  {
    icon: Users,
    title: "Customer Engagement",
    description: "Let customers rate dishes, leave reviews, and share their favorite meals directly from the menu.",
    benefits: ["In-menu rating system", "Social sharing", "Customer reviews"]
  },
  {
    icon: Star,
    title: "Boost Your Ratings",
    description: "Increase positive reviews and improve your online reputation with better customer experiences.",
    benefits: ["Higher review scores", "Better online presence", "Customer satisfaction"]
  },
  {
    icon: Clock,
    title: "Instant Updates",
    description: "Update prices, add new dishes, or mark items as unavailable instantly across all platforms.",
    benefits: ["Real-time menu changes", "Price updates", "Availability status"]
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security and 99.9% uptime guarantee for your restaurant operations.",
    benefits: ["Data protection", "Reliable service", "24/7 support"]
  },
  {
    icon: Zap,
    title: "Quick Setup",
    description: "Get your digital menu up and running in minutes, not hours. No technical expertise required.",
    benefits: ["5-minute setup", "No coding needed", "Instant deployment"]
  },
  {
    icon: Heart,
    title: "Customer Love",
    description: "Create memorable dining experiences that keep customers coming back for more.",
    benefits: ["Enhanced experience", "Customer loyalty", "Repeat visits"]
  }
];

export function Features() {
  return (
    <section className="py-16 sm:py-24" aria-label="Features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to digitize your restaurant
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed specifically for restaurants to create better customer experiences
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="group">
              <div className="rounded-lg border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <ul className="mt-4 space-y-1">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-xs text-muted-foreground">
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="rounded-lg bg-primary/5 p-8">
            <h3 className="text-2xl font-bold">Ready to digitize your menu?</h3>
            <p className="mt-2 text-muted-foreground">
              Join hundreds of restaurants already using Stuf&apos;d to create better customer experiences
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="/naming-contest"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                Get Started Free
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Schedule Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}