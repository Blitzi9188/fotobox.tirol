"use client";

import { FormEvent, useMemo, useState } from "react";
import { PricePlan, CMSContent } from "@/lib/types";
import CaptchaField from "@/components/site/CaptchaField";

type PackageOption = Pick<PricePlan, "name" | "price">;

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72l.35 2.79a2 2 0 0 1-.57 1.73l-1.2 1.2a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 1.73-.57l2.79.35A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function BookingInquiryForm({
  plans = [],
  initialPackage,
  inquiry
}: {
  plans?: PackageOption[];
  initialPackage?: string;
  inquiry: CMSContent["inquiry"];
}) {
  const safePlans: PackageOption[] = useMemo(
    () => (plans.length > 0 ? plans : [{ name: "Allgemeine Anfrage", price: 0 }]),
    [plans]
  );
  const [status, setStatus] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(initialPackage || safePlans[0]?.name || "");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);
  const [formStartedAt] = useState(() => Date.now());

  function plainSectionTitle(value: string) {
    return value.replace(/^\s*\d+\.\s*/, "").trim();
  }

  function requiredLabel(label: string) {
    return `${label} *`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const messageRaw = String(formData.get("message") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      eventDate: String(formData.get("eventDate") || "").trim(),
      packageName: String(formData.get("packageName") || "").trim(),
      eventType: "",
      location,
      boxType: "",
      printFormat: "",
      printText: "",
      message: messageRaw,
      website: String(formData.get("website") || "").trim(),
      startedAt: String(formData.get("startedAt") || "").trim(),
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
      setCaptchaRefreshKey((value) => value + 1);
      const params = new URLSearchParams();
      params.set("paket", submittedPackage);
      if (payload.eventDate) params.set("eventDate", payload.eventDate);
      if (payload.location) params.set("location", payload.location);
      window.location.replace(`/danke?${params.toString()}`);
      return;
    }

    setStatus(json?.error || inquiry.errorText || "Senden fehlgeschlagen.");
    setCaptchaToken("");
    setCaptchaAnswer("");
    setCaptchaRefreshKey((value) => value + 1);
  }

  return (
    <form className="inquiry-form-card" onSubmit={handleSubmit}>
      <input type="hidden" name="startedAt" value={String(formStartedAt)} />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden"
        }}
      >
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="inquiry-form-section">
        <span className="inquiry-section-title">{plainSectionTitle(inquiry.dateSectionTitle)}</span>
        <div className="inquiry-input-group">
          <label className="inquiry-field">
            <span className="inquiry-field-heading"><span className="inquiry-field-icon"><CalendarIcon /></span>{requiredLabel(inquiry.dateLabel || "Datum")}</span>
            <input name="eventDate" type="date" required />
          </label>
          <label className="inquiry-field">
            <span className="inquiry-field-heading"><span className="inquiry-field-icon"><PinIcon /></span>{inquiry.locationLabel || "Ort der Feier"}</span>
            <input name="location" type="text" placeholder={inquiry.locationPlaceholder || "Innsbruck, Kitzbühel..."} />
          </label>
        </div>
      </div>

      <div className="inquiry-form-section">
        <span className="inquiry-section-title">{plainSectionTitle(inquiry.contactSectionTitle)}</span>
        <div className="inquiry-input-group">
          <label className="inquiry-field">
            <span className="inquiry-field-heading"><span className="inquiry-field-icon"><UserIcon /></span>{requiredLabel(inquiry.nameLabel || "Vor- & Nachname")}</span>
            <input name="name" type="text" placeholder={inquiry.namePlaceholder || "Max Mustermann"} required />
          </label>
          <label className="inquiry-field">
            <span className="inquiry-field-heading"><span className="inquiry-field-icon"><MailIcon /></span>{requiredLabel(inquiry.emailLabel || "E-Mail Adresse")}</span>
            <input name="email" type="email" placeholder={inquiry.emailPlaceholder || "max@beispiel.at"} required />
          </label>
        </div>
        <div className="inquiry-input-group inquiry-input-group-single">
          <label className="inquiry-field">
            <span className="inquiry-field-heading"><span className="inquiry-field-icon"><PhoneIcon /></span>{inquiry.phoneLabel || "Telefonnummer"}</span>
            <input name="phone" type="tel" placeholder={inquiry.phonePlaceholder || "+43 664 ..."} />
          </label>
        </div>
        <label className="inquiry-field">
          <span className="inquiry-field-heading"><span className="inquiry-field-icon"><MessageIcon /></span>{inquiry.messageLabel || "Nachricht (optional)"}</span>
          <textarea name="message" rows={4} placeholder={inquiry.messagePlaceholder || "Besondere Wünsche oder Details..."} />
        </label>
      </div>

      <div className="inquiry-form-section">
        <span className="inquiry-section-title">{plainSectionTitle(inquiry.packageSectionTitle || "05. Paket Wunsch")}</span>
        <input type="hidden" name="packageName" value={selectedPackage} />
        <div className={`inquiry-options-grid ${safePlans.length === 2 ? "inquiry-options-grid-2" : ""}`}>
          {safePlans.map((plan) => (
            <button
              key={plan.name}
              type="button"
              className={`inquiry-option ${selectedPackage === plan.name ? "selected" : ""}`}
              onClick={() => setSelectedPackage(plan.name)}
            >
              <span className="inquiry-option-title">{plan.name}</span>
              <span className="inquiry-option-desc">
                {plan.price > 0 ? `${plan.price}€` : "Allgemeine Anfrage"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="inquiry-captcha-card">
        <div className="inquiry-captcha-copy">
          <span className="inquiry-section-title">Sicherheitsabfrage *</span>
          <p className="inquiry-captcha-help">Bitte bestätigen, dass die Anfrage von einer echten Person gesendet wird.</p>
        </div>
        <label className="inquiry-field">
          <span>Sicherheitsrechnung</span>
          <CaptchaField
            token={captchaToken}
            answer={captchaAnswer}
            onTokenChange={setCaptchaToken}
            onAnswerChange={setCaptchaAnswer}
            refreshKey={captchaRefreshKey}
          />
        </label>
      </div>

      <button className="inquiry-submit-btn" type="submit">{inquiry.submitText}</button>
      {status ? <p className="inquiry-status">{status}</p> : null}
    </form>
  );
}
