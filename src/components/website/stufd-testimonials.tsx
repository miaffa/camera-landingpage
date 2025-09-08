"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Owner, Golden Dragon Restaurant",
    avatar: "https://i.pravatar.cc/150?img=1",
    content: "Stuf'd transformed our dining experience. Our customers love rating dishes directly from the menu, and we've seen a 40% increase in positive reviews since implementing it.",
    rating: 5,
    restaurant: "Golden Dragon Restaurant"
  },
  {
    name: "Marcus Rodriguez",
    role: "Manager, Bella Vista Bistro",
    avatar: "https://i.pravatar.cc/150?img=2",
    content: "The real-time analytics help us understand what our customers really want. We've optimized our menu based on ratings and increased sales by 25%.",
    rating: 5,
    restaurant: "Bella Vista Bistro"
  },
  {
    name: "Emily Johnson",
    role: "Chef, The Garden Table",
    avatar: "https://i.pravatar.cc/150?img=3",
    content: "Setting up our digital menu was incredibly easy. Within 30 minutes, we had a beautiful, interactive menu that our customers absolutely love.",
    rating: 5,
    restaurant: "The Garden Table"
  },
  {
    name: "David Kim",
    role: "Owner, Seoul Kitchen",
    avatar: "https://i.pravatar.cc/150?img=4",
    content: "The customer feedback feature is game-changing. We can instantly see which dishes are popular and adjust our menu accordingly. Customer satisfaction has never been higher.",
    rating: 5,
    restaurant: "Seoul Kitchen"
  },
  {
    name: "Lisa Thompson",
    role: "Manager, Riverside Cafe",
    avatar: "https://i.pravatar.cc/150?img=5",
    content: "Our staff loves how easy it is to update the menu. When we run out of a dish or change prices, it's updated instantly across all platforms.",
    rating: 5,
    restaurant: "Riverside Cafe"
  },
  {
    name: "James Wilson",
    role: "Owner, Wilson's Steakhouse",
    avatar: "https://i.pravatar.cc/150?img=6",
    content: "The professional plan gives us everything we need. The custom branding makes it feel like our own app, and the analytics help us make data-driven decisions.",
    rating: 5,
    restaurant: "Wilson's Steakhouse"
  }
];

export function StufdTestimonials() {
  return (
    <section className="py-16 sm:py-24" aria-label="Testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by restaurants everywhere
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See how Stuf'd is helping restaurants create better customer experiences
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
                  "{testimonial.content}"
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
            <div className="text-sm text-muted-foreground">Restaurants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">50K+</div>
            <div className="text-sm text-muted-foreground">Menu Items Digitized</div>
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
