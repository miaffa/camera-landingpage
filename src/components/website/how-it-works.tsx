"use client";

import { Github, Code, Upload } from "lucide-react";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";

const steps = [
  {
    title: "Sign up for our platform",
    description: "Create your photographer account and choose your plan.",
    icon: Github,
  },
  {
    title: "List your camera equipment",
    description: "Upload photos and details of your gear to create rental listings.",
    icon: Code,
  },
  {
    title: "Start earning from rentals",
    description: "Accept rental requests and start earning money from your equipment.",
    icon: Upload,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24" aria-label="How It Works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Just 3 steps to get started with our platform (5 minutes)
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-sm gap-8 sm:max-w-none sm:grid-cols-3 sm:gap-12">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step Number */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>

              {/* Step Content */}
              <div>
                <h3 className="text-xl font-bold">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+4rem)] top-8 hidden h-[2px] w-[calc(100%-8rem)] bg-border sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Visual Example */}
        <div className="mt-16 rounded-3xl bg-muted/40 p-8 sm:p-12">
          <div className="relative mx-auto max-w-3xl">
            <HeroVideoDialog
              className="dark:hidden block"
              animationStyle="top-in-bottom-out"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
              thumbnailAlt="Product Demo"
            />
            <HeroVideoDialog
              className="hidden dark:block"
              animationStyle="top-in-bottom-out"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
              thumbnailAlt="Product Demo"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
