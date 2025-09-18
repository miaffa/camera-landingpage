"use client";

import Image from "next/image";
import Link from "next/link";

const companies = [
  {
    name: "Canon",
    image: "https://simpleicons.org/icons/canon.svg",
    url: "https://www.canon.com/",
  },
  {
    name: "Nikon",
    image: "https://simpleicons.org/icons/nikon.svg",
    url: "https://www.nikon.com/",
  },
  {
    name: "Sony",
    image: "https://simpleicons.org/icons/sony.svg",
    url: "https://www.sony.com/",
  },
  {
    name: "Fujifilm",
    image: "https://simpleicons.org/icons/fujifilm.svg",
    url: "https://www.fujifilm.com/",
  },
  {
    name: "Panasonic",
    image: "https://simpleicons.org/icons/panasonic.svg",
    url: "https://www.panasonic.com/",
  },
  {
    name: "Olympus",
    image: "https://simpleicons.org/icons/olympus.svg",
    url: "https://www.olympus.com/",
  },
];

export function CompanyLogos() {
  return (
    <div className="bg-muted/40 py-8" aria-label="Company Logos">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Trusted by photographers using
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
