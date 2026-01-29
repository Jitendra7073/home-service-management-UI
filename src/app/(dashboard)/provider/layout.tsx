import type { Metadata } from "next";
import GetFcmToken from "@/app/fcm-token";
import FirebaseForegroundListener from "@/components/common/firebase-foreground";

export const metadata: Metadata = {
  title: "Provider Portal - Grow Your Service Business",
  description:
    "Join Fixora as a service provider. Manage bookings, grow your customer base, and track earnings. The best platform for plumbers, electricians, cleaners, and home experts.",
  keywords: [
    "provider portal",
    "business management for contractors",
    "get more customers",
    "grow service business",
    "electrician jobs",
    "plumbing contracts",
    "house cleaning jobs",
    "freelance handyman",
    "contractor app",
    "service provider app",
    "home service business software",
    "find local customers",
    "leads for plumbers",
    "leads for electricians",
    "leads for painters",
    "register as professional",
    "Fixora provider login",
    "manage service requests",
    "independent contractor jobs",
    "gig economy jobs",
    "skilled trade jobs",
    "AC repair technician jobs",
    "carpenter work availability",
    "pest control leads",
    "beauty professional registration",
    "mobile mechanic jobs",
    "event planner jobs",
    "gardener jobs",
    "landscaper contracts",
    "appliance repair leads",
    "business tools for tradesmen",
    "invoice generator for contractors",
    "schedule management for service providers",
    "earn money online",
    "part time jobs for skilled workers",
    "full time service jobs",
  ],
  alternates: {
    canonical: "/provider",
  },
  openGraph: {
    title: "Fixora Provider Portal - Grow Your Business",
    description:
      "Connect with homeowners needing your skills. Manage jobs, payments, and your profile in one place.",
    url: "/provider",
    type: "website",
    siteName: "Fixora",
    images: [
      {
        url: "/provider-dashboard-og.png",
        width: 1200,
        height: 630,
        alt: "Fixora Provider Dashboard",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import AuthGuard from "@/components/common/AuthGuard";

function ProviderLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="provider">
      <GetFcmToken />
      <FirebaseForegroundListener />
      <main className="w-full">{children}</main>
    </AuthGuard>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProviderLayoutContent>{children}</ProviderLayoutContent>;
}
