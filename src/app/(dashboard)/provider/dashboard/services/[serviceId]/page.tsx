import React from "react";
import ServiceDashboard from "./services-by-id";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Manage your services effectively with HomHelpers.",
};

const ServiceById = async ({ params }: { params: { serviceId: string } }) => {
  const { serviceId } = await params;
  return <ServiceDashboard serviceId={serviceId} />;
};

export default ServiceById;
