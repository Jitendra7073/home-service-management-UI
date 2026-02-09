"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShieldAlert,
  CheckCircle,
  Briefcase,
  CreditCard,
  CalendarDays,
  ClipboardList,
  Building2,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface StaffDetailPageProps {
  params: Promise<{ staffId: string }>;
}

export default function AdminStaffDetailPage({ params }: StaffDetailPageProps) {
  const { staffId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [isRestrictDialogOpen, setIsRestrictDialogOpen] = useState(false);
  const [restrictionReason, setRestrictionReason] = useState("");

  // Fetch staff details
  const { data: staff, isLoading } = useQuery({
    queryKey: ["admin-staff-detail", staffId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/staff/${staffId}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.msg || "Failed to fetch staff");
      return json.data;
    },
  });

  // Restrict mutation
  const restrictMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/staff/${staffId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restrict", reason: restrictionReason }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json;
    },
    onSuccess: () => {
      toast.success("Staff restricted successfully");
      setIsRestrictDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["admin-staff-detail", staffId],
      });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Lift restriction mutation
  const liftRestrictionMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/staff/${staffId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lift-restriction" }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json;
    },
    onSuccess: () => {
      toast.success("Staff restriction lifted");
      queryClient.invalidateQueries({
        queryKey: ["admin-staff-detail", staffId],
      });
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (isLoading) {
    return <StaffDetailSkeleton />;
  }

  if (!staff) {
    return (
      <div className="flex w-full justify-center min-h-screen">
        <div className="w-full max-w-[1400px] px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="mx-auto h-12604 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Staff not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center min-h-screen">
      <div className="w-full max-w-7xl px-4 md:px-0 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Staff
            </Button>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-700 to-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-sm bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-3xl">
                {staff.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold">{staff.name}</h1>
                  <Badge
                    variant={staff.isRestricted ? "destructive" : "secondary"}
                    className={
                      !staff.isRestricted ? "bg-green-500 text-white" : ""
                    }>
                    {staff.isRestricted ? "Restricted" : "Active"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-white/80">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{staff.mobile || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined {new Date(staff.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white/10 rounded-sm backdrop-blur">
                  <p className="text-2xl font-bold">
                    {staff.performanceMetrics?.totalBookings || 0}
                  </p>
                  <p className="text-xs text-white/70">Bookings</p>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-sm backdrop-blur">
                  <p className="text-2xl font-bold">
                    {staff.performanceMetrics?.completionRate || 0}%
                  </p>
                  <p className="text-xs text-white/70">Completion</p>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-sm backdrop-blur">
                  <p className="text-2xl font-bold">
                    {staff.performanceMetrics?.averageRating || 0}
                  </p>
                  <p className="text-xs text-white/70">Rating</p>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-sm backdrop-blur">
                  <p className="text-2xl font-bold">
                    ₹{staff.performanceMetrics?.totalEarnings || 0}
                  </p>
                  <p className="text-xs text-white/70">Earnings</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Restriction Alert */}
        {staff.isRestricted && staff.restrictionReason && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-400">
                    Restriction Active
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {staff.restrictionReason}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-fit gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-sm">
            <TabsTrigger
              value="overview"
              className="gap-2 rounded-sm data-[state=active]:bg-white data-[state=active]:shadow">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="businesses"
              className="gap-2 rounded-sm data-[state=active]:bg-white data-[state=active]:shadow">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Businesses</span>
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="gap-2 rounded-sm data-[state=active]:bg-white data-[state=active]:shadow">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="gap-2 rounded-sm data-[state=active]:bg-white data-[state=active]:shadow">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger
              value="leaves"
              className="gap-2 rounded-sm data-[state=active]:bg-white data-[state=active]:shadow">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Leaves</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab staff={staff} />
          </TabsContent>

          {/* Businesses Tab */}
          <TabsContent value="businesses">
            <BusinessesTab staffId={staffId} />
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <BookingsTab staffId={staffId} />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <PaymentsTab staffId={staffId} />
          </TabsContent>

          {/* Leaves Tab */}
          <TabsContent value="leaves">
            <LeavesTab staffId={staffId} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Restrict Dialog */}
      <Dialog
        open={isRestrictDialogOpen}
        onOpenChange={setIsRestrictDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restrict Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to restrict this staff member? They will
              lose access to the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason for Restriction</Label>
              <Textarea
                placeholder="Please provide a reason..."
                value={restrictionReason}
                onChange={(e) => setRestrictionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRestrictDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => restrictMutation.mutate()}
              disabled={
                !restrictionReason.trim() || restrictMutation.isPending
              }>
              {restrictMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Restrict Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ staff }: { staff: any }) {
  const metrics = staff.performanceMetrics || {};

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Performance Metrics */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-sm">
                <p className="text-2xl font-bold text-blue-700">
                  {metrics.totalBookings || 0}
                </p>
                <p className="text-sm text-blue-600">Total Bookings</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-sm">
                <p className="text-2xl font-bold text-green-700">
                  {metrics.completedBookings || 0}
                </p>
                <p className="text-sm text-green-600">Completed</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-sm">
                <p className="text-2xl font-bold text-amber-700">
                  {metrics.averageRating || 0}
                </p>
                <p className="text-sm text-amber-600">
                  Avg. Rating ({metrics.reviewCount || 0})
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-sm">
                <p className="text-2xl font-bold text-purple-700">
                  ₹{metrics.totalEarnings || 0}
                </p>
                <p className="text-sm text-purple-600">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {staff.reviews && staff.reviews.length > 0 ? (
              <div className="space-y-4">
                {staff.reviews.slice(0, 5).map((review: any) => (
                  <div
                    key={review.id}
                    className="p-4 bg-slate-50 dark:bg-slate-900 rounded-sm">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{review.businessName}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.review}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No reviews yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Associated Businesses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Associated Businesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {staff.businesses && staff.businesses.length > 0 ? (
              <div className="space-y-3">
                {staff.businesses.slice(0, 5).map((business: any) => (
                  <div
                    key={business.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-sm">
                    <div>
                      <p className="font-medium">{business.businessName}</p>
                      <p className="text-xs text-muted-foreground">
                        {business.category}
                      </p>
                    </div>
                    <Badge
                      variant={
                        business.applicationStatus === "APPROVED"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        business.applicationStatus === "APPROVED"
                          ? "bg-green-600"
                          : ""
                      }>
                      {business.applicationStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No associated businesses
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {staff.recentActivity && staff.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {staff.recentActivity.slice(0, 5).map((activity: any) => (
                  <div key={activity.id} className="flex items-start gap-3 p-2">
                    <div className="w-2 h-2 mt-2 rounded-sm bg-blue-500" />
                    <div>
                      <p className="text-sm">
                        {activity.actionType.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Businesses Tab Component
function BusinessesTab({ staffId }: { staffId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-staff-businesses", staffId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/staff/${staffId}/businesses`);
      return res.json();
    },
  });

  if (isLoading) return <TabSkeleton />;

  const businesses = data?.data || [];
  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-blue-700">
              {stats.total || 0}
            </p>
            <p className="text-sm text-blue-600">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-green-700">
              {stats.approved || 0}
            </p>
            <p className="text-sm text-green-600">Approved</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-amber-700">
              {stats.pending || 0}
            </p>
            <p className="text-sm text-amber-600">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950/30 border-red-200">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-red-700">
              {stats.rejected || 0}
            </p>
            <p className="text-sm text-red-600">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Businesses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Associated Businesses</CardTitle>
          <CardDescription>
            All businesses this staff member is associated with
          </CardDescription>
        </CardHeader>
        <CardContent>
          {businesses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((app: any) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.businessProfile?.businessName}
                    </TableCell>
                    <TableCell>
                      {app.businessProfile?.category?.name || "-"}
                    </TableCell>
                    <TableCell>
                      {app.businessProfile?.user?.name || "-"}
                    </TableCell>
                    <TableCell>{app.businessProfile?.contactEmail}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          app.status === "APPROVED"
                            ? "default"
                            : app.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          app.status === "APPROVED" ? "bg-green-600" : ""
                        }>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No businesses associated with this staff member</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Bookings Tab Component
function BookingsTab({ staffId }: { staffId: string }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-staff-bookings", staffId, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "50" });
      if (statusFilter !== "all") params.append("status", statusFilter);
      const res = await fetch(`/api/admin/staff/${staffId}/bookings?${params}`);
      return res.json();
    },
  });

  if (isLoading) return <TabSkeleton />;

  const bookings = data?.data || [];
  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total", value: stats.total || 0, color: "blue" },
          { label: "Completed", value: stats.completed || 0, color: "green" },
          { label: "Cancelled", value: stats.cancelled || 0, color: "red" },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`bg-${stat.color}-50 dark:bg-${stat.color}-950/30 border-${stat.color}-200`}>
            <CardContent className="p-4">
              <p className={`text-3xl font-bold text-${stat.color}-700`}>
                {stat.value}
              </p>
              <p className={`text-sm text-${stat.color}-600`}>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter + Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Assigned Bookings</CardTitle>
              <CardDescription>
                All bookings assigned to this staff member
              </CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((assignment: any) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      {assignment.booking?.service?.name}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{assignment.booking?.user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {assignment.booking?.user?.mobile}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.booking?.businessProfile?.businessName}
                    </TableCell>
                    <TableCell>{assignment.booking?.date}</TableCell>
                    <TableCell>
                      {assignment.booking?.slot?.time || "-"}
                    </TableCell>
                    <TableCell>
                      ₹{assignment.booking?.totalAmount || 0}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          assignment.status === "COMPLETED"
                            ? "default"
                            : assignment.status === "ACCEPTED"
                            ? "secondary"
                            : assignment.status === "PENDING"
                            ? "outline"
                            : "destructive"
                        }
                        className={
                          assignment.status === "COMPLETED"
                            ? "bg-green-600"
                            : ""
                        }>
                        {assignment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No bookings found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Payments Tab Component
function PaymentsTab({ staffId }: { staffId: string }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-staff-payments", staffId, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "50" });
      if (statusFilter !== "all") params.append("status", statusFilter);
      const res = await fetch(`/api/admin/staff/${staffId}/payments?${params}`);
      return res.json();
    },
  });

  if (isLoading) return <TabSkeleton />;

  const payments = data?.data || [];
  const summary = data?.summary || {};

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-blue-700">
              {summary.totalPayments || 0}
            </p>
            <p className="text-sm text-blue-600">Total Payments</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-green-700">
              {summary.totalEarnings || 0}
            </p>
            <p className="text-sm text-green-600">Total Earnings</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 dark:bg-orange-950/30 border-orange-200">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-orange-700">
              {summary.totalRequested || 0}
            </p>
            <p className="text-sm text-orange-600">Total Requested</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                All payments received by this staff member
              </CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.booking?.service?.name}
                    </TableCell>
                    <TableCell>
                      {payment.booking?.businessProfile?.businessName}
                    </TableCell>
                    <TableCell>
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>₹{payment.requestedAmount}</TableCell>
                    <TableCell>{payment.percentage}%</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ₹{payment.staffAmount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "PAID"
                            ? "default"
                            : payment.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          payment.status === "PAID" ? "bg-green-600" : ""
                        }>
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No payments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Leaves Tab Component
function LeavesTab({ staffId }: { staffId: string }) {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-staff-leaves", staffId, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "50" });
      if (statusFilter !== "all") params.append("status", statusFilter);
      const res = await fetch(`/api/admin/staff/${staffId}/leaves?${params}`);
      return res.json();
    },
  });

  const updateLeaveMutation = useMutation({
    mutationFn: async ({
      leaveId,
      status,
      rejectReason,
    }: {
      leaveId: string;
      status: string;
      rejectReason?: string;
    }) => {
      const res = await fetch(`/api/admin/staff/leaves/${leaveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectReason }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json;
    },
    onSuccess: () => {
      toast.success("Leave status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["admin-staff-leaves", staffId],
      });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleApprove = (leaveId: string) => {
    updateLeaveMutation.mutate({ leaveId, status: "APPROVED" });
  };

  const handleReject = (leaveId: string) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      updateLeaveMutation.mutate({
        leaveId,
        status: "REJECTED",
        rejectReason: reason,
      });
    }
  };

  if (isLoading) return <TabSkeleton />;

  const leaves = data?.data || [];

  // Calculate stats
  const stats = {
    total: leaves.length,
    pending: leaves.filter((l: any) => l.status === "PENDING").length,
    approved: leaves.filter((l: any) => l.status === "APPROVED").length,
    rejected: leaves.filter((l: any) => l.status === "REJECTED").length,
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "SICK":
        return "bg-red-100 text-red-700";
      case "VACATION":
        return "bg-blue-100 text-blue-700";
      case "PERSONAL":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
            <p className="text-sm text-blue-600">Total Leaves</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-amber-700">{stats.pending}</p>
            <p className="text-sm text-amber-600">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-green-700">
              {stats.approved}
            </p>
            <p className="text-sm text-green-600">Approved</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950/30 border-red-200">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-red-700">{stats.rejected}</p>
            <p className="text-sm text-red-600">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaves Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>Manage staff leave requests</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {leaves.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaves.map((leave: any) => {
                  const startDate = new Date(leave.startDate);
                  const endDate = new Date(leave.endDate);
                  const duration =
                    Math.ceil(
                      (endDate.getTime() - startDate.getTime()) /
                        (1000 * 60 * 60 * 24),
                    ) + 1;

                  return (
                    <TableRow key={leave.id}>
                      <TableCell>
                        <Badge className={getLeaveTypeColor(leave.leaveType)}>
                          {leave.leaveType}
                        </Badge>
                      </TableCell>
                      <TableCell>{startDate.toLocaleDateString()}</TableCell>
                      <TableCell>{endDate.toLocaleDateString()}</TableCell>
                      <TableCell>{duration} day(s)</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {leave.reason || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            leave.status === "APPROVED"
                              ? "default"
                              : leave.status === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            leave.status === "APPROVED" ? "bg-green-600" : ""
                          }>
                          {leave.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {leave.status === "PENDING" && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleApprove(leave.id)}
                              disabled={updateLeaveMutation.isPending}>
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleReject(leave.id)}
                              disabled={updateLeaveMutation.isPending}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        {leave.status !== "PENDING" && (
                          <span className="text-xs text-muted-foreground">
                            {leave.status === "APPROVED"
                              ? `by Admin on ${new Date(
                                  leave.approvedAt,
                                ).toLocaleDateString()}`
                              : leave.status === "REJECTED"
                              ? leave.rejectReason
                              : "-"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No leave requests found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton Components
function StaffDetailSkeleton() {
  return (
    <div className="flex w-full justify-center min-h-screen">
      <div className="w-full max-w-[1400px] px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-40 w-full rounded-sm" />
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}
