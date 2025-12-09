import { useQuery } from "@tanstack/react-query";
import React from "react";

const cart = () => {
  const { data, isLoading, isPending, isError, error } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/customer/cart", {
        method: "GET",
      });
      const data = await res.json();
      return data;
    },
  });
  const services = data?.cart?.service || [];
  console.log(services);

  if (isLoading || isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return <div></div>;
};

export default cart;
