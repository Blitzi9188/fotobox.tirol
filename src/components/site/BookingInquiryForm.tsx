"use client";

import { FormEvent, useMemo, useState } from "react";
import { PricePlan, CMSContent } from "@/lib/types";
import CaptchaField from "@/components/site/CaptchaField";

type PackageOption = Pick<PricePlan, "name" | "price">;

const EVENT_TYPES = [
  { id: "hochzeit", label: "Hochzeit", desc: "Der schönste Tag" },
  { id: "firmenfeier", label: "Firmenfeier", desc: "Business & Event" },
  { id: "geburtstag", label: "Geburtstag", desc: "Party & Private" }
];

const BOX_TYPE_OPTIONS = [
  { id: "normal", label: "Normale Fotobox", desc: "" },
  { id: "ki", label: "KI-Fotobox", desc: "" }
];

const PRINT_FORMAT_OPTIONS = [
  { label: "5x15", desc: "Streifenformat" },
  { label: "10x15", desc: "Klassisches Fotopapier" }
];

function WeddingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 12v10H4V12" />
      <path d="M2 7h20v5H2z" />
      <path d="M12 22V7" />
      <path d="M12 7H4.5a2.5 2.5 0 0 1 0-5C7 2 12 7 12 7z" />
      <path d="M12 7h7.5a2.5 2.5 0 0 0 0-5C17 2 12 7 12 7z" />
    </svg>
  );
}

function BusinessIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function BirthdayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5c2.4 0 5.4 3 5.5 3" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5c-2.4 0-5.4 3-5.5 3" />
      <path d="M4 22h16l-2-13H6l-2 13Z" />
      <path d="M10.5 14.5c.9 0 1.5-.6 1.5-1.5s-.6-1.5-1.5-1.5-1.5.6-1.5 1.5.6 1.5 1.5 1.5Z" />
      <path d="M13.5 14.5c.9 0 1.5-.6 1.5-1.5s-.6-1.5-1.5-1.5-1.5.6-1.5 1.5.6 1.5 1.5 1.5Z" />
    </svg>
  );
}

function OtherIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

function ClassicPrintIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

function StripPrintIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M10 7h4" />
      <path d="M10 11h4" />
      <path d="M10 15h4" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
      <path d="M19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z" />
      <path d="M5 14l.9 2.1L8 17l-2.1.9L5 20l-.9-2.1L2 17l2.1-.9L5 14Z" />
    </svg>
  );
}

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

function getEventIcon(label: string) {
  const value = label.toLowerCase();
  if (value.includes("hoch")) return <WeddingIcon />;
  if (value.includes("firma") || value.includes("business")) return <BusinessIcon />;
  if (value.includes("geburt")) return <BirthdayIcon />;
  return <OtherIcon />;
}

function getPrintFormatIcon(label: string) {
  return label.includes("5x15") ? <StripPrintIcon /> : <ClassicPrintIcon />;
}

function getBoxTypeIcon(label: string) {
  return label.toLowerCase().includes("ki") ? <SparklesIcon /> : <CameraIcon />;
}

function getDefaultPrintFormatLabel(options: Array<{ label: string; desc: string }>) {
  return options.find((option) => option.label.includes("5x15"))?.label || options[0]?.label || PRINT_FORMAT_OPTIONS[1].label;
}

function orderPrintFormatOptions(options: Array<{ label: string; desc: string }>) {
  return [...options].sort((a, b) => {
    const aIsStrip = a.label.includes("5x15");
    const bIsStrip = b.label.includes("5x15");
    if (aIsStrip === bIsStrip) return 0;
    return aIsStrip ? -1 : 1;
  });
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
  const eventOptions = inquiry.eventOptions && inquiry.eventOptions.length > 0 ? inquiry.eventOptions : EVENT_TYPES;
  const printFormatOptions = orderPrintFormatOptions(
    inquiry.printFormatOptions && inquiry.printFormatOptions.length > 0
      ? inquiry.printFormatOptions
      : PRINT_FORMAT_OPTIONS
  );
  const boxTypeOptionsRaw = inquiry.boxTypeOptions && inquiry.boxTypeOptions.length > 0 ? inquiry.boxTypeOptions : BOX_TYPE_OPTIONS;
  const boxTypeOptions = boxTypeOptionsRaw.map((option) => {
    if ((option.label || "").toLowerCase().includes("ki")) {
      return { ...option, desc: "" };
    }
    return option;
  });
  const defaultPrintFormatLabel = getDefaultPrintFormatLabel(printFormatOptions);

  const [status, setStatus] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(eventOptions[0]?.label || EVENT_TYPES[0].label);
  const [selectedPrintFormat, setSelectedPrintFormat] = useState(defaultPrintFormatLabel);
  const [selectedPackage, setSelectedPackage] = useState(initialPackage || safePlans[0]?.name || "");
  const [selectedBoxType, setSelectedBoxType] = useState(boxTypeOptions[0]?.label || BOX_TYPE_OPTIONS[0].label);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);
  const [formStartedAt] = useState(() => Date.now());

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
      setSelectedEvent(eventOptions[0]?.label || EVENT_TYPES[0].label);
      setSelectedPrintFormat(defaultPrintFormatLabel);
      const submittedPackage = payload.packageName || initialPackage || safePlans[0]?.name || "";
      setSelectedPackage(initialPackage || safePlans[0]?.name || "");
      setSelectedBoxType(boxTypeOptions[0]?.label || BOX_TYPE_OPTIONS[0].label);
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
              <span className="inquiry-option-icon">{getEventIcon(item.label)}</span>
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
                  <span className="inquiry-choice-icon">{getPrintFormatIcon(option.label)}</span>
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
                  <span className="inquiry-choice-icon">{getBoxTypeIcon(option.label)}</span>
                  <span className="inquiry-choice-line">
                    <span className="inquiry-choice-title">{option.label}</span>
                    <span className="inquiry-choice-desc">{option.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </label>
        <label className="inquiry-field" style={{ marginTop: "0.8rem" }}>
          <span>{inquiry.printTextLabel || "Text für Ausdruck (optional)"}</span>
          <input name="printText" type="text" placeholder={inquiry.printTextPlaceholder || "z. B. Lisa & Markus | 14.06.2026"} />
        </label>
      </div>

      <div className="inquiry-form-section">
        <span className="inquiry-section-title">{inquiry.contactSectionTitle}</span>
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
          <span className="inquiry-section-title">06. Sicherheitsabfrage *</span>
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
