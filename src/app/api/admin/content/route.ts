import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readCmsContent, writeCmsContent } from "@/lib/cms";
import { verifySessionToken } from "@/lib/auth";
import { CMSContent } from "@/lib/types";

function isAuthorized() {
  const token = cookies().get("cms_admin_session")?.value;
  return verifySessionToken(token).ok;
}

export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = await readCmsContent();
    return NextResponse.json(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Inhalt konnte nicht geladen werden.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAuthorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CMSContent;
    await writeCmsContent(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Speichern fehlgeschlagen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
