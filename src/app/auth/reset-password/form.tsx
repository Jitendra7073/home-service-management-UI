"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/lib/validator/auth-validator";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

// Require field symbol
const RequireField = () =>{
  return <span className="text-red-500 -ml-1">*</span>;
}

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token"));
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Something went wrong");
        setIsSubmitting(false);
        return;
      }

      toast.success(result.message || "Password reset successfully!");
      router.push("/auth/login");
      setIsSubmitting(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5">
        <div className="grid gap-2">
          <Label htmlFor="newPassword">New Password <RequireField /></Label>
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-sm text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password <RequireField /></Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-1">
          <Checkbox
            id="showPassword"
            checked={showPassword}
            onCheckedChange={(v) => setShowPassword(v as boolean)}
          />
          <label
            htmlFor="showPassword"
            className="text-sm font-medium leading-none cursor-pointer">
            Show password
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex justify-center items-center gap-2">
              <Spinner className="w-4 h-4" />
              <span>Updating...</span>
            </div>
          ) : (
            "Update Password"
          )}
        </Button>
      </div>
    </form>
  );
}
