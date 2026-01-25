"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  isActive: boolean;
  category?: { name: string } | null;
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const products = useQuery(api.products.list, { search: search || undefined }) as Product[] | undefined;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your digital products
          </p>
        </div>
        <Button>
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
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
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
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {product.description}
                          </p>
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
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </div>
  );
}
