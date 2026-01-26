"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface Bundle {
  _id: Id<"bundles">;
  name: string;
  slug: string;
  description: string;
  productIds: Id<"products">[];
  price: number;
  discountPercent: number;
  isActive: boolean;
}

interface Product {
  _id: Id<"products">;
  name: string;
  price: number;
  category?: { name: string } | null;
}

interface BundleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bundle?: Bundle;
  onSuccess?: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function BundleFormModal({
  open,
  onOpenChange,
  bundle,
  onSuccess,
}: BundleFormModalProps) {
  const isEditMode = !!bundle;

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<Id<"products">[]>([]);
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries and mutations
  const products = useQuery(api.products.listAll, {}) as Product[] | undefined;
  const createBundle = useMutation(api.bundles.create);
  const updateBundle = useMutation(api.bundles.update);

  // Reset form when dialog opens/closes or bundle changes
  useEffect(() => {
    if (open) {
      if (bundle) {
        setName(bundle.name);
        setSlug(bundle.slug);
        setDescription(bundle.description);
        setSelectedProductIds(bundle.productIds);
        setPrice((bundle.price / 100).toFixed(2));
        setDiscountPercent(bundle.discountPercent.toString());
        setIsActive(bundle.isActive);
      } else {
        setName("");
        setSlug("");
        setDescription("");
        setSelectedProductIds([]);
        setPrice("");
        setDiscountPercent("");
        setIsActive(true);
      }
      setErrors({});
    }
  }, [open, bundle]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditMode || slug === slugify(name)) {
      setSlug(slugify(value));
    }
  };

  // Toggle product selection
  const toggleProduct = (productId: Id<"products">) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    if (selectedProductIds.length === 0) {
      newErrors.products = "At least one product must be selected";
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      newErrors.price = "Valid price is required";
    }

    if (
      discountPercent &&
      (isNaN(parseFloat(discountPercent)) ||
        parseFloat(discountPercent) < 0 ||
        parseFloat(discountPercent) > 100)
    ) {
      newErrors.discountPercent = "Discount must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const priceInCents = Math.round(parseFloat(price) * 100);
      const discount = discountPercent ? parseFloat(discountPercent) : 0;

      if (isEditMode && bundle) {
        await updateBundle({
          id: bundle._id,
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          productIds: selectedProductIds,
          price: priceInCents,
          discountPercent: discount,
          isActive,
        });
      } else {
        await createBundle({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          productIds: selectedProductIds,
          price: priceInCents,
          discountPercent: discount,
          isActive,
        });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save bundle:", error);
      setErrors({ submit: "Failed to save bundle. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Bundle" : "Create Bundle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter bundle name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="bundle-slug"
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter bundle description"
              rows={3}
            />
          </div>

          {/* Products selection */}
          <div className="space-y-2">
            <Label>Products *</Label>
            <div className="border border-input rounded-md max-h-48 overflow-y-auto p-3 space-y-2">
              {products === undefined ? (
                <p className="text-sm text-muted-foreground">
                  Loading products...
                </p>
              ) : products.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No products available
                </p>
              ) : (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      id={`product-${product._id}`}
                      checked={selectedProductIds.includes(product._id)}
                      onCheckedChange={() => toggleProduct(product._id)}
                    />
                    <label
                      htmlFor={`product-${product._id}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      <span className="font-medium">{product.name}</span>
                      {product.category && (
                        <span className="text-muted-foreground ml-2">
                          ({product.category.name})
                        </span>
                      )}
                      <span className="text-muted-foreground ml-2">
                        ${(product.price / 100).toFixed(2)}
                      </span>
                    </label>
                  </div>
                ))
              )}
            </div>
            {errors.products && (
              <p className="text-sm text-destructive">{errors.products}</p>
            )}
            {selectedProductIds.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedProductIds.length} product
                {selectedProductIds.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {/* Price and Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (in dollars) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPercent">Discount (%)</Label>
              <div className="relative">
                <Input
                  id="discountPercent"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="0"
                  className="pr-7"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
              {errors.discountPercent && (
                <p className="text-sm text-destructive">
                  {errors.discountPercent}
                </p>
              )}
            </div>
          </div>

          {/* Is Active */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Active (visible to customers)
            </Label>
          </div>

          {/* Submit error */}
          {errors.submit && (
            <p className="text-sm text-destructive">{errors.submit}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update Bundle"
                  : "Create Bundle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
