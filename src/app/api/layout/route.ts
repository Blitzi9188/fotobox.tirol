import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { getMailConfigStatus, formatMailConfigError } from "@/lib/mail-config";

export const runtime = "nodejs";

const MAX_FILE_MB = 30;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
  "image/svg+xml": "svg"
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function hasValue(value?: string) {
  return Boolean(value && value.trim());
}

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return Boolean(
    value &&
      typeof value !== "string" &&
      typeof (value as File).arrayBuffer === "function" &&
      typeof (value as File).name === "string"
  );
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const eventDate = String(form.get("eventDate") || "").trim();
  const printFormat = String(form.get("printFormat") || "").trim();
  const printText = String(form.get("printText") || "").trim();
  const colors = String(form.get("colors") || "").trim();
  const message = String(form.get("message") || "").trim();
  const honeypot = String(form.get("company") || "").trim(); // Spam-Falle

  // Einfache Validierung
  if (honeypot) {
    return NextResponse.json({ ok: true }); // Bot: still schlucken
  }
  if (!name || !email) {
    return NextResponse.json({ error: "Bitte Name und E-Mail angeben." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Bitte eine gültige E-Mail angeben." }, { status: 400 });
  }
  if (!printFormat) {
    return NextResponse.json({ error: "Bitte ein Format auswählen." }, { status: 400 });
  }

  // Datei prüfen (optional, aber wenn vorhanden: validieren)
  const fileEntry = form.get("file");
  const attachments: { filename: string; content: Buffer }[] = [];
  if (isUploadFile(fileEntry)) {
    const ext = ALLOWED_TYPES[fileEntry.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Dateityp nicht erlaubt. Bitte JPG, PNG, PDF, SVG oder GIF hochladen." },
        { status: 400 }
      );
    }
    if (fileEntry.size > MAX_FILE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Datei zu groß (max. ${MAX_FILE_MB} MB).` },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await fileEntry.arrayBuffer());
    const safeBase = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "kunde";
    attachments.push({ filename: `layout-${safeBase}.${ext}`, content: buffer });
  }

  const htmlLines = [
    `<h2>Neue Layout-Einreichung</h2>`,
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>`,
    hasValue(phone) ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : "",
    hasValue(eventDate) ? `<p><strong>Event-Datum:</strong> ${escapeHtml(eventDate)}</p>` : "",
    `<p><strong>Format:</strong> ${escapeHtml(printFormat)}</p>`,
    hasValue(printText) ? `<p><strong>Text fürs Layout:</strong> ${escapeHtml(printText)}</p>` : "",
    hasValue(colors) ? `<p><strong>Farbwünsche / Stil:</strong> ${escapeHtml(colors)}</p>` : "",
    hasValue(message) ? `<p><strong>Nachricht:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>` : "",
    attachments.length ? `<p><strong>Datei:</strong> im Anhang</p>` : `<p><em>Keine Datei hochgeladen.</em></p>`
  ].filter(Boolean);
  const htmlBody = htmlLines.join("\n");
  const textBody = htmlBody.replace(/<[^>]+>/g, "");
  const subject = `Layout-Einreichung – ${name}${eventDate ? ` (${eventDate})` : ""}`;

  const config = getMailConfigStatus();

  try {
    if (config.mode === "smtp" && config.missing.length === 0) {
      const transporter = nodemailer.createTransport({
        host: config.values.host,
        port: config.values.port,
        secure: config.values.secure,
        auth: { user: config.values.user, pass: config.values.pass }
      });
      await transporter.sendMail({
        from: config.values.from,
        to: config.values.to.split(",").map((s) => s.trim()).filter(Boolean),
        replyTo: email,
        subject,
        text: textBody,
        html: htmlBody,
        attachments
      });
      return NextResponse.json({ ok: true });
    }

    if (config.mode !== "resend" || config.missing.length > 0) {
      throw new Error(formatMailConfigError() || "Mailversand ist nicht konfiguriert.");
    }

    const resend = new Resend(config.values.apiKey);
    const result = await resend.emails.send({
      from: config.values.from,
      to: config.values.to.split(",").map((s) => s.trim()).filter(Boolean),
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
      attachments: attachments.map((a) => ({ filename: a.filename, content: a.content }))
    });
    if (result.error) {
      throw new Error(result.error.message || "Resend Versand fehlgeschlagen.");
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Senden fehlgeschlagen.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
