"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface TOCProps {
    content: string;
}

export const TableOfContents = ({ content }: TOCProps) => {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Extract headings from markdown
        const headingLines = content.split("\n").filter(line => line.startsWith("#"));
        const extractedHeadings = headingLines.map(line => {
            const match = line.match(/^(#+)\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2];
                const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                return { id, text, level };
            }
            return null;
        }).filter(Boolean) as Heading[];

        setHeadings(extractedHeadings);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0% 0% -80% 0%" }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground/50">Table of Contents</p>
            <ul className="space-y-3">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                    >
                        <a
                            href={`#${heading.id}`}
                            className={cn(
                                "text-sm transition-colors hover:text-primary",
                                activeId === heading.id ? "text-primary font-medium" : "text-muted-foreground"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
