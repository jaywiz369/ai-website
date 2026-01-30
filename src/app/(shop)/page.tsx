"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleArrowDown, HeartHandshake, Sparkles, Users, Star, Calendar, Terminal, PenTool, Palette, FolderOpen, MousePointerClick, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/product-grid";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const features = [
  {
    icon: CheckCircle2,
    title: "Battle-Tested Prompts",
    description: "Refined through generations",
  },
  {
    icon: CircleArrowDown,
    title: "Instant Download",
    description: "Get prompts immediately",
  },
  {
    icon: HeartHandshake,
    title: "Premium Support",
    description: "Expert help anytime",
  },
  {
    icon: Users,
    title: "10,000+ AI Creators",
    description: "Trusted worldwide",
  },
  {
    icon: Star,
    title: "Verified 5-Star",
    description: "Quality guaranteed",
  },
  {
    icon: Calendar,
    title: "Added Weekly",
    description: "Fresh premium content",
  },
];

export default function HomePage() {
  const featuredProducts = useQuery(api.products.getFeatured, { limit: 6 });
  const categories = useQuery(api.categories.getTopLevel);
  const branding = useQuery(api.settings.getBranding);

  const heroHeadline = branding?.heroHeadline ?? "Premium Prompts for AI Power Users";
  const heroDescription = branding?.heroDescription ?? "Curated prompt packs and automation tools to supercharge your AI workflow. Battle-tested, ready to use.";
  const ctaHeadline = branding?.ctaHeadline ?? "Ready to supercharge your AI workflow?";
  const ctaDescription = branding?.ctaDescription ?? "Join thousands of creators using our premium prompts.";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
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

      {/* Features Marquee (Moved to be immediately under Hero) */}
      <section className="relative overflow-hidden select-none border-b border-border">
        <div
          className="py-3"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
          }}
        >
          <motion.div
            className="flex whitespace-nowrap"
            style={{ width: 'max-content' }}
            animate={{ x: ["0%", "-33.333%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 35,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate 3 times for a perfectly seamless infinite loop */}
            {[...features, ...features, ...features].map((feature, index) => (
              <div
                key={`${feature.title}-${index}`}
                className="flex items-center gap-2.5 px-20 opacity-60 hover:opacity-100 transition-opacity"
              >
                <feature.icon className="h-4 w-4 text-primary shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-tight">{feature.title}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-0.5">{feature.description}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">
                Our most popular prompt packs and tools.
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex nav-glow">
              <Link href="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <ProductGrid
            products={featuredProducts || []}
            loading={featuredProducts === undefined}
          />

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MousePointerClick className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-display">1. Browse Collection</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Explore our curated library of battle-tested prompts for engineering, design, and content.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-display">2. Instant Access</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Secure checkout and immediate download. No waiting, no subscription barriers.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-display">3. Deploy & Scale</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Copy, paste, and customize. Shipping production-grade AI features has never been faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I receive my prompts?</AccordionTrigger>
              <AccordionContent>
                Immediately after purchase, you will receive a secure download link via email. You can also access your purchases anytime from your account dashboard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is this a recurring subscription?</AccordionTrigger>
              <AccordionContent>
                No. All our prompt packs are one-time purchases. You pay once and own it forever, including any future updates to that specific pack.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
              <AccordionContent>
                Due to the digital nature of our products, we generally do not offer refunds. However, if you are unsatisfied with your purchase, please contact our support team and we will do our best to resolve the issue.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I use these prompts for commercial projects?</AccordionTrigger>
              <AccordionContent>
                Yes! You are free to use the outputs generated by our prompts for any commercial or personal projects. You cannot, however, resell the prompt packs themselves.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Unified CTA & Newsletter Section */}
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
    </div>
  );
}
