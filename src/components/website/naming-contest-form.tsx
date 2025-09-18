"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Sparkles, Lightbulb } from "lucide-react";

interface RecentSuggestion {
  nameSuggestion: string;
  reason: string | null;
  createdAt: string;
}

export function NamingContestForm() {
  const [email, setEmail] = useState("");
  const [nameSuggestion, setNameSuggestion] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleNameSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameSuggestion.trim() || !email.trim()) return;

    try {
      setIsSubmitting(true);
      
      // Try to add to waitlist (optional - don't fail if this doesn't work)
      try {
        await fetch("/api/waitlist", {
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
      } catch (waitlistError) {
        console.log("Waitlist submission failed, continuing with name suggestion");
      }

      // Submit the name suggestion
      const suggestionResponse = await fetch("/api/name-suggestions", {
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

      if (!suggestionResponse.ok) {
        const errorData = await suggestionResponse.json();
        throw new Error(errorData.error || "Failed to submit suggestion");
      }

      toast.success("Thanks for the amazing suggestion! 🎨 We&apos;ll be in touch soon.");
      setNameSuggestion("");
      setReason("");
      setEmail("");
      
      // Refresh recent suggestions
      fetchRecentSuggestions();

    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit suggestion"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm mt-4">
          Help Us Name This Thing!
        </h1>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          <strong>Got a name that captures the spirit of peer-to-peer camera rentals?</strong> Drop it below and be part of our community!
        </p>
      </div>

      {/* Recent Suggestions */}
      {recentSuggestions.length > 0 && (
        <div className="bg-white/25 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-3xl p-8 max-w-4xl mx-auto shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Recent ideas from our creative community:</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {recentSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-white/25 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/40 dark:border-white/20 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-blue-500 mb-1">
                      &ldquo;{suggestion.nameSuggestion}&rdquo;
                    </div>
                    {suggestion.reason && (
                      <div className="text-sm text-muted-foreground">
                        {suggestion.reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6 italic text-center">
            We&apos;ve heard everything from LensLoop to Cammunity. What&apos;s your creative take? 💡
          </p>
        </div>
      )}

      {/* Naming Form */}
      <div className="bg-white/25 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-3xl p-8 max-w-3xl mx-auto shadow-xl">
        <form onSubmit={handleNameSuggestionSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                Your email address *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/25 dark:bg-white/10 backdrop-blur-sm border-white/40 dark:border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div>
              <label htmlFor="nameSuggestion" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                Your brilliant name idea *
              </label>
              <Input
                id="nameSuggestion"
                placeholder="e.g., LensLoop, Cammunity, GearShare, SnapSwap..."
                value={nameSuggestion}
                onChange={(e) => setNameSuggestion(e.target.value)}
                className="text-center text-lg font-medium bg-white/25 dark:bg-white/10 backdrop-blur-sm border-white/40 dark:border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div>
              <label htmlFor="reason" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                Why this name? (optional but we&apos;d love to know!)
              </label>
              <Textarea
                id="reason"
                placeholder="Tell us what makes this name special, memorable, or perfect for our community..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="resize-none bg-white/25 dark:bg-white/10 backdrop-blur-sm border-white/40 dark:border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-gray-900 dark:text-gray-100 h-20 field-sizing-auto"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !nameSuggestion.trim() || !email.trim()}
            className="w-full py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
          >
            {isSubmitting ? (
              "Submitting your idea..."
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Submit My Name Idea
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="text-center text-sm text-gray-900 dark:text-gray-100 max-w-2xl mx-auto">
        <div className="bg-white/25 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-2xl p-6 shadow-lg">
          <p>
            <strong>What happens next?</strong> We&apos;ll review all suggestions and may even run a community vote on the top contenders. 
            Contributors of winning names will get special recognition and early access! 🏆
          </p>
        </div>
      </div>
    </div>
  );
}
