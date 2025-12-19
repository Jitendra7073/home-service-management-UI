"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ShoppingCart,
  User2,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationSideBar from "../common/notification-sidebar";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const [open, setOpen] = React.useState(false);

  const { data: cart } = useQuery({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const res = await fetch("/api/customer/cart", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
    staleTime: 5 * 1000,
    refetchOnWindowFocus: false,
  });

  const cartCount = cart?.totalItems ?? 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/customer" className="text-2xl font-bold text-primary">
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

              {/* CART */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/customer/cart" className="relative">
                    <ShoppingCart />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/customer/profile">
                    <User2 />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NotificationSideBar />
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* MOBILE HEADER ICONS */}
        <div className="flex md:hidden items-center gap-2">

          <Link href="/customer/cart" className="relative p-2">
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <NotificationSideBar />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? <X /> : <Menu />}
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[280px] p-0">
              <ScrollArea className="h-full p-4 space-y-3">
                <Link href="/customer/explore">Explore</Link>
                <Link href="/customer/booking">Booking</Link>
                <Link href="/customer/profile">Profile</Link>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
