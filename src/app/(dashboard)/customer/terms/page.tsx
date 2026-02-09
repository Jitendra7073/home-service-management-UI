import { Metadata } from "next";
import ContentDisplay from "@/components/common/ContentDisplay";

// SEO: Generate metadata for terms page
export const metadata: Metadata = {
  title: "Terms & Conditions | Homhelper",
  description:
    "Read Homhelper's terms and conditions. Understand your rights and responsibilities when using our home services platform. Updated regularly.",
  keywords: [
    "homhelper terms",
    "terms and conditions",
    "user agreement",
    "service terms",
    "booking terms",
    "payment terms",
  ],
  openGraph: {
    title: "Terms & Conditions - Homhelper",
    description: "Terms of service for using Homhelper platform",
    url: "/customer/terms",
  },
};

export default function TermsPage() {
  return <ContentDisplay contentKey="terms_conditions" />;
}
