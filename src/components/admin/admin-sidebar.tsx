"use client";

import Link from "next/link";
import { useAdminData } from "@/providers/admin-data-provider";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    FolderTree,
    FileText,
    BarChart3,
    LogOut,
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Blog", href: "/admin/posts", icon: FileText },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const { storeName } = useAdminData();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border">
            <div className="flex h-16 items-center border-b border-border px-6">
                <Link href="/admin" className="font-serif text-xl">
                    {storeName}
                </Link>
            </div>
            <nav className="p-4 space-y-1">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border"
                >
                    View Store
                </Link>
                <a
                    href="/api/admin/auth"
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </a>
            </div>
        </aside>
    );
}
