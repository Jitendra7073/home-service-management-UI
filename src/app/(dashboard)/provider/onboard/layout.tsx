import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboard | Fixora",
  description: "Welcome to the provider onboarding process on Fixora.",
};


export default function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
