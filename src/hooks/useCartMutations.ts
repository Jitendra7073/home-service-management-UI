import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SlotPayload {
  serviceId: string;
  slotId: string;
  businessId: string;
  date: string;
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SlotPayload) => {
      const res = await fetch("/api/customer/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json?.data?.success === false) {
        throw new Error(json?.data?.msg || "Failed to add to cart");
      }

      return json;
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart-items"] });

      const previousCart = queryClient.getQueryData<any>(["cart-items"]);

      queryClient.setQueryData(["cart-items"], (old: any) => ({
        ...old,
        totalItems: (old?.totalItems ?? 0) + 1,
      }));

      return { previousCart };
    },

    onError: (error, _vars, context) => {
      queryClient.setQueryData(["cart-items"], context?.previousCart);
      toast.error(error.message);
    },

    onSuccess: (res) => {
      toast.success(res?.data?.msg || "Added to cart successfully");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
    },
  });
}
