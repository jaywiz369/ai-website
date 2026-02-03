import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteDataProvider } from "@/providers/site-data-provider";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteDataProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </div>
    </SiteDataProvider>
  );
}
