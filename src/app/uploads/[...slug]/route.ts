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

  // Build candidate list: CMS dir, public/uploads fallback, and .png↔.jpg alias
  const publicUploadsPath = path.join(process.cwd(), "public", "uploads", ...slug);
  const candidates: string[] = [filePath];
  if (publicUploadsPath !== filePath) candidates.push(publicUploadsPath);

  // If stored as .png but only .jpg exists (or vice versa), try the alias
  const PNG_TO_JPG: Record<string, string> = { ".png": ".jpg", ".jpg": ".png" };
  const aliasExt = PNG_TO_JPG[extension];
  if (aliasExt) {
    const slugAlias = [...slug.slice(0, -1), slug[slug.length - 1].replace(/\.[^.]+$/, aliasExt)];
    candidates.push(path.join(uploadsDir, ...slugAlias));
    const aliasPublic = path.join(process.cwd(), "public", "uploads", ...slugAlias);
    if (!candidates.includes(aliasPublic)) candidates.push(aliasPublic);
  }

  // Each candidate paired with its content-type (alias candidates use the alias extension)
  const aliasContentType = aliasExt ? (MIME_TYPES[aliasExt] || "application/octet-stream") : contentType;
  const candidateTypes = candidates.map((c, i) => (i < 2 ? contentType : aliasContentType));

  for (let i = 0; i < candidates.length; i++) {
    try {
      const fileBuffer = await fs.readFile(candidates[i]);
      return new NextResponse(fileBuffer, {
        headers: {
          "content-type": candidateTypes[i],
          "cache-control": "public, max-age=31536000, immutable"
        }
      });
    } catch {
      // try next candidate
    }
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
