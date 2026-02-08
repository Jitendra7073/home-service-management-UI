"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Star,
  Building2,
  Award,
  MapPin,
  CreditCard,
  User,
  Plus,
  RefreshCw,
  Loader2,
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

// Form state persistence key
const CARD_FORM_STATE_KEY = "staff_card_form_state";

export default function StaffProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      const res = await fetch("/api/staff/bank-accounts", {
        credentials: "include",
      });
      return res.json();
    },
  });

  const { data: stripeStatusData, refetch: refetchStripeStatus } = useQuery({
    queryKey: ["staff-stripe-status"],
    queryFn: async () => {
      const res = await fetch("/api/staff/payments/stripe/status", {
        credentials: "include",
      });
      return res.json();
    },
  });

  const profile = data?.profile;
  const addresses = addressData?.addresses || [];
  const cards = cardsData?.cards || [];
  const bankAccounts = bankAccountData?.bankAccounts || [];
  const hasConnected = stripeStatusData?.hasConnected || false;

  const handleSyncBankAccounts = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/staff/bank-accounts/sync", {
        method: "POST",
        credentials: "include",
      });
      const result = await res.json();

      if (result.success) {
        toast.success(result.msg || "Bank accounts synced successfully!");
        refetchBankAccount();
      } else {
        toast.error(result.msg || "Failed to sync bank accounts");
      }
    } catch (error) {
      toast.error("Error syncing bank accounts");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/staff/stripe/refresh", {
        method: "POST",
        credentials: "include",
      });
      const result = await res.json();

      if (result.success) {
        toast.success(
          `Stripe status updated from ${result.previousStatus} to ${result.newStatus}`
        );
        refetchBankAccount();
        // Also refresh the stripe status query
        refetchStripeStatus();
      } else {
        toast.error(result.msg || "Failed to refresh Stripe status");
      }
    } catch (error) {
      toast.error("Error refreshing Stripe status");
    } finally {
      setIsRefreshing(false);
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
              className={`overflow-hidden transition-all duration-300 ease-in-out ${showAddCard ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Bank Account</h2>
                <p className="text-gray-500 mt-1">
                  Manage your bank account for receiving payments
                </p>
              </div>
              {!hasConnected && (
                <Button
                  onClick={() => {
                    toast.info("Redirecting to Stripe...", {
                      description:
                        "You'll be redirected to complete your account setup",
                    });
                    fetch("/api/staff/payments/stripe/onboarding", {
                      credentials: "include",
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        if (data.success && data.onboardingUrl) {
                          setTimeout(() => {
                            window.location.href = data.onboardingUrl;
                          }, 1500);
                        } else {
                          toast.error(
                            data.msg || "Failed to generate onboarding link",
                          );
                        }
                      })
                      .catch(() => {
                        toast.error("Error connecting to Stripe");
                      });
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Connect Account
                </Button>
              )}
            </div>

            {!hasConnected ? (
              <div className="text-center py-16 px-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-sm">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-sm mb-6">
                  <CreditCard className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Connect Your Bank Account
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Connect your bank account to receive payments from providers for your completed services
                </p>
                <Button
                  onClick={() => {
                    fetch("/api/staff/payments/stripe/onboarding", {
                      credentials: "include",
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        if (data.success && data.onboardingUrl) {
                          toast.info("Redirecting to Stripe...");
                          setTimeout(() => {
                            window.location.href = data.onboardingUrl;
                          }, 1500);
                        } else {
                          toast.error(
                            data.msg || "Failed to generate onboarding link",
                          );
                        }
                      })
                      .catch(() => {
                        toast.error("Error connecting to Stripe");
                      });
                  }}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Connect Bank Account
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Bank Accounts List */}
                {bankAccounts.length > 0 ? (
                  <div className="grid gap-4">
                    {bankAccounts.map((account: any) => (
                      <div
                        key={account.id}
                        className="relative overflow-hidden bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-200">
                        {/* Gradient accent bar */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-600 to-blue-600" />

                        <div className="p-6 pl-8">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-sm">
                                  <Building2 className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-lg">
                                    {account.bankName}
                                  </h4>
                                  {account.isDefault && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium bg-green-100 text-green-800 mt-1">
                                      Default Account
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                    Account Number
                                  </p>
                                  <p className="font-mono text-lg font-semibold text-gray-900">
                                    •••• •••• •••• {account.last4}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                    Currency
                                  </p>
                                  <p className="font-semibold text-gray-900">
                                    {account.currency?.toUpperCase()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                    Status
                                  </p>
                                  <span className={`inline-flex items-center px-3 py-1 rounded-sm text-sm font-medium ${account.status === 'new' || account.status === 'validated'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {account.status === 'new' || account.status === 'validated' ? '✓' : '○'} {account.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-sm ${account.status === 'new' || account.status === 'validated'
                                ? 'bg-green-500'
                                : 'bg-gray-400'
                                }`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-8 bg-gray-50 rounded-sm">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      No bank accounts found in our database.
                    </p>
                    {hasConnected && (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500 mb-4">
                          If you've completed the Stripe onboarding and added a bank account, click below to sync.
                        </p>
                        <Button
                          onClick={handleSyncBankAccounts}
                          disabled={isSyncing}
                          variant="outline"
                          className="shadow-sm">
                          {isSyncing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Sync Bank Accounts
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                    {!hasConnected && (
                      <p className="text-sm text-gray-500">
                        Complete your Stripe setup to add a bank account.
                      </p>
                    )}
                  </div>
                )}

                {/* Stripe Account Status Card */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-white rounded-sm shadow-sm">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          Stripe Account Status
                        </h4>
                      </div>
                    </div>
                    {stripeStatusData?.stripeAccountStatus === 'PENDING' && (
                      <Button
                        onClick={handleRefreshStatus}
                        disabled={isRefreshing}
                        size="sm"
                        variant="outline"
                        className="shadow-sm bg-white">
                        {isRefreshing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Refreshing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Status
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-sm">
                      <span className="text-sm text-gray-600">Account Status</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-sm text-sm font-medium ${stripeStatusData?.stripeAccountStatus === 'VERIFIED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                        }`}>
                        {stripeStatusData?.stripeAccountStatus || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-sm">
                      <span className="text-sm text-gray-600">Payouts Enabled</span>
                      <span className={`inline-flex items-center text-sm font-medium ${stripeStatusData?.payoutsEnabled
                        ? 'text-green-700'
                        : 'text-gray-500'
                        }`}>
                        {stripeStatusData?.payoutsEnabled ? '✓ Active' : '○ Inactive'}
                      </span>
                    </div>
                  </div>
                  {stripeStatusData?.stripeAccountStatus === 'PENDING' && (
                    <div className="mt-4 p-3 bg-amber-100 rounded-sm">
                      <p className="text-xs text-amber-900">
                        <strong>Status Pending:</strong> Complete your Stripe onboarding to activate your account.
                        After adding a bank account, click "Refresh Status" to update.
                      </p>
                    </div>
                  )}
                </div>
              </div>
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
