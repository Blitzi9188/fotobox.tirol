"use client";

import { FormEvent, useState } from "react";
import { PricePlan } from "@/lib/types";
import CaptchaField from "@/components/site/CaptchaField";

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
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);
  const [source, setSource] = useState("");

  function requiredLabel(label: string) {
    return `${label} *`;
  }

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
      source: String(formData.get("source") || ""),
      captchaToken: String(formData.get("captchaToken") || "").trim(),
      captchaAnswer: String(formData.get("captchaAnswer") || "").trim()
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = (await response.json().catch(() => null)) as { error?: string } | null;
    if (response.ok) {
      const submittedPackage = payload.packageName || initialPackage || safePlans[0]?.name || "";
      setSelectedPackage(initialPackage || safePlans[0]?.name || "");
      setCaptchaToken("");
      setCaptchaAnswer("");
      setCaptchaRefreshKey((v) => v + 1);
      const params = new URLSearchParams();
      params.set("paket", submittedPackage);
      if (payload.eventDate) params.set("eventDate", payload.eventDate);
      window.location.replace(`/danke?${params.toString()}`);
      return;
    }

    setStatus(json?.error || "Senden fehlgeschlagen.");
    setCaptchaToken("");
    setCaptchaAnswer("");
    setCaptchaRefreshKey((v) => v + 1);
  }

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      <h2>Unverbindliche Preisanfrage</h2>
      <label className="admin-field">
        <span>{requiredLabel("Name")}</span>
        <input name="name" required />
      </label>
      <label className="admin-field">
        <span>{requiredLabel("E-Mail")}</span>
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
        <span>{requiredLabel("Paket Auswahl")}</span>
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
      <div className="admin-field">
        <span>Wie habt ihr uns gefunden? (Optional)</span>
        <div className="contact-source-options">
          {["Instagram", "Facebook", "Weiterempfehlung", "Google", "KI Suche"].map((opt) => (
            <label key={opt} className="contact-source-option">
              <input
                type="radio"
                name="source"
                value={opt}
                checked={source === opt}
                onChange={() => setSource(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <label className="admin-field">
        <span>{requiredLabel("Nachricht")}</span>
        <textarea name="message" rows={5} required />
      </label>
      <CaptchaField
        token={captchaToken}
        answer={captchaAnswer}
        onTokenChange={setCaptchaToken}
        onAnswerChange={setCaptchaAnswer}
        refreshKey={captchaRefreshKey}
      />
      <button className="btn" type="submit">Absenden</button>
      {status && <p className="admin-status">{status}</p>}
    </form>
  );
}
