"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/image-upload";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostForm({ postId }: { postId?: string }) {
    const router = useRouter();
    const post = useQuery(api.posts.getById, postId ? { id: postId as Id<"posts"> } : "skip");
    const createPost = useMutation(api.posts.create);
    const updatePost = useMutation(api.posts.update);

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState(post?.title || "");
    const [slug, setSlug] = useState(post?.slug || "");
    const [excerpt, setExcerpt] = useState(post?.excerpt || "");
    const [content, setContent] = useState(post?.content || "");
    const [mainImageUrl, setMainImageUrl] = useState(post?.mainImageUrl || "");
    const [mainImageId, setMainImageId] = useState<Id<"_storage"> | undefined>(post?.mainImageId);
    const [isPublished, setIsPublished] = useState(post?.isPublished || false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const generateUploadUrl = useMutation(api.downloads.generateUploadUrl);
    const getStorageUrl = useMutation(api.downloads.getStorageUrl);


    // Sync state if post loads (for edit mode)
    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setSlug(post.slug);
            setExcerpt(post.excerpt);
            setContent(post.content);
            setMainImageId(post.mainImageId);
            setMainImageUrl(post.mainImageUrl || "");
            setIsPublished(post.isPublished);
        }
    }, [post]);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!postId) {
            setSlug(generateSlug(newTitle));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let finalImageId = mainImageId;
            let finalImageUrl = mainImageUrl;

            // Upload new image if selected
            if (selectedFile) {
                const uploadUrl = await generateUploadUrl();
                const response = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": selectedFile.type },
                    body: selectedFile,
                });

                if (response.ok) {
                    const { storageId } = await response.json();
                    finalImageId = storageId as Id<"_storage">;
                    const storageUrl = await getStorageUrl({ storageId });
                    if (storageUrl) {
                        finalImageUrl = storageUrl;
                    }
                }
            }

            if (postId) {
                await updatePost({
                    id: postId as Id<"posts">,
                    title,
                    slug,
                    excerpt,
                    content,
                    mainImageId: finalImageId,
                    mainImageUrl: finalImageUrl,
                    isPublished,
                });
                toast.success("Post updated successfully");
            } else {
                await createPost({
                    title,
                    slug,
                    excerpt,
                    content,
                    mainImageId: finalImageId,
                    mainImageUrl: finalImageUrl,
                    isPublished,
                });
                toast.success("Post created successfully");
                router.push("/admin/posts");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (postId && !post) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/posts">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {postId ? "Edit Post" : "Create Post"}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Post Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="The future of digital products"
                                    value={title}
                                    onChange={handleTitleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    placeholder="the-future-of-digital-products"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea
                                    id="excerpt"
                                    placeholder="Brief summary for SEO..."
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content (Markdown)</Label>
                                <Textarea
                                    id="content"
                                    className="min-h-[400px] font-mono"
                                    placeholder="# Start writing..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Featured Image</Label>
                                <ImageUpload
                                    value={mainImageUrl}
                                    onChange={(url) => setMainImageUrl(url)}
                                    onFileSelect={(file) => setSelectedFile(file)}
                                    onClear={() => {
                                        setMainImageId(undefined);
                                        setMainImageUrl("");
                                        setSelectedFile(null);
                                    }}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="published"
                                    checked={isPublished}
                                    onCheckedChange={(checked) => setIsPublished(!!checked)}
                                />
                                <Label htmlFor="published">Published</Label>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {postId ? "Update Post" : "Publish Post"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
