"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Clock,
  DollarSign,
  Ban,
  CheckCircle,
  Loader2,
  Building2,
  Tag,
  Info,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceData {
  _id: string;
  id?: string;
  name: string;
  description: string;
  duration: number; // or durationInMinutes
  durationInMinutes?: number;
  price: number;
  currency: string;
  isActive: boolean;
  isRestricted: boolean;
  restrictionReason?: string;
  businessProfile: {
    _id: string;
    id?: string;
    businessName: string;
    contactEmail: string;
    phoneNumber: string;
    user: {
      name: string;
    }
  };
  category: {
    _id: string;
    name: string;
    description?: string;
  }; 
  _count?: {
    bookings: number;
  };
  images: string[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.serviceId as string;

  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await res.json();

      if ((json.success || json.ok) && json.data) {
        setService(json.data);
      } else {
        toast.error(json.message || "Failed to fetch service details");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch service details");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockService = async () => {
    if (!blockReason.trim()) {
      toast.error("Please provide a reason for blocking");
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/services/${serviceId}/restrict`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: blockReason }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.ok || data.success) {
        toast.success("Service blocked successfully");
        setBlockDialogOpen(false);
        setBlockReason("");
        fetchServiceDetails();
      } else {
        toast.error(data.message || "Failed to block service");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to block service");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockService = async () => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/services/${serviceId}/lift-restriction`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (data.ok || data.success) {
        toast.success("Service unblocked successfully");
        fetchServiceDetails();
      } else {
        toast.error(data.message || "Failed to unblock service");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to unblock service");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
             <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
             <CardContent className="space-y-4">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-20 w-full" />
             </CardContent>
          </Card>
          <Card>
             <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
             <CardContent className="space-y-4">
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-8 w-full" />
             </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-6">
          <Info className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Service not found</p>
          <Button variant="outline" className="mt-4 cursor-pointer" onClick={() => router.back()}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>
            {service.isRestricted && (
              <Badge variant="destructive" className="gap-1">
                <Ban className="h-3 w-3" />
                Blocked
              </Badge>
            )}
            {!service.isActive && (
              <Badge variant="secondary" className="gap-1">
                Inactive
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
             <Building2 className="h-4 w-4" />
             <span className="font-medium">{service.businessProfile.businessName}</span>
             <span>•</span>
             <Tag className="h-4 w-4" />
             <span>{service.category.name}</span>
          </div>
        </div>

        {/* Actions */}
        {service.isRestricted ? (
          <Button
            variant="default"
            className="gap-2 cursor-pointer"
            onClick={handleUnblockService}
            disabled={actionLoading}
          >
            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Unblock Service
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="gap-2 cursor-pointer"
            onClick={() => setBlockDialogOpen(true)}
            disabled={actionLoading}
          >
            <Ban className="h-4 w-4" />
            Block Service
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
             {/* Images */}
             {service.images && service.images.length > 0 && (
               <Card>
                 <CardHeader>
                   <CardTitle>Service Images</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     {service.images.map((image, index) => (
                       <div key={index} className="relative aspect-video rounded-md overflow-hidden border">
                         {/* Using img tag since Next.js Image requires domain config */}
                         <img 
                           src={image} 
                           alt={`${service.name} ${index + 1}`} 
                           className="object-cover w-full h-full hover:scale-105 transition-transform"
                         />
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             )}

             <Card>
                <CardHeader>
                    <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Description:</span>
                        <p className="mt-1 leading-relaxed">{service.description}</p>
                    </div>

                     {service.category.description && (
                        <div className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Category Info:</span>
                            <p className="mt-1 leading-relaxed">{service.category.description}</p>
                        </div>
                     )}

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                             <div>
                                 <p className="text-sm font-medium">Duration</p>
                                 <p className="text-2xl font-bold">{service.duration || service.durationInMinutes} <span className="text-sm font-normal text-muted-foreground">mins</span></p>
                             </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <div>
                                 <p className="text-sm font-medium">Price</p>
                                 <p className="text-2xl font-bold">{service.currency === "INR" ? "₹" : "$"}{service.price}</p>
                             </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                             <p className="text-sm font-medium text-muted-foreground">Rating</p>
                             <div className="flex items-center gap-1">
                                <span className="text-2xl font-bold">{service.averageRating || 0}</span>
                                <span className="text-sm text-muted-foreground">/ 5</span>
                             </div>
                        </div>
                        <div>
                             <p className="text-sm font-medium text-muted-foreground">Reviews</p>
                             <p className="text-2xl font-bold">{service.reviewCount || 0}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                         <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                            <p className="text-2xl font-bold">{service._count?.bookings || 0}</p>
                         </div>
                         <div>
                            <p className="text-sm font-medium text-muted-foreground">Created At</p>
                            <p className="text-sm font-bold">{new Date(service.createdAt).toLocaleDateString()}</p>
                         </div>
                    </div>
                </CardContent>
             </Card>

             {/* Restriction Info */}
             {service.restrictionReason && (
                <Card className="border-destructive">
                  <CardHeader>
                     <CardTitle className="text-destructive">Restriction Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-destructive">{service.restrictionReason}</p>
                  </CardContent>
                </Card>
             )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                             {service.businessProfile.businessName[0]}
                         </div>
                         <div>
                             <p className="font-medium">{service.businessProfile.businessName}</p>
                             <p className="text-xs text-muted-foreground">ID: {service.businessProfile._id || service.businessProfile.id}</p>
                         </div>
                     </div>
                     <div className="space-y-2 pt-2 border-t">
                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">Contact:</span> <br/>
                            {service.businessProfile.user.name}
                        </div>
                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">Email:</span> <br/>
                            {service.businessProfile.contactEmail}
                        </div>
                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">Phone:</span> <br/>
                            {service.businessProfile.phoneNumber}
                        </div>
                     </div>
                     <Button variant="outline" className="w-full cursor-pointer" onClick={() => router.push(`/admin/businesses/${service.businessProfile._id || service.businessProfile.id}`)}>
                         View Business Profile
                     </Button>
                </CardContent>
             </Card>
        </div>
      </div>

      {/* Block Service Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Service</DialogTitle>
            <DialogDescription>
              You are about to block <span className="font-semibold">{service.name}</span>.
              This will hide the service from customers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="block-reason">
                Reason for blocking <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="block-reason"
                placeholder="Provide a reason for blocking this service..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setBlockDialogOpen(false);
                setBlockReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={handleBlockService}
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
                  Block Service
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
