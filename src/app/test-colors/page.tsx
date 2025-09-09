"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function TestColorsPage() {
  const [cssVars, setCssVars] = useState<Record<string, string>>({});

  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement);
    const vars = {
      primary: computedStyle.getPropertyValue('--primary').trim(),
      secondary: computedStyle.getPropertyValue('--secondary').trim(),
      accent: computedStyle.getPropertyValue('--accent').trim(),
      muted: computedStyle.getPropertyValue('--muted').trim(),
      destructive: computedStyle.getPropertyValue('--destructive').trim(),
    };
    setCssVars(vars);
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-foreground">Color System Test</h1>
        
        {/* Primary Colors */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Primary Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary rounded-lg">
              <p className="text-primary-foreground font-medium">Primary</p>
              <p className="text-primary-foreground/70 text-sm">#89DDFF</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-secondary-foreground font-medium">Secondary</p>
              <p className="text-secondary-foreground/70 text-sm">#FFA39B</p>
            </div>
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-accent-foreground font-medium">Accent</p>
              <p className="text-accent-foreground/70 text-sm">#FFE18A</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground font-medium">Muted</p>
              <p className="text-muted-foreground/70 text-sm">#AFDC83</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </div>

        {/* Background Colors */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Background Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background border border-border rounded-lg">
              <p className="text-foreground font-medium">Background</p>
              <p className="text-foreground/70 text-sm">Main background</p>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <p className="text-card-foreground font-medium">Card</p>
              <p className="text-card-foreground/70 text-sm">Card background</p>
            </div>
            <div className="p-4 bg-muted border border-border rounded-lg">
              <p className="text-muted-foreground font-medium">Muted</p>
              <p className="text-muted-foreground/70 text-sm">Muted background</p>
            </div>
          </div>
        </div>

        {/* Chart Colors */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Chart Colors</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="p-4 bg-chart-1 rounded-lg text-center">
              <p className="text-white font-medium">Chart 1</p>
            </div>
            <div className="p-4 bg-chart-2 rounded-lg text-center">
              <p className="text-white font-medium">Chart 2</p>
            </div>
            <div className="p-4 bg-chart-3 rounded-lg text-center">
              <p className="text-foreground font-medium">Chart 3</p>
            </div>
            <div className="p-4 bg-chart-4 rounded-lg text-center">
              <p className="text-foreground font-medium">Chart 4</p>
            </div>
            <div className="p-4 bg-chart-5 rounded-lg text-center">
              <p className="text-white font-medium">Chart 5</p>
            </div>
          </div>
        </div>

        {/* CSS Variables Debug */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">CSS Variables Debug</h2>
          <div className="p-4 bg-card border border-border rounded-lg">
            <p className="text-card-foreground font-medium mb-2">Actual CSS Variables (from browser):</p>
            <div className="text-sm text-card-foreground/70 space-y-1">
              <p>--primary: <span className="font-mono">{cssVars.primary || 'Not loaded'}</span></p>
              <p>--secondary: <span className="font-mono">{cssVars.secondary || 'Not loaded'}</span></p>
              <p>--accent: <span className="font-mono">{cssVars.accent || 'Not loaded'}</span></p>
              <p>--muted: <span className="font-mono">{cssVars.muted || 'Not loaded'}</span></p>
              <p>--destructive: <span className="font-mono">{cssVars.destructive || 'Not loaded'}</span></p>
            </div>
          </div>
        </div>

        {/* Direct CSS Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Direct CSS Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              <p className="font-medium">Direct Primary</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
              <p className="font-medium">Direct Secondary</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              <p className="font-medium">Direct Accent</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
              <p className="font-medium">Direct Muted</p>
            </div>
          </div>
        </div>

        {/* Tailwind Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Tailwind Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-500 text-white rounded-lg">
              <p className="font-medium">Built-in Blue</p>
            </div>
            <div className="p-4 bg-red-500 text-white rounded-lg">
              <p className="font-medium">Built-in Red</p>
            </div>
            <div className="p-4 bg-green-500 text-white rounded-lg">
              <p className="font-medium">Built-in Green</p>
            </div>
            <div className="p-4 bg-yellow-500 text-black rounded-lg">
              <p className="font-medium">Built-in Yellow</p>
            </div>
          </div>
        </div>

        {/* Custom Color Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Custom Color Test (Direct Hex)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue text-black rounded-lg">
              <p className="font-medium">Custom Blue</p>
            </div>
            <div className="p-4 bg-coral text-black rounded-lg">
              <p className="font-medium">Custom Coral</p>
            </div>
            <div className="p-4 bg-yellow text-black rounded-lg">
              <p className="font-medium">Custom Yellow</p>
            </div>
            <div className="p-4 bg-green text-black rounded-lg">
              <p className="font-medium">Custom Green</p>
            </div>
          </div>
        </div>

        {/* Simple Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Simple Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#89DDFF] text-black rounded-lg">
              <p className="font-medium">Arbitrary Value</p>
            </div>
            <div className="p-4 bg-[#FFA39B] text-black rounded-lg">
              <p className="font-medium">Arbitrary Value</p>
            </div>
            <div className="p-4 bg-[#FFE18A] text-black rounded-lg">
              <p className="font-medium">Arbitrary Value</p>
            </div>
            <div className="p-4 bg-[#AFDC83] text-black rounded-lg">
              <p className="font-medium">Arbitrary Value</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
