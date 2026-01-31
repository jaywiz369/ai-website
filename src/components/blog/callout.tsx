"use client";

import { Info, AlertTriangle, Lightbulb, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "note" | "tip" | "important" | "warning" | "caution";

interface CalloutProps {
    type: CalloutType;
    children: React.ReactNode;
}

const calloutConfig = {
    note: {
        icon: Info,
        title: "Note",
        className: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300",
        iconClassName: "text-blue-600 dark:text-blue-400",
    },
    tip: {
        icon: Lightbulb,
        title: "Tip",
        className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
        iconClassName: "text-emerald-600 dark:text-emerald-400",
    },
    important: {
        icon: AlertCircle,
        title: "Important",
        className: "bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300",
        iconClassName: "text-purple-600 dark:text-purple-400",
    },
    warning: {
        icon: AlertTriangle,
        title: "Warning",
        className: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300",
        iconClassName: "text-amber-600 dark:text-amber-400",
    },
    caution: {
        icon: AlertCircle,
        title: "Caution",
        className: "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300",
        iconClassName: "text-red-600 dark:text-red-400",
    },
};

export const Callout = ({ type, children }: CalloutProps) => {
    const config = calloutConfig[type];
    const Icon = config.icon;

    return (
        <div className={cn("my-6 flex gap-4 rounded-xl border p-4", config.className)}>
            <div className="mt-1 flex-shrink-0">
                <Icon className={cn("h-5 w-5", config.iconClassName)} />
            </div>
            <div className="flex-1 space-y-2">
                <div className={cn("font-bold uppercase tracking-wider text-xs", config.iconClassName)}>
                    {config.title}
                </div>
                <div className="text-sm leading-relaxed prose-p:my-0">
                    {children}
                </div>
            </div>
        </div>
    );
};
