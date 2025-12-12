import QuickCountCard from "@/components/provider/dashboard/quick-count-card";
import { BarChart, Users, ShoppingBag, Wallet } from "lucide-react";

const quickCounts = () => {
  const dashboardStats = [
    {
      title: "Total Revenue",
      value: "₹ 89,200",
      growth: "+14%",
      icon: Wallet,
      linkText: "View details",
    },
    {
      title: "New Customers",
      value: "320",
      growth: "+8%",
      icon: Users,
      linkText: "View customers",
    },
    {
      title: "Total Orders",
      value: "1,245",
      growth: "+5%",
      icon: ShoppingBag,
      linkText: "View orders",
    },
    {
      title: "Monthly Analytics",
      value: "92%",
      growth: "+3%",
      icon: BarChart,
      linkText: "Open analytics",
    },
  ];

  return (
    <>
      {dashboardStats.map((item, index) => {
        return (
          <div key={index} className="w-full">
            <QuickCountCard
              title={item.title}
              value={item.value}
              growth={item.growth}
              icon={item.icon}
              linkText={item.linkText}
            />
          </div>
        );
      })}
    </>
  );
};

export default quickCounts;
