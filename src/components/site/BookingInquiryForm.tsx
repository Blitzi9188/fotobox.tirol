"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PricePlan, CMSContent } from "@/lib/types";

type PackageOption = Pick<PricePlan, "name" | "price">;

const EVENT_TYPES = [
  { id: "hochzeit", label: "Hochzeit", desc: "Der schoenste Tag" },
  { id: "firmenfeier", label: "Firmenfeier", desc: "Business & Event" },
  { id: "geburtstag", label: "Geburtstag", desc: "Party & Private" }
];

const PRINT_FORMAT_OPTIONS = [
  { id: "10x15", label: "10x15", desc: "Klassisches Fotopapier" },
  { id: "5x15", label: "5x15", desc: "Streifenformat" }
];

const BOX_TYPE_OPTIONS = [
  { id: "normal", label: "Normale Fotobox", desc: "" },
  { id: "ki", label: "KI-Fotobox", desc: "" }
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
  const printFormatOptions = inquiry.printFormatOptions && inquiry.printFormatOptions.length > 0 ? inquiry.printFormatOptions : PRINT_FORMAT_OPTIONS;
  const boxTypeOptionsRaw = inquiry.boxTypeOptions && inquiry.boxTypeOptions.length > 0 ? inquiry.boxTypeOptions : BOX_TYPE_OPTIONS;
  const boxTypeOptions = boxTypeOptionsRaw.map((option) => {
    if ((option.label || "").toLowerCase().includes("ki")) {
      return { ...option, desc: "" };
    }
    return option;
  });

  const [status, setStatus] = useState("");
  const router = useRouter();
  const defaultPackage = initialPackage || safePlans[0]?.name || "";
  const [selectedEvent, setSelectedEvent] = useState(eventOptions[0]?.label || EVENT_TYPES[0].label);
  const [selectedPackage, setSelectedPackage] = useState(defaultPackage);
  const [selectedPrintFormat, setSelectedPrintFormat] = useState(printFormatOptions[0]?.label || PRINT_FORMAT_OPTIONS[0].label);
  const [selectedBoxType, setSelectedBoxType] = useState(boxTypeOptions[0]?.label || BOX_TYPE_OPTIONS[0].label);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const messageRaw = String(formData.get("message") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const eventType = String(formData.get("eventType") || "").trim();
    const boxType = String(formData.get("boxType") || "").trim();
    const printFormat = String(formData.get("printFormat") || "").trim();
    const printText = String(formData.get("printText") || "").trim();
    const normalizedMessage = messageRaw || "Keine Zusatznachricht.";
    const detailsPrefix = [`Eventart: ${eventType}`];
    if (location) detailsPrefix.push(`Ort: ${location}`);
    if (boxType) detailsPrefix.push(`Fotobox: ${boxType}`);
    if (printFormat) detailsPrefix.push(`Format: ${printFormat}`);
    if (printText) detailsPrefix.push(`Aufdruck-Wunsch: ${printText}`);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      eventDate: String(formData.get("eventDate") || "").trim(),
      packageName: String(formData.get("packageName") || "").trim(),
      message: `${detailsPrefix.join(" | ")}\n${normalizedMessage}`
    };

    const subject = `Unverbindliche Anfrage: ${payload.packageName || "Fotobox"}`;
    const bodyLines = [
      `Name: ${payload.name}`,
      `E-Mail: ${payload.email}`,
      `Telefon: ${payload.phone || "-"}`,
      `Event-Datum: ${payload.eventDate || "-"}`,
      `Paket: ${payload.packageName || "-"}`,
      "",
      "Details:",
      payload.message
    ];
    const mailto = `mailto:info@fotobox.tirol?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;
    setStatus(inquiry.successText || "E-Mail wird vorbereitet.");
    event.currentTarget.reset();
    setSelectedEvent(eventOptions[0]?.label || EVENT_TYPES[0].label);
    setSelectedPackage(defaultPackage);
    setSelectedPrintFormat(printFormatOptions[0]?.label || PRINT_FORMAT_OPTIONS[0].label);
    setSelectedBoxType(boxTypeOptions[0]?.label || BOX_TYPE_OPTIONS[0].label);
    router.push("/danke");
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
            <span>{inquiry.dateLabel || "Datum"}</span>
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
        <input type="hidden" name="packageName" value={selectedPackage} />
        <div className="inquiry-input-group">
          <label className="inquiry-field">
            <span>{inquiry.nameLabel || "Vor- & Nachname"}</span>
            <input name="name" type="text" placeholder={inquiry.namePlaceholder || "Max Mustermann"} required />
          </label>
          <label className="inquiry-field">
            <span>{inquiry.emailLabel || "E-Mail Adresse"}</span>
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

      <button className="inquiry-submit-btn" type="submit">{inquiry.submitText}</button>
      {status ? <p className="inquiry-status">{status}</p> : null}
    </form>
  );
}
