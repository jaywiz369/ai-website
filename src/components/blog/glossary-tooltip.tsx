"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const GLOSSARY: Record<string, string> = {
    "LLM": "Large Language Model - a type of AI trained on massive amounts of text data to understand and generate human-like text.",
    "RAG": "Retrieval-Augmented Generation - a technique that gives LLMs access to specific, up-to-date information without retraining.",
    "Convex": "A full-stack TypeScript development platform that replaces your database, server functions, and state management.",
    "Next.js": "The React framework for the web, enabling features like server-side rendering and generating static websites.",
};

interface GlossaryTooltipProps {
    term: string;
}

export const GlossaryTooltip = ({ term }: GlossaryTooltipProps) => {
    const definition = GLOSSARY[term];

    if (!definition) return <span>{term}</span>;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="cursor-help border-b border-dotted border-primary/50 text-foreground font-medium decoration-primary/30 decoration-2 underline-offset-4 transition-colors hover:text-primary">
                        {term}
                    </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs p-3">
                    <p className="text-xs leading-relaxed">{definition}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
