import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { createLead } from "@/lib/cms";
import { verifyCaptchaChallenge } from "@/lib/captcha";
import { formatMailConfigError, getMailConfigStatus } from "@/lib/mail-config";

const REQUEST_WINDOW_MS = 10 * 60 * 1000;
const EMAIL_WINDOW_MS = 30 * 60 * 1000;
const MIN_FORM_FILL_MS = 3500;
const MAX_REQUESTS_PER_IP = 5;
const MAX_REQUESTS_PER_EMAIL = 3;

const ipRequestStore = new Map<string, number[]>();
const emailRequestStore = new Map<string, number[]>();

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

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";

  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function pruneTimestamps(store: Map<string, number[]>, key: string, windowMs: number, now: number) {
  const recent = (store.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
  store.set(key, recent);
  return recent;
}

function registerRequest(store: Map<string, number[]>, key: string, now: number) {
  const entries = store.get(key) || [];
  entries.push(now);
  store.set(key, entries);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isSpamContent(values: string[]) {
  const combined = values.join("\n").toLowerCase();
  const urlMatches = combined.match(/https?:\/\//g) || [];
  if (urlMatches.length >= 2) return true;

  const suspiciousPatterns = [
    /\bseo\b/,
    /\bbacklinks?\b/,
    /\bguest post\b/,
    /\bcasino\b/,
    /\bcrypto\b/,
    /\btelegram\b/,
    /\bwhatsapp\b/,
    /\bviagra\b/,
    /\bloan\b/,
    /\bforex\b/
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(combined));
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
    throw new Error(formatMailConfigError() || "SMTP ist nicht vollständig konfiguriert und Resend ist ebenfalls nicht gesetzt.");
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
  const website = String(body.website || "").trim();
  const startedAt = Number(body.startedAt || 0);
  const captchaToken = String(body.captchaToken || "").trim();
  const captchaAnswer = String(body.captchaAnswer || "").trim();
  const clientIp = getClientIp(request);
  const nowMs = now.getTime();
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

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Bitte eine gültige E-Mail Adresse eingeben." }, { status: 400 });
  }

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (startedAt > 0 && nowMs - startedAt < MIN_FORM_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  if (isSpamContent([name, email, location, printText, message])) {
    return NextResponse.json({ ok: true });
  }

  if (clientIp !== "unknown") {
    const recentIpRequests = pruneTimestamps(ipRequestStore, clientIp, REQUEST_WINDOW_MS, nowMs);
    if (recentIpRequests.length >= MAX_REQUESTS_PER_IP) {
      return NextResponse.json({ error: "Zu viele Anfragen in kurzer Zeit. Bitte versuche es in ein paar Minuten erneut." }, { status: 429 });
    }
    registerRequest(ipRequestStore, clientIp, nowMs);
  }

  const emailKey = email.toLowerCase();
  const recentEmailRequests = pruneTimestamps(emailRequestStore, emailKey, EMAIL_WINDOW_MS, nowMs);
  if (recentEmailRequests.length >= MAX_REQUESTS_PER_EMAIL) {
    return NextResponse.json({ error: "Für diese E-Mail Adresse wurden gerade bereits mehrere Anfragen gesendet. Bitte versuche es später erneut." }, { status: 429 });
  }
  registerRequest(emailRequestStore, emailKey, nowMs);

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
