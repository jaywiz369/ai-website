"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: true,
    theme: "dark", // We can make this dynamic later
    securityLevel: "loose",
    fontFamily: "Inter, sans-serif",
});

interface MermaidProps {
    chart: string;
}

export const Mermaid = ({ chart }: MermaidProps) => {
    const [svg, setSvg] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderChart = async () => {
            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
            } catch (error) {
                console.error("Mermaid rendering failed:", error);
            }
        };

        renderChart();
    }, [chart]);

    return (
        <div
            ref={containerRef}
            className="flex justify-center my-8 p-4 bg-muted/30 rounded-2xl border border-border overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};
