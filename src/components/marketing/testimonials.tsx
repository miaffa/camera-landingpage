"use client";

import Image from "next/image";

const testimonials = [
  {
    quote:
      "LensFlare has completely changed how I access camera gear. I can try expensive lenses before buying, and the community is amazing. It&apos;s like having a professional gear library at my fingertips.",
    author: "Sarah Chen",
    role: "Wedding Photographer",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    quote:
      "I&apos;ve made over $2,000 renting out my idle camera equipment on LensFlare. The insurance coverage gives me peace of mind, and the platform handles everything. It&apos;s passive income I never knew I needed.",
    author: "Marcus Johnson",
    role: "Commercial Photographer",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    quote:
      "The social feed is brilliant - I can showcase my work and people can rent the exact gear I used. It&apos;s like Instagram meets gear rental. The community aspect makes it so much more than just a rental platform.",
    author: "Elena Rodriguez",
    role: "Content Creator",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    quote:
      "As a film student, LensFlare has been a game-changer. I can access professional equipment I could never afford to buy. The local Louisville community is incredibly supportive and helpful.",
    author: "David Kim",
    role: "Film Student",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    quote:
      "The trust and safety features are outstanding. ID verification, reviews, and insurance coverage make me feel confident renting out my $5,000 camera. The 72-hour dispute resolution is incredibly fast.",
    author: "Amanda Foster",
    role: "Portrait Photographer",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    quote:
      "LensFlare&apos;s mobile app is perfect for on-the-go rentals. I can browse gear, book instantly, and coordinate pickup all from my phone. The PWA experience feels just like a native app.",
    author: "James Wilson",
    role: "Event Photographer",
    image: "https://i.pravatar.cc/150?img=6",
  },
];

export function WebsiteTestimonials() {
  return (
    <section className="bg-muted/40 py-16 sm:py-24" aria-label="Testimonials">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What our community is saying
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join 200+ photographers and videographers who are already monetizing their gear and discovering new equipment on LensFlare.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="flex flex-col justify-between rounded-3xl bg-background p-8 shadow-xs ring-1 ring-border/60"
            >
              <blockquote className="text-lg leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <Image
                  className="h-10 w-10 rounded-full object-cover"
                  src={testimonial.image}
                  alt={testimonial.author}
                  fill
                />
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
