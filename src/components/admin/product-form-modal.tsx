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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./image-upload";
import { FileUpload } from "./file-upload";
import { slugify, formatPrice } from "@/lib/utils";

interface Product {
  _id: Id<"products">;
  name: string;
  slug: string;
  description: string;
  categoryId: Id<"categories">;
  type: string;
  price: number;
  previewUrl?: string;
  previewImageId?: Id<"_storage">;
  fileId?: Id<"_storage">;
  deliveryUrl?: string;
  isActive: boolean;
}

type DeliveryType = "none" | "canva" | "file";

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  type: string;
  price: string;
  previewUrl: string;
  deliveryUrl: string;
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  type?: string;
  price?: string;
}

export function ProductFormModal({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormModalProps) {
  const isEditMode = !!product;

  const categories = useQuery(api.categories.list);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const generateUploadUrl = useMutation(api.downloads.generateUploadUrl);
  const getStorageUrl = useMutation(api.downloads.getStorageUrl);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    description: "",
    categoryId: "",
    type: "",
    price: "",
    previewUrl: "",
    deliveryUrl: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageCleared, setImageCleared] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("none");
  const [selectedDeliveryFile, setSelectedDeliveryFile] = useState<File | null>(null);
  const [deliveryFileInfo, setDeliveryFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [deliveryCleared, setDeliveryCleared] = useState(false);

  // Reset form when modal opens/closes or product changes
  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description,
          categoryId: product.categoryId,
          type: product.type,
          price: String(product.price),
          previewUrl: product.previewUrl || "",
          deliveryUrl: product.deliveryUrl || "",
          isActive: product.isActive,
        });
        // Determine delivery type based on existing data
        if (product.deliveryUrl) {
          setDeliveryType("canva");
        } else if (product.fileId) {
          setDeliveryType("file");
          setDeliveryFileInfo({ name: "Existing file", size: 0 });
        } else {
          setDeliveryType("none");
        }
      } else {
        setFormData({
          name: "",
          slug: "",
          description: "",
          categoryId: "",
          type: "",
          price: "",
          previewUrl: "",
          deliveryUrl: "",
          isActive: true,
        });
        setDeliveryType("none");
      }
      setErrors({});
      setSelectedFile(null);
      setImageCleared(false);
      setSelectedDeliveryFile(null);
      setDeliveryCleared(false);
      // Only reset deliveryFileInfo if not editing a product with a file
      if (!product?.fileId) {
        setDeliveryFileInfo(null);
      }
    }
  }, [open, product]);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugify(name),
    }));
  };

  const handleChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when field is edited
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Type is required";
    }

    const priceNum = parseInt(formData.price, 10);
    if (!formData.price || isNaN(priceNum) || priceNum < 0) {
      newErrors.price = "Valid price in cents is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let previewUrl = formData.previewUrl;
      let previewImageId: Id<"_storage"> | undefined = undefined;
      let fileId: Id<"_storage"> | undefined = undefined;
      let deliveryUrl: string | undefined = undefined;

      // Upload preview image if one was selected
      if (selectedFile) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });

        if (response.ok) {
          const { storageId } = await response.json();
          previewImageId = storageId as Id<"_storage">;
          // Get the actual Convex storage URL (not the temporary blob URL)
          const storageUrl = await getStorageUrl({ storageId });
          if (storageUrl) {
            previewUrl = storageUrl;
          }
        }
      }

      // Handle delivery based on type
      if (deliveryType === "canva") {
        deliveryUrl = formData.deliveryUrl.trim() || undefined;
      } else if (deliveryType === "file" && selectedDeliveryFile) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedDeliveryFile.type },
          body: selectedDeliveryFile,
        });

        if (response.ok) {
          const { storageId } = await response.json();
          fileId = storageId as Id<"_storage">;
        }
      }

      const productData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        categoryId: formData.categoryId as Id<"categories">,
        type: formData.type.trim(),
        price: parseInt(formData.price, 10),
        previewUrl: previewUrl || undefined,
        previewImageId: previewImageId,
        fileId: fileId,
        deliveryUrl: deliveryUrl,
        isActive: formData.isActive,
      };

      if (isEditMode && product) {
        const updateData: Parameters<typeof updateProduct>[0] = {
          id: product._id,
          ...productData,
        };

        // If image was cleared, tell the backend to delete the old image
        if (imageCleared && !selectedFile) {
          updateData.clearPreviewImage = true;
        }

        // If delivery was cleared or changed, handle appropriately
        if (deliveryCleared || (deliveryType === "none" && (product.deliveryUrl || product.fileId))) {
          updateData.clearDeliveryUrl = true;
          updateData.fileId = undefined;
        }

        await updateProduct(updateData);
      } else {
        await createProduct(productData);
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priceDisplay = formData.price
    ? formatPrice(parseInt(formData.price, 10) || 0)
    : "$0.00";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Product" : "Create Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the product details below."
              : "Fill in the details to create a new product."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Product name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="product-slug"
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Auto-generated from name. Used in the product URL.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Product description..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleChange("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  ?.filter((c) => !c.parentId)
                  .map((category) => (
                    <div key={category._id}>
                      <SelectItem value={category._id}>
                        {category.name}
                      </SelectItem>
                      {/* Show subcategories indented */}
                      {categories
                        .filter((c) => c.parentId === category._id)
                        .map((subCategory) => (
                          <SelectItem
                            key={subCategory._id}
                            value={subCategory._id}
                            className="pl-6"
                          >
                            └ {subCategory.name}
                          </SelectItem>
                        ))}
                    </div>
                  ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              placeholder="e.g., Template, Checklist, Planner"
            />
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (in cents)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="999"
                className="max-w-32"
              />
              <span className="text-sm text-muted-foreground">
                Display: {priceDisplay}
              </span>
            </div>
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price}</p>
            )}
          </div>

          {/* Preview Image */}
          <div className="space-y-2">
            <Label>Preview Image</Label>
            <ImageUpload
              value={formData.previewUrl}
              onChange={(url) => handleChange("previewUrl", url)}
              onFileSelect={handleFileSelect}
              onClear={() => setImageCleared(true)}
            />
          </div>

          {/* Digital Product Delivery */}
          <div className="space-y-4 border border-input rounded-lg p-4">
            <div>
              <Label className="text-base font-medium">Digital Product Delivery</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Choose how customers will receive this product after purchase.
              </p>
            </div>

            {/* Delivery Type Selection */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={deliveryType === "none" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setDeliveryType("none");
                  setDeliveryCleared(true);
                }}
              >
                None
              </Button>
              <Button
                type="button"
                variant={deliveryType === "canva" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setDeliveryType("canva");
                  setSelectedDeliveryFile(null);
                  setDeliveryFileInfo(null);
                }}
              >
                Canva Link
              </Button>
              <Button
                type="button"
                variant={deliveryType === "file" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setDeliveryType("file");
                  handleChange("deliveryUrl", "");
                }}
              >
                File Upload
              </Button>
            </div>

            {/* Canva Link Input */}
            {deliveryType === "canva" && (
              <div className="space-y-2">
                <Label htmlFor="deliveryUrl">Canva Template URL</Label>
                <Input
                  id="deliveryUrl"
                  type="url"
                  placeholder="https://www.canva.com/design/..."
                  value={formData.deliveryUrl}
                  onChange={(e) => handleChange("deliveryUrl", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Customers will see an &quot;Open in Canva&quot; button after purchase.
                </p>
              </div>
            )}

            {/* File Upload */}
            {deliveryType === "file" && (
              <div className="space-y-2">
                <Label>Upload Delivery File</Label>
                <FileUpload
                  value={deliveryFileInfo}
                  onFileSelect={(file) => {
                    setSelectedDeliveryFile(file);
                    setDeliveryFileInfo({ name: file.name, size: file.size });
                  }}
                  onClear={() => {
                    setSelectedDeliveryFile(null);
                    setDeliveryFileInfo(null);
                    setDeliveryCleared(true);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Customers will receive a secure download link after purchase.
                </p>
              </div>
            )}

            {deliveryType === "none" && (
              <p className="text-sm text-muted-foreground italic">
                No digital delivery configured. Add a Canva link or upload a file to enable instant delivery.
              </p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                handleChange("isActive", checked as boolean)
              }
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Active (visible to customers)
            </Label>
          </div>

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
                ? "Update Product"
                : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
