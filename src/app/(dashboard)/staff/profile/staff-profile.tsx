"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Building2,
  MapPin,
  Plus,
  Trash2,
  Landmark,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffProfileSkeleton } from "@/components/staff/skeletons";
import { toast } from "sonner";
import { StaffProfileEditDialog } from "@/components/staff/staff-profile-edit-dialog";
import { StaffAddressList } from "@/components/staff/address-list";
import { StaffCardForm } from "@/components/staff/card-form";
import { StaffCardList } from "@/components/staff/card-list";
import { StaffAddAddressDialog } from "@/components/staff/add-address-dialog";
import { StaffBankAccountForm } from "@/components/staff/bank-account-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Form state persistence key
const CARD_FORM_STATE_KEY = "staff_card_form_state";

export default function StaffProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const queryClient = useQueryClient();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Initialize active tab from URL or default to "details"
  const [activeTab, setActiveTab] = useState(
    tabParam === "details" ||
      tabParam === "addresses" ||
      tabParam === "payment" ||
      tabParam === "bank-account"
      ? tabParam
      : "details",
  );

  // Handle tab change and update URL
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (newTab === "details") {
      params.delete("tab");
    } else {
      params.set("tab", newTab);
    }

    // Update URL without refreshing
    router.push(`/staff/profile?${params.toString()}`, { scroll: false });
  };

  // Restore form state from session storage
  useEffect(() => {
    const savedState = sessionStorage.getItem(CARD_FORM_STATE_KEY);
    if (savedState === "show") {
      setShowAddCard(true);
    }
  }, []);

  // Persist form state to session storage
  useEffect(() => {
    if (showAddCard) {
      sessionStorage.setItem(CARD_FORM_STATE_KEY, "show");
    } else {
      sessionStorage.removeItem(CARD_FORM_STATE_KEY);
    }

    // Cleanup on unmount
    return () => {
      if (!showAddCard) {
        sessionStorage.removeItem(CARD_FORM_STATE_KEY);
      }
    };
  }, [showAddCard]);

  const { data, isLoading } = useQuery({
    queryKey: ["staff-profile-full"],
    queryFn: async () => {
      const res = await fetch("/api/staff/profile", {
        credentials: "include",
      });
      return res.json();
    },
  });

  const { data: addressData, refetch: refetchAddresses } = useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const res = await fetch("/api/common/address", {
        credentials: "include",
      });
      return res.json();
    },
  });

  const { data: cardsData, refetch: refetchCards } = useQuery({
    queryKey: ["staff-cards"],
    queryFn: async () => {
      const res = await fetch("/api/common/cards", {
        credentials: "include",
      });
      return res.json();
    },
  });

  const { data: bankAccountData, refetch: refetchBankAccount } = useQuery({
    queryKey: ["staff-bank-account"],
    queryFn: async () => {
      const res = await fetch("/api/staff/bank-account", {
        credentials: "include",
      });
      return res.json();
    },
  });

  const profile = data?.profile;
  const addresses = addressData?.addresses || [];
  const cards = cardsData?.cards || [];
  const bankAccount = bankAccountData?.bankAccount;

  const handleDeleteBankAccount = async () => {
    if (!bankAccount?.id) return;
    setIsDeletingAccount(true);
    try {
      const res = await fetch(`/api/staff/bank-account/${bankAccount.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Bank account removed successfully");
        refetchBankAccount();
      } else {
        toast.error(result.msg || "Failed to remove bank account");
      }
    } catch (error) {
      toast.error("Error removing bank account");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // ---------------- LOADING STATE ----------------
  if (isLoading) {
    return <StaffProfileSkeleton />;
  }

  // ---------------- EMPTY STATE ----------------
  if (!profile) {
    return (
      <div className="flex w-full justify-center">
        <div className="w-full max-w-7xl px-4 py-8">
          <p className="text-gray-600">Profile not found.</p>
        </div>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-7xl px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your profile, addresses, and payment details
          </p>
        </div>

        {/* Profile Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
            <TabsTrigger value="details">Profile Details</TabsTrigger>
            <TabsTrigger value="addresses">
              Addresses
              {addresses.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {addresses.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="payment">
              Card Details
              {cards.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {cards.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bank-account">Bank Account</TabsTrigger>
          </TabsList>

          {/* Profile Details Tab */}
          <TabsContent value="details" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditDialogOpen(true)}>
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{profile.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Mobile</p>
                        <p className="font-medium">{profile.mobile}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium">
                          {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <Badge variant="secondary">Staff</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Memberships */}
            {profile.businessMemberships &&
              profile.businessMemberships.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Business Memberships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.businessMemberships.map((business: any) => (
                        <div
                          key={business.id}
                          className="flex items-center justify-between p-4 border rounded-sm">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium">
                                {business.businessName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {business.category?.name}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              business.status === "ACTIVE"
                                ? "default"
                                : "secondary"
                            }>
                            {business.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">My Addresses</h2>
                <p className="text-gray-600 mt-1">
                  Manage your addresses for payments and deliveries
                </p>
              </div>
              <Button onClick={() => setShowAddAddress(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </div>

            {addresses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No addresses found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add your address to receive payments
                  </p>
                  <Button onClick={() => setShowAddAddress(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Address
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <StaffAddressList
                addresses={addresses}
                onRefresh={refetchAddresses}
              />
            )}
          </TabsContent>

          {/* Card Details Tab */}
          <TabsContent value="payment" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Card Details</h2>
                <p className="text-gray-600 mt-1">
                  Add your card details to receive payments from providers
                </p>
              </div>
              {!showAddCard && (
                <Button onClick={() => setShowAddCard(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card
                </Button>
              )}
            </div>

            {/* Add Card Form with smooth animation */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showAddCard ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}>
              {showAddCard && (
                <StaffCardForm
                  onSuccess={() => {
                    setShowAddCard(false);
                    refetchCards();
                  }}
                  onCancel={() => setShowAddCard(false)}
                />
              )}
            </div>

            <StaffCardList cards={cards} onRefresh={refetchCards} />

            {/* Info Section */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  How Payments Work
                </h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>
                    • Add your card details securely to receive payments from
                    providers
                  </p>
                  <p>
                    • Your card information is encrypted with AES-256 encryption
                  </p>
                  <p>
                    • Providers can send payments directly to your saved card
                  </p>
                  <p>• Set a default card for automatic payments</p>
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-sm">
                  <p className="text-xs text-blue-900">
                    <strong>Security:</strong> Your card details are stored
                    securely and encrypted. We never display your full card
                    number or CVV.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bank Account Tab */}
          <TabsContent value="bank-account" className="space-y-6 mt-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bank Account</h2>
              <p className="text-gray-500 mt-1">
                Manage your bank account for receiving payouts.
              </p>
            </div>

            {bankAccount ? (
              <div className="space-y-4">
                <Card className="relative overflow-hidden border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                          <Landmark className="w-5 h-5" />
                          {bankAccount.bankName}
                        </div>
                        <p className="text-sm text-gray-500">
                          {bankAccount.accountHolderName}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-green-600 bg-green-50 border-green-200">
                        Active
                      </Badge>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                          Account Number
                        </p>
                        <p className="mt-1 font-mono text-gray-900 font-medium text-lg">
                          {bankAccount.accountNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                          IFSC Code
                        </p>
                        <p className="mt-1 font-mono text-gray-900 font-medium">
                          {bankAccount.ifscCode}
                        </p>
                      </div>
                      {bankAccount.upiId && (
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                            UPI ID
                          </p>
                          <p className="mt-1 font-medium text-gray-900">
                            {bankAccount.upiId}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        Remove Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Remove Bank Account?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this bank account? You
                          won't be able to receive payouts until you add a new
                          one.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteBankAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={isDeletingAccount}>
                          {isDeletingAccount ? "Removing..." : "Remove"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ) : (
              <StaffBankAccountForm onSuccess={() => refetchBankAccount()} />
            )}
          </TabsContent>
        </Tabs>

        <StaffProfileEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          profile={profile}
        />

        <StaffAddAddressDialog
          open={showAddAddress}
          onOpenChange={setShowAddAddress}
          onSuccess={() => {
            refetchAddresses();
          }}
        />
      </div>
    </div>
  );
}
