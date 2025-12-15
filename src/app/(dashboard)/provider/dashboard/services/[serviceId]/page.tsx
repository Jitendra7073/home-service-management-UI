import React from "react";
import ServiceDashboard from "./services-by-id";

const ServiceById = async ({ params }: { params: { serviceId: String } }) => {
  const { serviceId } = await params;
  return <ServiceDashboard serviceId={serviceId}/>;
};

export default ServiceById;
