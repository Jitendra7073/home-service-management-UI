"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Ban,
  CheckCircle,
  Eye,
  Loader2,
  Image as ImageIcon,
  Clock,
  DollarSign,
  XCircle,
} from "lucide-react";
import {
  useAdminBusinessDetails,
  useAdminBusinessServices,
  useApproveBusiness,
  useRejectBusiness,
  useRestrictBusiness,
  useLiftBusinessRestriction,
  useRestrictService,
  useLiftServiceRestriction,
} from "@/hooks/use-admin-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminDataGrid } from "@/components/admin/ui/admin-data-grid";
import { ServiceCard } from "@/components/admin/service-card";

interface BusinessData {
  _id: string;
  name: string;
  description: string;
  businessName: string;
  category: {
    _id: string;
    name: string;
  };
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
  address: string;
  phone?: string;
  email?: string;
  isApproved: boolean;
  isRejected: boolean;
  isRestricted: boolean;
  restrictionReason?: string;
  restrictionRequestMessage?: string;
  images?: string[];
  createdAt: string;
  operatingHours?: {
    [key: string]: { open: string; close: string; isClosed: boolean };
  };
}

interface ServiceData {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  isRestricted: boolean;
  restrictionReason?: string;
  isActive: boolean;
}

interface BusinessResponse {
  ok: boolean;
  business?: BusinessData;
  message?: string;
}

interface ServicesResponse {
  ok: boolean;
  services?: ServiceData[];
  message?: string;
}

export default function BusinessDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;

  // Queries
  const {
    data: businessResponse,
    isLoading: loading,
    error: businessError,
  } = useAdminBusinessDetails(businessId);
  const {
    data: servicesResponse,
    isLoading: servicesLoading,
    error: servicesError,
  } = useAdminBusinessServices(businessId);

  // Mutations
  const { mutate: approveBusiness, isPending: isApprovePending } =
    useApproveBusiness();
  const { mutate: rejectBusiness, isPending: isRejectPending } =
    useRejectBusiness();
  const { mutate: restrictBusiness, isPending: isRestrictPending } =
    useRestrictBusiness();
  const { mutate: liftRestriction, isPending: isLiftPending } =
    useLiftBusinessRestriction();
  const { mutateAsync: restrictServiceAsync } = useRestrictService();

  // Derived state
  const businessDataRaw = businessResponse?.data;
  const services = businessDataRaw?.services || [];

  const business: BusinessData | null = businessDataRaw
    ? {
        ...businessDataRaw,
        _id: businessDataRaw.id || businessDataRaw._id,
        owner: businessDataRaw.user
          ? {
              ...businessDataRaw.user,
              _id: businessDataRaw.user.id || businessDataRaw.user._id,
              firstName: businessDataRaw.user.name?.split(" ")[0] || "",
              lastName:
                businessDataRaw.user.name?.split(" ").slice(1).join(" ") || "",
            }
          : { _id: "", firstName: "Unknown", lastName: "", email: "" },
        address: businessDataRaw.address || "No address provided",
        email: businessDataRaw.contactEmail,
        phone: businessDataRaw.phoneNumber,
        restrictionRequestMessage: businessDataRaw.restrictionRequestMessage,
      }
    : null;

  const actionLoading =
    isApprovePending || isRejectPending || isRestrictPending || isLiftPending;

  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const handleApproveBusiness = () => {
    approveBusiness(businessId);
  };

  const handleRejectBusiness = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    rejectBusiness(
      { businessId, reason: rejectReason },
      {
        onSuccess: () => {
          setRejectDialogOpen(false);
          setRejectReason("");
        },
      },
    );
  };

  const handleBlockBusiness = () => {
    if (!blockReason.trim()) {
      toast.error("Please provide a reason for blocking");
      return;
    }
    restrictBusiness(
      { businessId, reason: blockReason },
      {
        onSuccess: () => {
          setBlockDialogOpen(false);
          setBlockReason("");
        },
      },
    );
  };

  const handleUnblockBusiness = () => {
    liftRestriction(businessId);
  };

  const handleBlockService = async (serviceId: string, reason: string) => {
    try {
      await restrictServiceAsync({ serviceId, reason });
    } catch (error) {
      // Error handled in hook
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton className="h-40 rounded-md" />
                  <Skeleton className="h-40 rounded-md" />
                  <Skeleton className="h-40 rounded-md" />
                  <Skeleton className="h-40 rounded-md" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-6">
          <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Business not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex md:flex-row flex-col justify-between items-start w-full">
            <div className="flex flex-col text-left w-fit">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight w-fit">
                {business.businessName}
              </h1>
              <p className="text-muted-foreground w-fit">
                {business.category.name}
              </p>
            </div>
            <div className="flex gap-3 justify-between w-full md:w-fit md:justify-end">
              <div>
                {business.isRestricted && (
                  <Badge variant="destructive" className="gap-1">
                    <Ban className="h-3 w-3" />
                    Blocked
                  </Badge>
                )}
                {!business.isApproved && !business.isRejected && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-yellow-500 text-yellow-600">
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                )}
                {business.isApproved && (
                  <Badge variant="default" className="gap-1 bg-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Approved
                  </Badge>
                )}
                {business.isRejected && (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    Rejected
                  </Badge>
                )}
              </div>

              <div>
                {/* Actions */}
                {!business.isApproved &&
                  !business.isRejected &&
                  !business.isRestricted && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="gap-2 border-destructive text-destructive"
                        onClick={() => setRejectDialogOpen(true)}
                        disabled={actionLoading}>
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        variant="default"
                        className="gap-2 bg-green-600 hover:bg-green-700"
                        onClick={handleApproveBusiness}
                        disabled={actionLoading}>
                        {actionLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Approve
                      </Button>
                    </div>
                  )}

                {business.isRestricted ? (
                  <Button
                    variant="default"
                    className="gap-2"
                    onClick={handleUnblockBusiness}
                    disabled={actionLoading}>
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Unblock Business
                  </Button>
                ) : (
                  business.isApproved && (
                    <Button
                      variant="destructive"
                      className="gap-2"
                      onClick={() => setBlockDialogOpen(true)}
                      disabled={actionLoading}>
                      <Ban className="h-4 w-4" />
                      Block Business
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Business Details */}
        <div className="space-y-6 lg:col-span-1">
          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={business.owner.profileImage} />
                  <AvatarFallback>
                    {business.owner.firstName[0]}
                    {business.owner.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {business.owner.firstName} {business.owner.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {business.owner.email}
                  </p>
                </div>
              </div>
              {business.owner.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{business.owner.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {business.businessName && (
                <div className="flex items-start gap-2 text-sm">
                  <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>{business.businessName}</span>
                </div>
              )}
              {business.email && (
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>{business.email}</span>
                </div>
              )}
              {business.phone && (
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>{business.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {business.restrictionReason && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">
                  Restriction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-sm mb-1">
                    Reason for Restriction:
                  </p>
                  <p className="text-sm text-destructive">
                    {business.restrictionReason}
                  </p>
                </div>
                {business.restrictionRequestMessage && (
                  <div className="pt-4 border-t border-destructive/20">
                    <p className="font-semibold text-sm mb-1">
                      Appeal from Provider:
                    </p>
                    <p className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md border italic">
                      "
                      {business.restrictionRequestMessage &&
                        business.restrictionRequestMessage
                          .charAt(0)
                          .toUpperCase() +
                          business.restrictionRequestMessage.slice(1)}
                      "
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Services */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Services ({services.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminDataGrid
                data={services}
                isLoading={servicesLoading}
                gridClassName="lg:grid-cols-2"
                emptyState={{
                  icon: Clock,
                  title: "No services found",
                  description: "This business has not added any services yet.",
                }}
                renderItem={(service: any) => (
                  <ServiceCard
                    key={service.id || service._id}
                    id={service.id || service._id}
                    name={service.name}
                    description={service.description}
                    duration={
                      service.duration || service.durationInMinutes || 0
                    }
                    price={service.price}
                    currency="INR"
                    businessName={business.businessName}
                    categoryName={business.category.name}
                    isRestricted={service.isRestricted}
                    restrictionReason={service.restrictionReason}
                    isActive={service.isActive ?? true}
                    onViewDetails={() =>
                      router.push(
                        `/admin/services/${service.id || service._id}`,
                      )
                    }
                  />
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Block Business Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Business</DialogTitle>
            <DialogDescription>
              You are about to block{" "}
              <span className="font-semibold">{business.name}</span>. This will
              restrict access to this business and all its services.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="business-reason">
                Reason for blocking <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="business-reason"
                placeholder="Provide a reason for blocking this business..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBlockDialogOpen(false);
                setBlockReason("");
              }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlockBusiness}
              disabled={actionLoading || !blockReason.trim()}>
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Blocking...
                </>
              ) : (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Block Business
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Business Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Business Application</DialogTitle>
            <DialogDescription>
              You are about to reject the application for{" "}
              <span className="font-semibold">{business.name}</span>. Please
              provide a reason for the rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">
                Reason for rejection <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reject-reason"
                placeholder="Provide a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
              }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectBusiness}
              disabled={actionLoading || !rejectReason.trim()}>
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Business
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper component for blocking individual services
function ServiceBlockButton({
  onBlock,
}: {
  onBlock: (reason: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBlock = async () => {
    if (!reason.trim()) {
      return;
    }
    setLoading(true);
    await onBlock(reason);
    setLoading(false);
    setOpen(false);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="destructive"
        size="sm"
        className="gap-2"
        onClick={() => setOpen(true)}>
        <Ban className="h-4 w-4" />
        Block
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block Service</DialogTitle>
          <DialogDescription>
            Provide a reason for blocking this service
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="service-reason">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="service-reason"
              placeholder="Reason for blocking..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={handleBlock}
            disabled={loading || !reason.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Blocking...
              </>
            ) : (
              "Block Service"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
