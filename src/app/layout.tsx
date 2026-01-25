import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Toaster } from "sonner";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PropTemplates | Professional Real Estate Digital Products",
  description:
    "Premium digital templates, checklists, and guides for Airbnb hosts, landlords, realtors, and home buyers. Streamline your real estate business today.",
  keywords: [
    "real estate templates",
    "airbnb host templates",
    "landlord tools",
    "property management",
    "realtor marketing",
    "home buying checklist",
  ],
  openGraph: {
    title: "PropTemplates | Professional Real Estate Digital Products",
    description:
      "Premium digital templates, checklists, and guides for real estate professionals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        <ConvexClientProvider>
          {children}
          <Toaster position="bottom-right" />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
