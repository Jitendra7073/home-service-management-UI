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

export default function LoginPage() {
  return (
    <section className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-gray-50">
      {/* Main Container */}
      <div className="flex w-full max-w-4xl overflow-hidden rounded-xl border bg-white shadow-lg">
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">
                Login to your account
              </CardTitle>
              <CardDescription>
                Enter your email below to login to your account. <br />
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:underline font-medium">
                  Sign Up
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user123@gmail.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm text-muted-foreground underline-offset-4 hover:underline">
                        Forgot your password?
                      </Link>
                    </div>
                    <Input id="password" type="password" required />
                  </div>

                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="px-0 flex-col gap-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Side: Image (Hidden on mobile) */}
        <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center relative">
          {/* Ensure you have an image at public/images/login.jpg */}
          <Image
            src="/images/loginForm.jpg"
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
