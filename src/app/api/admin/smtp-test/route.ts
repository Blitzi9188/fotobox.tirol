import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getMailConfigStatus, formatMailConfigError } from "@/lib/mail-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getMailConfigStatus();

  if (config.mode !== "smtp" || config.missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        mode: config.mode,
        error: formatMailConfigError() || "SMTP ist nicht konfiguriert."
      },
      { status: 400 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.values.host,
      port: config.values.port,
      secure: config.values.secure,
      auth: {
        user: config.values.user,
        pass: config.values.pass
      }
    });

    await transporter.verify();

    return NextResponse.json({
      ok: true,
      mode: "smtp",
      host: config.values.host,
      port: config.values.port,
      secure: config.values.secure,
      from: config.values.from,
      to: config.values.to
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMTP Verbindung fehlgeschlagen.";
    return NextResponse.json(
      {
        ok: false,
        mode: "smtp",
        error: message
      },
      { status: 502 }
    );
  }
}
