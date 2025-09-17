"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, Smartphone, TrendingUp, Users, Link as LinkIcon, Upload, PenTool } from "lucide-react";
import AvatarCircles from "@/components/ui/avatar-circles";
import { cn } from "@/lib/utils";
import WordRotate from "@/components/ui/word-rotate";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function Hero() {
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
              <span className="inline-block">Rent Camera Gear,</span>
              <br />
              <WordRotate
                className="text-primary inline-block"
                words={["anywhere", "instantly", "affordably", "securely"]}
              />
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl max-w-2xl">
                Connect with photographers nationwide to rent professional camera equipment and share your creative work.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button size="lg" asChild>
                <Link href="/join-waitlist">Start Renting Gear</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">List Your Equipment</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Join 500+ photographers already sharing their gear
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-4">
                <AvatarCircles avatarUrls={avatarUrls} numPeople={500} />
                <div className="text-sm">
                  <p className="font-medium">500+ photographers</p>
                  <p className="text-muted-foreground">
                    Already using our platform
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

          {/* Equipment Upload Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Get Started in Minutes</h2>
              <p className="text-muted-foreground">Choose how you&apos;d like to list your camera equipment</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Link Equipment URL Option */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-auto p-8 flex flex-col items-center gap-4 hover:bg-primary/5 hover:border-primary/20 transition-all min-h-[180px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <LinkIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center w-full">
                      <h3 className="font-semibold text-lg break-words hyphens-auto">Link Equipment URL</h3>
                      <p className="text-sm text-muted-foreground mt-1 break-words leading-relaxed hyphens-auto overflow-hidden">
                        Paste your existing equipment listing and we&apos;ll extract it automatically
                      </p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl lg:max-w-4xl bg-background border shadow-lg">
                  <DialogHeader>
                    <DialogTitle>Link Your Equipment</DialogTitle>
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
                      <h3 className="font-semibold text-lg break-words hyphens-auto">Upload Photos</h3>
                      <p className="text-sm text-muted-foreground mt-1 break-words leading-relaxed hyphens-auto overflow-hidden">
                        Upload photos of your camera equipment or snap them with your phone
                      </p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl lg:max-w-4xl bg-background border shadow-lg">
                  <DialogHeader>
                    <DialogTitle>Upload Equipment Photos</DialogTitle>
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
                        Create your equipment listing from scratch with our easy builder
                      </p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl lg:max-w-4xl bg-background border shadow-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Equipment Listing</DialogTitle>
                  </DialogHeader>
                  <MenuUploadForm type="manual" />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Feature Cards - Below Equipment Upload */}
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                {/* Feature Card 1 */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Easy Listings</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create professional equipment listings in minutes
                  </p>
                </div>

                {/* Feature Card 2 */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Secure Rentals</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Safe transactions with verified users and insurance
                  </p>
                </div>

                {/* Feature Card 3 */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Community</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Connect with photographers and share your work
                  </p>
                </div>

                {/* Feature Card 4 */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Earn Money</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Monetize your gear when you&apos;re not using it
                  </p>
                </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Equipment Upload Form Component
function MenuUploadForm({ type }: { type: 'url' | 'image' | 'manual' }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    photographerName: '',
    equipmentType: '',
    category: '',
    description: '',
    equipmentUrl: '',
    phone: '',
    email: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate AI extraction process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would integrate with your AI extraction service
    console.log('Processing equipment:', { type, formData });
    
    setIsLoading(false);
    // Handle success/redirect
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="photographerName">Photographer Name *</Label>
          <Input
            id="photographerName"
            placeholder="Enter your name or business name"
            value={formData.photographerName}
            onChange={(e) => handleInputChange('photographerName', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipmentType">Equipment Type *</Label>
          <Select value={formData.equipmentType} onValueChange={(value) => handleInputChange('equipmentType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select equipment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="camera">Camera Body</SelectItem>
              <SelectItem value="lens">Lens</SelectItem>
              <SelectItem value="lighting">Lighting Equipment</SelectItem>
              <SelectItem value="tripod">Tripod & Support</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="audio">Audio Equipment</SelectItem>
              <SelectItem value="drone">Drone</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select photography category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="portrait">Portrait Photography</SelectItem>
            <SelectItem value="wedding">Wedding Photography</SelectItem>
            <SelectItem value="landscape">Landscape Photography</SelectItem>
            <SelectItem value="street">Street Photography</SelectItem>
            <SelectItem value="commercial">Commercial Photography</SelectItem>
            <SelectItem value="fashion">Fashion Photography</SelectItem>
            <SelectItem value="sports">Sports Photography</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {type === 'url' && (
        <div className="space-y-2">
          <Label htmlFor="equipmentUrl">Equipment URL *</Label>
          <Input
            id="equipmentUrl"
            type="url"
            placeholder="https://example.com/equipment"
            value={formData.equipmentUrl}
            onChange={(e) => handleInputChange('equipmentUrl', e.target.value)}
            required
          />
        </div>
      )}

      {type === 'image' && (
        <div className="space-y-2">
          <Label htmlFor="equipmentImage">Equipment Photos *</Label>
          <Input
            id="equipmentImage"
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            required
          />
          <p className="text-xs text-muted-foreground">
            Take photos or upload images of your camera equipment
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Brief description of your equipment and rental terms..."
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
            placeholder="photographer@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City, State (e.g., Los Angeles, CA)"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
        />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {type === 'url' ? 'Extracting from URL...' : 
               type === 'image' ? 'Processing Images...' : 
               'Creating Equipment Listing...'}
            </>
          ) : (
            <>
              {type === 'url' ? 'Extract Equipment from URL' : 
               type === 'image' ? 'Process Equipment Images' : 
               'Create Equipment Listing'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
