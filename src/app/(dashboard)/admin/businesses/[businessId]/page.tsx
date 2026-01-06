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
} from "lucide-react";

interface BusinessData {
  _id: string;
  name: string;
  description: string;
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

  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBusinessDetails();
    fetchBusinessServices();
  }, [businessId]);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/businesses/${businessId}`, {
        method: "GET",
        credentials: "include",
      });

      const data: BusinessResponse = await res.json();

      if (data.ok && data.business) {
        setBusiness(data.business);
      } else {
        toast.error(data.message || "Failed to fetch business details");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch business details");
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessServices = async () => {
    try {
      setServicesLoading(true);
      const res = await fetch(`/api/admin/businesses/${businessId}/services`, {
        method: "GET",
        credentials: "include",
      });

      const data: ServicesResponse = await res.json();

      if (data.ok && data.services) {
        setServices(data.services);
      } else {
        toast.error(data.message || "Failed to fetch services");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch services");
    } finally {
      setServicesLoading(false);
    }
  };

  const handleBlockBusiness = async () => {
    if (!blockReason.trim()) {
      toast.error("Please provide a reason for blocking");
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restrict", reason: blockReason }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.ok) {
        toast.success("Business blocked successfully");
        setBlockDialogOpen(false);
        setBlockReason("");
        fetchBusinessDetails();
      } else {
        toast.error(data.message || "Failed to block business");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to block business");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockBusiness = async () => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lift-restriction" }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.ok) {
        toast.success("Business unblocked successfully");
        fetchBusinessDetails();
      } else {
        toast.error(data.message || "Failed to unblock business");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to unblock business");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockService = async (serviceId: string, reason: string) => {
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restrict", reason }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.ok) {
        toast.success("Service blocked successfully");
        fetchBusinessServices();
      } else {
        toast.error(data.message || "Failed to block service");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to block service");
    }
  };

  const handleUnblockService = async (serviceId: string) => {
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lift-restriction" }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.ok) {
        toast.success("Service unblocked successfully");
        fetchBusinessServices();
      } else {
        toast.error(data.message || "Failed to unblock service");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to unblock service");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{business.name}</h1>
            {business.isRestricted && (
              <Badge variant="destructive" className="gap-1">
                <Ban className="h-3 w-3" />
                Blocked
              </Badge>
            )}
            {!business.isApproved && !business.isRejected && (
              <Badge variant="outline" className="gap-1 border-yellow-500 text-yellow-600">
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
          </div>
          <p className="text-muted-foreground">{business.category.name}</p>
        </div>
        {business.isRestricted ? (
          <Button
            variant="default"
            className="gap-2"
            onClick={handleUnblockBusiness}
            disabled={actionLoading}
          >
            <CheckCircle className="h-4 w-4" />
            Unblock Business
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="gap-2"
            onClick={() => setBlockDialogOpen(true)}
            disabled={actionLoading}
          >
            <Ban className="h-4 w-4" />
            Block Business
          </Button>
        )}
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
                  <p className="text-sm text-muted-foreground">{business.owner.email}</p>
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
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span>{business.address}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span>
                  Joined {new Date(business.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {business.restrictionReason && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Restriction Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive">{business.restrictionReason}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Services */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Services ({services.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <div className="flex min-h-[200px] items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : services.length === 0 ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center p-6">
                  <Clock className="mb-4 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No services found</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {services.map((service) => (
                    <Card key={service._id} className={service.isRestricted ? "border-destructive" : ""}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{service.name}</CardTitle>
                          {service.isRestricted && (
                            <Badge variant="destructive" className="gap-1">
                              <Ban className="h-3 w-3" />
                              Blocked
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{service.duration} mins</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>${service.price}</span>
                          </div>
                        </div>
                        {service.isRestricted && service.restrictionReason && (
                          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs">
                            <p className="font-semibold text-destructive">Reason:</p>
                            <p className="text-destructive">{service.restrictionReason}</p>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={() => router.push(`/admin/services/${service._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          {service.isRestricted ? (
                            <Button
                              variant="default"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleUnblockService(service._id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Unblock
                            </Button>
                          ) : (
                            <ServiceBlockButton onBlock={(reason) => handleBlockService(service._id, reason)} />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
              You are about to block <span className="font-semibold">{business.name}</span>.
              This will restrict access to this business and all its services.
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
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlockBusiness}
              disabled={actionLoading || !blockReason.trim()}
            >
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
    </div>
  );
}

// Helper component for blocking individual services
function ServiceBlockButton({ onBlock }: { onBlock: (reason: string) => void }) {
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
        onClick={() => setOpen(true)}
      >
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleBlock}
            disabled={loading || !reason.trim()}
          >
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
