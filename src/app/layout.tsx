import { Toaster } from "sonner";
import "./globals.css";
import AuthProvider from "@/components/common/AuthProvider";
import TanstackProvider from "@/app/tanstackProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "HomHelpers | Trusted Home Services, Repairs & Maintenance",
    template: "%s | HomHelpers",
  },
  description:
    "HomHelpers is your one-stop platform for booking trusted home services. From plumbing and electrical work to cleaning and renovations, find verified experts near you.",
  category: "Home Services",
  keywords: [
    // Core Brand & Intent
    "HomHelpers",
    "HomHelper",
    "Home Helper",
    "home service app",
    "service providers",
    "home service management application",
    "homhelpers customer",
    "homhelpers provider",
    "homhelpers staff",
    "homhelpers member",
    "book home services online",
    "trusted home experts",
    "verified professionals",
    "on-demand home maintenance",
    "local service marketplace",
    // Cleaning & Sanitization
    "professional house cleaning",
    "deep cleaning services",
    "sofa cleaning",
    "carpet cleaning",
    "water tank cleaning",
    "disinfection services",
    "home sanitization",
    "bathroom deep cleaning",
    "kitchen cleaning",
    // Repairs & Maintenance
    "emergency plumber near me",
    "certified electrician",
    "AC repair services",
    "appliance repair",
    "washing machine repair",
    "refrigerator repair",
    "microwave repair",
    "geyser repair",
    "TV mounting service",
    "laptop repair at home",
    // Construction & Installation
    "home renovation",
    "bathroom remodeling",
    "kitchen remodeling",
    "home painter",
    "carpentry services",
    "flooring installation",
    "roofing contractors",
    "CCTV installation",
    "smart home automation",
    // Outdoor & Lifestyle
    "landscaping services",
    "lawn care",
    "pest control services",
    "movers and packers",
    "house shifting services",
    "interior designers",
    "pet grooming services",
    "dog walking",
    "mobile car wash",
    // Assembly & Small Tasks
    "handyman services",
    "furniture assembly",
    "IKEA furniture assembly",
    "wall hanging service",
    "door lock repair",
    // Health & Wellness
    "physiotherapy at home",
    "nursing services at home",
    "elderly care services",
    "beauty services at home",
    // Local & Delivery Intent
    "same day home service",
    "affordable home repairs",
    "24/7 emergency maintenance",
    "home service providers near me",
    "home service providers near you",
  ],
  authors: [{ name: "HomHelpers" }],
  creator: "HomHelpers",
  publisher: "HomHelpers",
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://www.homhelpers.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.homhelpers.com",
    title: "HomHelpers - Professional Home Services on Demand",
    description:
      "Connect with top-rated professionals for cleaning, repairs, and maintenance. Fast, secure, and reliable.",
    siteName: "HomHelpers",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HomHelpers Home Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HomHelpers | Verified Home Service Experts",
    description:
      "Your home deserves the best. Book verified experts for any task instantly.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta
          name="google-site-verification"
          content="WVbSWAOzRGMZEG-jf9B1EOfvItVxBQ6WDIy4YfgaYC4"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
      </head>
      <body>
        <TanstackProvider>
          <AuthProvider>
            <Toaster position="top-right" richColors />
            {children}
          </AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
