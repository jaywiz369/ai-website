"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export const ReadingProgressBar = () => {
    const [progress, setProgress] = useState(0);
    const rafId = useRef<number | null>(null);
    const lastUpdate = useRef(0);

    const updateProgress = useCallback(() => {
        const now = Date.now();
        // Throttle to ~30fps (33ms between updates)
        if (now - lastUpdate.current < 33) {
            rafId.current = requestAnimationFrame(updateProgress);
            return;
        }
        lastUpdate.current = now;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const newProgress = docHeight > 0 ? scrollTop / docHeight : 0;
        setProgress(newProgress);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(updateProgress);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        updateProgress();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [updateProgress]);

    return (
        <div
            className="fixed top-0 left-0 right-0 h-1.5 bg-primary origin-left z-[100]"
            style={{
                transform: `scaleX(${progress})`,
                transition: "transform 0.1s ease-out",
            }}
        />
    );
};
