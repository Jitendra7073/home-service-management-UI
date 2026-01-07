import CategoryManagement from "@/components/admin/CategoryManagement";

export const metadata = {
  title: "Category Management | Admin Dashboard",
  description: "Manage business categories",
};

export default function CategoryPage() {
  return (
    <div className="pb-6 max-w-7xl mx-auto">
      <CategoryManagement />
    </div>
  );
}
