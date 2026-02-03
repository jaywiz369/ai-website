import type { Metadata } from "next";
import { Space_Grotesk, Outfit, JetBrains_Mono, Lora } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ThemeProvider } from "@/providers/theme-provider";
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
    title: "AgenticVault.dev | Premium AI Agents & Automation Tools",
    description:
        "The vault for AI engineers. Premium prompt packs, autonomous agents, and automation tools to supercharge your engineering workflow.",
    keywords: [
        "AI agents",
        "autonomous agents",
        "prompt engineering",
        "AI automation",
        "developer tools",
        "AI workflows",
        "LLM ops",
    ],
    openGraph: {
        title: "AgenticVault.dev | Premium AI Agents & Automation Tools",
        description:
            "The vault for AI engineers. Premium prompt packs, autonomous agents, and automation tools.",
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
                className={`${outfit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${lora.variable} font-sans antialiased`}
            >
                <ThemeProvider>
                    <ConvexClientProvider>
                        {children}
                        <Toaster position="bottom-right" />
                    </ConvexClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
