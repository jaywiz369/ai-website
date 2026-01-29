import type { Metadata } from "next";
import { Space_Grotesk, Outfit, JetBrains_Mono, Lora } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PromptVault | Premium AI Prompts & Automation Tools",
  description:
    "Premium prompt packs and AI automation tools for power users. Supercharge your workflow with expertly crafted prompts for ChatGPT, Claude, and more.",
  keywords: [
    "AI prompts",
    "ChatGPT prompts",
    "prompt engineering",
    "AI automation",
    "prompt packs",
    "AI tools",
  ],
  openGraph: {
    title: "PromptVault | Premium AI Prompts & Automation Tools",
    description:
      "Premium prompt packs and AI automation tools for power users.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${lora.variable} font-sans antialiased`}
      >
        <ConvexClientProvider>
          {children}
          <Toaster position="bottom-right" />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
