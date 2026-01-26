import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    // Validate token and get download info
    const downloadData = await convex.query(api.downloads.getByToken, { token });

    if ("error" in downloadData) {
      return NextResponse.json({ error: downloadData.error }, { status: 400 });
    }

    const { token: tokenData, product } = downloadData;

    // Check if token is valid
    if (tokenData.expiresAt < Date.now()) {
      return NextResponse.json(
        { error: "Download link has expired" },
        { status: 400 }
      );
    }

    if (tokenData.downloadCount >= tokenData.maxDownloads) {
      return NextResponse.json(
        { error: "Download limit reached" },
        { status: 400 }
      );
    }

    // Increment download count
    await convex.mutation(api.downloads.incrementDownloadCount, { token });

    // Get file URL from Convex storage
    if (product.fileId) {
      const fileUrl = await convex.query(api.downloads.getFileUrl, {
        fileId: product.fileId,
      });

      if (fileUrl) {
        // Redirect to the file URL
        return NextResponse.redirect(fileUrl);
      }
    }

    // If no file, return error
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Download failed" },
      { status: 500 }
    );
  }
}
