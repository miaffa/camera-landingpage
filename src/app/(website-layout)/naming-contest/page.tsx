import { Metadata } from "next";
import { WebPageJsonLd } from "next-seo";
import { appConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { NamingContestForm } from "@/components/website/naming-contest-form";

export const metadata: Metadata = {
  title: "Name Our Platform - Naming Contest",
  description: "Help us name our peer-to-peer camera rental platform. Submit your creative name ideas and be part of our community!",
  openGraph: {
    title: "Name Our Platform - Naming Contest",
    description: "Help us name our peer-to-peer camera rental platform. Submit your creative name ideas and be part of our community!",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://camerashare.com'}/naming-contest`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://camerashare.com'}/images/og.png`,
        width: 1200,
        height: 630,
        alt: "Naming Contest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Name Our Platform - Naming Contest",
    description: "Help us name our peer-to-peer camera rental platform. Submit your creative name ideas and be part of our community!",
    images: [`${process.env.NEXT_PUBLIC_APP_URL || 'https://camerashare.com'}/images/og.png`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://camerashare.com'}/naming-contest`,
  },
};

export default function JoinWaitlistPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden relative">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[150%] skew-y-12"
        )}
      />
      <WebPageJsonLd
        useAppDir
        id={`${process.env.NEXT_PUBLIC_APP_URL || 'https://camerashare.com'}/naming-contest`}
        title="Join Waitlist"
        description="Join our waitlist to get early access to our platform."
        isAccessibleForFree={true}
        publisher={{
          "@type": "Organization",
          name: appConfig.projectName,
          url: process.env.NEXT_PUBLIC_APP_URL || 'https://camerashare.com',
        }}
      />
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 z-10">
        <div className="bg-background">
          <div className="rounded-2xl sm:rounded-3xl bg-white/25 dark:bg-white/10 backdrop-blur-sm sm:backdrop-blur-md border border-white/40 dark:border-white/20 p-4 sm:p-6 lg:p-8 shadow-xl">
            <NamingContestForm />
          </div>
        </div>
      </div>
    </div>
  );
}
