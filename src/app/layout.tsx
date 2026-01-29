import { Toaster } from "sonner";
import "./globals.css";
import AuthProvider from "@/components/common/AuthProvider";
import TanstackProvider from "@/app/tanstackProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Fixora - Home Service Management",
    template: "%s | Fixora",
  },
  description:
    "Fixora is the world's leading platform for booking trusted home services. Find top-rated plumbers, electricians, cleaners, and handymen near you instantly. Trusted by millions for fast, secure, and reliable home maintenance.",
  keywords: [
    "home services",
    "book home services",
    "hire professionals",
    "local service providers",
    "plumber near me",
    "electrician near me",
    "best house cleaning services",
    "handyman services",
    "emergency plumber",
    "24/7 electrician",
    "appliance repair",
    "AC repair services",
    "home painter",
    "carpentry services",
    "pest control services",
    "home renovation",
    "bathroom remodeling",
    "kitchen remodeling",
    "flooring installation",
    "roofing contractors",
    "landscaping services",
    "lawn care",
    "movers and packers",
    "house shifting services",
    "interior designers",
    "home sanitization",
    "disinfection services",
    "mobile car wash",
    "beauty services at home",
    "sofa cleaning",
    "carpet cleaning",
    "water tank cleaning",
    "CCTV installation",
    "smart home automation",
    "TV mounting service",
    "furniture assembly",
    "IKEA furniture assembly",
    "geyser repair",
    "washing machine repair",
    "refrigerator repair",
    "microwave repair",
    "laptop repair",
    "computer repair services",
    "mobile repair at home",
    "physiotherapy at home",
    "nursing services at home",
    "elderly care services",
    "pet grooming services",
    "dog walking",
    "trusted home experts",
    "verified professionals",
    "affordable home services",
    "premium home services",
    "same day service",
    "Fixora app",
    "Fixora services",
    "online service booking",
    "home maintenance app",
    "service marketplace",
  ],
  authors: [{ name: "Fixora" }],
  creator: "Fixora",
  publisher: "Fixora",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
    url: "/",
    title: "Fixora - Your Trusted Home Service Partner",
    description:
      "Connect with top-rated professionals for all your home service needs. Fast, reliable, and secure booking.",
    siteName: "Fixora",
    images: [
      {
        url: "/HSM-logo.png",
        width: 1200,
        height: 630,
        alt: "Fixora - Home Service Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fixora - Home Service Management",
    description:
      "Find and book trusted local service providers for home maintenance, cleaning, repairs, and more.",
    images: ["/HSM-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
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
