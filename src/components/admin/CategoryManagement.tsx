"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TableCell, TableRow } from "@/components/ui/table";
import { AdminDataTable } from "@/components/admin/ui/admin-data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Interface for Category
interface Category {
  id: string;
  name: string;
  description: string;
  totalProvidersCount: number;
  activeProvidersCount: number;
  createdAt: string;
}

export default function CategoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  // Form states
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({ name: "", description: "" });

  const queryClient = useQueryClient();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const limit = 10;

  // Fetch Categories
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["admin", "categories", page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (debouncedSearch) params.append("search", debouncedSearch);

      const res = await fetch(`/api/admin/categories?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const categories = (categoriesData?.categories || []) as Category[];
  const pagination = categoriesData?.pagination;

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(
          result.msg || result.message || "Failed to create category",
        );
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category created successfully");
      setIsAddOpen(false);
      setFormData({ name: "", description: "" });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      description: string;
    }) => {
      const res = await fetch(`/api/admin/categories/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(
          result.msg || result.message || "Failed to update category",
        );
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category updated successfully");
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(
          result.msg || result.message || "Failed to delete category",
        );
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category deleted successfully");
      setDeletingCategory(null);
    },
    onError: (err: Error) => {
      toast.error(err.message);
      setDeletingCategory(null);
    },
  });

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (formData.name.trim().length < 3) {
      setErrors({ ...errors, name: "Min 3 characters" });
      return;
    }
    if (formData.description.trim().length < 10) {
      setErrors({ ...errors, description: "Min 10 characters" });
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({ ...formData, id: editingCategory.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setErrors({ name: "", description: "" });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Categories</h2>
      </div>
      <div className="flex justify-between items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-9 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button
            onClick={() => {
              setIsAddOpen(true);
              setEditingCategory(null);
              setFormData({ name: "", description: "" });
              setErrors({ name: "", description: "" });
            }}
            className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
      </div>

      <AdminDataTable
        title="Manage Categories"
        columns={[
          { header: "Category Name" },
          { header: "Description", className: "hidden md:table-cell" },
          { header: "Total Providers", className: "text-center" },
          { header: "Active Providers", className: "text-center" },
          { header: "Actions", className: "text-right" },
        ]}
        data={categories}
        isLoading={isLoading}
        emptyMessage="No categories found."
        currentPage={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={handlePageChange}
        renderRow={(category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium capitalize">
              {category.name}
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground truncate max-w-[200px]">
              {category.description}
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">{category.totalProvidersCount}</Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge
                variant="outline"
                className="border-green-200 text-green-700 bg-green-50">
                {category.activeProvidersCount}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => openEdit(category)}
                  disabled={
                    updateMutation.isPending &&
                    editingCategory?.id === category.id
                  }>
                  {updateMutation.isPending &&
                  editingCategory?.id === category.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  ) : (
                    <div className="flex ">
                      <Pencil className="h-4 w-4 text-gray-500" />{" "}
                    </div>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingCategory(category)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  disabled={
                    deleteMutation.isPending &&
                    deletingCategory?.id === category.id
                  }>
                  {deleteMutation.isPending &&
                  deletingCategory?.id === category.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />

      {/* Add/Edit Modal */}
      <Dialog
        open={isAddOpen || !!editingCategory}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            setEditingCategory(null);
          }
        }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Plumbing"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of services in this category..."
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category
              <span className="font-semibold text-foreground">
                {" "}
                "{deletingCategory?.name}"
              </span>
              .
              {deletingCategory && deletingCategory.totalProvidersCount > 0 && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex gap-2 text-red-800 items-start">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">
                    Warning: This category is used by{" "}
                    {deletingCategory.totalProvidersCount} providers. Deleting
                    it might result in errors or be blocked by the server.
                  </span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-pointer"
              onClick={() =>
                deletingCategory && deleteMutation.mutate(deletingCategory.id)
              }
              disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
