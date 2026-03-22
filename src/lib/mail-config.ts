export type MailConfigStatus =
  | {
      mode: "smtp";
      missing: string[];
      values: {
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
        to: string;
        secure: boolean;
      };
    }
  | {
      mode: "resend";
      missing: string[];
      values: {
        apiKey: string;
        from: string;
        to: string;
      };
    };

function getMissingEnvVars(pairs: Array<[string, string | undefined]>) {
  return pairs.filter(([, value]) => !value).map(([key]) => key);
}

export function getMailConfigStatus(): MailConfigStatus {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || process.env.MAIL_FROM;
  const smtpTo = process.env.SMTP_TO || process.env.MAIL_TO || "info@fotobox.tirol";
  const smtpSecure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || smtpPort === 465;

  const smtpMissing = getMissingEnvVars([
    ["SMTP_HOST", smtpHost],
    ["SMTP_USER", smtpUser],
    ["SMTP_PASS", smtpPass],
    ["SMTP_FROM", smtpFrom]
  ]);

  if (smtpMissing.length === 0) {
    return {
      mode: "smtp",
      missing: [],
      values: {
        host: smtpHost || "",
        port: smtpPort,
        user: smtpUser || "",
        pass: smtpPass || "",
        from: smtpFrom || "",
        to: smtpTo,
        secure: smtpSecure
      }
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.RESEND_TO || "info@fotobox.tirol";
  const resendMissing = getMissingEnvVars([
    ["RESEND_API_KEY", apiKey],
    ["RESEND_FROM", from]
  ]);

  return {
    mode: "resend",
    missing: resendMissing,
    values: {
      apiKey: apiKey || "",
      from: from || "",
      to
    }
  };
}

export function formatMailConfigError() {
  const status = getMailConfigStatus();

  if (status.mode === "smtp" && status.missing.length === 0) {
    return null;
  }

  if (status.mode === "resend" && status.missing.length === 0) {
    return null;
  }

  const smtpStatus = getMissingEnvVars([
    ["SMTP_HOST", process.env.SMTP_HOST],
    ["SMTP_USER", process.env.SMTP_USER],
    ["SMTP_PASS", process.env.SMTP_PASS],
    ["SMTP_FROM", process.env.SMTP_FROM || process.env.MAIL_FROM]
  ]);
  const resendStatus = getMissingEnvVars([
    ["RESEND_API_KEY", process.env.RESEND_API_KEY],
    ["RESEND_FROM", process.env.RESEND_FROM]
  ]);

  return `SMTP unvollstaendig: ${smtpStatus.join(", ") || "ok"}. Resend unvollstaendig: ${resendStatus.join(", ") || "ok"}.`;
}
