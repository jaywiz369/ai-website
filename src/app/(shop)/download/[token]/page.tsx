"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { Download, AlertCircle, Clock, FileText } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DownloadPage() {
  const params = useParams();
  const token = params.token as string;

  const downloadData = useQuery(api.downloads.getByToken, { token });
  const incrementDownload = useMutation(api.downloads.incrementDownloadCount);

  const handleDownload = async () => {
    if (!downloadData || "error" in downloadData) return;

    try {
      // Increment download count
      await incrementDownload({ token });

      // If there's a file stored in Convex, get its URL
      if (downloadData.product.fileId) {
        // In production, you would fetch the file URL from Convex storage
        // For now, we'll show a placeholder message
        alert("Download started! Check your downloads folder.");
      } else {
        // For demo purposes
        alert("This is a demo. In production, the file would download here.");
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (downloadData === undefined) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24">
        <div className="text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  if ("error" in downloadData) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold">Download Unavailable</h1>
          <p className="mt-2 text-muted-foreground">{downloadData.error}</p>
          <Button asChild className="mt-8">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { token: tokenData, product } = downloadData;
  const remainingDownloads = tokenData.maxDownloads - tokenData.downloadCount;
  const expiresAt = new Date(tokenData.expiresAt);
  const isExpired = tokenData.expiresAt < Date.now();
  const noDownloadsLeft = remainingDownloads <= 0;

  if (isExpired || noDownloadsLeft) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold">
            {isExpired ? "Link Expired" : "Download Limit Reached"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isExpired
              ? "This download link has expired."
              : "You've reached the maximum number of downloads for this file."}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Need help? Contact support for assistance.
          </p>
          <Button asChild className="mt-8">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-24">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <FileText className="h-8 w-8 text-accent" />
        </div>
        <h1 className="mt-4 font-serif text-2xl">{product.name}</h1>
        <p className="mt-2 text-muted-foreground">{product.type}</p>
      </div>

      <div className="mt-8 border border-border p-6">
        <Button
          size="lg"
          variant="accent"
          className="w-full"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-5 w-5" />
          Download File
        </Button>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Downloads remaining
            </span>
            <span className="font-medium text-foreground">
              {remainingDownloads} of {tokenData.maxDownloads}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Expires
            </span>
            <span className="font-medium text-foreground">
              {expiresAt.toLocaleDateString()} at{" "}
              {expiresAt.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Having trouble? Contact us at support@proptemplates.com
      </p>
    </div>
  );
}
