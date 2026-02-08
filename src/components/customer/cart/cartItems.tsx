import { ArrowRight, ShoppingCart, X } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface CartItemProps {
  data: any;
  isLoading: boolean;
  isError: boolean;
  isPending: boolean;
  removingItemId?: string | null;
  clickHandle: (id: string) => void | Promise<void>;
}

const CartItems: React.FC<CartItemProps> = ({
  data,
  isLoading,
  isError,
  isPending,
  removingItemId,
  clickHandle,
}) => {
  const cartItems = data?.cart || [];

  if (cartItems.length === 0) {
    return (
      <div className="bg-white p-6 text-center mb-3 animate-fadeIn">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-gray-800 font-semibold text-lg">
            Your cart is feeling a little empty
          </h2>

          <p className="text-gray-600 text-sm max-w-xs leading-relaxed">
            You haven’t added any services yet. Explore trusted professionals
            and easily book your preferred time slot.
          </p>

          <Link
            href="/customer/explore"
            className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline transition">
            Explore Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || isPending) {
    return (
      <div className="bg-white rounded-sm p-4 border mb-3">
        <div className="flex justify-between items-start ">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4  animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3  animate-pulse"></div>
          </div>

          <div className="h-5 bg-gray-200 rounded w-12  animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-pink-50 border border-pink-200 rounded-sm p-5 text-center space-y-2 mb-3">
        <p className="text-pink-800 font-semibold text-lg">
          Oh no… your cart is hiding!
        </p>
        <p className="text-pink-600 text-sm">
          It seems something went a little off. Refresh the page and we’ll bring
          it right back for you.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      <div
        className={`space-y-4 ${cartItems.length > 3 ? "max-h-64 overflow-y-auto pr-2" : ""
          }`}>
        {cartItems.map((item: any, index: any) => (
          <div key={index} className="bg-gray-50 rounded-sm p-4 border">
            <div className="flex justify-between items-start ">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-gray-800">
                  {item.service.name}
                </h3>

                <div className="flex gap-2 font-semibold">
                  <p className="text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600">{item.slot.time}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="font-bold text-gray-800">
                  ₹{item.service.price}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="mt-1"
                      onClick={() =>
                        removingItemId !== item.id && clickHandle(item.id)
                      }>
                      {removingItemId === item.id ? (
                        <div className="h-4 w-4 animate-spin rounded-sm border-2 border-red-500 border-t-transparent" />
                      ) : (
                        <X className="w-4 h-4 text-red-500 hover:text-red-600 cursor-pointer" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">Remove from cart</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          {isLoading || isPending ? (
            <span className="h-5 bg-gray-200 rounded w-20  animate-pulse"></span>
          ) : (
            <span>₹{data.totalPrice}</span>
          )}
        </div>
        <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t">
          <span>Total</span>
          {isLoading || isPending ? (
            <span className="h-5 bg-gray-300 rounded w-30  animate-pulse"></span>
          ) : (
            <span>₹{data.totalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
