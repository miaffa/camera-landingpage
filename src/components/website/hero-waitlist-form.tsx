"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowRight, Mail, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RecentSuggestion {
  nameSuggestion: string;
  reason: string | null;
  createdAt: string;
}

export function HeroWaitlistForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [nameSuggestion, setNameSuggestion] = useState("");
  const [reason, setReason] = useState("");
  const [, setRecentSuggestions] = useState<RecentSuggestion[]>([]);

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

      toast.success("You're in!");
      setIsSuccess(true);
      // Don't clear email - we'll use it for the naming contest

    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to join waitlist"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

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
          reason: reason.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle Zod validation errors
        if (result.error && Array.isArray(result.error)) {
          const errorMessage = result.error.map((err: { message: string }) => err.message).join(", ");
          throw new Error(errorMessage);
        }
        // Handle other errors
        throw new Error(result.error || "Something went wrong");
      }

      toast.success("Thanks for the suggestion! We love the creativity");
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

  if (isSuccess) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Success Animation */}
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            You&apos;re in!
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Now help us name this thing. We&apos;re building this platform for creators like you. 
            Got a name that captures the spirit of peer-to-peer camera rentals? Drop it below.
          </p>
        </div>

        {/* Naming Form */}
        <div className="bg-white/25 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-3xl p-8 max-w-2xl mx-auto shadow-xl">
          <form onSubmit={handleNameSuggestionSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="nameSuggestion" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Your name idea *
                </label>
                <Input
                  id="nameSuggestion"
                  placeholder="e.g., LensLoop, Cammunity, GearShare..."
                  value={nameSuggestion}
                  onChange={(e) => setNameSuggestion(e.target.value)}
                  className="text-center bg-white/25 dark:bg-white/10 backdrop-blur-sm border-white/40 dark:border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Why this name? (optional)
                </label>
                <Textarea
                  id="reason"
                  placeholder="Tell us what makes this name special..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="resize-none bg-white/25 dark:bg-white/10 backdrop-blur-sm border-white/40 dark:border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !nameSuggestion.trim()}
              className="w-full py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Users className="w-5 h-5 mr-2" />
                  Send it in
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Thanks for being part of our community! We&apos;ll keep you updated on our progress.</p>
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
