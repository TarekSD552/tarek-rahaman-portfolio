import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getCmsData, updateCmsPartial } from "@/lib/cms-db";
import { isRequestAuthenticated } from "@/lib/admin-auth";
import { CmsMediaItem } from "@/types/portfolio";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Strict allowed file extensions
const ALLOWED_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".ico",
  ".pdf", ".mp4", ".webm", ".ogg", ".mov", ".mp3", ".wav",
  ".aac", ".m4a", ".flac"
]);

// Explicitly blocked dangerous extensions
const BLOCKED_EXTENSIONS = new Set([
  ".php", ".phtml", ".php3", ".php4", ".php5", ".phps", ".phar",
  ".exe", ".bat", ".cmd", ".sh", ".bash", ".bin",
  ".js", ".mjs", ".cjs", ".ts", ".html", ".htm", ".xhtml",
  ".jsp", ".asp", ".aspx", ".cgi", ".pl", ".py", ".rb",
  ".svgz", ".htaccess", ".config", ".env"
]);

// Allowed MIME types
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/ico",
  "image/icon",
  "application/pdf",
  "application/octet-stream", // commonly sent for .ico or raw audio
  // Video formats
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  // Audio formats
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
  "audio/aac",
  "audio/x-m4a",
  "audio/flac",
]);

export async function GET() {
  try {
    const cms = await getCmsData();
    return NextResponse.json({ success: true, media: cms.media }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuthed = await isRequestAuthenticated(request);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Administrator session required." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();

    // 1. Extension Verification
    if (BLOCKED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, error: `Security violation: Executable or script extension "${ext}" is strictly forbidden.` },
        { status: 400 }
      );
    }

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file extension "${ext}". Allowed formats: JPG, PNG, WEBP, SVG, GIF, ICO, PDF, MP4, WEBM, MP3, WAV, AAC, FLAC.`,
        },
        { status: 400 }
      );
    }

    // 2. MIME Type Verification
    if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file MIME type "${file.type}".`,
        },
        { status: 400 }
      );
    }

    // 3. File Size Validation
    const isVideo = ext === ".mp4" || ext === ".webm" || ext === ".ogg" || ext === ".mov";
    const maxSizeBytes = isVideo ? 100 * 1024 * 1024 : 25 * 1024 * 1024; // 100MB for video, 25MB for others

    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds maximum allowed limit (${isVideo ? "100MB" : "25MB"}).`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. SVG Content Security Inspection (prevent Stored XSS via embedded scripts)
    if (ext === ".svg" || file.type === "image/svg+xml") {
      const svgContent = buffer.toString("utf-8").toLowerCase();
      const dangerousPatterns = [
        "<script",
        "javascript:",
        "onerror=",
        "onload=",
        "onclick=",
        "onmouseover=",
        "xlink:href=\"javascript:",
        "xlink:href='javascript:",
        "href=\"javascript:",
        "href='javascript:",
        "data:text/html",
        "<foreignobject",
        "<iframe",
        "<embed",
        "<object",
      ];

      const hasMaliciousPattern = dangerousPatterns.some((pattern) =>
        svgContent.includes(pattern)
      );

      if (hasMaliciousPattern) {
        return NextResponse.json(
          {
            success: false,
            error: "Security violation: Executable JavaScript or unsafe elements detected in SVG file.",
          },
          { status: 400 }
        );
      }
    }

    // Ensure uploads directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Sanitize filename to alphanumeric, dots, hyphens, and underscores only
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50);
    const uniqueName = `${Date.now()}-${baseName}${ext}`;
    const destinationPath = path.join(UPLOAD_DIR, uniqueName);

    await fs.writeFile(destinationPath, buffer);

    const relativeUrl = `/uploads/${uniqueName}`;
    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    let mediaCategory = "Documents";
    if (ext === ".ico" || [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"].includes(ext)) {
      mediaCategory = "Images";
    } else if (isVideo) {
      mediaCategory = "Videos";
    } else if ([".mp3", ".wav", ".aac", ".m4a", ".flac", ".ogg"].includes(ext)) {
      mediaCategory = "Audio";
    }

    const newMediaItem: CmsMediaItem = {
      id: `media-${Date.now()}`,
      name: `${baseName}${ext}`,
      url: relativeUrl,
      size: formattedSize,
      type: file.type || `application/${ext.replace(".", "")}`,
      category: mediaCategory,
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    const currentCms = await getCmsData();
    const updatedMedia = [newMediaItem, ...currentCms.media];
    await updateCmsPartial({ media: updatedMedia });

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        mediaItem: newMediaItem,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuthed = await isRequestAuthenticated(request);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Administrator session required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Media ID required" }, { status: 400 });
    }

    const currentCms = await getCmsData();
    const itemToDelete = currentCms.media.find((m) => m.id === id);

    if (!itemToDelete) {
      return NextResponse.json({ success: false, error: "Media item not found" }, { status: 404 });
    }

    // If file is located in /uploads/, remove safely from disk (prevent path traversal)
    if (itemToDelete.url.startsWith("/uploads/")) {
      const rawFilename = itemToDelete.url.replace("/uploads/", "");
      const safeFilename = path.basename(rawFilename);
      const fullDiskPath = path.join(UPLOAD_DIR, safeFilename);

      if (path.resolve(fullDiskPath).startsWith(path.resolve(UPLOAD_DIR))) {
        try {
          await fs.unlink(fullDiskPath);
        } catch {
          // file might already be removed, proceed
        }
      }
    }

    const updatedMedia = currentCms.media.filter((m) => m.id !== id);
    await updateCmsPartial({ media: updatedMedia });

    return NextResponse.json(
      { success: true, message: `Media ${itemToDelete.name} deleted successfully` },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
