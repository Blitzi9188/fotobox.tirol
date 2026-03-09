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
  requestDate: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  packageName: string;
  eventType: string;
  location: string;
  boxType: string;
  printFormat: string;
  printText: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.RESEND_TO || "info@fotobox.tirol";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY fehlt.");
  }
  if (!from) {
    throw new Error("RESEND_FROM fehlt.");
  }
  if (!to) {
    throw new Error("RESEND_TO fehlt.");
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to: to.split(",").map((item) => item.trim()).filter(Boolean),
    subject: `Buchungsanfrage ${params.requestDate}`,
    replyTo: params.email,
    text: [
      "Neue Buchungsanfrage",
      `Anfrage-Datum: ${params.requestDate}`,
      `Name: ${params.name}`,
      `E-Mail: ${params.email}`,
      `Telefon: ${params.phone || "-"}`,
      `Event-Datum: ${params.eventDate || "-"}`,
      `Eventart: ${params.eventType || "-"}`,
      `Ort: ${params.location || "-"}`,
      `Paket: ${params.packageName}`,
      `Fotobox: ${params.boxType || "-"}`,
      `Format: ${params.printFormat || "-"}`,
      `Aufdruck-Wunsch: ${params.printText || "-"}`,
      `Zusatznachricht: ${params.message || "-"}`
    ].join("\n"),
    html: `
      <h2>Neue Buchungsanfrage</h2>
      <p><strong>Anfrage-Datum:</strong> ${escapeHtml(params.requestDate)}</p>
      <p><strong>Name:</strong> ${escapeHtml(params.name)}</p>
      <p><strong>E-Mail:</strong> ${escapeHtml(params.email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(params.phone || "-")}</p>
      <p><strong>Event-Datum:</strong> ${escapeHtml(params.eventDate || "-")}</p>
      <p><strong>Eventart:</strong> ${escapeHtml(params.eventType || "-")}</p>
      <p><strong>Ort:</strong> ${escapeHtml(params.location || "-")}</p>
      <p><strong>Paket:</strong> ${escapeHtml(params.packageName)}</p>
      <p><strong>Fotobox:</strong> ${escapeHtml(params.boxType || "-")}</p>
      <p><strong>Format:</strong> ${escapeHtml(params.printFormat || "-")}</p>
      <p><strong>Aufdruck-Wunsch:</strong> ${escapeHtml(params.printText || "-")}</p>
      <p><strong>Zusatznachricht:</strong><br/>${escapeHtml(params.message || "-").replace(/\n/g, "<br/>")}</p>
    `
  });

  if (result.error) {
    throw new Error(result.error.message || "Resend Versand fehlgeschlagen.");
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const now = new Date();
  const requestDate = now.toISOString().slice(0, 10);

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const eventDate = String(body.eventDate || "").trim();
  const packageName = String(body.packageName || "").trim();
  const eventType = String(body.eventType || "").trim();
  const location = String(body.location || "").trim();
  const boxType = String(body.boxType || "").trim();
  const printFormat = String(body.printFormat || "").trim();
  const printText = String(body.printText || "").trim();
  const message = String(body.message || "").trim();
  const mergedSummary = [
    `Anfrage-Datum: ${requestDate}`,
    `Eventart: ${eventType || "-"}`,
    `Ort: ${location || "-"}`,
    `Fotobox: ${boxType || "-"}`,
    `Format: ${printFormat || "-"}`,
    `Aufdruck-Wunsch: ${printText || "-"}`,
    `Zusatznachricht: ${message || "-"}`
  ].join("\n");

  if (!name || !email || !packageName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await createLead({
    name,
    email,
    phone,
    eventDate,
    packageName,
    message: mergedSummary,
    createdAt: now.toISOString()
  });

  try {
    await sendLeadMail({
      requestDate,
      name,
      email,
      phone,
      eventDate,
      packageName,
      eventType,
      location,
      boxType,
      printFormat,
      printText,
      message
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "E-Mail Versand fehlgeschlagen.";
    console.error("Resend mail failed:", error);
    return NextResponse.json(
      {
        error: `${message} Bitte RESEND_API_KEY, RESEND_FROM und RESEND_TO in Railway prüfen.`
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
