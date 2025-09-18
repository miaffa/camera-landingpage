"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle2, Sparkles, Lightbulb, Users } from "lucide-react";

interface RecentSuggestion {
  nameSuggestion: string;
  reason: string | null;
  createdAt: string;
}

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"signup" | "naming">("signup");
  const [nameSuggestion, setNameSuggestion] = useState("");
  const [reason, setReason] = useState("");
  const [recentSuggestions, setRecentSuggestions] = useState<RecentSuggestion[]>([]);

  // Fetch recent suggestions when component mounts
  useEffect(() => {
    fetchRecentSuggestions();
  }, []);

  const fetchRecentSuggestions = async () => {
    try {
      const response = await fetch("/api/name-suggestions");
      if (response.ok) {
        const suggestions = await response.json();
        setRecentSuggestions(suggestions);
      }
    } catch (error) {
      console.error("Failed to fetch recent suggestions:", error);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
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

      toast.success("You&apos;re in! 🎉");
      
      // Show success animation then transition to naming step
      setTimeout(() => {
        setStep("naming");
        fetchRecentSuggestions(); // Refresh suggestions
      }, 1500);

    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to join waitlist"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameSuggestion.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/name-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          nameSuggestion: nameSuggestion.trim(),
          reason: reason.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success("Thanks for the suggestion! We love the creativity 🎨");
      setNameSuggestion("");
      setReason("");
      
      // Refresh recent suggestions
      fetchRecentSuggestions();

    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit suggestion"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "signup") {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join Our Waitlist
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Be among the first to experience our platform when we launch.
          </p>
        </div>

        <form onSubmit={handleWaitlistSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting || !email}
              className="px-8"
            >
              {isSubmitting ? (
                "Joining..."
              ) : (
                <>
                  Join Waitlist
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>Join the revolution where photographers connect, share camera gear, and create together.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success Animation */}
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          You&apos;re in!
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Now help us name this thing. We&apos;re building this platform for creators like you. 
          Got a name that captures the spirit of peer-to-peer camera rentals? Drop it below.
        </p>
      </div>

      {/* Recent Suggestions */}
      {recentSuggestions.length > 0 && (
        <div className="bg-white/25 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-3xl p-6 max-w-2xl mx-auto shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold">Recent ideas from the community:</h3>
          </div>
          <div className="space-y-2">
            {recentSuggestions.map((suggestion, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium text-blue-600">&ldquo;{suggestion.nameSuggestion}&rdquo;</span>
                {suggestion.reason && (
                  <span className="text-muted-foreground ml-2">- {suggestion.reason}</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 italic">
            We&apos;ve heard everything from LensLoop to Cammunity. What&apos;s your take?
          </p>
        </div>
      )}

      {/* Naming Form */}
      <form onSubmit={handleNameSuggestionSubmit} className="space-y-6 max-w-md mx-auto">
        <div className="space-y-4">
          <div>
            <label htmlFor="nameSuggestion" className="block text-sm font-medium mb-2">
              Your name idea *
            </label>
            <Input
              id="nameSuggestion"
              placeholder="e.g., LensLoop, Cammunity, GearShare..."
              value={nameSuggestion}
              onChange={(e) => setNameSuggestion(e.target.value)}
              className="text-center"
              required
            />
          </div>
          
          <div>
            <label htmlFor="reason" className="block text-sm font-medium mb-2">
              Why this name? (optional)
            </label>
            <Textarea
              id="reason"
              placeholder="Tell us what makes this name special..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !nameSuggestion.trim()}
          className="w-full"
        >
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              <Users className="w-4 h-4 mr-2" />
              Send it in
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        <p>Thanks for being part of our community! We&apos;ll keep you updated on our progress.</p>
      </div>
    </div>
  );
}
