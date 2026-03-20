type RecaptchaVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
};

function getRecaptchaSecretKey() {
  return process.env.RECAPTCHA_SECRET_KEY || "";
}

export function getRecaptchaSiteKey() {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
}

export async function verifyRecaptchaToken(token: string, remoteIp?: string) {
  const secret = getRecaptchaSecretKey();
  if (!secret) {
    throw new Error("RECAPTCHA_SECRET_KEY fehlt.");
  }

  if (!token) return false;

  const payload = new URLSearchParams();
  payload.set("secret", secret);
  payload.set("response", token);
  if (remoteIp) payload.set("remoteip", remoteIp);

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: payload.toString(),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`reCAPTCHA Verifikation fehlgeschlagen (${response.status}).`);
  }

  const json = (await response.json()) as RecaptchaVerifyResponse;
  return Boolean(json.success);
}
