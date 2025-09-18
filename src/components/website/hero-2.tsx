import { Sparkles, ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Hero2() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          name: "", // Empty name for backend compatibility
          twitterAccount: "" // Empty twitter for backend compatibility
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success("Successfully joined the waitlist! We'll notify you when we launch.");
      setEmail("");
      // Optionally redirect to success page
      // router.push("/join-waitlist/success");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to join waitlist"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex items-center justify-center px-4 py-16 min-h-[80vh]">
        <div className="max-w-4xl mx-auto text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/25 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-full text-sm mb-8 shadow-xl">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="font-medium">Exclusive Early Access • Invite Only</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            The Future of
            <br />
            <span>Camera Gear </span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
              Sharing
            </span>
          </h1>

          
          {/* Email Signup Form */}
          <div className="mb-12">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
              <div className="relative flex-1 w-full">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/25 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-xl"
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
          </div>

         {/* Descriptive Paragraph */}
         <p className="text-md md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
             Join the revolution where photographers connect, share premium gear, and create together.
         </p>

          {/* Feature List
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-12 mb-12 mt-50">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/25 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-white/40 dark:border-white/20 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Premium Gear Access</span>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-3 bg-white/25 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-white/40 dark:border-white/20 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Creator Community</span>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-3 bg-white/25 dark:bg-white/10 backdrop-blur-sm rounded-xl border border-white/40 dark:border-white/20 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Social Discovery</span>
            </div>
          </div> */}

          {/* Bottom Badge
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/25 backdrop-blur-md border border-white/40 rounded-full text-sm text-gray-700 shadow-xl">
            <span>Launching in </span>
            <span className="font-bold text-gray-900">2026</span>
            <span> • Get notified first</span>
          </div> */}
        </div>
    </div>
  );
}
