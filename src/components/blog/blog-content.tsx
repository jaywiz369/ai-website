"use client";

import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, ArrowLeft, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";
import { Callout } from "@/components/blog/callout";
import { ImageLightbox } from "@/components/blog/image-lightbox";
import { VideoEmbed } from "@/components/blog/video-embed";
import { GlossaryTooltip } from "@/components/blog/glossary-tooltip";
import remarkMath from "remark-math";
import remarkFootnotes from "remark-footnotes";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// Dynamic imports for heavy components
const Mermaid = dynamic(() => import("@/components/blog/mermaid").then(m => m.Mermaid), { ssr: false });
const CodeBlock = dynamic(() => import("@/components/blog/code-block").then(m => m.CodeBlock), { ssr: false });
const ReadingProgressBar = dynamic(() => import("@/components/blog/reading-progress-bar").then(m => m.ReadingProgressBar), { ssr: false });
const TableOfContents = dynamic(() => import("@/components/blog/table-of-contents").then(m => m.TableOfContents), { ssr: false });

interface Post {
    title: string;
    content: string;
    createdAt: number;
    mainImageUrl?: string;
}

export function BlogContent({ post }: { post: Post }) {
    return (
        <div className="relative">
            <ReadingProgressBar />
            <article className="container py-20 max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="flex-1 max-w-3xl border-r border-border/50 pr-0 lg:pr-12">
                        <Button asChild variant="ghost" className="mb-8">
                            <Link href="/blog">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Blog
                            </Link>
                        </Button>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                                    {post.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        {Math.ceil(post.content.split(" ").length / 200)} min read
                                    </div>
                                    <div className="flex items-center gap-2 font-medium text-foreground">
                                        <User className="h-4 w-4" />
                                        Admin
                                    </div>
                                </div>
                            </div>

                            <div className="aspect-video relative bg-muted rounded-2xl overflow-hidden border border-border shadow-2xl">
                                {post.mainImageUrl ? (
                                    <img
                                        src={post.mainImageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                                        <span className="text-muted-foreground/30 font-display text-4xl">
                                            {post.title}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none font-serif prose-headings:font-sans prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline prose-img:rounded-2xl prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:pr-4 prose-table:text-sm">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath, remarkFootnotes]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        h1: ({ children }) => <h1 id={String(children).toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}>{children}</h1>,
                                        h2: ({ children }) => <h2 id={String(children).toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}>{children}</h2>,
                                        h3: ({ children }) => <h3 id={String(children).toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}>{children}</h3>,
                                        p: ({ children }) => {
                                            const hasBlockElement = React.Children.toArray(children).some((child: any) => {
                                                return child.type === ImageLightbox || child.type === VideoEmbed || child.type === Mermaid || child.type === CodeBlock;
                                            });

                                            if (hasBlockElement) {
                                                return <>{children}</>;
                                            }
                                            return <p>{children}</p>;
                                        },
                                        img: ({ src, alt }) => {
                                            if (alt === "youtube" || alt === "loom") {
                                                return <VideoEmbed url={src || ""} type={alt} />;
                                            }
                                            return <ImageLightbox src={src || ""} alt={alt} />;
                                        },
                                        a: ({ href, children }) => {
                                            if (href === "glossary") {
                                                return <GlossaryTooltip term={String(children)} />;
                                            }
                                            return (
                                                <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                                    {children}
                                                </a>
                                            );
                                        },
                                        code({ node, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || "");
                                            const isMermaid = match?.[1] === "mermaid";

                                            if (isMermaid) {
                                                return <Mermaid chart={String(children).replace(/\n$/, "")} />;
                                            }

                                            if (match) {
                                                return <CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")} />;
                                            }

                                            return (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        blockquote({ children }) {
                                            const text = Array.isArray(children)
                                                ? children.map((c: any) => c.props?.children).join("")
                                                : (children as any)?.props?.children;

                                            const match = typeof text === "string" && text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

                                            if (match) {
                                                const type = match[1].toLowerCase() as any;
                                                const filteredChildren = React.Children.map(children, (child: any) => {
                                                    if (child.props?.children && typeof child.props.children === "string") {
                                                        const newContent = child.props.children.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, "");
                                                        if (!newContent) return null;
                                                        return React.cloneElement(child, { ...child.props, children: newContent });
                                                    }
                                                    return child;
                                                });

                                                return <Callout type={type}>{filteredChildren}</Callout>;
                                            }

                                            return <blockquote>{children}</blockquote>;
                                        },
                                    }}
                                >
                                    {post.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24 space-y-8">
                            <TableOfContents content={post.content} />
                        </div>
                    </aside>
                </div>
            </article>
        </div>
    );
}
