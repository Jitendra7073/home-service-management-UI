"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ResetPasswordForm = (userId: String) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <form>
      <div className="flex flex-col gap-5">
        {/* New Password */}
        <div className="grid gap-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
            required
          />
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <Checkbox
            id="showPassword"
            checked={showPassword}
            onCheckedChange={(value) => setShowPassword(value as boolean)}
          />
          <label
            htmlFor="showPassword"
            className="text-sm font-medium leading-none cursor-pointer">
            Show password
          </label>
        </div>

        <Button type="submit" className="w-full mt-3">
          Reset Password
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
