"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface FeedbackFormProps {
  open: boolean;
  close: () => void;
  bookingId: string;
}

const FeedbackDialog: React.FC<FeedbackFormProps> = ({
  open,
  close,
  bookingId,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [touched, setTouched] = useState(false);
    const queryClient = useQueryClient();

  const commentLength = comment.length;

  /* ---------------- VALIDATIONS ---------------- */
  const ratingError = touched && (rating < 1 || rating > 5);
  const commentError = touched && (commentLength < 10 || commentLength > 200);

  const isFormValid =
    rating >= 1 && rating <= 5 && commentLength >= 10 && commentLength <= 200;

  /* ---------------- API CALL ---------------- */
  const feedbackMutation = useMutation({
    mutationFn: async (payload: {
      rating: number;
      comment: string;
      bookingId: string;
    }) => {
      const res = await fetch("/api/customer/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.msg || "Something went wrong");
      }

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.msg || "Feedback submitted successfully");
      setRating(0);
      setComment("");
      setTouched(false);
      queryClient.invalidateQueries({
        queryKey:["customer-bookings"]
      });
      close();
    },

    onError: (error: any) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const isSubmitting = feedbackMutation.isPending;

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = () => {
    setTouched(true);
    if (!isFormValid || isSubmitting) return;

    feedbackMutation.mutate({
      rating,
      comment,
      bookingId,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (isSubmitting) return;
        if (!value) close();
      }}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => isSubmitting && e.preventDefault()}
        onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Share Your Feedback
          </DialogTitle>
        </DialogHeader>

        {/* ----------- RATING ----------- */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Rating <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setTouched(true);
                  setRating(star);
                }}
                className="focus:outline-none disabled:opacity-50">
                <Star
                  className={cn(
                    "h-6 w-6 transition",
                    rating >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              </button>
            ))}
          </div>

          {ratingError && (
            <p className="text-xs text-red-500">
              Please select a rating between 1 and 5.
            </p>
          )}
        </div>

        {/* ----------- COMMENT ----------- */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Comment <span className="text-red-500">*</span>
          </label>

          <Textarea
            placeholder="Write your feedback..."
            value={comment}
            disabled={isSubmitting}
            maxLength={200}
            onChange={(e) => {
              setTouched(true);
              setComment(e.target.value);
            }}
            className="resize-none"
          />

          <div className="flex justify-between items-center">
            {commentError ? (
              <p className="text-xs text-red-500">
                Comment must be 10–200 characters.
              </p>
            ) : (
              <span />
            )}

            <span
              className={cn(
                "text-xs font-medium",
                commentLength >= 10 ? "text-green-600" : "text-red-500"
              )}>
              {commentLength}/200
            </span>
          </div>
        </div>

        {/* ----------- ACTIONS ----------- */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" disabled={isSubmitting} onClick={close}>
            Cancel
          </Button>

          <Button
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
