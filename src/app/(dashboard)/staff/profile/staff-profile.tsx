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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffProfileSkeleton } from "@/components/staff/skeletons";
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

  // Initialize active tab from URL or default to "details"
  const [activeTab, setActiveTab] = useState(
    tabParam === "details" || tabParam === "addresses" || tabParam === "payment"
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
      const res = await fetch("/api/staff/cards", {
        credentials: "include",
      });
      return res.json();
    },
  });

  const profile = data?.profile;
  const addresses = addressData?.addresses || [];
  const cards = cardsData?.cards || [];

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profile.stats.totalBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profile.stats.completedBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profile.stats.averageRating.toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profile.stats.totalBusinesses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
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
                          className="flex items-center justify-between p-4 border rounded-lg">
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
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-xs text-blue-900">
                    <strong>Security:</strong> Your card details are stored
                    securely and encrypted. We never display your full card
                    number or CVV.
                  </p>
                </div>
              </CardContent>
            </Card>
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
