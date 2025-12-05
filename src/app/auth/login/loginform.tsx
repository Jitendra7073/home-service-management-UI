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

interface LoginValues {
  email: string;
  password: string;
}

export default function LoginForm() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();
      console.log("Login Response:", json);

      if (!res.ok) {
        toast.error(json?.message || "Login failed");
        return;
      }

      toast.success("Login successful!");
      router.push("/customer");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Email */}
      <div className="grid gap-2">
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="user123@gmail.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label>Password</Label>
          <Link
            href="/auth/forgot-password"
            className="ml-auto text-sm text-muted-foreground hover:underline">
            Forgot?
          </Link>
        </div>

        <Input type="password" placeholder="******" {...register("password")} />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
