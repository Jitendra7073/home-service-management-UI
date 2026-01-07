import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResetPasswordForm from "./form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Fixora",
  description: "Reset your password securely with Fixora.",
};

export default async function ResetPasswordPage() {

  return (
    <section className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-3xl md:max-w-4xl rounded-md bg-card shadow-lg border overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 flex items-center justify-center">
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">
                Reset your password
              </CardTitle>
              <CardDescription>
                Enter your new password below to complete the reset process.
                <br />
                Go back to{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline font-medium">
                  Login
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
               <Suspense fallback={<FallbackLoading />}>
              <ResetPasswordForm/>
                  </Suspense>
            </CardContent>
          </Card>
        </div>

        <div className="hidden md:flex items-center justify-center bg-gray-100 relative">
          <Image
            src="/images/reset-password.jpg"
            alt="Reset password illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function FallbackLoading() {
  return (
    <div className="p-6 text-center text-muted-foreground">
      Loading Services details...
    </div>
  );
}

