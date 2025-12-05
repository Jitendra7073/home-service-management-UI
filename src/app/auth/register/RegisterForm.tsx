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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { User, Wrench } from "lucide-react";
import { toast } from "sonner";

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

  const handleRoleChange = (checked: boolean) => {
    const newRole = checked ? "provider" : "customer";
    setRole(newRole);
    setValue("role", newRole);
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        role: data.role,
        name: data.name,
        email: data.email,
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
      console.log("Registration result:", result);

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
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-5xl rounded-xl border bg-white shadow-lg grid grid-cols-1 md:grid-cols-2">
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
              {/* ROLE SWITCH */}
              <div className="flex items-center justify-between mb-6 p-3 border rounded-lg">
                <span className="font-medium hidden sm:block">Register as</span>
                <div className="flex items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <User
                        className={`w-5 h-5 ${
                          role === "customer"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>Customer</TooltipContent>
                  </Tooltip>

                  <Switch
                    checked={role === "provider"}
                    onCheckedChange={handleRoleChange}
                  />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Wrench
                        className={`w-5 h-5 ${
                          role === "provider"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>Provider</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid md:grid-cols-2 gap-5">
                <input type="hidden" {...register("role")} />

                {/* Name */}
                <div className="col-span-2">
                  <Label>Full Name</Label>
                  <Input placeholder="John Doe" {...register("name")} />
                  {errors.name && (
                    <p className="text-red-600 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <Input
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
                  <Label>Mobile</Label>
                  <Input placeholder="9876543210" {...register("mobile")} />
                  {errors.mobile && (
                    <p className="text-red-600 text-sm">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label>Password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
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
                  <Label>Confirm Password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Show Password */}
                <div className="col-span-2">
                  <label className="flex gap-2 items-center text-sm">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    Show Password
                  </label>
                </div>

                <div className="col-span-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}>
                    {isSubmitting ? "Creating Account..." : "Create Account"}
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
