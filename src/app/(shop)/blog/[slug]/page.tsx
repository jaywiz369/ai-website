"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { use } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, ArrowLeft, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const post = useQuery(api.posts.getBySlug, { slug });

    if (post === undefined) {
        return (
            <div className="container py-20 space-y-8 animate-pulse">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-12 w-3/4 bg-muted rounded" />
                <div className="h-6 w-1/4 bg-muted rounded" />
                <div className="aspect-video w-full bg-muted rounded-xl" />
                <div className="space-y-4">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container py-20 text-center space-y-4">
                <h1 className="text-4xl font-bold">Post Not Found</h1>
                <p className="text-muted-foreground text-lg">
                    The article you are looking for does not exist or has been removed.
                </p>
                <Button asChild variant="outline">
                    <Link href="/blog">Back to Blog</Link>
                </Button>
            </div>
        );
    }

    return (
        <article className="container py-20 max-w-3xl mx-auto space-y-12">
            <div className="max-w-[750px] mx-auto space-y-12">

                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>
                </Button>

                <div className="space-y-6">
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
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </article>

    );
}
