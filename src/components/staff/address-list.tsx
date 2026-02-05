"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  Trash2,
  Home,
  Building,
  Briefcase,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type: string;
  landmark: string;
}

interface StaffAddressListProps {
  addresses: Address[];
  onRefresh: () => void;
}

export function StaffAddressList({
  addresses,
  onRefresh,
}: StaffAddressListProps) {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (addressId: string) => {
      setDeleteId(addressId);
      const res = await fetch(`/api/common/address`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addressId }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Address deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["address"] });
        onRefresh();
      } else {
        toast.error(data.msg || "Failed to delete address");
      }
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Error deleting address");
      setDeleteId(null);
    },
  });

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "HOME":
        return Home;
      case "OFFICE":
        return Building;
      case "OTHER":
      default:
        return Briefcase;
    }
  };

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case "HOME":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "OFFICE":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "OTHER":
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getAddressIconColor = (type: string) => {
    switch (type) {
      case "HOME":
        return "text-blue-600 bg-blue-50";
      case "OFFICE":
        return "text-purple-600 bg-purple-50";
      case "OTHER":
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (addresses.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 bg-gray-50 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            No addresses saved
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-xs">
            Add your address to receive services at your location
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {addresses.map((address) => {
        const AddressIcon = getAddressIcon(address.type);
        const isProcessing =
          deleteId === address.id && deleteMutation.isPending;

        return (
          <Card
            key={address.id}
            className="hover:shadow-md transition-all duration-200 border-gray-200">
            <CardContent className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-lg ${getAddressIconColor(
                      address.type,
                    )}`}>
                    <AddressIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {address.type === "HOME"
                        ? "Home"
                        : address.type === "OFFICE"
                        ? "Office"
                        : "Other"}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`mt-1 text-xs ${getAddressTypeColor(
                        address.type,
                      )}`}>
                      {address.type}
                    </Badge>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      disabled={isProcessing}>
                      {isProcessing ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Address</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this address? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        onClick={() => deleteMutation.mutate(address.id)}
                        className="bg-red-600 hover:bg-red-700">
                        {deleteMutation.isPending && deleteId === address.id ? (
                          <>
                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Address Details */}
              <div className="space-y-2.5">
                {/* Street */}
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {address.street}
                  </p>
                </div>

                {/* City, State, Postal Code */}
                <div className="text-sm text-gray-600 pl-7">
                  {address.city}, {address.state} {address.postalCode}
                </div>

                {/* Country */}
                <div className="text-sm text-gray-600 pl-7">
                  {address.country}
                </div>

                {/* Landmark */}
                {address.landmark && address.landmark !== "N/A" && (
                  <div className="flex items-start gap-2.5 pt-2.5 mt-2.5 border-t border-gray-100">
                    <div className="w-4 h-4 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </div>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-gray-600">
                        Landmark:
                      </span>{" "}
                      {address.landmark}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
