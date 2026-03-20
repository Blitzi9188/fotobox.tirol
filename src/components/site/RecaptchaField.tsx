"use client";

import ReCAPTCHA from "react-google-recaptcha";

export default function RecaptchaField({
  value,
  onChange
}: {
  value: string;
  onChange: (token: string) => void;
}) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  if (!siteKey) {
    return (
      <div className="inquiry-recaptcha-missing">
        Google reCAPTCHA ist noch nicht konfiguriert. Bitte `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` setzen.
      </div>
    );
  }

  return (
    <div className="inquiry-recaptcha-widget">
      <ReCAPTCHA
        sitekey={siteKey}
        theme="light"
        onChange={(token) => onChange(token || "")}
      />
      <input type="hidden" name="recaptchaToken" value={value} />
    </div>
  );
}
