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
    tabName: "Gear Listings",
    icon: Search,
    heading: "Discover & List Camera Gear",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>High-quality gear photos</b> with detailed specifications
        </li>
        <li>
          • <b>Smart search filters</b> by camera type, lens, price, location
        </li>
        <li>• <b>Availability calendar</b> for easy booking</li>
        <li>• <b>Map view</b> to find gear near you</li>
        <li>• <b>AI-powered recommendations</b> based on your needs</li>
      </ul>
    ),
    timeSaved: "Instant",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Cameras</Badge>
        <Badge>Lenses</Badge>
        <Badge>Lighting</Badge>
        <Badge>Audio</Badge>
        <Badge>Drones</Badge>
      </div>
    ),
  },
  {
    id: 2,
    tabName: "Payments",
    icon: CreditCard,
    heading: "Secure Payment Processing",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Escrow-style payments</b> for secure transactions
        </li>
        <li>
          • <b>10% total commission</b> (5% from each party)
        </li>
        <li>• <b>Insurance integration</b> for damage protection</li>
        <li>• <b>Automatic payouts</b> to gear owners</li>
        <li>• <b>Dispute resolution</b> in 72 hours</li>
      </ul>
    ),
    timeSaved: "Secure",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Stripe</Badge>
        <Badge>Escrow</Badge>
        <Badge>Insurance</Badge>
        <Badge>Dispute Resolution</Badge>
      </div>
    ),
  },
  {
    id: 3,
    tabName: "Trust",
    icon: UserCheck,
    heading: "Trust & Safety",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>• <b>ID verification</b> for all users</li>
        <li>• <b>User reviews & ratings</b> system</li>
        <li>• <b>Trust badges</b> for verified creators</li>
        <li>• <b>Community verification</b> process</li>
        <li>• <b>Timestamped gear photos</b> for condition tracking</li>
      </ul>
    ),
    timeSaved: "Safe",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>ID Verification</Badge>
        <Badge>Reviews</Badge>
        <Badge>Trust Badges</Badge>
        <Badge>Community</Badge>
      </div>
    ),
  },
  {
    id: 4,
    tabName: "Social Feed",
    icon: Mail,
    heading: "Social Community",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Instagram-style feed</b> for showcasing work
        </li>
        <li>
          • <b>Gear tagging</b> in every post
        </li>
        <li>
          • <b>Direct rental CTAs</b> from posts
        </li>
        <li>
          • <b>Creator incentives</b> for gear-linked content
        </li>
        <li>
          • <b>Professional networking</b> opportunities
        </li>
      </ul>
    ),
    timeSaved: "Engaging",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Social Feed</Badge>
        <Badge>Gear Tagging</Badge>
        <Badge>Networking</Badge>
        <Badge>Community</Badge>
      </div>
    ),
  },
  {
    id: 5,
    tabName: "Messaging",
    icon: Database,
    heading: "In-App Communication",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Real-time messaging</b> between renters and owners
        </li>
        <li>
          • <b>Photo attachments</b> for gear coordination
        </li>
        <li>
          • <b>Rental status updates</b> and notifications
        </li>
        <li>
          • <b>Pickup/dropoff coordination</b>
        </li>
        <li>
          • <b>Built-in support</b> for any issues
        </li>
      </ul>
    ),
    timeSaved: "Seamless",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Real-time Chat</Badge>
        <Badge>Photo Sharing</Badge>
        <Badge>Notifications</Badge>
        <Badge>Support</Badge>
      </div>
    ),
  },
  {
    id: 6,
    tabName: "Mobile",
    icon: Palette,
    heading: "Mobile-First PWA",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Progressive Web App</b> for mobile experience
        </li>
        <li>
          • <b>Add to home screen</b> functionality
        </li>
        <li>
          • <b>Offline caching</b> for better performance
        </li>
        <li>
          • <b>Push notifications</b> for updates
        </li>
        <li>
          • <b>Camera integration</b> for gear photos
        </li>
        <li>
          • <b>Location services</b> for nearby gear
        </li>
      </ul>
    ),
    timeSaved: "Native-like",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>PWA</Badge>
        <Badge>Offline</Badge>
        <Badge>Push Notifications</Badge>
        <Badge>Mobile-First</Badge>
      </div>
    ),
  },
  {
    id: 7,
    tabName: "Insurance",
    icon: Cog,
    heading: "Comprehensive Protection",
    featureList: (
      <ul className="mt-4 space-y-3">
        <li>
          • <b>Damage protection</b> for all rentals
        </li>
        <li>
          • <b>Theft coverage</b> with quick claims
        </li>
        <li>
          • <b>72-hour resolution</b> process
        </li>
        <li>
          • <b>Third-party insurance</b> partnerships
        </li>
        <li>
          • <b>Clear liability</b> terms and conditions
        </li>
        <li>
          • <b>Automated claims</b> processing
        </li>
      </ul>
    ),
    timeSaved: "Protected",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Damage Protection</Badge>
        <Badge>Theft Coverage</Badge>
        <Badge>Quick Claims</Badge>
        <Badge>Insurance Partners</Badge>
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
        <li>• <b>Louisville launch</b> with local focus</li>
        <li>• <b>Founding creators</b> badge program</li>
        <li>
          • <b>Referral rewards</b> for bringing in users
        </li>
        <li>
          • <b>Local events</b> and meetups
        </li>
        <li>
          • <b>Gear condition</b> checklists
        </li>
        <li>
          • <b>Booking management</b> tools
        </li>
        <li>
          • <b>Analytics dashboard</b> for owners
        </li>
        <li>
          • <b>Community guidelines</b> and support
        </li>
        <li>• And much more...</li>
      </ul>
    ),
    timeSaved: "Complete",
    footer: (
      <div className="flex items-center gap-2">
        <Badge>Louisville</Badge>
        <Badge>Founding Creators</Badge>
        <Badge>Referrals</Badge>
        <Badge>Events</Badge>
        <Badge>Analytics</Badge>
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
            Rent camera gear from creators,{" "}
            <HyperText
              startOnView
              delay={1000}
              as="span"
              className="text-primary"
            >
              showcase your work
            </HyperText>
            , build community
          </h2>
          <p className="text-center text-lg text-muted-foreground md:text-xl">
            Discover professional equipment, monetize your gear, and connect with fellow creators.{" "}
            <span className="text-primary">LensFlare</span> is the peer-to-peer platform that makes camera gear accessible,{" "}
            <HyperText startOnView delay={2500} as="span" className="text-sm">
              One rental at a time.
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
