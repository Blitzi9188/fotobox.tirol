import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { createLead } from "@/lib/cms";
import { verifyCaptchaChallenge } from "@/lib/captcha";
import { formatMailConfigError, getMailConfigStatus } from "@/lib/mail-config";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatDateEu(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "-";

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}.${month}.${year}`;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("de-AT");
  }

  return trimmed;
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
  const textBody = [
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
  ].join("\n");

  const htmlBody = `
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
  `;

  const config = getMailConfigStatus();

  if (config.mode === "smtp" && config.missing.length === 0) {
    const transporter = nodemailer.createTransport({
      host: config.values.host,
      port: config.values.port,
      secure: config.values.secure,
      auth: {
        user: config.values.user,
        pass: config.values.pass
      }
    });

    await transporter.sendMail({
      from: config.values.from,
      to: config.values.to.split(",").map((item) => item.trim()).filter(Boolean),
      replyTo: params.email,
      subject: `Buchungsanfrage ${params.requestDate}`,
      text: textBody,
      html: htmlBody
    });
    return;
  }

  if (config.mode === "resend" && config.missing.length > 0) {
    throw new Error(formatMailConfigError() || "SMTP ist nicht vollstaendig konfiguriert und Resend ist ebenfalls nicht gesetzt.");
  }

  if (config.mode !== "resend") {
    throw new Error("Unerwarteter Mail-Modus.");
  }

  const resend = new Resend(config.values.apiKey);
  const result = await resend.emails.send({
    from: config.values.from,
    to: config.values.to.split(",").map((item) => item.trim()).filter(Boolean),
    subject: `Buchungsanfrage ${params.requestDate}`,
    replyTo: params.email,
    text: textBody,
    html: htmlBody
  });

  if (result.error) {
    throw new Error(result.error.message || "Resend Versand fehlgeschlagen.");
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const now = new Date();
  const requestDate = formatDateEu(now.toISOString().slice(0, 10));
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const eventDate = formatDateEu(String(body.eventDate || "").trim());
  const packageName = String(body.packageName || "").trim();
  const eventType = String(body.eventType || "").trim();
  const location = String(body.location || "").trim();
  const boxType = String(body.boxType || "").trim();
  const printFormat = String(body.printFormat || "").trim();
  const printText = String(body.printText || "").trim();
  const message = String(body.message || "").trim();
  const captchaToken = String(body.captchaToken || "").trim();
  const captchaAnswer = String(body.captchaAnswer || "").trim();
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

  if (!verifyCaptchaChallenge(captchaToken, captchaAnswer)) {
    return NextResponse.json({ error: "Die Sicherheitsrechnung war leider nicht korrekt. Bitte kurz neu versuchen." }, { status: 400 });
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
    console.error("Mail delivery failed:", error);
    return NextResponse.json(
      {
        error: message
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
