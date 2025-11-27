"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { User, Wrench } from "lucide-react";

export default function RegisterForm() {
  const [role, setRole] = useState<"customer" | "provider">("customer");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append("role", role);

    console.log("formData", formData);
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-5xl rounded-xl border bg-white shadow-lg grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 flex items-center">
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">
                Create your account
              </CardTitle>
              <CardDescription>
                Enter your details to create an account. <br />
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline font-medium">
                  Login
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              {/* Role Toggle */}
              <div className="flex items-center justify-between mb-6 p-3 border rounded-lg">
                <span className="font-medium hidden sm:block">Register as</span>

                <div className="flex items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <User
                        className={`w-5 h-5 cursor-pointer ${
                          role === "customer"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </TooltipTrigger>

                    <TooltipContent side="top">Customer</TooltipContent>
                  </Tooltip>

                  {/* --- Switch --- */}
                  <Switch
                    checked={role === "provider"}
                    onCheckedChange={(checked: boolean) =>
                      setRole(checked ? "provider" : "customer")
                    }
                  />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Wrench
                        className={`w-5 h-5  cursor-pointer ${
                          role === "provider"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </TooltipTrigger>

                    <TooltipContent side="top">Provider</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* GRID FORM */}
              <form
                onSubmit={handleSubmit}
                className=" flex flex-col sm:grid sm:grid-cols-auto md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="grid gap-1 col-span-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="grid gap-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>

                {/* Password */}
                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="grid gap-1">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input
                    id="confirm"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </div>

                <div className="col-span-2 mt-2">
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="px-0 flex-col gap-4">
              <Separator />
              <Button variant="outline" className="w-full">
                Sign up with Google
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* ==== RIGHT IMAGE SECTION ==== */}
        <div className="hidden md:block relative">
          <Image
            src="/images/register.avif"
            alt="Home services illustration"
            fill
            className="object-cover rounded-r-xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
