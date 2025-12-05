"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Loader2,
  CalendarDays,
  Phone,
  HelpCircle,
  AlertTriangle,
  Locate,
  ChevronRight,
  User,
  Expand,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NotificationSideBar from "../common/notification-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Navigation configuration for better maintainability
const NAV_CONFIG = {
  booking: [
    {
      href: "/bookings/ongoing",
      icon: Loader2,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/10",
      title: "Ongoing Bookings",
      description: "Track services that are currently being handled.",
      animate: true,
    },
    {
      href: "/bookings/upcoming",
      icon: CalendarDays,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/10",
      title: "Upcoming Bookings",
      description: "View your scheduled upcoming service appointments.",
    },
  ],
  support: [
    {
      href: "/support/contact",
      icon: Phone,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
      title: "Contact Support",
      description: "Get quick help via call, chat, or email.",
    },
    {
      href: "/support/faqs",
      icon: HelpCircle,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      title: "FAQs",
      description: "Quick answers to common questions.",
    },
  ],
};

// Reusable NavItem Component
interface NavItemProps {
  href: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
  animate?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon: Icon,
  iconColor,
  bgColor,
  title,
  description,
  animate,
  onClick,
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors group">
    <div
      className={`p-2 ${bgColor} rounded-md group-hover:scale-110 transition-transform`}>
      <Icon
        size={18}
        className={`${iconColor} ${animate ? "animate-spin-slow" : ""}`}
      />
    </div>
    <div className="flex-1">
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  </Link>
);

export default function Header() {
  const [open, setOpen] = React.useState(false);

  const closeSheet = () => setOpen(false);

  return (
    <header className="w-full bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        {/* LOGO */}
        <Link
          href="/customer"
          className="text-2xl font-bold tracking-wide text-primary shrink-0">
          HSM
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-1">
              {/* Explore */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}>
                  <Link href="/customer/explore" className="text-sm">
                    Explore
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Bookings */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">
                  Booking
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col gap-2 p-3 w-[300px]">
                    {NAV_CONFIG.booking.map((item) => (
                      <NavItem key={item.href} {...item} />
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Support */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">
                  Support
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col gap-2 p-3 w-[300px]">
                    {NAV_CONFIG.support.map((item) => (
                      <NavItem key={item.href} {...item} />
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Notification Bell */}
              <NavigationMenuItem>
                <NotificationSideBar />
              </NavigationMenuItem>

              {/* User Profile */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}>
                  <Link href="/profile" className="text-sm">
                    Profile
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* MOBILE ACTIONS */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Menu Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                {open ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </SheetTrigger>

            {/* MOBILE MENU CONTENT */}
            <SheetContent side="left" className="w-[300px] p-0">
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b from-primary/5 to-transparent">
                <Link
                  href="/customer"
                  onClick={closeSheet}
                  className="text-xl font-bold text-primary">
                  HSM
                </Link>
              </div>

              <ScrollArea className="h-[calc(100vh-73px)]">
                {/* MOBILE NAV LINKS */}
                <div className="px-4 py-4 space-y-1">
                  {/* Home Link */}
                  <Link
                    href="/customer"
                    onClick={closeSheet}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors">
                    <Home size={20} className="text-primary" />
                    <span className="font-medium">Home</span>
                  </Link>

                  {/* Profile Link */}
                  <Link
                    href="/customer/profile"
                    onClick={closeSheet}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors">
                    <User size={20} className="text-primary" />
                    <span className="font-medium">Profile</span>
                  </Link>

                  <Link
                    href="/customer/explore"
                    onClick={closeSheet}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-accent transition-colors">
                    <Expand size={20} className="text-primary" />
                    <span className="font-medium">Explore</span>
                  </Link>

                  {/* Accordion for Sections */}
                  <Accordion type="single" collapsible className="w-full">
                    {/* Booking Section */}
                    <AccordionItem value="booking" className="border-none">
                      <AccordionTrigger className="py-3 px-4 hover:bg-accent rounded-lg hover:no-underline">
                        <div className="flex items-center gap-3">
                          <CalendarDays size={20} className="text-primary" />
                          <span className="font-medium">Booking</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2 pb-2 pt-1">
                        <div className="space-y-1">
                          {NAV_CONFIG.booking.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeSheet}
                              className="flex items-center gap-3 py-2.5 px-4 rounded-md hover:bg-accent/50 transition-colors group">
                              <div className={`p-1.5 ${item.bgColor} rounded`}>
                                <item.icon
                                  size={16}
                                  className={`${item.iconColor} ${
                                    item.animate ? "animate-spin-slow" : ""
                                  }`}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                              <ChevronRight
                                size={16}
                                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Support Section */}
                    <AccordionItem value="support" className="border-none">
                      <AccordionTrigger className="py-3 px-4 hover:bg-accent rounded-lg hover:no-underline">
                        <div className="flex items-center gap-3">
                          <HelpCircle size={20} className="text-primary" />
                          <span className="font-medium">Support</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2 pb-2 pt-1">
                        <div className="space-y-1">
                          {NAV_CONFIG.support.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeSheet}
                              className="flex items-center gap-3 py-2.5 px-4 rounded-md hover:bg-accent/50 transition-colors group">
                              <div className={`p-1.5 ${item.bgColor} rounded`}>
                                <item.icon
                                  size={16}
                                  className={item.iconColor}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                              <ChevronRight
                                size={16}
                                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
