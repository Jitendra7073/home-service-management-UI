import React from "react";

import CartDetails from "@/components/customer/cart/cartDetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Manage your cart items effectively with Fixora.",
};

const Cart = () => {
  return (
    <div>
      <CartDetails />
    </div>
  );
};

export default Cart;
