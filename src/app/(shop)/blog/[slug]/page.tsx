import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { BlogContent } from "@/components/blog/blog-content";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await fetchQuery(api.posts.getBySlug, { slug });

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

    return <BlogContent post={post as any} />;
}
