import type { Metadata } from "next";
import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import TanstackProvider from "../../tanstackProvider";
import GetFcmToken from "@/app/fcm-token";
import FirebaseForegroundListener from "@/components/common/firebase-foreground";

export const metadata: Metadata = {
  title: "Dashboard - Book Top Rated Home Services | HomHelpers",
  description:
    "Your personal dashboard to book and manage home services. Hire 5-star plumbers, electricians, cleaners, and beauty experts. Track bookings, view invoices, and get support instantly.",
  keywords: [
    "customer dashboard",
    "my bookings",
    "track service provider",
    "rate service provider",
    "hire plumber online",
    "hire electrician online",
    "book house cleaning",
    "hire carpenter",
    "best home service app",
    "trusted local handyman",
    "verified service providers near me",
    "cheap plumbing service",
    "affordable electrician",
    "luxury home salon services",
    "massage at home",
    "men's grooming at home",
    "women's salon at home",
    "pest control for home",
    "termite treatment",
    "cockroach control",
    "deep cleaning services",
    "kitchen cleaning",
    "bathroom cleaning",
    "sofa dry cleaning",
    "mattress cleaning",
    "curtain cleaning",
    "window glass cleaning",
    "facade cleaning",
    "car detailing at home",
    "bike servicing at home",
    "laundry services",
    "dry cleaning pick up",
    "ironing services",
    "shoe laundry",
    "bag repair",
    "suitcase repair",
    "cobbler services",
    "locksmith near me",
    "key duplication service",
    "emergency home repairs",
    "same day handyman",
    "weekend service booking",
    "holiday home maintenance",
    "annual maintenance contract AMC",
    "HomHelpers customer login",
    "manage home repairs",
    "home service history",
  ],
  alternates: {
    canonical: "/customer",
  },
  openGraph: {
    title: "HomHelpers Customer Dashboard - Manage Your Home Services",
    description:
      "Your central hub for booking and managing top-rated home services. Trusted professionals, secure payments, and reliable service.",
    url: "/customer",
    type: "website",
    siteName: "HomHelpers",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import AuthGuard from "@/components/common/AuthGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TanstackProvider>
      <AuthGuard role="customer">
        <GetFcmToken />
        <FirebaseForegroundListener />
        <main className="min-h-screen flex flex-col justify-between">
          <Header />
          {children}
          <Footer />
        </main>
      </AuthGuard>
    </TanstackProvider>
  );
}
