"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  CreditCard,
  UserCheck,
  Database,
  Search,
  Palette,
  Cog,
  MoreHorizontal,
  Check,
} from "lucide-react";
import HyperText from "../ui/hyper-text";

const tabs = [
  {
    id: 1,
    tabName: "Digital Menus",
    icon: Mail,
    heading: "Interactive Menu Creation",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Drag-and-drop menu builder</b> for easy customization
        </li>
        <li>
          • <b>Real-time menu updates</b> across all platforms
        </li>
        <li>• Mobile-optimized design for all devices</li>
        <li>• Custom branding and restaurant themes</li>
      </ul>
    ),
    timeSaved: "4 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>QR Codes</Badge>
        <Badge>Mobile App</Badge>
        <Badge>Web Portal</Badge>
        <Badge>Custom Branding</Badge>
      </div>
    ),
  },
  {
    id: 2,
    tabName: "Customer Ratings",
    icon: CreditCard,
    heading: "Real-time Customer Feedback",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>In-menu rating system</b> for every dish
        </li>
        <li>
          • <b>Customer reviews and comments</b> collection
        </li>
        <li>• Social sharing of favorite dishes</li>
        <li>• Real-time popularity rankings</li>
        <li>
          • <b>Review management</b> and response system
        </li>
      </ul>
    ),
    timeSaved: "8 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Star Ratings</Badge>
        <Badge>Social Sharing</Badge>
        <Badge>Review Management</Badge>
        <Badge>Analytics</Badge>
      </div>
    ),
  },
  {
    id: 3,
    tabName: "Analytics",
    icon: UserCheck,
    heading: "Restaurant Analytics Dashboard",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>• Real-time dish popularity rankings</li>
        <li>• Customer satisfaction metrics</li>
        <li>• Peak dining time analysis</li>
        <li>• Revenue impact tracking</li>
        <li>• Custom reporting and insights</li>
      </ul>
    ),
    timeSaved: "12 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Real-time Data</Badge>
        <Badge>Custom Reports</Badge>
        <Badge>Export Data</Badge>
      </div>
    ),
  },
  {
    id: 4,
    tabName: "QR Codes",
    icon: Database,
    heading: "QR Code Integration",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Custom QR codes</b> for each table
        </li>
        <li>
          • <b>Instant menu access</b> via smartphone
        </li>
        <li>
          • <b>Contactless ordering</b> system
        </li>
        <li>
          • <b>Table-specific</b> menu customization
        </li>
        <li>
          • <b>Print-ready</b> QR code designs
        </li>
      </ul>
    ),
    timeSaved: "6 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>QR Generation</Badge>
        <Badge>Table Codes</Badge>
        <Badge>Print Ready</Badge>
        <Badge>Contactless</Badge>
      </div>
    ),
  },
  {
    id: 5,
    tabName: "Multi-Location",
    icon: Search,
    heading: "Multi-Location Management",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Centralized menu management</b> for all locations
        </li>
        <li>
          • <b>Location-specific</b> menu customization
        </li>
        <li>
          • <b>Franchise support</b> with brand consistency
        </li>
        <li>
          • <b>Regional pricing</b> and availability
        </li>
        <li>
          • <b>Location analytics</b> and performance tracking
        </li>
      </ul>
    ),
    timeSaved: "5 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Franchise</Badge>
        <Badge>Multi-Site</Badge>
        <Badge>Centralized</Badge>
        <Badge>Regional</Badge>
      </div>
    ),
  },
  {
    id: 6,
    tabName: "Customization",
    icon: Palette,
    heading: "Restaurant Branding",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Custom restaurant themes</b> and colors
        </li>
        <li>
          • <b>Logo integration</b> and branding
        </li>
        <li>
          • <b>Menu layout customization</b> options
        </li>
        <li>
          • <b>Font and typography</b> selection
        </li>
        <li>
          • <b>Mobile-optimized</b> responsive design
        </li>
        <li>
          • <b>White-label</b> solutions available
        </li>
        <li>
          • <b>Custom domain</b> support
        </li>
        <li>
          • <b>Restaurant-specific</b> templates
        </li>
      </ul>
    ),
    timeSaved: "10 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Custom Themes</Badge>
        <Badge>White Label</Badge>
        <Badge>Branding</Badge>
      </div>
    ),
  },
  {
    id: 7,
    tabName: "Staff Management",
    icon: Cog,
    heading: "Restaurant Staff Tools",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Staff training</b> and onboarding
        </li>
        <li>
          • <b>Menu update notifications</b>
        </li>
        <li>
          • <b>Customer feedback alerts</b>
        </li>
        <li>
          • <b>Performance tracking</b> for staff
        </li>
        <li>
          • <b>Multi-language</b> support
        </li>
        <li>
          • <b>Role-based access</b> control
        </li>
        <li>
          • <b>Staff dashboard</b> for management
        </li>
      </ul>
    ),
    timeSaved: "7 hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Training</Badge>
        <Badge>Notifications</Badge>
        <Badge>Multi-Language</Badge>
        <Badge>Staff Dashboard</Badge>
      </div>
    ),
  },
  {
    id: 8,
    tabName: "More",
    icon: MoreHorizontal,
    heading: "And Much More...",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>• Integration with POS systems</li>
        <li>• Menu photo upload and processing</li>
        <li>
          • <b>Restaurant community</b> for support and tips
        </li>
        <li>
          • <b>Admin dashboard</b> for managing restaurants and analytics
        </li>
        <li>
          • <b>Menu templates</b> for different cuisine types
        </li>
        <li>
          • <b>Waitlist integration</b> for table management
        </li>
        <li>
          • <b>Legal compliance</b> and privacy features
        </li>
        <li>
          • <b>Customer support</b> and help center
        </li>
        <li>
          • <b>Email notifications</b> for restaurants and customers
        </li>
        <li>• And much more...</li>
      </ul>
    ),
    timeSaved: "15+ hours",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>POS Integration</Badge>
        <Badge>Menu Templates</Badge>
        <Badge>Waitlist</Badge>
        <Badge>Legal Compliance</Badge>
        <Badge>Support</Badge>
        <Badge>Notifications</Badge>
      </div>
    ),
  },
];

export const WebsiteFeatures = () => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <section className="py-32" id="features" aria-label="Features">
      <div className="container">
        <div className="mx-auto flex max-w-(--breakpoint-md) flex-col items-center gap-6">
          <h2 className="mb-4 text-center text-4xl font-semibold md:text-5xl">
            Digitize your restaurant menu{" "}
            <HyperText
              startOnView
              delay={1000}
              as="span"
              className="text-primary"
            >
              instantly
            </HyperText>
            , boost reviews
          </h2>
          <p className="text-center text-lg text-muted-foreground md:text-xl">
            Create digital menus, collect customer ratings, and get real-time analytics. Spend your
            time running your restaurant, not managing paper menus.{" "}
            <span className="text-primary">Stuf'd</span> provides you with
            everything you need to digitize,{" "}
            <HyperText startOnView delay={2500} as="span" className="text-sm">
              Faster than ever.
            </HyperText>
          </p>
        </div>
        <div className="mt-12">
          <Tabs
            defaultValue="1"
            className="mx-auto flex w-full flex-col items-center gap-8"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="flex h-auto flex-wrap justify-center gap-2 rounded-lg md:rounded-full py-4 md:p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id.toString()}
                    className={`flex items-center gap-2 rounded-full border border-solid border-transparent px-4 py-2 text-sm font-semibold transition ${
                      activeTab === tab.id.toString()
                        ? "border border-solid border-muted2 shadow-xs"
                        : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.tabName}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent
                value={tab.id.toString()}
                key={tab.id}
                className="mt-0 w-full overflow-hidden rounded-2xl bg-accent px-8 py-6 md:px-12 md:py-8"
              >
                <div className="flex flex-col justify-between">
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold">{tab.heading}</h3>
                    {tab.featureList}
                    <div className="mt-6">
                      <span className="text-sm text-green-500 flex items-center gap-1">
                        <Check className="h-4 w-4" /> Time saved:
                        <span className="font-semibold text-green-500">
                          {tab.timeSaved}
                        </span>
                      </span>
                    </div>
                    <div className="mt-4 w-full">{tab.footer}</div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default WebsiteFeatures;
