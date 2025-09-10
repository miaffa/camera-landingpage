"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users } from "lucide-react";

export function CTA2() {
  return (
    <aside className="border-y border-border/40" aria-label="Call to Action">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to digitize your menu?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join 500+ restaurants who are already creating better customer
            experiences with Stuf'd.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>500+ restaurants</span>
            </div>
          </div>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/#pricing">Get Stuf'd Pro</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            14-day free trial for all new restaurants
          </p>
        </div>
      </div>
    </aside>
  );
}
