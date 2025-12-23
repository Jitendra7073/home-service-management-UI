import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import LoginForm from "./loginform";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-xl border bg-white shadow-lg">
        
        {/* LEFT - FORM */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
              <CardDescription>
                Enter your credentials to login. <br />
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <LoginForm />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="hidden md:flex w-1/2 relative bg-gray-100">
          <Image
            src="/images/loginForm.jpg"
            alt="Login illustration"
            fill
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
}
