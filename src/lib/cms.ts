import { promises as fs } from "fs";
import path from "path";
import { CMSContent, ContactLead } from "@/lib/types";
import { getCmsDataDir } from "@/lib/storagePaths";

const dataDirectory = getCmsDataDir();
const seedCmsFilePath = path.join(process.cwd(), "data", "cms-content.json");
const cmsFilePath = path.join(dataDirectory, "cms-content.json");
const contactFilePath = path.join(dataDirectory, "contact-leads.json");
const BROKEN_HERO_URL = "https://fotoboxtirol-production.up.railway.app/uploads/1772911775-hero-fotobox-final.png";
const WORKING_HERO_URL = "/uploads/hero-optimized.jpg";

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

async function ensureCmsStorage(): Promise<void> {
  await withFsRetry(() => fs.mkdir(dataDirectory, { recursive: true }));

  async function readJsonOrNull<T>(filePath: string): Promise<T | null> {
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const trimmed = raw.trim();
      if (!trimmed) return null;
      return JSON.parse(trimmed) as T;
    } catch {
      return null;
    }
  }

  try {
    await fs.access(cmsFilePath);
  } catch {
    let seedPayload = "{}";
    try {
      seedPayload = await fs.readFile(seedCmsFilePath, "utf-8");
    } catch {
      seedPayload = "{}";
    }
    await withFsRetry(() => fs.writeFile(cmsFilePath, seedPayload, "utf-8"));
  }

  const cmsPayload = await readJsonOrNull<CMSContent>(cmsFilePath);
  if (!cmsPayload) {
    let seedPayload = "{}";
    try {
      seedPayload = await fs.readFile(seedCmsFilePath, "utf-8");
      JSON.parse(seedPayload);
    } catch {
      seedPayload = "{}";
    }
    await withFsRetry(() => fs.writeFile(cmsFilePath, seedPayload, "utf-8"));
  }

  try {
    await fs.access(contactFilePath);
  } catch {
    await withFsRetry(() => fs.writeFile(contactFilePath, "[]", "utf-8"));
  }

  const contactPayload = await readJsonOrNull<ContactLead[]>(contactFilePath);
  if (!contactPayload) {
    await withFsRetry(() => fs.writeFile(contactFilePath, "[]", "utf-8"));
  }
}

export async function readCmsContent(): Promise<CMSContent> {
  await ensureCmsStorage();
  const raw = await fs.readFile(cmsFilePath, "utf-8");
  try {
    const trimmed = raw.trim();
    if (!trimmed) throw new Error("Empty CMS payload.");
    const parsed = JSON.parse(trimmed) as CMSContent;
    if (parsed?.hero?.imageUrl === BROKEN_HERO_URL) {
      const patched: CMSContent = {
        ...parsed,
        hero: {
          ...parsed.hero,
          imageUrl: WORKING_HERO_URL
        }
      };
      await writeCmsContent(patched);
      return patched;
    }
    return parsed;
  } catch {
    const seedPayload = await fs.readFile(seedCmsFilePath, "utf-8").catch(() => "{}");
    await withFsRetry(() => fs.writeFile(cmsFilePath, seedPayload, "utf-8"));
    return JSON.parse(seedPayload) as CMSContent;
  }
}

export async function writeCmsContent(content: CMSContent): Promise<void> {
  await ensureCmsStorage();
  const payload = JSON.stringify(content, null, 2);
  const tempPath = `${cmsFilePath}.tmp`;

  await withFsRetry(() => fs.writeFile(tempPath, payload, "utf-8"));
  await withFsRetry(() => fs.rename(tempPath, cmsFilePath));
}

export async function createLead(lead: ContactLead): Promise<void> {
  await ensureCmsStorage();
  let leads: ContactLead[] = [];
  try {
    const raw = await fs.readFile(contactFilePath, "utf-8");
    leads = JSON.parse(raw) as ContactLead[];
  } catch {
    leads = [];
  }

  leads.unshift(lead);
  await withFsRetry(() => fs.writeFile(contactFilePath, JSON.stringify(leads, null, 2), "utf-8"));
}

export async function resetCmsContentFromSeed(): Promise<{ backupPath?: string }> {
  await ensureCmsStorage();

  const currentRaw = await fs.readFile(cmsFilePath, "utf-8");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(dataDirectory, `cms-content.backup.${timestamp}.json`);
  await withFsRetry(() => fs.writeFile(backupPath, currentRaw, "utf-8"));

  const seedPayload = await fs.readFile(seedCmsFilePath, "utf-8");
  const parsed = JSON.parse(seedPayload) as CMSContent;
  await writeCmsContent(parsed);

  return { backupPath };
}
