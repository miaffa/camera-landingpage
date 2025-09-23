"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Sparkles } from "lucide-react";

interface RecentSuggestion {
  nameSuggestion: string;
  reason: string | null;
  createdAt: string;
}

export function NamingContestForm() {
  const [email, setEmail] = useState("");
  const [nameSuggestion, setNameSuggestion] = useState("");
  const [reason, setReason] = useState("");
  const [instagram, setInstagram] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      } catch {
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
          instagram: instagram.trim() || null,
        }),
      });

      if (!suggestionResponse.ok) {
        const errorData = await suggestionResponse.json();
        throw new Error(errorData.error || "Failed to submit suggestion");
      }

      toast.success("Thanks for the amazing suggestion! 🎨 We&apos;ll be in touch soon.");
      setNameSuggestion("");
      setReason("");
      setInstagram("");
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
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 drop-shadow-sm mt-2 sm:mt-4 relative">
          <span className="relative z-10">Help Us Name This Thing!</span>
          <div 
            className="absolute -z-10 opacity-60 blur-lg"
            style={{
              background: 'radial-gradient(ellipse, rgba(182, 71, 234, 0.6) 0%, rgba(216, 177, 255, 0.4) 30%, rgba(255, 217, 241, 0.3) 60%, rgba(255, 217, 241, 0.1) 80%, transparent 100%)',
              top: '50%',
              left: '50%',
              width: '80%',
              height: '140%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </h1>
        <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-4" style={{ color: 'var(--foreground)' }}>
          <strong style={{ color: 'var(--foreground)' }}>Got a name that captures the spirit of peer-to-peer camera rentals?</strong> Drop it below and be part of our community!
        </p>
      </div>

      {/* Naming Form */}
      <div className="bg-white/25 dark:bg-white/10 backdrop-blur-sm sm:backdrop-blur-md border border-white/40 dark:border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full shadow-xl">
        <form onSubmit={handleNameSuggestionSubmit} className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Your email address *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-base py-3 sm:py-4 bg-white/25 dark:bg-white/10 backdrop-blur-sm border-white/40 dark:border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder:text-gray-600 dark:placeholder:text-gray-300"
                style={{ color: 'var(--foreground)' }}
                required
              />
            </div>
            
            <div>
              <label htmlFor="nameSuggestion" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Your brilliant name idea *
              </label>
              <Input
                id="nameSuggestion"
                placeholder="e.g., LensLoop, Cammunity, GearShare, SnapSwap..."
                value={nameSuggestion}
                onChange={(e) => setNameSuggestion(e.target.value)}
                className="text-center text-base sm:text-lg font-medium py-3 sm:py-4 bg-white/25 dark:bg-white/10 backdrop-blur-sm border-white/40 dark:border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder:text-gray-600 dark:placeholder:text-gray-300"
                style={{ color: 'var(--foreground)' }}
                required
              />
            </div>
            
            <div>
              <label htmlFor="reason" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Why this name? (optional but we&apos;d love to know!)
              </label>
              <Textarea
                id="reason"
                placeholder="Tell us what makes this name special, memorable, or perfect for our community..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="resize-none text-base py-3 sm:py-4 bg-white/25 dark:bg-white/10 backdrop-blur-sm border-white/40 dark:border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder:text-gray-600 dark:placeholder:text-gray-300"
                style={{ color: 'var(--foreground)' }}
              />
            </div>
            
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Instagram handle (optional)
              </label>
              <Input
                id="instagram"
                placeholder="@yourusername"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="text-base py-3 sm:py-4 bg-white/25 dark:bg-white/10 backdrop-blur-sm border-white/40 dark:border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder:text-gray-600 dark:placeholder:text-gray-300"
                style={{ color: 'var(--foreground)' }}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !nameSuggestion.trim() || !email.trim()}
            className="w-full py-4 sm:py-6 text-base sm:text-lg min-h-[44px] bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
          >
            {isSubmitting ? (
              "Submitting your idea..."
            ) : (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Submit My Name Idea
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="text-center text-sm w-full">
        <div className="bg-white/25 dark:bg-white/10 backdrop-blur-sm sm:backdrop-blur-md border border-white/40 dark:border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg max-w-2xl mx-auto">
        <p style={{ color: 'var(--foreground)' }}>
          <strong style={{ color: 'var(--foreground)' }}>What happens next?</strong> We&apos;ll review all suggestions and may even run a community vote on the top contenders.
          Contributors of winning names will get special recognition and early access! 🏆
        </p>
        </div>
      </div>
    </div>
  );
}
