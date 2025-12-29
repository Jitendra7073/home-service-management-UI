"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  Calendar,
  LogOut,
  Trash2,
  Loader2,
  Map,
  MapPin,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import ProfileSkeleton from "./profileSkeleton";

const CustomerProfilePage = () => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch("/api/common/profile", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return (await res.json()) as any;
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const user = data?.user ?? null;
  const address = user?.addresses[0];

  const handleLogOut = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        toast.error("Failed to log out");
        return;
      }

      const data = await res.json();
      toast.success(data.message || "Logout Successful");

      // Clear stored tokens
      localStorage.removeItem("accessToken");

      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/common/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });

      return res.json();
    },
    onSuccess: () => {
      toast.success("Account deleted successfully");

      router.push("/auth/login");
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
  });

  const handleDeleteAccount = () => {
    deleteMutation.mutate();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitial = (name: string) => name?.charAt(0).toUpperCase();

  const getRoleColor = (role: string) => {
    switch (String(role).toLowerCase()) {
      case "customer":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "provider":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex justify-center items-center p-4">
        <Card className="max-w-md w-full border-red-200">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Failed to Load Profile
            </h2>
            <p className="text-gray-600 mb-4">Please try refreshing the page</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <>
      <div className="min-h-screen  py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* PROFILE HEADER CARD */}
          <Card className="shadow-md mb-6 rounded-lg overflow-hidden border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="h-24 sm:h-32 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800" />

              <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
                  {/* Left Section - Avatar & Info */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 flex-1">
                    <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-white shadow-lg flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-900 text-white text-2xl sm:text-3xl font-bold">
                        {getInitial(user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-center sm:text-left flex-1">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {user.name}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 mt-1 break-all">
                        {user.email}
                      </p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                        <Badge
                          className={`${getRoleColor(
                            user.role
                          )} border font-medium text-xs sm:text-sm`}>
                          {user.role}
                        </Badge>

                        <Badge className="bg-green-50 text-green-700 border-green-200 border font-medium text-xs sm:text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          Since {formatDate(user.createdAt)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Buttons (Hidden on Mobile) */}
                  <div className="hidden sm:flex flex-col gap-2 w-full sm:w-auto">
                    <Button
                      className="bg-gray-600 hover:bg-gray-700 text-white w-full sm:w-40 flex items-center justify-center gap-2"
                      onClick={handleLogOut}>
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </Button>

                    <Button
                      onClick={() => setDeleteOpen(true)}
                      className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-40 flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PERSONAL INFO CARD */}
          <Card className="shadow-md rounded-lg border-gray-200 hover:shadow-lg transition-shadow mb-6">
            <CardHeader className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl">Personal Information</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 p-4 sm:p-6">
              {/* Name Field */}
              <div>
                <Label className="text-gray-700 font-medium text-sm sm:text-base">
                  Full Name
                </Label>
                <p className="text-base sm:text-lg font-medium text-gray-900 mt-2 break-all">
                  {user.name}
                </p>
              </div>

              {/* Email Field */}
              <div>
                <Label className="text-gray-700 font-medium flex items-center gap-1 text-sm sm:text-base">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email Address
                </Label>
                <div className="mt-2 p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <p className="text-sm sm:text-base text-gray-900 break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Mobile Field */}
              <div>
                <Label className="text-gray-700 font-medium flex items-center gap-1 text-sm sm:text-base">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Mobile Number
                </Label>
                <p className="text-base sm:text-lg font-medium text-gray-900 mt-2">
                  {user.mobile}
                </p>
              </div>

              {/* Account Created Date */}
              <div className="pt-2 border-t border-gray-200">
                <Label className="text-gray-700 font-medium flex items-center gap-1 text-sm sm:text-base">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Account Created
                </Label>
                <p className="text-sm sm:text-base text-gray-600 mt-2">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ADDRESS INFO CARD */}
          <Card className="shadow-md rounded-lg border-gray-200 hover:shadow-lg transition-shadow mb-6">
            <CardHeader className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl">Addresses</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              {user?.addresses && user.addresses.length > 0 && (
                <div className="space-y-4">
                  <div className="p-4 sm:p-6 rounded-lg border-2 border-border hover:border-border/80 transition-all bg-gradient-to-br from-muted/50 to-card">
                    {/* Address Details */}
                    <div className="space-y-3">
                      {/* Street Address */}
                      <div>
                        <Label className="text-gray-600 font-medium text-xs sm:text-sm uppercase tracking-wide">
                          Street Address
                        </Label>
                        <p className="text-sm sm:text-base text-gray-900 font-medium break-words mt-1">
                          {address.street}
                        </p>
                      </div>

                      {/* City, State, Postal Code, Country Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div>
                          <Label className="text-gray-600 font-medium text-xs uppercase tracking-wide">
                            City
                          </Label>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {address.city}
                          </p>
                        </div>

                        <div>
                          <Label className="text-gray-600 font-medium text-xs uppercase tracking-wide">
                            State
                          </Label>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {address.state}
                          </p>
                        </div>

                        <div>
                          <Label className="text-gray-600 font-medium text-xs uppercase tracking-wide">
                            Postal Code
                          </Label>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {address.postalCode}
                          </p>
                        </div>

                        <div>
                          <Label className="text-gray-600 font-medium text-xs uppercase tracking-wide">
                            Country
                          </Label>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {address.country}
                          </p>
                        </div>
                      </div>

                      {/* Full Address Summary */}
                      <div className="mt-3 pt-3 border-t border-border bg-card rounded-md p-3">
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                          <span className="font-semibold text-foreground">
                            {address.street}
                          </span>
                          , {address.city}, {address.state} -{" "}
                          {address.postalCode}, {address.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* MOBILE ACTION BUTTONS */}
          <div className="sm:hidden flex flex-col gap-2">
            <Button
              className="bg-gray-600 hover:bg-gray-700 text-white w-full py-2.5 flex items-center justify-center gap-2"
              onClick={handleLogOut}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>

            <Button
              onClick={() => setDeleteOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white w-full py-2.5 flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="w-full max-w-sm mx-4 sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 text-lg sm:text-xl">
              Delete Your Account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              This action <strong>cannot be undone.</strong>
              It will permanently delete:
              <ul className="list-disc ml-5 sm:ml-6 mt-3 space-y-1 text-xs sm:text-sm">
                <li>Your profile</li>
                <li>All your data</li>
              </ul>
              <div className="mt-4 space-y-2">
                <p className="text-xs sm:text-sm">
                  To confirm, type:{" "}
                  <span className="font-semibold break-all">
                    "delete my account"
                  </span>
                </p>
                <Input
                  placeholder="delete my account"
                  value={deleteText}
                  onChange={(e) => setDeleteText(e.target.value)}
                  className="text-sm"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 sm:gap-3">
            <AlertDialogCancel className="bg-gray-200 text-sm sm:text-base">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={
                deleteText.trim().toLowerCase() !== "delete my account" ||
                deleteMutation.isPending
              }
              className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base disabled:opacity-40"
              onClick={() => {
                setDeleteOpen(false);
                handleDeleteAccount();
              }}>
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Permanently"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CustomerProfilePage;
