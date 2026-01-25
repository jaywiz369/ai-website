"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";

interface Order {
  _id: string;
  email: string;
  status: string;
  total: number;
  createdAt: number;
}

export default function AdminOrdersPage() {
  const orders = useQuery(api.orders.listAll) as Order[] | undefined;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          View and manage customer orders
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Order ID
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Total
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders === undefined ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order: Order) => (
                    <tr
                      key={order._id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="p-4">
                        <span className="font-mono text-sm">
                          {order._id.slice(-8)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{order.email}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-sm font-medium">
                          {formatPrice(order.total)}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
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
