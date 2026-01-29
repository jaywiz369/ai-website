"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Plus, Pencil, Trash2, ChevronRight, FolderOpen, Folder } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

interface Category {
  _id: Id<"categories">;
  name: string;
  slug: string;
  description: string;
  parentId?: Id<"categories">;
  parentName?: string | null;
  productCount: number;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  parentId: string;
}

export default function AdminCategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState<Id<"categories"> | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    description: "",
    parentId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useQuery(api.categories.list) as Category[] | undefined;
  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const removeCategory = useMutation(api.categories.remove);

  // Organize categories into a tree structure
  const topLevelCategories = categories?.filter((c) => !c.parentId) || [];
  const getChildren = (parentId: Id<"categories">) =>
    categories?.filter((c) => c.parentId === parentId) || [];

  const handleAddClick = (parentId?: Id<"categories">) => {
    setEditingCategory(undefined);
    setFormData({
      name: "",
      slug: "",
      description: "",
      parentId: parentId || "",
    });
    setModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId || "",
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (categoryId: Id<"categories">) => {
    setDeleteConfirmId(categoryId);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      try {
        await removeCategory({ id: deleteConfirmId });
        toast.success("Category deleted");
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete category";
        toast.error(errorMessage);
      }
      setDeleteConfirmId(null);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugify(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        parentId: formData.parentId ? (formData.parentId as Id<"categories">) : undefined,
      };

      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, ...data });
        toast.success("Category updated");
      } else {
        await createCategory(data);
        toast.success("Category created");
      }

      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const children = getChildren(category._id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedCategories.has(category._id);

    return (
      <div key={category._id}>
        <div
          className={`flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 ${level > 0 ? "bg-muted/20" : ""
            }`}
          style={{ paddingLeft: `${1 + level * 1.5}rem` }}
        >
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(category._id)}
                className="p-1 hover:bg-muted rounded"
              >
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""
                    }`}
                />
              </button>
            ) : (
              <div className="w-6" />
            )}
            {hasChildren ? (
              <FolderOpen className="h-5 w-5 text-accent" />
            ) : (
              <Folder className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">{category.name}</p>
              <p className="text-xs text-muted-foreground">{category.slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary">{category.productCount} products</Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddClick(category._id)}
                title="Add subcategory"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditClick(category)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              {deleteConfirmId === category._id ? (
                <div className="flex gap-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteConfirm}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirmId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteClick(category._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div>
            {children.map((child) => renderCategory(child as Category, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage product categories and subcategories
          </p>
        </div>
        <Button onClick={() => handleAddClick()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {categories === undefined ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No categories found. Create your first category to get started.
            </div>
          ) : (
            <div>
              {topLevelCategories.map((category) =>
                renderCategory(category as Category)
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Form Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category details below."
                : "Fill in the details to create a new category."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Category name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="category-slug"
              />
              <p className="text-xs text-muted-foreground">
                Used in the URL: /categories/{formData.slug || "..."}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Category description..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Category (optional)</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, parentId: value === "none" ? "" : value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No parent (top-level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No parent (top-level)</SelectItem>
                  {topLevelCategories
                    .filter((c) => c._id !== editingCategory?._id)
                    .map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select a parent to make this a subcategory.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editingCategory
                    ? "Update Category"
                    : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
