"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "@/lib/validator/auth-validator";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
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
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

// Require field symbol
const RequireField = () => {
  return <span className="text-red-500 -ml-1">*</span>;
}

export default function ForgotPassword() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: any) => {
    try {
      const UserEmail = String(data.email).toLocaleLowerCase()
      const payload = {
        email: UserEmail,
      };
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.message || "Something went wrong");
        return;
      }

      toast.success(result?.message || "Reset link sent to your email!");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.message || "Network error");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-sm border bg-card shadow-lg">
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">
                Forgot your password?
              </CardTitle>
              <CardDescription>
                Enter your email address and we’ll send you a reset link.
                <br />
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline font-medium">
                  Login
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label>Email Address <RequireField /></Label>
                    <Input
                      type="text"
                      placeholder="Enter your email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex justify-center items-center gap-2">
                        <Spinner className="w-4 h-4" />
                        <span>Sending Link...</span>
                      </div>
                    ) : (
                      "Reset Your Passwword"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="px-0" />
          </Card>
        </div>

        {/* Right Image */}
        <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center relative">
          <Image
            src="/images/forgot-password.jpg"
            alt="Forgot password"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
