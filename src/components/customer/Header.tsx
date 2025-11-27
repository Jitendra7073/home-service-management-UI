"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  User,
  Home,
  Layers,
  Users,
  Grid2x2,
  Loader2,
  CalendarDays,
  Phone,
  HelpCircle,
  AlertTriangle,
  Locate,
  Bell,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import NotificationSideBar from "../common/notification-sidebar";

export default function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="w-full bg-white border-b  sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* LOGO */}
        <Link
          href="/customer"
          className="text-2xl font-bold tracking-wide text-primary">
          HSM
        </Link>

        {/* DESKTOP SEARCH */}
        <div className="hidden md:flex w-[30%] items-center relative">
          <Search size={18} className="absolute left-3 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search services..."
            className="pl-10 rounded-full"
          />
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-4">
              {/* Explore */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-wrap gap-2 p-2 w-[300px]">
                    {/* Find Providers */}
                    <Link
                      href="/providers"
                      className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors">
                      <div className="p-2 bg-blue-500/10 rounded-md">
                        <Users size={18} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Find Providers</p>
                        <p className="text-xs text-muted-foreground">
                          Explore verified home service professionals near you.
                        </p>
                      </div>
                    </Link>

                    {/* Browse Services */}
                    <Link
                      href="/services"
                      className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors">
                      <div className="p-2 bg-green-500/10 rounded-md">
                        <Grid2x2 size={18} className="text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Browse Services</p>
                        <p className="text-xs text-muted-foreground">
                          View all available home service categories.
                        </p>
                      </div>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Bookings */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Booking</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-wrap gap-2 p-2 w-[300px]">
                    {/* Ongoing Bookings */}
                    <Link
                      href="/bookings/ongoing"
                      className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors">
                      <div className="p-2 bg-purple-500/10 rounded-md">
                        <Loader2
                          size={18}
                          className="text-purple-500 animate-spin-slow"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Ongoing Bookings</p>
                        <p className="text-xs text-muted-foreground">
                          Track services that are currently being handled.
                        </p>
                      </div>
                    </Link>

                    {/* Upcoming Bookings */}
                    <Link
                      href="/bookings/upcoming"
                      className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors">
                      <div className="p-2 bg-orange-500/10 rounded-md">
                        <CalendarDays size={18} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Upcoming Bookings</p>
                        <p className="text-xs text-muted-foreground">
                          View your scheduled upcoming service appointments.
                        </p>
                      </div>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Supports */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Support</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 w-[500px]">
                    {/* Contact Support */}
                    <Link
                      href="/support/contact"
                      className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <Phone size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Contact Support</p>
                        <p className="text-xs text-muted-foreground">
                          Get quick help via call, chat, or email.
                        </p>
                      </div>
                    </Link>

                    {/* FAQs */}
                    <Link
                      href="/support/faqs"
                      className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors">
                      <div className="p-2 bg-blue-500/10 rounded-md">
                        <HelpCircle size={18} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">FAQs</p>
                        <p className="text-xs text-muted-foreground">
                          Quick answers to common questions.
                        </p>
                      </div>
                    </Link>

                    {/* Raise Complaint */}
                    <Link
                      href="/support/complaint"
                      className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors">
                      <div className="p-2 bg-red-500/10 rounded-md">
                        <AlertTriangle size={18} className="text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Raise Complaint</p>
                        <p className="text-xs text-muted-foreground">
                          Report any service issue for resolution.
                        </p>
                      </div>
                    </Link>

                    {/* Track Complaint */}
                    <Link
                      href="/support/track"
                      className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors">
                      <div className="p-2 bg-amber-500/10 rounded-md">
                        <Locate size={18} className="text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Track Complaint</p>
                        <p className="text-xs text-muted-foreground">
                          Check the status of your submitted tickets.
                        </p>
                      </div>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Notifiaction Bell */}
              <NavigationMenuItem>
                <NotificationSideBar />
              </NavigationMenuItem>

              {/* User Profile */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}>
                  <Link href="/profile">Profile</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* MOBILE MENU BUTTON */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {open ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </SheetTrigger>

          {/* MOBILE MENU CONTENT */}
          <SheetContent side="left" className="w-[260px] p-0">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <Link href="/" className="text-xl font-semibold">
                HSM
              </Link>
            </div>

            {/* MOBILE SEARCH */}
            <div className="px-4 py-3">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-muted-foreground"
                />
                <Input placeholder="Search..." className="pl-10 rounded-full" />
              </div>
            </div>

            {/* MOBILE NAV LINKS */}
            <nav className="mt-3 px-4 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent">
                <Home size={18} /> Home
              </Link>

              <Link
                href="/components"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent">
                <Layers size={18} /> Components
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent">
                <User size={18} /> Profile
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
