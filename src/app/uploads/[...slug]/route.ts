import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getCmsUploadsDir } from "@/lib/storagePaths";

const uploadsDir = getCmsUploadsDir();

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".heic": "image/heic",
  ".heif": "image/heif"
};

function isSafeSegment(segment: string) {
  return Boolean(segment) && !segment.includes("..") && !segment.includes("/") && !segment.includes("\\");
}

export async function GET(_: Request, context: { params: { slug: string[] } }) {
  const slug = context.params?.slug || [];
  if (slug.length === 0 || !slug.every(isSafeSegment)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filePath = path.join(uploadsDir, ...slug);

  if (!filePath.startsWith(uploadsDir)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || "application/octet-stream";

  // Try CMS uploads dir first, then fall back to public/uploads/ for static assets in git
  const candidates = [filePath, path.join(process.cwd(), "public", "uploads", ...slug)];

  for (const candidate of candidates) {
    try {
      const fileBuffer = await fs.readFile(candidate);
      return new NextResponse(fileBuffer, {
        headers: {
          "content-type": contentType,
          "cache-control": "public, max-age=31536000, immutable"
        }
      });
    } catch {
      // try next candidate
    }
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
