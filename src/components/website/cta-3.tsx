"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";

export function CTA3() {
  const { theme } = useTheme();

  return (
    <section className="overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Transform your photography with gear rentals
            </h2>

            <p className="mt-4 text-lg text-primary-foreground/80">
              Join hundreds of photographers who are sharing their equipment
              and earning money while helping others create amazing photos.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                asChild
              >
                <Link href="/sign-up">
                  Start Renting
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
                asChild
              >
                <Link href="/contact">List Equipment</Link>
              </Button>
            </div>

            {/* Reviews */}
            <div className="mt-12">
              <div className="flex items-center gap-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < 5
                          ? "fill-primary-foreground text-primary-foreground"
                          : "fill-primary-foreground/20 text-primary-foreground/20"
                      )}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-medium">Rated 4.8 by 500+ photographers</p>
                  <p className="text-primary-foreground/60">
                    on photography platforms
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-4xl bg-primary-foreground/10">
              {theme === 'dark' ? (
                <Image
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxNzd8fHx8fHwyfHwxNzIzNjM0NDc0fA&ixlib=rb-4.0.3&q=80&w=1080"
                  alt="Digital Menu Preview (Dark)"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxNzd8fHx8fHwyfHwxNzIzNjM0NDc0fA&ixlib=rb-4.0.3&q=80&w=1080"
                  alt="Digital Menu Preview (Light)"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 rounded-3xl bg-background p-6 shadow-xl ring-1 ring-border/10 sm:-bottom-8 sm:-left-8 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-3xl font-bold">$2,500</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Average monthly earnings
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold">95%</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Equipment utilization rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 