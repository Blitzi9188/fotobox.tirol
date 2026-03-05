import { NextResponse } from "next/server";
import { createLead } from "@/lib/cms";

export async function POST(request: Request) {
  const body = await request.json();

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const eventDate = String(body.eventDate || "").trim();
  const packageName = String(body.packageName || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !packageName || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await createLead({
    name,
    email,
    phone,
    eventDate,
    packageName,
    message,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
