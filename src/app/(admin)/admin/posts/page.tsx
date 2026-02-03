"use client";

import { useQuery, useMutation } from "convex/react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

export default function AdminPostsPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const posts = useQuery(api.posts.listAll);
    const removePost = useMutation(api.posts.remove);

    const handleDelete = async (id: Id<"posts">) => {
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                await removePost({ id });
                toast.success("Post deleted successfully");
            } catch (error) {
                toast.error("Failed to delete post");
            }
        }
    };

    const filteredPosts = posts?.filter((post) =>
        post.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold">Blog Posts</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your SEO content and articles
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/posts/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Post
                    </Link>
                </Button>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search posts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 max-w-md"
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Title</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Slug</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts === undefined ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td>
                                    </tr>
                                ) : filteredPosts?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">No posts found.</td>
                                    </tr>
                                ) : (
                                    filteredPosts?.map((post) => (
                                        <tr key={post._id} className="border-b border-border last:border-0">
                                            <td className="p-4 font-medium">{post.title}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{post.slug}</td>
                                            <td className="p-4">
                                                <Badge variant={post.isPublished ? "default" : "secondary"}>
                                                    {post.isPublished ? "Published" : "Draft"}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/posts/${post._id}`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(post._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
