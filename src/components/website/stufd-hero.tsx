"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, Smartphone, TrendingUp, Users, Link as LinkIcon, Upload, PenTool } from "lucide-react";
import AvatarCircles from "@/components/ui/avatar-circles";
import { cn } from "@/lib/utils";
import HyperText from "@/components/ui/hyper-text";
import WordRotate from "@/components/ui/word-rotate";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function StufdHero() {
  const avatarUrls = [
    {
      imageUrl: "https://i.pravatar.cc/150?img=1",
      profileUrl: "#",
    },
    {
      imageUrl: "https://i.pravatar.cc/150?img=2", 
      profileUrl: "#",
    },
    {
      imageUrl: "https://i.pravatar.cc/150?img=3",
      profileUrl: "#",
    },
    {
      imageUrl: "https://i.pravatar.cc/150?img=4",
      profileUrl: "#",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="overflow-hidden py-16 sm:py-24" aria-label="Hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Centered Content */}
          {/* Add this temporarily at the top of your hero section for testing */}

          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="inline-block">Your Menu,</span>
              <br />
              <WordRotate
                className="text-primary inline-block"
                words={["working harder", "digitized", "smart", "connected"]}
              />
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl max-w-2xl">
                Digitizing menus for real time ratings and better customer experience.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button size="lg" asChild>
                <Link href="/join-waitlist">Register Your Restaurant</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Request a Demo</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Join 500+ restaurants already digitizing their menus
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-4">
                <AvatarCircles avatarUrls={avatarUrls} numPeople={500} />
                <div className="text-sm">
                  <p className="font-medium">500+ restaurants</p>
                  <p className="text-muted-foreground">
                    Already using Stuf'd
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < 5
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>
          </div>

          {/* Menu Upload Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Get Started in Minutes</h2>
              <p className="text-muted-foreground">Choose how you'd like to create your digital menu</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Link Menu URL Option */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-auto p-8 flex flex-col items-center gap-4 hover:bg-primary/5 hover:border-primary/20 transition-all min-h-[180px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <LinkIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center w-full">
                      <h3 className="font-semibold text-lg break-words hyphens-auto">Link Menu URL</h3>
                      <p className="text-sm text-muted-foreground mt-1 break-words leading-relaxed hyphens-auto overflow-hidden">
                        Paste your existing menu link and we'll extract it automatically
                      </p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl lg:max-w-4xl bg-background border shadow-lg">
                  <DialogHeader>
                    <DialogTitle>Link Your Menu</DialogTitle>
                  </DialogHeader>
                  <MenuUploadForm type="url" />
                </DialogContent>
              </Dialog>

              {/* Upload Image Option */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-auto p-8 flex flex-col items-center gap-4 hover:bg-primary/5 hover:border-primary/20 transition-all min-h-[180px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center w-full">
                      <h3 className="font-semibold text-lg break-words hyphens-auto">Upload Image</h3>
                      <p className="text-sm text-muted-foreground mt-1 break-words leading-relaxed hyphens-auto overflow-hidden">
                        Upload a photo of your menu or snap one with your camera
                      </p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl lg:max-w-4xl bg-background border shadow-lg">
                  <DialogHeader>
                    <DialogTitle>Upload Menu Image</DialogTitle>
                  </DialogHeader>
                  <MenuUploadForm type="image" />
                </DialogContent>
              </Dialog>

              {/* Start Fresh Option */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-auto p-8 flex flex-col items-center gap-4 hover:bg-primary/5 hover:border-primary/20 transition-all min-h-[180px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <PenTool className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center w-full">
                      <h3 className="font-semibold text-lg break-words hyphens-auto">Start Fresh</h3>
                      <p className="text-sm text-muted-foreground mt-1 break-words leading-relaxed hyphens-auto overflow-hidden">
                        Create your menu from scratch with our easy builder
                      </p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl lg:max-w-4xl bg-background border shadow-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Menu</DialogTitle>
                  </DialogHeader>
                  <MenuUploadForm type="manual" />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Feature Cards - Below Menu Upload */}
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                {/* Feature Card 1 */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Digital Menus</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Convert paper menus to interactive digital experiences
                  </p>
                </div>

                {/* Feature Card 2 */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Real-time Ratings</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get instant feedback and ratings from customers
                  </p>
                </div>

                {/* Feature Card 3 */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Customer Insights</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Understand what customers love about your dishes
                  </p>
                </div>

                {/* Feature Card 4 */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Boost Reviews</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Increase positive reviews and customer satisfaction
                  </p>
                </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Menu Upload Form Component
function MenuUploadForm({ type }: { type: 'url' | 'image' | 'manual' }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: '',
    menuType: '',
    cuisine: '',
    description: '',
    menuUrl: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate AI extraction process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would integrate with your AI extraction service
    console.log('Processing menu:', { type, formData });
    
    setIsLoading(false);
    // Handle success/redirect
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="restaurantName">Restaurant Name *</Label>
          <Input
            id="restaurantName"
            placeholder="Enter your restaurant name"
            value={formData.restaurantName}
            onChange={(e) => handleInputChange('restaurantName', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="menuType">Menu Type *</Label>
          <Select value={formData.menuType} onValueChange={(value) => handleInputChange('menuType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select menu type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="brunch">Brunch</SelectItem>
              <SelectItem value="full-menu">Full Menu</SelectItem>
              <SelectItem value="drinks">Drinks Only</SelectItem>
              <SelectItem value="desserts">Desserts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cuisine">Cuisine Type</Label>
        <Select value={formData.cuisine} onValueChange={(value) => handleInputChange('cuisine', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select cuisine type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="american">American</SelectItem>
            <SelectItem value="italian">Italian</SelectItem>
            <SelectItem value="mexican">Mexican</SelectItem>
            <SelectItem value="asian">Asian</SelectItem>
            <SelectItem value="mediterranean">Mediterranean</SelectItem>
            <SelectItem value="indian">Indian</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {type === 'url' && (
        <div className="space-y-2">
          <Label htmlFor="menuUrl">Menu URL *</Label>
          <Input
            id="menuUrl"
            type="url"
            placeholder="https://example.com/menu"
            value={formData.menuUrl}
            onChange={(e) => handleInputChange('menuUrl', e.target.value)}
            required
          />
        </div>
      )}

      {type === 'image' && (
        <div className="space-y-2">
          <Label htmlFor="menuImage">Menu Image *</Label>
          <Input
            id="menuImage"
            type="file"
            accept="image/*"
            capture="environment"
            required
          />
          <p className="text-xs text-muted-foreground">
            Take a photo or upload an image of your menu
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Brief description of your restaurant..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="restaurant@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="123 Main St, City, State 12345"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {type === 'url' ? 'Extracting from URL...' : 
               type === 'image' ? 'Processing Image...' : 
               'Creating Menu...'}
            </>
          ) : (
            <>
              {type === 'url' ? 'Extract Menu from URL' : 
               type === 'image' ? 'Process Menu Image' : 
               'Create Menu'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
