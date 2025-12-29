"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ShoppingCart,
  User2,
  Compass,
  CalendarCheck,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import NotificationSideBar from "../common/notification-sidebar";
import { useQuery } from "@tanstack/react-query";
// import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  const [open, setOpen] = React.useState(false);

  const { data: cart } = useQuery({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const res = await fetch("/api/customer/cart", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  const cartCount = cart?.totalItems ?? 0;

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-3 h-14 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/customer"
          className="text-lg font-bold tracking-tight text-primary"
        >
          HSM
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/customer/explore">Explore</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/customer/booking">Booking</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/customer/cart" className="relative">
                    <ShoppingCart className="text-primary"/>
                    {cartCount > 0 && (

                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/customer/profile">
                    <User2 className="text-primary"/>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* <NavigationMenuItem>
                <ThemeToggle />
              </NavigationMenuItem> */}

              <NavigationMenuItem>
                <NotificationSideBar />
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* MOBILE ACTIONS */}
        <div className="flex md:hidden items-center gap-1">

          <Link
            href="/customer/cart"
            className="relative p-2 rounded-md hover:bg-muted"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* <ThemeToggle /> */}

          <NotificationSideBar />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>

            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>

            {/* MOBILE MENU */}
            <SheetContent side="left" className="w-[260px] p-0">
              <div className="flex flex-col h-full">

                {/* MENU LINKS */}
                <div className="px-4 pt-10 space-y-1">
                  <MobileNavItem
                    href="/customer/explore"
                    icon={Compass}
                    label="Explore Services"
                    onClick={() => setOpen(false)}
                  />
                  <MobileNavItem
                    href="/customer/booking"
                    icon={CalendarCheck}
                    label="My Bookings"
                    onClick={() => setOpen(false)}
                  />
                  <MobileNavItem
                    href="/customer/profile"
                    icon={User2}
                    label="My Profile"
                    onClick={() => setOpen(false)}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileNavItem({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-base font-medium">{label}</span>
    </Link>
  );
}

function PromoCard({
  title,
  image,
}: {
  title: string;
  image: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border">
      <Image
        src={image}
        alt={title}
        width={400}
        height={160}
        className="h-24 w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 flex items-end p-2">
        <span className="text-white text-sm font-semibold bg-gray-500 px-3 rounded">
          {title}
        </span>
      </div>
    </div>
  );
}
