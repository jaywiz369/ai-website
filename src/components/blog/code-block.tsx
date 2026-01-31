"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
    language: string;
    value: string;
}

export const CodeBlock = ({ language, value }: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-6 overflow-hidden rounded-2xl border border-border bg-[#282c34]">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                <span className="text-xs font-mono text-muted-foreground uppercase">{language || "text"}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-muted"
                    onClick={copyToClipboard}
                >
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
            <div className="p-4 overflow-x-auto text-sm">
                <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    customStyle={{
                        margin: 0,
                        padding: 0,
                        background: "transparent",
                    }}
                    codeTagProps={{
                        className: "font-mono leading-relaxed",
                    }}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};
