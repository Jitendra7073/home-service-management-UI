export const AVAILABLE_ANALYSIS = [
  { label: "Total Customers", value: "total_customers" },
  { label: "Total Bookings", value: "total_bookings" },
  { label: "Total Revenue", value: "total_revenue" },
  { label: "All Services", value: "all_services" },
  { label: "Customer Feedback", value: "customer_feedback" },
  { label: "Booking List", value: "booking_list" },
];

export const AVAILABLE_CHART = [
  { label: "Bookings status chart", value: "bookings_status_chart" },
  { label: "Revenue chart", value: "revenue_chart" },
  { label: "Popular Services chart", value: "popular_services_chart" },
];

export const FREE_PLAN = {
  name: "Free",
  maxServices: 5,
  maxBookings: 20,
  benefits: ["Basic Business Profile", "Up to 3 Services"],
  features: {
    allowedRoutes: [
      "Total Customers",
      "Total Bookings",
      "Total Revenue",
      "All Services",
      "Booking List",
    ],
    allowedGraphs: [],
  },
};
