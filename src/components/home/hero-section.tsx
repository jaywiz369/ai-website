"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBranding } from "@/providers/site-data-provider";

export function HeroSection() {
    const { branding } = useBranding();

    const heroHeadline = branding?.heroHeadline ?? "Premium Prompts for AI Power Users";
    const heroDescription = branding?.heroDescription ?? "Curated prompt packs and automation tools to supercharge your AI workflow. Battle-tested, ready to use.";

    return (
        <section className="relative border-b border-border overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 bg-grid opacity-40" />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
            {/* Decorative glow orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        <span className="text-gradient">{heroHeadline}</span>
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                        {heroDescription}
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="xl" className="w-full sm:w-auto bg-primary text-primary-foreground hover:glow-md transition-all px-8 py-6 rounded-full text-lg font-bold" asChild>
                            <Link href="#categories">
                                Explore Collections
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="xl" variant="outline" className="w-full sm:w-auto border-border/50 hover:border-primary/50 hover:bg-primary/5 px-8 py-6 rounded-full text-lg font-medium backdrop-blur-sm" asChild>
                            <Link href="/blog">Read Our Guide</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
