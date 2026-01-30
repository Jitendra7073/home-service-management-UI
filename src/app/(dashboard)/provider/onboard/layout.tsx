import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboard",
  description: "Welcome to the provider onboarding process on HomHelpers.",
};

export default function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
