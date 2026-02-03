"use client";

import { useEffect, useRef, useState } from "react";
import type mermaidType from "mermaid";

interface MermaidProps {
    chart: string;
}

// Singleton pattern - prevents re-initialization on hot reload
let mermaidInstance: typeof mermaidType | null = null;
let initPromise: Promise<typeof mermaidType> | null = null;

const getMermaid = async (): Promise<typeof mermaidType> => {
    if (mermaidInstance) return mermaidInstance;

    if (!initPromise) {
        initPromise = (async () => {
            const m = await import("mermaid");
            m.default.initialize({
                startOnLoad: false,
                theme: "dark",
                securityLevel: "loose",
                fontFamily: "Inter, sans-serif",
            });
            mermaidInstance = m.default;
            return m.default;
        })();
    }

    return initPromise;
};

export const Mermaid = ({ chart }: MermaidProps) => {
    const [svg, setSvg] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;

        const renderChart = async () => {
            try {
                const mermaid = await getMermaid();
                if (cancelled) return;

                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);

                if (!cancelled) {
                    setSvg(svg);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Mermaid rendering failed:", error);
                if (!cancelled) setIsLoading(false);
            }
        };

        renderChart();

        return () => { cancelled = true; };
    }, [chart]);

    return (
        <div
            ref={containerRef}
            className="flex justify-center my-8 p-4 bg-muted/30 rounded-2xl border border-border overflow-x-auto min-h-[100px]"
        >
            {isLoading ? (
                <div className="flex items-center justify-center text-muted-foreground text-sm">
                    Loading diagram...
                </div>
            ) : (
                <div dangerouslySetInnerHTML={{ __html: svg }} />
            )}
        </div>
    );
};
