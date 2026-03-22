"use client";

import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function RecaptchaField({
  value,
  onChange
}: {
  value: string;
  onChange: (token: string) => void;
}) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

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
        ref={recaptchaRef}
        sitekey={siteKey}
        theme="light"
        onChange={(token) => onChange(token || "")}
        onExpired={() => onChange("")}
        onErrored={() => onChange("")}
      />
      <button
        type="button"
        className="inquiry-recaptcha-refresh"
        onClick={() => {
          recaptchaRef.current?.reset();
          onChange("");
        }}
      >
        Neu laden
      </button>
      <input type="hidden" name="recaptchaToken" value={value} />
    </div>
  );
}
