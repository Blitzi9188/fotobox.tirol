import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import { resetCmsContentFromSeed } from "@/lib/cms";

function isAuthorized() {
  const token = cookies().get("cms_admin_session")?.value;
  return verifySessionToken(token).ok;
}

export async function POST() {
  if (!isAuthorized()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await resetCmsContentFromSeed();
    return NextResponse.json({ ok: true, backupPath: result.backupPath });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reset fehlgeschlagen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
