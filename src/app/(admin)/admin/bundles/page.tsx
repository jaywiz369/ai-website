"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { BundleFormModal } from "@/components/admin/bundle-form-modal";

interface Bundle {
  _id: Id<"bundles">;
  name: string;
  slug: string;
  description: string;
  productIds: Id<"products">[];
  price: number;
  originalPrice: number;
  discountPercent: number;
  isActive: boolean;
  products?: { _id: string }[];
}

export default function AdminBundlesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | undefined>(undefined);
  const [deleteConfirmId, setDeleteConfirmId] = useState<Id<"bundles"> | null>(null);

  const bundles = useQuery(api.bundles.listAll) as Bundle[] | undefined;
  const removeBundle = useMutation(api.bundles.remove);

  const handleAddClick = () => {
    setEditingBundle(undefined);
    setModalOpen(true);
  };

  const handleEditClick = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setModalOpen(true);
  };

  const handleDeleteClick = (bundleId: Id<"bundles">) => {
    setDeleteConfirmId(bundleId);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      await removeBundle({ id: deleteConfirmId });
      setDeleteConfirmId(null);
    }
  };

  const handleModalSuccess = () => {
    setEditingBundle(undefined);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Bundles</h1>
          <p className="text-sm text-muted-foreground">
            Manage product bundles
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create Bundle
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Bundle
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Products
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Discount
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
                {bundles === undefined ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-muted-foreground"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : bundles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No bundles yet.
                    </td>
                  </tr>
                ) : (
                  bundles.map((bundle: Bundle) => (
                    <tr
                      key={bundle._id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{bundle.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {bundle.description}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">
                          {bundle.products?.length || 0} products
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <span className="font-mono text-sm font-medium">
                            {formatPrice(bundle.price)}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground line-through ml-2">
                            {formatPrice(bundle.originalPrice)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="accent">
                          {bundle.discountPercent}% off
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={bundle.isActive ? "default" : "secondary"}
                        >
                          {bundle.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(bundle)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {deleteConfirmId === bundle._id ? (
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
                              onClick={() => handleDeleteClick(bundle._id)}
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

      <BundleFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        bundle={editingBundle}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
