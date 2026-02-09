import { Metadata } from "next";
import ContentDisplay from "@/components/common/ContentDisplay";

// SEO: Generate metadata for privacy policy page
export const metadata: Metadata = {
  title: "Privacy Policy | Homhelper",
  description:
    "Homhelper's privacy policy. Learn how we protect your personal data and privacy when you use our home services platform. Your data security is our priority.",
  keywords: [
    "homhelper privacy policy",
    "data protection",
    "user privacy",
    "data security",
    "privacy policy",
    "personal information",
  ],
  openGraph: {
    title: "Privacy Policy - Homhelper",
    description: "How Homhelper protects your data and privacy",
    url: "/customer/privacy-policy",
  },
};

export default function PrivacyPage() {
  return <ContentDisplay contentKey="privacy_policy" />;
}
