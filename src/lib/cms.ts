import { promises as fs } from "fs";
import path from "path";
import { CMSContent, ContactLead } from "@/lib/types";

const dataDirectory = process.env.CMS_DATA_DIR
  ? path.resolve(process.env.CMS_DATA_DIR)
  : path.join(process.cwd(), "data");
const seedCmsFilePath = path.join(process.cwd(), "data", "cms-content.json");
const cmsFilePath = path.join(dataDirectory, "cms-content.json");
const contactFilePath = path.join(dataDirectory, "contact-leads.json");

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

  try {
    await fs.access(contactFilePath);
  } catch {
    await withFsRetry(() => fs.writeFile(contactFilePath, "[]", "utf-8"));
  }
}

export async function readCmsContent(): Promise<CMSContent> {
  await ensureCmsStorage();
  const raw = await fs.readFile(cmsFilePath, "utf-8");
  return JSON.parse(raw) as CMSContent;
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
