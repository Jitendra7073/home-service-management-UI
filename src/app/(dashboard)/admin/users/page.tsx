import { UserManagement } from "@/components/admin/users/UserManagement";

export const dynamic = "force-dynamic";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage All Users in HomHelpers.",
};

export default function AdminUsersPage() {
  return <UserManagement />;
}
