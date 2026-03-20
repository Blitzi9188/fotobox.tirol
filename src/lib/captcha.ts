import crypto from "crypto";

const CAPTCHA_TTL_MS = 15 * 60 * 1000;

type CaptchaPayload = {
  a: number;
  b: number;
  exp: number;
};

function getCaptchaSecret() {
  return process.env.CAPTCHA_SECRET || "fotobox-tirol-local-captcha-secret";
}

function signPayload(payload: string) {
  return crypto.createHmac("sha256", getCaptchaSecret()).update(payload).digest("hex");
}

export function createCaptchaChallenge() {
  const a = crypto.randomInt(1, 10);
  const b = crypto.randomInt(1, 10);
  const payload: CaptchaPayload = {
    a,
    b,
    exp: Date.now() + CAPTCHA_TTL_MS
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encodedPayload);

  return {
    question: `Wieviel ist ${a} + ${b}?`,
    token: `${encodedPayload}.${signature}`
  };
}

export function verifyCaptchaChallenge(token: string, answer: string) {
  if (!token || !answer) return false;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const expectedSignature = signPayload(encodedPayload);
  const signatureOk = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  if (!signatureOk) return false;

  let payload: CaptchaPayload;
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as CaptchaPayload;
  } catch {
    return false;
  }

  if (!payload || typeof payload.a !== "number" || typeof payload.b !== "number" || typeof payload.exp !== "number") {
    return false;
  }

  if (Date.now() > payload.exp) return false;

  return Number(answer.trim()) === payload.a + payload.b;
}
