import { Metadata } from "next";
import AllStaffLeavesView from "./all-staff-leaves-view";

export const metadata: Metadata = {
  title: "Staff Leave Requests - Provider Portal",
  description: "Manage leave requests from all your staff members",
};

export default function AllStaffLeavesPage() {
  return <AllStaffLeavesView />;
}
