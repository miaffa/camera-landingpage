"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Wedding Photographer",
    avatar: "https://i.pravatar.cc/150?img=1",
    content: "This platform has completely transformed my photography business. I can now try expensive equipment before buying and earn money from my unused gear. It's been a game-changer!",
    rating: 5,
    restaurant: "Sarah Chen Photography"
  },
  {
    name: "Marcus Rodriguez",
    role: "Commercial Photographer",
    avatar: "https://i.pravatar.cc/150?img=2",
    content: "The rental analytics help me understand which equipment is most in demand. I've optimized my gear collection based on rental data and increased my monthly earnings by 40%.",
    rating: 5,
    restaurant: "Marcus Rodriguez Studios"
  },
  {
    name: "Emily Johnson",
    role: "Portrait Photographer",
    avatar: "https://i.pravatar.cc/150?img=3",
    content: "Setting up my equipment listings was incredibly easy. Within 30 minutes, I had professional listings that started generating rental requests immediately.",
    rating: 5,
    restaurant: "Emily Johnson Photography"
  },
  {
    name: "David Kim",
    role: "Street Photographer",
    avatar: "https://i.pravatar.cc/150?img=4",
    content: "The community features are amazing. I can share my work, tag the equipment I used, and connect with other photographers. It's like Instagram but for photographers!",
    rating: 5,
    restaurant: "David Kim Photography"
  },
  {
    name: "Lisa Thompson",
    role: "Event Photographer",
    avatar: "https://i.pravatar.cc/150?img=5",
    content: "I love how easy it is to manage my rentals. When equipment is booked or returned, I get instant notifications. The calendar integration makes scheduling so simple.",
    rating: 5,
    restaurant: "Lisa Thompson Events"
  },
  {
    name: "James Wilson",
    role: "Studio Owner",
    avatar: "https://i.pravatar.cc/150?img=6",
    content: "The professional plan gives us everything we need. The custom branding makes it feel like our own platform, and the analytics help us make data-driven decisions about our gear.",
    rating: 5,
    restaurant: "Wilson Photography Studio"
  }
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24" aria-label="Testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by photographers everywhere
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See how our platform is helping photographers earn money and access amazing equipment
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-sm text-muted-foreground mb-4">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-primary font-medium">{testimonial.restaurant}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Photographers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">2K+</div>
            <div className="text-sm text-muted-foreground">Equipment Listings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">4.8/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
