import { Check, X } from "lucide-react";

interface ComparisonItem {
  title: string;
  description: string;
}

export function WithWithout() {
  const withProduct: ComparisonItem[] = [
    {
      title: "Peer-to-Peer Rentals",
      description:
        "Rent camera gear directly from local creators with secure payments and insurance coverage",
    },
    {
      title: "Social Community",
      description:
        "Showcase your work, tag gear, and connect with fellow photographers and videographers",
    },
    {
      title: "Trust & Safety",
      description:
        "ID verification, user reviews, and comprehensive insurance for peace of mind",
    },
    {
      title: "Mobile-First PWA",
      description:
        "Native app experience with offline support, push notifications, and camera integration",
    },
    {
      title: "Fair Commission",
      description:
        "Only 10% total commission (5% each) - lower than industry standard of 15%",
    },
    {
      title: "Local Community",
      description:
        "Louisville-focused launch with local events, meetups, and founding creator perks",
    },
  ];

  const withoutProduct: ComparisonItem[] = [
    {
      title: "Expensive Gear Purchases",
      description:
        "Spend thousands on camera equipment you only use occasionally",
    },
    {
      title: "Idle Equipment",
      description:
        "Watch your expensive gear collect dust while missing out on passive income",
    },
    {
      title: "Limited Access",
      description:
        "Struggle to access professional equipment for specific projects or learning",
    },
    {
      title: "No Community",
      description:
        "Miss out on networking opportunities and creative inspiration from peers",
    },
    {
      title: "High Commission Fees",
      description:
        "Pay 15% or more commission on existing rental platforms",
    },
    {
      title: "Trust Issues",
      description:
        "Worry about damage, theft, or unreliable renters without proper protection",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8" aria-label="Comparison">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Experience the Difference
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Without Product Section */}
          <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-900">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-500 p-2 rounded-full">
                <X className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">
                Without LensFlare
              </h3>
            </div>
            <div className="space-y-6">
              {withoutProduct.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-red-700 dark:text-red-400">
                    {item.title}
                  </h4>
                  <p className="text-red-600 dark:text-red-300/90">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* With Product Section */}
          <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-500 p-2 rounded-full">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
                With LensFlare
              </h3>
            </div>
            <div className="space-y-6">
              {withProduct.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-green-700 dark:text-green-400">
                    {item.title}
                  </h4>
                  <p className="text-green-600 dark:text-green-300/90">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
