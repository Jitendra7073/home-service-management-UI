import { Metadata } from "next";
import ContentDisplay from "@/components/common/ContentDisplay";
import { OrganizationSchema } from "@/components/seo";

// SEO: Generate metadata for about page
export const metadata: Metadata = {
  title: "About Us - India's Trusted Home Services Platform | Homhelper",
  description:
    "Learn about Homhelper - India's most trusted home services platform. Connect with verified professionals for all your home service needs. Our mission, vision, and values.",
  keywords: [
    "about homhelper",
    "homhelper team",
    "homhelper mission",
    "home services platform",
    "trusted service professionals",
    "homhelper story",
  ],
  openGraph: {
    title: "About Us - Homhelper",
    description: "Learn about Homhelper's mission to revolutionize home services in India",
    url: "/customer/about",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* SEO: Organization Schema */}
      <OrganizationSchema
        description="Homhelper is India's most trusted home services platform, connecting millions of customers with verified service professionals across 50+ categories."
      />
      <ContentDisplay contentKey="about_us" />
    </>
  );
}
