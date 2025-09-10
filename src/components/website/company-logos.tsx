"use client";

import Image from "next/image";
import Link from "next/link";

const companies = [
  {
    name: "OpenTable",
    image: "https://simpleicons.org/icons/opentable.svg",
    url: "https://www.opentable.com/",
  },
  {
    name: "Yelp",
    image: "https://simpleicons.org/icons/yelp.svg",
    url: "https://www.yelp.com/",
  },
  {
    name: "Grubhub",
    image: "https://simpleicons.org/icons/grubhub.svg",
    url: "https://www.grubhub.com/",
  },
  {
    name: "DoorDash",
    image: "https://simpleicons.org/icons/doordash.svg",
    url: "https://www.doordash.com/",
  },
  {
    name: "Uber Eats",
    image: "https://simpleicons.org/icons/ubereats.svg",
    url: "https://www.ubereats.com/",
  },
  {
    name: "Toast",
    image: "https://simpleicons.org/icons/toast.svg",
    url: "https://pos.toasttab.com/",
  },
];

export function CompanyLogos() {
  return (
    <div className="bg-muted/40 py-8" aria-label="Company Logos">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Trusted by restaurants using
        </p>
        <div className="mt-8 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <Link
              key={company.name}
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center grayscale transition hover:grayscale-0"
            >
              <div className="relative h-12 w-32">
                <Image
                  src={company.image}
                  alt={company.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
