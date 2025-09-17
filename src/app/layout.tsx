import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { appConfig } from "@/lib/config";
import Providers from "./Providers";
import { Analytics } from "@vercel/analytics/next"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${appConfig.projectName}`,
    absolute: appConfig.projectName,
  },
  description: appConfig.description,
  keywords: appConfig.keywords,
  openGraph: {
    title: appConfig.projectName,
    description: appConfig.description,
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: appConfig.projectName,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/assets/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased bg-background`} style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}