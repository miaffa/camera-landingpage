import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Naming Contest Confirmation",
  description: "Successfully submitted your name suggestion.",
};

export default function WaitlistSuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="container max-w-md px-4 py-16 text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-16 w-16 text-blue-500" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Thanks for Your Suggestion!</h1>
        <p className="mb-8 text-muted-foreground">
          Thank you for your creative name idea. We&apos;ll be in touch soon!
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
} 