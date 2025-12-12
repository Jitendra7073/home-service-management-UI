"use client";

import { Button } from "@/components/ui/button";
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

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, MapPin, Trash2 } from "lucide-react";
import React, { useState } from "react";
import AddAddressForm from "./addressForm";

interface Addressprops {
  selectedAddress: any;
  setSelectedAddress: any;
}

const Address: React.FC<Addressprops> = ({
  selectedAddress,
  setSelectedAddress,
}) => {
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading, isError, isPending } = useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const res = await fetch("/api/common/address");
      if (res.status === 404) return null;
      return await res.json();
    },
  });

  const address = data;

  const deleteAddress = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/common/address`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.msg);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["address"]);
      setSelectedAddress(null);
      setShowDeleteModal(false);
    },
  });

  if (isLoading || isPending) {
    return (
      <div>
        <h2 className="text-md font-semibold text-gray-800 mb-4">
          Select Service Address
        </h2>

        <div className="flex justify-between items-center mb-4 p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex flex-col gap-3 flex-1">
            <div className="h-5 w-40 bg-gray-200 animate-pulse rounded-md" />
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded-md" />
          </div>

          <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-5 text-center space-y-2">
        <p className="text-red-700 font-semibold text-lg">
          Couldn't load your address 😔
        </p>
        <p className="text-red-600 text-sm">
          Something went wrong while fetching your saved address. Please refresh
          and try again.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-md font-semibold text-gray-800 mb-4">
        Select Service Address
      </h2>

      <div className="space-y-3">
        {!address ? (
          <AddAddressForm />
        ) : (
          <div onClick={() => setSelectedAddress(address.id)}>
            <div
              className={`flex items-center justify-between gap-4 p-4 rounded-md border shadow-sm hover:shadow-md cursor-pointer
                ${
                  selectedAddress === address.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-700" />
                  <span className="font-semibold text-gray-800">Address</span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {address.street}, {address.city}, {address.state},{" "}
                  {address.postalCode}, {address.country}
                </p>

                {address.landmark !== "N/A" && (
                  <p className="text-gray-600 text-sm italic">
                    Landmark: {address.landmark}
                  </p>
                )}
              </div>

              {/* DELETE BUTTON WITH MODAL */}
              <AlertDialog
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}>
                <AlertDialogTrigger asChild>
                  <Button
                    className="text-red-500 bg-transparent hover:bg-red-200 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteModal(true);
                    }}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold">
                      Delete Address?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Your saved address will be
                      permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => deleteAddress.mutate()}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;
