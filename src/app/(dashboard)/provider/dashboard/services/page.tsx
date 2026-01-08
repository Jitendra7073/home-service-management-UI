import ServiceView from "./service";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Manage your services effectively with Fixora.",
};

export default function ServicesPage() {
  return <ServiceView />;
}
