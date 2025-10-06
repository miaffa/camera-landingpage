"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Import all the different options
import { 
  ProfileStatsMinimal, 
  ProfileStatsProgress, 
  ProfileStatsContent, 
  ProfileStatsCompact 
} from "@/components/profile/ProfileStatsV2";

import { 
  ProfileStatsDashboard, 
  ProfileStatsCircular, 
  ProfileStatsActivity, 
  ProfileStatsBadges 
} from "@/components/profile/ProfileStatsCreative";

export default function StatsDemoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Profile Stats UI Options</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Option 1: Minimalist Horizontal */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Option 1: Minimalist Horizontal</h2>
          <p className="text-sm text-gray-600 mb-4">Clean horizontal layout with subtle dividers</p>
          <ProfileStatsMinimal />
        </section>

        {/* Option 2: Visual Progress Indicators */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Option 2: Visual Progress Indicators</h2>
          <p className="text-sm text-gray-600 mb-4">Progress bars showing activity levels</p>
          <ProfileStatsProgress />
        </section>

        {/* Option 3: Content Preview Cards */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Option 3: Content Preview Cards</h2>
          <p className="text-sm text-gray-600 mb-4">Shows actual content with visual elements</p>
          <ProfileStatsContent />
        </section>

        {/* Option 4: Compact Metric Bar */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Option 4: Compact Metric Bar</h2>
          <p className="text-sm text-gray-600 mb-4">Single horizontal bar with all stats</p>
          <ProfileStatsCompact />
        </section>

        {/* Option 5: Dashboard Tiles */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Option 5: Dashboard Tiles</h2>
          <p className="text-sm text-gray-600 mb-4">Interactive tiles with hover effects and trends</p>
          <ProfileStatsDashboard />
        </section>

        {/* Option 6: Circular Progress Rings */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Option 6: Circular Progress Rings</h2>
          <p className="text-sm text-gray-600 mb-4">Circular progress indicators with icons</p>
          <ProfileStatsCircular />
        </section>

        {/* Option 7: Activity Feed Style */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Option 7: Activity Feed Style</h2>
          <p className="text-sm text-gray-600 mb-4">List format showing recent activity</p>
          <ProfileStatsActivity />
        </section>

        {/* Option 8: Minimalist Badges */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Option 8: Minimalist Badges</h2>
          <p className="text-sm text-gray-600 mb-4">Pill-shaped badges with icons and values</p>
          <ProfileStatsBadges />
        </section>

      </div>
    </div>
  );
}
