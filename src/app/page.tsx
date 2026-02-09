import type { Metadata } from "next";
import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import HeroSection from "@/components/customer/HeroSection";
import CategoryList from "@/components/customer/business-profile-list";
import HowItWorks from "@/components/customer/how-it-works";
import {
  OrganizationSchema,
  WebsiteSchema,
  FAQSchema,
} from "@/components/seo";

export const metadata: Metadata = {
  title: "Homhelper - Book Trusted Home Services Online | Expert Cleaners, Plumbers, Electricians & More",
  description:
    "India's most trusted home services platform. Book verified professionals for cleaning, repairs, AC service, plumbing, electrical, and 50+ services. ⭐ 4.5+ avg rating. 30-day warranty. Instant booking.",
  keywords: [
    "home services",
    "home services near me",
    "trusted home experts",
    "verified professionals",
    "home service app",
    "book home services online",
    "cleaning services",
    "plumber near me",
    "electrician near me",
    "AC repair service",
    "home repair services",
    "professional home services",
    "local service marketplace",
    "home maintenance services",
    "homhelper",
  ],
  authors: [{ name: "Homhelper Team" }],
  creator: "Homhelper",
  publisher: "Homhelper",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Homhelper - Book Trusted Home Services Online",
    description:
      "Connect with top-rated local professionals for cleaning, repair, maintenance, and more. Fast, reliable, and secure booking.",
    images: [
      {
        url: "/og-homepage.png",
        width: 1200,
        height: 630,
        alt: "Homhelper - Trusted Home Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Homhelper - Trusted Home Service Experts",
    description:
      "Book verified professionals for all your home service needs. ⭐ 4.5+ rating, 30-day warranty.",
    images: ["/og-homepage.png"],
  },
};

export default function LandingPage() {
  // FAQs for structured data
  const faqs = [
    {
      question: "What home services does Homhelper offer?",
      answer: "Homhelper offers 50+ home services including cleaning, plumbing, electrical work, AC repair, appliance repair, painting, carpentry, pest control, and much more.",
    },
    {
      question: "Are the service professionals on Homhelper verified?",
      answer: "Yes, all professionals on Homhelper are thoroughly verified including background checks, skill verification, and training certification.",
    },
    {
      question: "What is Homhelper's warranty policy?",
      answer: "Homhelper offers a 30-day warranty against any service quality issues. If you're not satisfied, we'll re-do the service for free.",
    },
    {
      question: "How do I book a service on Homhelper?",
      answer: "Simply browse our categories, select your service, choose a convenient time slot, and confirm your booking. Payment is secure and can be done online or after service completion.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col justify-between">
      {/* SEO: Structured Data */}
      <OrganizationSchema
        description="Homhelper is India's most trusted home services platform, connecting customers with verified professionals for all home service needs."
        address={{
          street: "123 Business Street",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          country: "India",
        }}
      />
      <WebsiteSchema />
      <FAQSchema faqs={faqs} />

      <HeroSection />
      <CategoryList isVisible={true} search={false} />
      <HowItWorks />
    </main>
  );
}
