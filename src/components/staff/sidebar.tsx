"use client";

import * as React from "react";
import { Calendar, User, Building2, FileText, IndianRupee } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";

// Staff navigation links
const staffNavMain = [
  {
    title: "Dashboard",
    url: "/staff",
    icon: Calendar,
  },
  {
    title: "My Bookings",
    url: "/staff/bookings",
    icon: Calendar,
  },
  {
    title: "Earnings",
    url: "/staff/earnings",
    icon: IndianRupee,
  },
  {
    title: "Browse Businesses",
    url: "/staff/businesses",
    icon: Building2,
  },
  {
    title: "My Applications",
    url: "/staff/applications",
    icon: FileText,
  },
  {
    title: "My Profile",
    url: "/staff/profile",
    icon: User,
  },
];

export function StaffSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data } = useQuery({
    queryKey: ["staff-profile"],
    queryFn: async () => {
      const res = await fetch("/api/common/profile");
      return res.json();
    },
  });

  const staff = data?.user;

  const userData = {
    name: staff?.name || "Staff Member",
    email: staff?.email || "",
    avatar: staff?.avatar,
  };

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      window.location.href = "/";
    }
  };

  const userMenuItems = [
    {
      label: "Profile",
      href: "/staff/profile",
      icon: User,
    },
  ];

  return (
    <AppSidebar
      user={userData}
      navItems={staffNavMain}
      logoutHandler={handleLogout}
      homeLink="/staff"
      userMenuItems={userMenuItems}
      subscriptionStatus={
        staff?.employmentType === "GLOBAL_FREELANCE"
          ? "Freelancer"
          : "Business Staff"
      }
      {...props}
    />
  );
}
