import { UserManagement } from "@/components/admin/users/UserManagement";

export const dynamic = "force-dynamic";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users | Fixora",
  description: "Manage All Users in Fixora.",
};

export default function AdminUsersPage() {
  return <UserManagement />;
}
