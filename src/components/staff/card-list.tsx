"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  CreditCard,
  Trash2,
  Star,
  Loader2,
  AlertCircle,
  Edit,
} from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { EditCardDialog } from "@/components/staff/edit-card-dialog";

interface CardDetail {
  id: string;
  cardholderName: string;
  lastFourDigits: string;
  expiryMonth: number;
  expiryYear: number;
  cardType: string;
  isDefault: boolean;
  isExpired: boolean;
  maskedNumber: string;
}

interface StaffCardListProps {
  cards: CardDetail[];
  onRefresh: () => void;
}

const CARD_TYPE_CONFIG = {
  visa: { color: "from-blue-500 to-blue-600", text: "VISA", icon: "💳" },
  mastercard: {
    color: "from-orange-500 to-orange-600",
    text: "MASTERCARD",
    icon: "💳",
  },
  amex: { color: "from-green-500 to-green-600", text: "AMEX", icon: "💳" },
  discover: {
    color: "from-purple-500 to-purple-600",
    text: "DISCOVER",
    icon: "💳",
  },
  rupay: { color: "from-indigo-500 to-indigo-600", text: "RUPAY", icon: "💳" },
};

export function StaffCardList({ cards, onRefresh }: StaffCardListProps) {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [setDefaultId, setSetDefaultId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<CardDetail | null>(null);

  // Sort cards: default card first, then others
  const sortedCards = [...cards].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return 0;
  });

  const deleteMutation = useMutation({
    mutationFn: async (cardId: string) => {
      setDeleteId(cardId);
      const res = await fetch(`/api/common/cards/${cardId}`, {
        method: "DELETE",
        credentials: "include",
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Card deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["staff-cards"] });
        queryClient.invalidateQueries({
          queryKey: ["staff-profile-completion"],
        });
        onRefresh();
      } else {
        toast.error(data.msg || "Failed to delete card");
      }
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Error deleting card");
      setDeleteId(null);
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (cardId: string) => {
      setSetDefaultId(cardId);
      const res = await fetch(`/api/common/cards/${cardId}`, {
        method: "PATCH",
        credentials: "include",
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Default card updated");
        queryClient.invalidateQueries({ queryKey: ["staff-cards"] });
        onRefresh();
      } else {
        toast.error(data.msg || "Failed to update default card");
      }
      setSetDefaultId(null);
    },
    onError: () => {
      toast.error("Error updating default card");
      setSetDefaultId(null);
    },
  });

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No cards saved
          </h3>
          <p className="text-gray-600">
            Add your card details to receive payments from providers
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCards.map((card) => {
          const config = CARD_TYPE_CONFIG[
            card.cardType as keyof typeof CARD_TYPE_CONFIG
          ] || {
            color: "from-gray-500 to-gray-600",
            text: "CARD",
            icon: "💳",
          };

          const isProcessing =
            (deleteId === card.id && deleteMutation.isPending) ||
            (setDefaultId === card.id && setDefaultMutation.isPending);

          return (
            <Card
              key={card.id}
              className={`${
                card.isExpired
                  ? "border-red-200 bg-red-50"
                  : "border-gray-200 hover:shadow-md"
              } transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  {/* Card Preview - Full Width */}
                  <div
                    className={`w-full h-36 rounded-md bg-gradient-to-br ${config.color} p-5 text-white flex flex-col justify-between relative overflow-hidden`}>
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-15 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />

                    {/* Card Content */}
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <div className="text-xs opacity-80 mb-1">
                          {config.icon}
                        </div>
                        <div className="font-mono text-lg tracking-wider">
                          {card.maskedNumber}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {card.isDefault && (
                          <Badge className="bg-white/20 text-white border-white/30">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Default
                          </Badge>
                        )}
                        {card.isExpired && (
                          <Badge
                            variant="destructive"
                            className="bg-red-500/80 text-white border-red-400">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Expired
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="relative z-10">
                      <div className="text-sm opacity-90 font-medium">
                        {card.cardholderName}
                      </div>
                      <div className="text-xs mt-1 opacity-80">
                        {String(card.expiryMonth).padStart(2, "0")}/
                        {String(card.expiryYear).slice(2)}
                      </div>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {config.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {String(card.expiryMonth).padStart(2, "0")}/
                          {card.expiryYear}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {!card.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultMutation.mutate(card.id)}
                          disabled={setDefaultId !== null}
                          className="flex-1">
                          {setDefaultId === card.id ? (
                            <>
                              <Loader2 className="animate-spin w-4 h-4 mr-2" />
                              Setting...
                            </>
                          ) : (
                            <>
                              <Star className="w-3 h-3 mr-2" />
                              Set Default
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCard(card)}
                        disabled={setDefaultId !== null}
                        className="flex-1">
                        <Edit className="w-3 h-3 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 flex-shrink-0"
                            disabled={isProcessing}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Card</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this card? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                              onClick={() => deleteMutation.mutate(card.id)}
                              className="bg-red-600 hover:bg-red-700">
                              {deleteMutation.isPending &&
                              deleteId === card.id ? (
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
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Card Dialog */}
      {editingCard && (
        <EditCardDialog
          open={!!editingCard}
          onOpenChange={(open) => {
            if (!open) setEditingCard(null);
          }}
          card={editingCard}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
