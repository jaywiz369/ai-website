"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSiteData } from "@/providers/site-data-provider";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openCart, getItemCount } = useCart();
  const itemCount = getItemCount();
  const { branding, categories } = useSiteData();
  const storeName = branding?.storeName ?? "AgenticVault";

  // Prevent hydration mismatch by only showing cart count after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 group flex items-center gap-0.5">
            <div className="relative h-20 w-20 transition-transform group-hover:scale-105">
              <Image
                src="/logo-v3.png"
                alt="AgenticVault Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight transition-all group-hover:text-glow">
              {storeName}
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation - Left (Categories) */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-8">
          {categories?.slice(0, 5).map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="group flex items-center gap-2 text-sm font-medium text-muted-foreground nav-glow"
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground nav-glow"
          >
            Blog
          </Link>
        </div>

        {/* Desktop navigation - Right (Utility) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-2">
          <ThemeToggle />
          <div className="h-5 w-px bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-primary/10"
            onClick={openCart}
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {itemCount}
              </span>
            )}
            <span className="sr-only">Open cart</span>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden",
          mobileMenuOpen ? "fixed inset-0 z-50" : "hidden"
        )}
      >
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background border-l border-border px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="font-display text-2xl font-semibold tracking-tight">
                {storeName}
              </span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              {/* Main navigation */}
              <div className="space-y-1 py-6">
                {categories?.map((category) => (
                  <Link
                    key={category._id}
                    href={`/categories/${category.slug}`}
                    className="-mx-3 flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  href="/blog"
                  className="-mx-3 flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </div>

              {/* Theme and Cart */}
              <div className="flex items-center gap-4 py-6">
                <ThemeToggle />
                <Button
                  variant="outline"
                  className="w-full justify-start border-border hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCart();
                  }}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Cart
                  {mounted && itemCount > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
