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
  ".heif": "image/heif",
  ".svg": "image/svg+xml"
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

  try {
    const fileBuffer = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
