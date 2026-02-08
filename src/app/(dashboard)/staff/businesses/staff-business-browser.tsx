"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Building2,
  Briefcase,
  Send,
  Map,
  PinIcon,
  MapPin,
  CircleCheckBig,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { StaffBusinessesSkeleton } from "@/components/staff/skeletons";

export default function StaffBusinessBrowser() {
  const [search, setSearch] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ================= FETCH BUSINESSES =================

  const { data, isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const res = await fetch("/api/staff/businesses", {
        credentials: "include",
      });
      const result = await res.json();
      return result.providers;
    },
  });

  const businesses = data || [];

  // Show skeleton while loading
  if (isLoading) {
    return <StaffBusinessesSkeleton />;
  }

  // ================= SEARCH FILTER =================

  const filteredBusinesses = businesses.filter((provider: any) =>
    provider.businessProfile?.businessName
      ?.toLowerCase()
      .includes(search.toLowerCase()),
  );

  // ================= APPLY HANDLER =================

  const handleApply = async (businessId: string) => {
    if (!selectedBusiness) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/staff/applications/apply`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessProfileId: businessId,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.msg || "Application submitted successfully!");
        setIsDialogOpen(false);
        setCoverLetter("");
        setSelectedBusiness(null);
      } else {
        toast.error(result.msg || "Failed to submit application");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= UI =================

  return (
    <div className="space-y-6 max-w-7xl px-4 py-8 mx-auto">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Browse Businesses
          </h2>
          <p className="text-muted-foreground">
            Find service providers and apply to join their team
          </p>
        </div>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search by business name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* ================= LOADING STATE ================= */}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded mt-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBusinesses.length === 0 ? (
        /* ================= EMPTY STATE ================= */

        <Card className="p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />

          <h3 className="text-lg font-semibold mb-2">No businesses found</h3>

          <p className="text-muted-foreground">
            Try searching with a different keyword
          </p>
        </Card>
      ) : (
        /* ================= BUSINESS GRID ================= */

        <div className="grid gap-6 md:grid-cols-2">
          {filteredBusinesses.map((provider: any) => {
            const business = provider?.businessProfile;
            const services = business?.services || [];
            const address = provider?.addresses?.[0];

            return (
              <Card key={provider.id} className="flex flex-col">
                {/* ================= CARD HEADER ================= */}

                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2">
                    <span className="line-clamp-1">
                      {business?.businessName || "Unnamed Business"}
                    </span>

                    <Badge
                      variant={business?.isActive ? "default" : "destructive"}>
                      {business?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>

                  <CardDescription>
                    {provider.name} • {provider.mobile}
                  </CardDescription>
                </CardHeader>

                {/* ================= CARD BODY ================= */}

                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* ADDRESS */}

                    {address && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {address.street},{" "}
                        {address.city}, {address.state}
                      </p>
                    )}

                    {/* SERVICE COUNT */}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{services.length} Services Available</span>
                    </div>
                  </div>

                  {/* ================= APPLY MODAL ================= */}

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      {provider.isApplied ? (
                        <Button
                          onClick={() => setSelectedBusiness(provider)}
                          disabled
                          className="w-full bg-transparent border border-green-700 rounded-sm text-green-700 hover:bg-transparent">
                          <CircleCheckBig className="mr-2 h-4 w-4 text-green-700" />
                          Already Applied
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setSelectedBusiness(provider)}
                          className="w-full">
                          <Send className="mr-2 h-4 w-4" />
                          Apply to Join
                        </Button>
                      )}
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Apply to {business?.businessName}
                        </DialogTitle>

                        <DialogDescription>
                          Introduce yourself to this provider
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Cover Letter (Optional)</Label>

                          <Textarea
                            placeholder="Tell about your skills and experience..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows={6}
                            maxLength={1000}
                          />

                          <p className="text-xs text-muted-foreground text-right">
                            {coverLetter.length}/1000
                          </p>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsDialogOpen(false);
                              setCoverLetter("");
                            }}>
                            Cancel
                          </Button>

                          <Button
                            onClick={() => handleApply(business.id)}
                            disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit"}{" "}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
