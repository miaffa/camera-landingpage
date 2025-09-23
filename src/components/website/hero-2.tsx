import { Sparkles } from "lucide-react";
import { HeroWaitlistForm } from "./hero-waitlist-form";

export default function Hero2() {

  return (
    <div className="relative flex items-center justify-center px-4 py-8 sm:py-16 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/25 dark:bg-white/10 backdrop-blur-sm sm:backdrop-blur-md border border-white/40 dark:border-white/20 rounded-full text-xs sm:text-sm mb-6 sm:mb-8 shadow-xl">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
            <span className="font-medium">Exclusive Early Access • Invite Only</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            The Future of
            <br />
            <span>Camera Gear Sharing</span> 
          </h1>

          
          {/* Email Signup Form */}
          <div className="mb-8 sm:mb-12">
            <HeroWaitlistForm />
          </div>

         {/* Descriptive Paragraph */}
         <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
             Join the revolution where photographers connect, share camera gear, and create together.
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
