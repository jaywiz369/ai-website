"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon, Calendar, ArrowRight, Clock } from "lucide-react";

export default function BlogIndexPage() {
    // Use a query for published posts. For the index, we can use collect() or paginate.
    // Given we don't have many posts yet, collect is fine.
    const posts = useQuery(api.posts.listPublished, {
        paginationOpts: { numItems: 10, cursor: null },
    });

    return (
        <div className="container mx-auto py-12 space-y-8">
            <div className="space-y-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Blog</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Insights, tutorials, and news about our premium digital products.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts === undefined ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden animate-pulse">
                            <div className="aspect-video bg-muted" />
                            <CardHeader className="space-y-4">
                                <div className="h-6 w-3/4 bg-muted rounded" />
                                <div className="h-4 w-1/4 bg-muted rounded" />
                            </CardHeader>
                            <CardContent>
                                <div className="h-4 w-full bg-muted rounded mb-2" />
                                <div className="h-4 w-2/3 bg-muted rounded" />
                            </CardContent>
                        </Card>
                    ))
                ) : posts.page.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-muted/30 rounded-lg border-2 border-dashed">
                        <p className="text-muted-foreground">No blog posts found.</p>
                    </div>
                ) : (
                    posts.page.map((post) => (
                        <Link key={post._id} href={`/blog/${post.slug}`}>
                            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border-none bg-card/50 backdrop-blur-sm group">
                                <div className="aspect-video relative bg-muted overflow-hidden">
                                    {post.mainImageUrl ? (
                                        <img
                                            src={post.mainImageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-3 tracking-wider uppercase">
                                        <Calendar className="h-3 w-3" />
                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        <span className="mx-1">•</span>
                                        <Clock className="h-3 w-3" />
                                        <span>{Math.ceil(post.content.split(" ").length / 200)}m read</span>
                                    </div>
                                    <CardTitle className="line-clamp-2 leading-tight font-display text-xl group-hover:text-primary transition-colors">
                                        {post.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center text-primary font-bold text-xs uppercase tracking-widest gap-2 group-hover:gap-3 transition-all">
                                        Read Article
                                        <ArrowRight className="h-3 w-3" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
