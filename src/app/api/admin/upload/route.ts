import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { getCmsUploadsDir, getCmsUploadsPublicBase } from "@/lib/storagePaths";

function isAuthorized() {
  const token = cookies().get("cms_admin_session")?.value;
  return verifySessionToken(token).ok;
}

function safeName(fileName: string): string {
  return fileName.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
}

const ALLOWED_IMAGE_MIME_TYPES: Record<string, string> = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heif"
};
const MAX_UPLOAD_SIZE_MB = Number(process.env.CMS_UPLOAD_MAX_MB || "30");
const uploadsDir = getCmsUploadsDir();
const uploadsPublicBase = getCmsUploadsPublicBase();

function isRetryableFsError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const code = (error as NodeJS.ErrnoException).code;
  return code === "ETIMEDOUT" || code === "EBUSY" || code === "EPERM";
}

async function withFsRetry<T>(operation: () => Promise<T>, attempts = 4): Promise<T> {
  let lastError: unknown;
  for (let index = 0; index < attempts; index += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isRetryableFsError(error) || index === attempts - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 120 * (index + 1)));
    }
  }

  throw lastError;
}

export async function POST(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const mimeType = (file.type || "").toLowerCase();
    const extByMime = ALLOWED_IMAGE_MIME_TYPES[mimeType];
    const extByName = safeName(file.name).split(".").pop() || "";
    const extension = extByMime || (["jpg", "jpeg", "png", "webp", "gif", "avif", "heic", "heif"].includes(extByName) ? extByName : "");

    if (!extension) {
      return NextResponse.json(
        { error: "Nur JPG, PNG, WEBP, GIF, AVIF oder HEIC sind erlaubt." },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Datei zu groß. Maximal ${MAX_UPLOAD_SIZE_MB}MB erlaubt.` },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await withFsRetry(() => fs.mkdir(uploadsDir, { recursive: true }));

    const originalBaseName = safeName(file.name).replace(/\.[a-z0-9]+$/i, "");
    const fileName = `${Date.now()}-${crypto.randomUUID()}-${originalBaseName}.${extension}`;
    const fullPath = path.join(uploadsDir, fileName);

    await withFsRetry(() => fs.writeFile(fullPath, buffer));

    return NextResponse.json({
      ok: true,
      url: `${uploadsPublicBase}/${fileName}`
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload fehlgeschlagen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
