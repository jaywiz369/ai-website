"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface Order {
  _id: string;
  status: string;
  total: number;
  createdAt: number;
}

interface Category {
  _id: string;
  name: string;
  productCount?: number;
}

export default function AdminAnalyticsPage() {
  const orders = useQuery(api.orders.listAll) as Order[] | undefined;
  const products = useQuery(api.products.list, {});
  const categories = useQuery(api.categories.list) as Category[] | undefined;

  const completedOrders = orders?.filter((o: Order) => o.status === "completed") || [];
  const totalRevenue = completedOrders.reduce((sum: number, o: Order) => sum + o.total, 0);
  const avgOrderValue =
    completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  // Group orders by date for chart data
  const ordersByDate = completedOrders.reduce((acc: Record<string, number>, order: Order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + order.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Track your store performance
        </p>
      </div>

      {/* Revenue stats */}
      <div className="grid gap-6 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {formatPrice(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {formatPrice(avgOrderValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categories === undefined ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {categories.map((category: Category) => (
                  <div key={category._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{category.name}</span>
                      <span className="font-medium">{category.productCount}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{
                          width: `${
                            ((category.productCount || 0) /
                              (products?.length || 1)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(ordersByDate).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No sales data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {(Object.entries(ordersByDate) as [string, number][])
                  .slice(-7)
                  .map(([date, revenue]) => (
                    <div
                      key={date}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-muted-foreground">
                        {date}
                      </span>
                      <span className="font-mono text-sm font-medium">
                        {formatPrice(revenue)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
