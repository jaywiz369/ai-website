"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const supportLinks = [
  { name: "Contact", href: "/contact" },
  { name: "FAQ", href: "/faq" },
  { name: "Download Help", href: "/download-help" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Refund Policy", href: "/refunds" },
];

export function Footer() {
  const branding = useQuery(api.settings.getBranding);
  const categories = useQuery(api.categories.getTopLevel);

  const storeName = branding?.storeName ?? "PromptVault";
  const storeTagline = branding?.storeTagline ?? "AI Prompts & Automation Tools";

  return (
    <footer className="relative border-t border-border bg-card overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-display text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                {storeName}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {storeTagline}
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-display font-semibold">Products</h3>
                <ul role="list" className="mt-4 space-y-3">
                  <li>
                    <Link
                      href="/products"
                      className="text-sm text-muted-foreground nav-glow"
                    >
                      All Products
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-display font-semibold">Categories</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {categories?.slice(0, 4).map((category) => (
                    <li key={category._id}>
                      <Link
                        href={`/categories/${category.slug}`}
                        className="text-sm text-muted-foreground nav-glow"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                  {(!categories || categories.length === 0) && (
                    <li>
                      <Link
                        href="/categories"
                        className="text-sm text-muted-foreground nav-glow"
                      >
                        Browse All
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-display font-semibold">Support</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {supportLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground nav-glow"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-display font-semibold">Legal</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {legalLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground nav-glow"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
