"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { PricePlan, CMSContent } from "@/lib/types";

type PackageOption = Pick<PricePlan, "name" | "price">;

const EVENT_TYPES = [
  { id: "hochzeit", label: "Hochzeit", desc: "Der schoenste Tag" },
  { id: "firmenfeier", label: "Firmenfeier", desc: "Business & Event" },
  { id: "geburtstag", label: "Geburtstag", desc: "Party & Private" }
];

const BOX_TYPE_OPTIONS = [
  { id: "normal", label: "Normale Fotobox", desc: "" },
  { id: "ki", label: "KI-Fotobox", desc: "" }
];

const PRINT_FORMAT_OPTIONS = [
  { label: "10x15", desc: "Klassisches Fotopapier" },
  { label: "5x15", desc: "Streifenformat" }
];

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
  const eventOptions = inquiry.eventOptions && inquiry.eventOptions.length > 0 ? inquiry.eventOptions : EVENT_TYPES;
  const printFormatOptions =
    inquiry.printFormatOptions && inquiry.printFormatOptions.length > 0
      ? inquiry.printFormatOptions
      : PRINT_FORMAT_OPTIONS;
  const boxTypeOptionsRaw = inquiry.boxTypeOptions && inquiry.boxTypeOptions.length > 0 ? inquiry.boxTypeOptions : BOX_TYPE_OPTIONS;
  const boxTypeOptions = boxTypeOptionsRaw.map((option) => {
    if ((option.label || "").toLowerCase().includes("ki")) {
      return { ...option, desc: "" };
    }
    return option;
  });

  const [status, setStatus] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(eventOptions[0]?.label || EVENT_TYPES[0].label);
  const [selectedPrintFormat, setSelectedPrintFormat] = useState(printFormatOptions[0]?.label || PRINT_FORMAT_OPTIONS[0].label);
  const [selectedPackage, setSelectedPackage] = useState(initialPackage || safePlans[0]?.name || "");
  const [selectedBoxType, setSelectedBoxType] = useState(boxTypeOptions[0]?.label || BOX_TYPE_OPTIONS[0].label);
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  async function loadCaptcha() {
    const response = await fetch(`/api/captcha?t=${Date.now()}`, { cache: "no-store" });
    const json = (await response.json()) as { question: string; token: string };
    setCaptchaQuestion(json.question);
    setCaptchaToken(json.token);
    setCaptchaAnswer("");
  }

  useEffect(() => {
    void loadCaptcha();
  }, []);

  function requiredLabel(label: string) {
    return `${label} *`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const messageRaw = String(formData.get("message") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const eventType = String(formData.get("eventType") || "").trim();
    const boxType = String(formData.get("boxType") || "").trim();
    const printText = String(formData.get("printText") || "").trim();

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      eventDate: String(formData.get("eventDate") || "").trim(),
      packageName: String(formData.get("packageName") || "").trim(),
      eventType,
      location,
      boxType,
      printFormat: String(formData.get("printFormat") || "").trim(),
      printText,
      message: messageRaw,
      captchaToken,
      captchaAnswer
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = (await response.json().catch(() => null)) as { error?: string } | null;
    setStatus(
      response.ok
        ? (inquiry.successText || "Anfrage erfolgreich gesendet.")
        : (json?.error || inquiry.errorText || "Senden fehlgeschlagen.")
    );
    if (response.ok) {
      event.currentTarget.reset();
      setSelectedEvent(eventOptions[0]?.label || EVENT_TYPES[0].label);
      setSelectedPrintFormat(printFormatOptions[0]?.label || PRINT_FORMAT_OPTIONS[0].label);
      const submittedPackage = payload.packageName || initialPackage || safePlans[0]?.name || "";
      setSelectedPackage(initialPackage || safePlans[0]?.name || "");
      setSelectedBoxType(boxTypeOptions[0]?.label || BOX_TYPE_OPTIONS[0].label);
      setCaptchaAnswer("");
      window.location.assign(`/danke?paket=${encodeURIComponent(submittedPackage)}`);
      return;
    }

    void loadCaptcha();
  }

  return (
    <form className="inquiry-form-card" onSubmit={handleSubmit}>
      <div className="inquiry-form-section">
        <span className="inquiry-section-title">{inquiry.eventSectionTitle}</span>
        <input type="hidden" name="eventType" value={selectedEvent} />
        <div className="inquiry-options-grid">
          {eventOptions.map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              className={`inquiry-option ${selectedEvent === item.label ? "selected" : ""}`}
              onClick={() => setSelectedEvent(item.label)}
            >
              <span className="inquiry-option-title">{item.label}</span>
              <span className="inquiry-option-desc">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="inquiry-form-section">
        <span className="inquiry-section-title">{inquiry.dateSectionTitle}</span>
        <div className="inquiry-input-group">
          <label className="inquiry-field">
            <span>{requiredLabel(inquiry.dateLabel || "Datum")}</span>
            <input name="eventDate" type="date" required />
          </label>
          <label className="inquiry-field">
            <span>{inquiry.locationLabel || "Ort der Feier"}</span>
            <input name="location" type="text" placeholder={inquiry.locationPlaceholder || "Innsbruck, Kitzbuehel..."} />
          </label>
        </div>
      </div>

      <div className="inquiry-form-section">
        <span className="inquiry-section-title">{inquiry.printSectionTitle}</span>
        <label className="inquiry-field" style={{ marginTop: "0.8rem" }}>
          <span>{inquiry.printFormatLabel || "Druckformat"}</span>
          <div className="inquiry-checkbox-group">
            {printFormatOptions.map((option, index) => (
              <label
                key={`${option.label}-${index}`}
                className={`inquiry-checkbox-item ${selectedPrintFormat === option.label ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="printFormat"
                  value={option.label}
                  checked={selectedPrintFormat === option.label}
                  onChange={() => setSelectedPrintFormat(option.label)}
                />
                <span className="inquiry-checkmark" aria-hidden="true" />
                <span className="inquiry-choice-line">
                  <span className="inquiry-choice-title">{option.label}</span>
                  <span className="inquiry-choice-desc">{option.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </label>
        <label className="inquiry-field" style={{ marginTop: "0.8rem" }}>
          <span>{inquiry.boxTypeLabel || "Fotobox Variante"}</span>
          <div className="inquiry-checkbox-group">
            {boxTypeOptions.map((option, index) => (
              <label
                key={`${option.label}-${index}`}
                className={`inquiry-checkbox-item ${selectedBoxType === option.label ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="boxType"
                  value={option.label}
                  checked={selectedBoxType === option.label}
                  onChange={() => setSelectedBoxType(option.label)}
                />
                <span className="inquiry-checkmark" aria-hidden="true" />
                <span className="inquiry-choice-line">
                  <span className="inquiry-choice-title">{option.label}</span>
                  <span className="inquiry-choice-desc">{option.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </label>
        <label className="inquiry-field" style={{ marginTop: "0.8rem" }}>
          <span>{inquiry.printTextLabel || "Text fuer Ausdruck (optional)"}</span>
          <input name="printText" type="text" placeholder={inquiry.printTextPlaceholder || "z. B. Lisa & Markus | 14.06.2026"} />
        </label>
      </div>

      <div className="inquiry-form-section">
        <span className="inquiry-section-title">{inquiry.contactSectionTitle}</span>
        <div className="inquiry-input-group">
          <label className="inquiry-field">
            <span>{requiredLabel(inquiry.nameLabel || "Vor- & Nachname")}</span>
            <input name="name" type="text" placeholder={inquiry.namePlaceholder || "Max Mustermann"} required />
          </label>
          <label className="inquiry-field">
            <span>{requiredLabel(inquiry.emailLabel || "E-Mail Adresse")}</span>
            <input name="email" type="email" placeholder={inquiry.emailPlaceholder || "max@beispiel.at"} required />
          </label>
        </div>
        <div className="inquiry-input-group inquiry-input-group-single">
          <label className="inquiry-field">
            <span>{inquiry.phoneLabel || "Telefonnummer"}</span>
            <input name="phone" type="tel" placeholder={inquiry.phonePlaceholder || "+43 664 ..."} />
          </label>
        </div>
        <label className="inquiry-field">
          <span>{inquiry.messageLabel || "Nachricht (optional)"}</span>
          <textarea name="message" rows={4} placeholder={inquiry.messagePlaceholder || "Besondere Wuensche oder Details..."} />
        </label>
      </div>

      <div className="inquiry-form-section">
        <span className="inquiry-section-title">{inquiry.packageSectionTitle || "05. Paket Wunsch"}</span>
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
          <span className="inquiry-section-title">06. Sicherheitsabfrage</span>
          <p className="inquiry-captcha-help">Bitte kurz die Rechenfrage beantworten, dann kann die Anfrage gesendet werden.</p>
        </div>
        <label className="inquiry-field">
          <span>{requiredLabel(captchaQuestion || "Lade Sicherheitsfrage...")}</span>
          <div className="inquiry-captcha-row">
            <input
              name="captchaAnswer"
              type="text"
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

      <button className="inquiry-submit-btn" type="submit">{inquiry.submitText}</button>
      {status ? <p className="inquiry-status">{status}</p> : null}
    </form>
  );
}
