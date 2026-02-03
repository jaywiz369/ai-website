"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, ImageIcon, Star } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { ProductFormModal } from "@/components/admin/product-form-modal";
import { useDebounce } from "@/hooks/use-debounce";

interface Product {
  _id: Id<"products">;
  name: string;
  slug: string;
  description: string;
  type: string;
  price: number;
  fileId?: Id<"_storage">;
  isActive: boolean;
  isFeatured: boolean;
  category?: { name: string } | null;
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState<Id<"products"> | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const products = useQuery(api.products.listAll, { search: debouncedSearch || undefined }) as Product[] | undefined;
  const removeProduct = useMutation(api.products.remove);

  const handleAddClick = () => {
    setEditingProduct(undefined);
    setModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDeleteClick = (productId: Id<"products">) => {
    setDeleteConfirmId(productId);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      await removeProduct({ id: deleteConfirmId });
      setDeleteConfirmId(null);
    }
  };

  const handleModalSuccess = () => {
    setEditingProduct(undefined);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your digital products
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Products table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground w-20">
                    Image
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products === undefined ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product: Product) => (
                    <tr
                      key={product._id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="p-4">
                        <div className="w-16 h-12 relative bg-muted/50 border border-border overflow-hidden">
                          {product.previewUrl ? (
                            <Image
                              src={product.previewUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {product.name}
                              {product.isFeatured && (
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">
                          {product.category?.name || "—"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{product.type}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-sm">
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={product.isActive ? "default" : "secondary"}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {deleteConfirmId === product._id ? (
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
                              onClick={() => handleDeleteClick(product._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ProductFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={editingProduct}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
