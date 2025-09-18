"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Mail, CheckCircle2, Sparkles } from "lucide-react";

export function HeroWaitlistForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email,
          name: "",
          twitterAccount: ""
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success("You're in! 🎉");
      setIsSuccess(true);
      setEmail("");

    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to join waitlist"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">You&apos;re in! 🎉</h3>
          <p className="text-muted-foreground">
            We&apos;ll notify you when we launch. Want to help us name this thing?{" "}
      <a
        href="/naming-contest"
        className="text-blue-600 hover:text-blue-700 underline font-medium"
      >
        Join our naming contest →
      </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
      <div className="relative flex-1 w-full">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/25 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-400/60 hover:bg-white/30 dark:hover:bg-white/15 transition-all duration-300 shadow-xl"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !email}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:hover:opacity-50 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isSubmitting ? (
          "Joining..."
        ) : (
          <>
            Join Waitlist
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
