"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users } from "lucide-react";

export function CTA2() {
  return (
    <aside className="border-y border-border/40" aria-label="Call to Action">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to rent camera gear?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join 500+ photographers who are already sharing their equipment
            and earning money with our platform.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>500+ photographers</span>
            </div>
          </div>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/#pricing">Start Renting</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free to list your equipment and start earning
          </p>
        </div>
      </div>
    </aside>
  );
}
