import type { Metadata } from "next";
import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import HeroSection from "@/components/customer/HeroSection";
import CategoryList from "@/components/customer/business-profile-list";
import HowItWorks from "@/components/customer/how-it-works";

export const metadata: Metadata = {
  title: "Fixora - Book Trusted Home Services Online",
  description:
    "Connect with top-rated local professionals for cleaning, repair, maintenance, and more. Fast, reliable, and secure booking with Fixora.",
  alternates: {
    canonical: "/",
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <HeroSection />
      <CategoryList isVisible={true} search={false} />
      <HowItWorks />
    </main>
  );
}
