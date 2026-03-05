import crypto from "crypto";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function sign(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken(email: string): string {
  const secret = process.env.SESSION_SECRET || "dev-secret";
  const payload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS
  };
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(payloadEncoded, secret);
  return `${payloadEncoded}.${signature}`;
}

export function verifySessionToken(token?: string): { ok: boolean; email?: string } {
  if (!token) return { ok: false };

  const secret = process.env.SESSION_SECRET || "dev-secret";
  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) return { ok: false };

  const expected = sign(payloadEncoded, secret);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return { ok: false };
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadEncoded, "base64url").toString("utf-8")) as {
      email: string;
      exp: number;
    };

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { ok: false };
    }

    return { ok: true, email: payload.email };
  } catch {
    return { ok: false };
  }
}

export function isValidAdminLogin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@fotoboxtirol.at";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin1234";
  return email === adminEmail && password === adminPassword;
}
