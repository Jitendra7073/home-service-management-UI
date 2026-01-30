import CategoryManagement from "@/components/admin/CategoryManagement";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage All Categories in HomHelpers.",
};

export default function CategoryPage() {
  return (
    <div className="pb-6 max-w-7xl mx-auto">
      <CategoryManagement />
    </div>
  );
}
