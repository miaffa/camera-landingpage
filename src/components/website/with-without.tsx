import { Check, X } from "lucide-react";

interface ComparisonItem {
  title: string;
  description: string;
}

export function WithWithout() {
  const withProduct: ComparisonItem[] = [
    {
      title: "Digital Menu Creation",
      description:
        "Create beautiful, interactive digital menus with drag-and-drop builder and custom branding",
    },
    {
      title: "Real-time Customer Feedback",
      description:
        "Collect instant ratings and reviews from customers directly through the menu",
    },
    {
      title: "Instant Menu Updates",
      description:
        "Update prices, add items, or mark unavailable instantly across all platforms",
    },
    {
      title: "Analytics Dashboard",
      description:
        "Get real-time insights into popular dishes, customer satisfaction, and dining trends",
    },
    {
      title: "QR Code Integration",
      description:
        "Generate custom QR codes for each table for contactless menu access",
    },
    {
      title: "Multi-Location Support",
      description:
        "Manage multiple restaurant locations with centralized control and location-specific customization",
    },
  ];

  const withoutProduct: ComparisonItem[] = [
    {
      title: "Paper Menu Nightmare",
      description:
        "Spend hundreds on printing costs and hours updating prices manually",
    },
    {
      title: "No Customer Feedback",
      description:
        "Miss out on valuable customer insights and struggle to improve your menu",
    },
    {
      title: "Outdated Information",
      description:
        "Deal with customer complaints about wrong prices and unavailable items",
    },
    {
      title: "No Analytics",
      description:
        "Make decisions based on guesswork instead of real customer data",
    },
    {
      title: "Lost Customers",
      description:
        "Watch customers choose competitors with modern digital experiences",
    },
    {
      title: "Staff Confusion",
      description:
        "Constantly train staff on menu changes and deal with version control issues",
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
                Without Stuf'd
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
                With Stuf'd
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
