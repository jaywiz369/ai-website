"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleArrowDown, HeartHandshake, Users, Star, Calendar } from "lucide-react";

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

export function FeaturesMarquee() {
    return (
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
    );
}
