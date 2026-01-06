"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/lib/validator/auth-validator";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface LoginValues {
  email: string;
  password: string;
}

// Require field symbol
const RequireField = () => {
  return <span className="text-red-500 -ml-1">*</span>;
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      const UserEmail = String(data.email).toLocaleLowerCase();
      const payload = {
        email: UserEmail,
        password: data.password,
      };
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json?.message || "Login failed");
        return;
      }

      toast.success("Login successful!");
      // Redirect based on role returned from backend
      let redirectPath = "/customer";
      if (json?.role === "admin") {
        redirectPath = "/admin";
      } else if (json?.role === "provider") {
        redirectPath = "/provider/dashboard";
      } else {
        redirectPath = "/customer";
      }
      // Small delay to ensure cookies are set
      setTimeout(() => {
        router.push(redirectPath);
      }, 500);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Email */}
      <div className="grid gap-2">
        <Label>
          Email <RequireField />
        </Label>
        <Input
          type="text"
          placeholder="Enter your email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label>
            Password <RequireField />
          </Label>
          <Link
            href="/auth/forgot-password"
            className="ml-auto text-sm text-muted-foreground hover:underline">
            Forgot?
          </Link>
        </div>

        <Input
          type={`${showPassword ? "text" : "password"}`}
          placeholder="Enter your password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex justify-center items-center gap-2">
            <Spinner className="w-4 h-4" />
            <span>Login...</span>
          </div>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
