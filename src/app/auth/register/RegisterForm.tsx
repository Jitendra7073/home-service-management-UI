"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registrationSchema } from "@/lib/validator/auth-validator";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

// Require field symbol
const RequireField = () =>{
  return <span className="text-red-500 -ml-1">*</span>;
}

export default function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "provider">("customer");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      role: role,
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRoleChange = (newRole: "customer" | "provider") => {
    setRole(newRole);
    setValue("role", newRole);
  };

  const onSubmit = async (data: any) => {
    try {
      const UserEmail = String(data.email).toLocaleLowerCase();
      const payload = {
        role: data.role,
        name: data.name,
        email: UserEmail,
        mobile: data.mobile,
        password: data.password,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(
          result.message || "Registration successful! Please login."
        );
        router.push("/auth/login");
        return;
      }

      toast.error(result.message || "Registration failed. Please try again.");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-10">
      <div className="w-full max-w-5xl rounded-xl border bg-card shadow-lg grid grid-cols-1 md:grid-cols-2">
        {/* LEFT FORM */}
        <div className="p-8 flex items-center">
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">
                Create your account
              </CardTitle>
              <CardDescription>
                Enter your details to create an account. Already have an
                account?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline font-medium">
                  Login
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              {/* ROLE TABS */}
              <div className="mb-6">
                <Tabs
                  value={role}
                  onValueChange={(value) => handleRoleChange(value as "customer" | "provider")}
                  className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="customer" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer
                    </TabsTrigger>
                    <TabsTrigger value="provider" className="flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      Provider
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="hidden" {...register("role")} />

                {/* Name */}
                <div className="md:col-span-2">
                  <Label className="pb-2">Full Name <RequireField /></Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label className="pb-2">Email <RequireField /></Label>
                  <Input
                    type="text"
                    placeholder="example@gmail.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <Label className="pb-2">Mobile <RequireField /></Label>
                  <Input
                    type="number"
                    placeholder="9876543210"
                    {...register("mobile")}
                  />
                  {errors.mobile && (
                    <p className="text-red-600 text-sm">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label className="pb-2">Password <RequireField /></Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label className="pb-2">Confirm Password <RequireField /></Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Show Password */}
                <div className="md:col-span-2">
                  <label className="flex gap-2 items-center text-sm">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    Show Password
                  </label>
                </div>

                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex justify-center items-center gap-2">
                        <Spinner className="w-4 h-4" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:block relative">
          <Image
            src="/images/register.avif"
            alt="register"
            fill
            className="object-cover rounded-r-xl"
          />
        </div>
      </div>
    </section>
  );
}
