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
    console.log(`[DOWNLOAD DEBUG] Token: ${token}`);
    const downloadData = await convex.query(api.downloads.getByToken, { token });

    if ("error" in downloadData) {
      console.error(`[DOWNLOAD DEBUG] Convex Error: ${downloadData.error}`);
      return NextResponse.json({ error: downloadData.error }, { status: 400 });
    }

    const { token: tokenData, product } = downloadData;
    console.log(`[DOWNLOAD DEBUG] Found product: ${product.name}`);

    // Check if token is valid
    if (tokenData.expiresAt < Date.now()) {
      console.warn(`[DOWNLOAD DEBUG] Token expired`);
      return NextResponse.json(
        { error: "Download link has expired" },
        { status: 400 }
      );
    }

    if (tokenData.downloadCount >= tokenData.maxDownloads) {
      console.warn(`[DOWNLOAD DEBUG] Download limit reached`);
      return NextResponse.json(
        { error: "Download limit reached" },
        { status: 400 }
      );
    }

    // Get file URL from Convex storage
    if (product.fileId) {
      console.log(`[DOWNLOAD DEBUG] Fetching file URL for fileId: ${product.fileId}`);
      const fileUrl = await convex.query(api.downloads.getFileUrl, {
        fileId: product.fileId,
      });

      if (fileUrl) {
        console.log(`[DOWNLOAD DEBUG] File URL: ${fileUrl}`);
        // Fetch the file from the storage URL
        try {
          const fileResponse = await fetch(fileUrl);

          if (!fileResponse.ok) {
            console.error(`[DOWNLOAD DEBUG] Fetch failed: ${fileResponse.status} ${fileResponse.statusText}`);
            throw new Error("Failed to fetch file from storage");
          }

          console.log(`[DOWNLOAD DEBUG] Fetch successful. Size: ${fileResponse.headers.get("content-length")}`);

          // Only increment download count if we successfully reached the file
          await convex.mutation(api.downloads.incrementDownloadCount, { token });

          // Get file data
          const blob = await fileResponse.blob();

          // Return the file for streaming/download
          // Use the stored filename if available, otherwise generate a fallback
          const filename = product.fileName
            ? product.fileName
            : `${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${product.type === "template" ? "pdf" : "zip"}`;
          console.log(`[DOWNLOAD DEBUG] Serving file: ${filename}`);

          return new NextResponse(blob, {
            headers: {
              "Content-Type": fileResponse.headers.get("Content-Type") || "application/octet-stream",
              "Content-Disposition": `attachment; filename="${filename}"`,
            },
          });
        } catch (e) {
          console.error(`[DOWNLOAD DEBUG] Processing error:`, e);
          return NextResponse.json({ error: "Processing failed" }, { status: 500 });
        }
      } else {
        console.error(`[DOWNLOAD DEBUG] No file URL returned from Convex`);
      }
    } else {
      console.warn(`[DOWNLOAD DEBUG] Product has no fileId`);
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
