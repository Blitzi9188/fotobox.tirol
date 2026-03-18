"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PricePlan } from "@/lib/types";

type PackageOption = Pick<PricePlan, "name" | "price">;

export default function ContactForm({
  plans = [],
  initialPackage
}: {
  plans?: PackageOption[];
  initialPackage?: string;
}) {
  const safePlans: PackageOption[] = plans.length > 0 ? plans : [{ name: "Allgemeine Anfrage", price: 0 }];
  const [status, setStatus] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(initialPackage || safePlans[0]?.name || "");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const router = useRouter();

  async function loadCaptcha() {
    const response = await fetch("/api/captcha", { cache: "no-store" });
    const json = (await response.json()) as { question: string; token: string };
    setCaptchaQuestion(json.question);
    setCaptchaToken(json.token);
    setCaptchaAnswer("");
  }

  useEffect(() => {
    void loadCaptcha();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      eventDate: String(formData.get("eventDate") || ""),
      packageName: String(formData.get("packageName") || ""),
      message: String(formData.get("message") || ""),
      captchaToken,
      captchaAnswer
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = (await response.json().catch(() => null)) as { error?: string } | null;
    setStatus(response.ok ? "Anfrage gesendet." : (json?.error || "Senden fehlgeschlagen."));
    if (response.ok) {
      event.currentTarget.reset();
      setSelectedPackage(initialPackage || safePlans[0]?.name || "");
      setCaptchaAnswer("");
      router.replace("/danke");
      return;
    }

    void loadCaptcha();
  }

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      <h2>Unverbindliche Preisanfrage</h2>
      <label className="admin-field">
        <span>Name</span>
        <input name="name" required />
      </label>
      <label className="admin-field">
        <span>E-Mail</span>
        <input name="email" type="email" required />
      </label>
      <label className="admin-field">
        <span>Telefon</span>
        <input name="phone" />
      </label>
      <label className="admin-field">
        <span>Event Datum</span>
        <input name="eventDate" type="date" />
      </label>
      <label className="admin-field">
        <span>Paket Auswahl</span>
        <select
          name="packageName"
          value={selectedPackage}
          onChange={(event) => setSelectedPackage(event.target.value)}
          required
        >
          {safePlans.map((plan) => (
            <option key={plan.name} value={plan.name}>
              {plan.price > 0 ? `${plan.name} - ${plan.price}€` : plan.name}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-field">
        <span>Nachricht</span>
        <textarea name="message" rows={5} required />
      </label>
      <div className="inquiry-captcha-card">
        <div className="inquiry-captcha-copy">
          <span className="inquiry-section-title">Sicherheitsabfrage</span>
          <p className="inquiry-captcha-help">Ein kurzer Schutz gegen Spam.</p>
        </div>
        <label className="admin-field" style={{ marginBottom: 0 }}>
          <span>{captchaQuestion || "Lade Sicherheitsfrage..."}</span>
          <div className="inquiry-captcha-row">
            <input
              name="captchaAnswer"
              inputMode="numeric"
              value={captchaAnswer}
              onChange={(event) => setCaptchaAnswer(event.target.value)}
              placeholder="Antwort"
              required
            />
            <button className="btn btn-outline inquiry-captcha-refresh" type="button" onClick={() => void loadCaptcha()}>
              Neu
            </button>
          </div>
        </label>
      </div>
      <button className="btn" type="submit">Absenden</button>
      {status && <p className="admin-status">{status}</p>}
    </form>
  );
}
