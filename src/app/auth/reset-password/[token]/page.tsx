import Link from "next/link";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResetPasswordForm from "./form";

export default async function ResetPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  const {token} = await params;

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-3xl md:max-w-4xl rounded-xl bg-white shadow-lg border overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
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
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Login
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <ResetPasswordForm token={token} />
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
