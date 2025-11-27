import Link from "next/link";
import Image from "next/image";

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

export default function ForgotPassword() {
  return (
    <section className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-gray-50">
      {/* Main Container */}
      <div className="flex w-full max-w-4xl overflow-hidden rounded-xl border bg-white shadow-lg">
        {/* Left Side: Forgot Password Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">
                Forgot your password?
              </CardTitle>
              <CardDescription>
                Enter your email address and we’ll send you a reset link. <br />
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline font-medium">
                  Login
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user123@gmail.com"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Reset Link
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="px-0">
              {/* Optional: Add a subtle info message or remove this block completely */}
            </CardFooter>
          </Card>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center relative">
          <Image
            src="/images/forgot-password.jpg"
            alt="Home services illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
