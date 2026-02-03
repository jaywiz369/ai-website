import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminDataProvider } from "@/providers/admin-data-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminDataProvider>
      <div className="min-h-screen bg-muted/30">
        <AdminSidebar />
        {/* Main content */}
        <main className="pl-64">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </AdminDataProvider>
  );
}
