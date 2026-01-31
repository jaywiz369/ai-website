"use client";

import { cn } from "@/lib/utils";

interface VideoEmbedProps {
    url: string;
    type: "youtube" | "loom";
}

export const VideoEmbed = ({ url, type }: VideoEmbedProps) => {
    let embedUrl = "";

    if (type === "youtube") {
        const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    } else if (type === "loom") {
        const videoId = url.match(/loom\.com\/share\/([a-f0-9]+)/)?.[1];
        embedUrl = videoId ? `https://www.loom.com/embed/${videoId}` : "";
    }

    if (!embedUrl) return null;

    return (
        <div className="relative w-full aspect-video my-8 rounded-2xl overflow-hidden border border-border shadow-2xl bg-muted/30">
            <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};
