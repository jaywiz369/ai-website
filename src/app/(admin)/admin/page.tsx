"use client";

import { useQuery } from "convex/react";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface Order {
  _id: string;
  email: string;
  status: string;
  total: number;
  createdAt: number;
}

export default function AdminDashboardPage() {
  const products = useQuery(api.products.list, {});
  const orders = useQuery(api.orders.listAll) as Order[] | undefined;

  const totalProducts = products?.length ?? 0;
  const totalOrders = orders?.filter((o: Order) => o.status === "completed").length ?? 0;
  const totalRevenue =
    orders
      ?.filter((o: Order) => o.status === "completed")
      .reduce((sum: number, o: Order) => sum + o.total, 0) ?? 0;

  const stats = [
    {
      name: "Total Products",
      value: totalProducts,
      icon: Package,
      description: "Active templates",
    },
    {
      name: "Orders",
      value: totalOrders,
      icon: ShoppingCart,
      description: "Completed orders",
    },
    {
      name: "Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      description: "Total earnings",
    },
  ];

  const recentOrders = orders
    ?.filter((o: Order) => o.status === "completed")
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders === undefined ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium">{order.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-medium">
                      {formatPrice(order.total)}
                    </p>
                    <p className="text-xs text-accent capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
