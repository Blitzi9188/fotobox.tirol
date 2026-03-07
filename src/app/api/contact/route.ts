import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createLead } from "@/lib/cms";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendLeadMail(params: {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  packageName: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.RESEND_TO;

  if (!apiKey || !from || !to) return;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: to.split(",").map((item) => item.trim()).filter(Boolean),
    subject: `Neue Anfrage von ${params.name}`,
    replyTo: params.email,
    text: [
      "Neue Buchungsanfrage",
      `Name: ${params.name}`,
      `E-Mail: ${params.email}`,
      `Telefon: ${params.phone || "-"}`,
      `Event-Datum: ${params.eventDate || "-"}`,
      `Paket: ${params.packageName}`,
      `Nachricht: ${params.message}`
    ].join("\n"),
    html: `
      <h2>Neue Buchungsanfrage</h2>
      <p><strong>Name:</strong> ${escapeHtml(params.name)}</p>
      <p><strong>E-Mail:</strong> ${escapeHtml(params.email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(params.phone || "-")}</p>
      <p><strong>Event-Datum:</strong> ${escapeHtml(params.eventDate || "-")}</p>
      <p><strong>Paket:</strong> ${escapeHtml(params.packageName)}</p>
      <p><strong>Nachricht:</strong><br/>${escapeHtml(params.message).replace(/\n/g, "<br/>")}</p>
    `
  });
}

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

  try {
    await sendLeadMail({
      name,
      email,
      phone,
      eventDate,
      packageName,
      message
    });
  } catch (error) {
    console.error("Resend mail failed:", error);
  }

  return NextResponse.json({ ok: true });
}
