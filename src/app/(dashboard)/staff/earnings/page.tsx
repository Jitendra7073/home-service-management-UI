import StaffEarnings from "./staff-earnings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Earnings",
  description: "View your earnings and payment history",
};

export default function StaffEarningsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-0">
      <StaffEarnings />
    </div>
  );
}
