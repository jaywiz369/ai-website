"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/NewsletterForm";
import { useBranding } from "@/providers/site-data-provider";

export function CTASection() {
    const { branding } = useBranding();

    const ctaHeadline = branding?.ctaHeadline ?? "Ready to supercharge your AI workflow?";
    const ctaDescription = branding?.ctaDescription ?? "Join thousands of creators using our premium prompts.";

    return (
        <section className="relative border-t border-border bg-card/50 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Left: Product CTA */}
                    <div className="flex flex-col items-start text-left space-y-6">
                        <h2 className="font-display text-3xl sm:text-4xl font-bold">
                            <span className="text-gradient">{ctaHeadline}</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-xl">
                            {ctaDescription} Stop wasting time with bad prompts and start shipping production-grade AI features today.
                        </p>
                        <Button
                            size="xl"
                            className="bg-primary text-primary-foreground hover:glow-md transition-all px-8 py-6 rounded-full text-lg font-semibold w-full sm:w-auto"
                            asChild
                        >
                            <Link href="/products">
                                Get Full Access
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>

                    {/* Right: Newsletter (Separated by visual divider on large screens) */}
                    <div className="relative">
                        {/* Vertical Divider for desktop */}
                        <div className="hidden lg:block absolute -left-12 top-0 bottom-0 w-px bg-border/50" />

                        <div className="flex flex-col space-y-6 lg:pl-4">
                            <div>
                                <h3 className="font-display text-2xl font-bold mb-2">Join the Inner Circle</h3>
                                <p className="text-muted-foreground">
                                    Get weekly implementation guides and new prompt drops directly to your inbox.
                                </p>
                            </div>
                            <NewsletterForm />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
