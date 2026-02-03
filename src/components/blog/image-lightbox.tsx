"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ImageLightboxProps {
    src: string;
    alt?: string;
}

export const ImageLightbox = ({ src, alt }: ImageLightboxProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <span
                className="block relative cursor-zoom-in my-8 group overflow-hidden rounded-2xl border border-border bg-muted/30"
                onClick={() => setIsOpen(true)}
            >
                <img src={src} alt={alt} className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]" />
                {alt && (
                    <span className="block p-3 text-center text-sm text-muted-foreground border-t border-border bg-muted/10 italic">
                        {alt}
                    </span>
                )}
            </span>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 backdrop-blur-md p-4 sm:p-20"
                        onClick={() => setIsOpen(false)}
                    >
                        <button
                            className="absolute top-8 right-8 p-3 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-[210]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                            }}
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={src}
                            alt={alt}
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
