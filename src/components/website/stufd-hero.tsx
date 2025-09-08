"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, Smartphone, TrendingUp, Users } from "lucide-react";
import AvatarCircles from "@/components/ui/avatar-circles";
import { cn } from "@/lib/utils";
import HyperText from "@/components/ui/hyper-text";
import WordRotate from "@/components/ui/word-rotate";

export function StufdHero() {
  const avatarUrls = [
    {
      imageUrl: "https://i.pravatar.cc/150?img=1",
      profileUrl: "#",
    },
    {
      imageUrl: "https://i.pravatar.cc/150?img=2", 
      profileUrl: "#",
    },
    {
      imageUrl: "https://i.pravatar.cc/150?img=3",
      profileUrl: "#",
    },
    {
      imageUrl: "https://i.pravatar.cc/150?img=4",
      profileUrl: "#",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-12" aria-label="Hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            {/* Left Column */}
            <div className="flex flex-col justify-center lg:col-span-6">
              <h1 className="mt-8 text-4xl font-bold tracking-tight sm:mt-10 sm:text-5xl lg:mt-12 lg:text-6xl">
                <span className="inline-block">Your Menu,</span>
                <br />
                <WordRotate
                  className="text-primary inline-block"
                  words={["working harder", "digitized", "smart", "connected"]}
                />
              </h1>
              <p className="mt-4 text-lg text-muted-foreground sm:mt-5 sm:text-xl lg:mt-6">
                <HyperText as="span" startOnView delay={600}>
                  Digitizing menus for real time ratings and better customer experience.
                </HyperText>
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:gap-6 lg:mt-12">
                <Button size="lg" asChild>
                  <Link href="/join-waitlist">Register Your Restaurant</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Request a Demo</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Join 500+ restaurants already digitizing their menus
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-4">
                  <AvatarCircles avatarUrls={avatarUrls} numPeople={500} />
                  <div className="text-sm">
                    <p className="font-medium">500+ restaurants</p>
                    <p className="text-muted-foreground">
                      Already using Stuf'd
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < 5
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
            </div>

            {/* Right Column - Restaurant Benefits */}
            <div className="relative mt-12 lg:col-span-6 lg:mt-0">
              <div className="grid grid-cols-2 gap-6">
                {/* Feature Card 1 */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Digital Menus</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Convert paper menus to interactive digital experiences
                  </p>
                </div>

                {/* Feature Card 2 */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Real-time Ratings</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get instant feedback and ratings from customers
                  </p>
                </div>

                {/* Feature Card 3 */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Customer Insights</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Understand what customers love about your dishes
                  </p>
                </div>

                {/* Feature Card 4 */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Boost Reviews</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Increase positive reviews and customer satisfaction
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
