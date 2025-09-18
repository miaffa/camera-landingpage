import { Check, X } from "lucide-react";

interface ComparisonItem {
  title: string;
  description: string;
}

export function WithWithout() {
  const withProduct: ComparisonItem[] = [
    {
      title: "Easy Equipment Listings",
      description:
        "Create professional equipment listings with photos, descriptions, and custom pricing in minutes",
    },
    {
      title: "Secure Rental System",
      description:
        "Safe transactions with verified users, escrow payments, and equipment insurance coverage",
    },
    {
      title: "Real-time Availability",
      description:
        "Update equipment availability, pricing, or descriptions instantly across all platforms",
    },
    {
      title: "Rental Analytics Dashboard",
      description:
        "Get real-time insights into rental performance, earnings, and equipment utilization rates",
    },
    {
      title: "Community Features",
      description:
        "Share your photography work, tag equipment used, and connect with other photographers",
    },
    {
      title: "Location-Based Search",
      description:
        "Find equipment near you with geographic search, distance calculations, and local pickup options",
    },
  ];

  const withoutProduct: ComparisonItem[] = [
    {
      title: "Expensive Rental Costs",
      description:
        "Spend hundreds on rental shop fees and deal with limited availability and high prices",
    },
    {
      title: "No Equipment Access",
      description:
        "Miss out on professional gear opportunities and struggle to compete with better-equipped photographers",
    },
    {
      title: "Limited Availability",
      description:
        "Deal with equipment unavailability and last-minute rental cancellations",
    },
    {
      title: "No Rental Analytics",
      description:
        "Make decisions based on guesswork instead of real rental performance data",
    },
    {
      title: "Lost Opportunities",
      description:
        "Watch clients choose photographers with better equipment and miss out on projects",
    },
    {
      title: "Equipment Management Hassle",
      description:
        "Constantly manage rental schedules, returns, and deal with rental shop policies",
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
                Without Our Platform
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
          <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500 p-2 rounded-full">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                With Our Platform
              </h3>
            </div>
            <div className="space-y-6">
              {withProduct.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-blue-700 dark:text-blue-400">
                    {item.title}
                  </h4>
                  <p className="text-blue-600 dark:text-blue-300/90">
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
