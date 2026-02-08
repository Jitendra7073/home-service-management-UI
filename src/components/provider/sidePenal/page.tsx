"use client";

import * as React from "react";
import {
  LayoutDashboard,
  BarChart,
  HandCoins,
  Building2,
  TicketCheck,
  User,
  CreditCard,
  Wallet,
  CalendarClock,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { AppSidebar as ReusableAppSidebar } from "@/components/common/sidebar/app-sidebar";
import { Sidebar } from "@/components/ui/sidebar";

// Sidebar links
const navMain = [
  {
    title: "Dashboard",
    url: "/provider/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Business",
    url: "/provider/dashboard/business",
    icon: Building2,
  },

  {
    title: "Services",
    url: "/provider/dashboard/services",
    icon: BarChart,
  },

  {
    title: "Bookings",
    url: "/provider/dashboard/bookings",
    icon: TicketCheck,
  },
  {
    title: "Pricing",
    url: "/provider/dashboard/pricing",
    icon: HandCoins,
  },
  {
    title: "Staff",
    url: "/provider/dashboard/staff",
    icon: User,
  },
  {
    title: "Payments",
    url: "/provider/dashboard/payments",
    icon: Wallet,
  },
  {
    title: "Staff Leaves",
    url: "/provider/dashboard/staff-leaves",
    icon: CalendarClock,
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: UserData } = useQuery({
    queryKey: ["provider-profile"],
    queryFn: async () => {
      const res = await fetch("/api/common/profile", {
        method: "GET",
      });
      const data = await res.json();
      return data;
    },
    staleTime: 5 * 60 * 60 * 1000,
  });
  const user = UserData?.user ?? {};
  const subscriptionStatus =
    user?.providerSubscription !== null &&
      user?.providerSubscription !== undefined
      ? user?.providerSubscription?.plan.name.toLowerCase()
      : "free";

  const LogoutHandler = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      window.location.reload();
    }
  };

  const userMenuItems = [
    {
      label: "Account",
      href: "/provider/dashboard/profile",
      icon: User,
    },
    {
      label: "Pricing",
      href: "/provider/dashboard/pricing",
      icon: CreditCard,
    },
  ];

  const sidebarUser = {
    name: user.name || "Provider",
    email: user.email || "",
    avatar: user.avatar,
  };

  return (
    <ReusableAppSidebar
      user={sidebarUser}
      navItems={navMain}
      logoutHandler={LogoutHandler}
      subscriptionStatus={subscriptionStatus}
      userMenuItems={userMenuItems}
      homeLink="/provider/dashboard"
      {...props}
    />
  );
}
