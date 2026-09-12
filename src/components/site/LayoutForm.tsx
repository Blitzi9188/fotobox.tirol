"use client";

import { FormEvent, useState } from "react";

const OCCASIONS = [
  { id: "hochzeit", label: "Hochzeit", hint: "Elegant, floral" },
  { id: "firmenfeier", label: "Firmenfeier", hint: "Clean, mit Logo" },
  { id: "weihnachtsfeier", label: "Weihnachtsfeier", hint: "Festlich, winterlich" }
];

const FORMATS = [
  { id: "10x15-quer", label: "10 × 15 quer", hint: "Ein großes Foto" },
  { id: "10x15-hoch", label: "10 × 15 hoch", hint: "Drei Fotos" },
  { id: "5x15-streifen", label: "5 × 15 Streifen", hint: "Drei Fotos untereinander" }
];

export default function LayoutForm() {
  const [occasion, setOccasion] = useState(OCCASIONS[0].id);
  const [format, setFormat] = useState(FORMATS[0].id);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const selOcc = OCCASIONS.find((o) => o.id === occasion) || OCCASIONS[0];
  const selFmt = FORMATS.find((f) => f.id === format) || FORMATS[0];
  const previewSrc = `/uploads/layouts/${occasion}-${format}.jpg`;
  const templateSrc = `/uploads/layouts/${occasion}-${format}.pdf`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setStatus("");
    const formData = new FormData(event.currentTarget);
    formData.set("printFormat", `${selOcc.label} · ${selFmt.label}`);
    try {
      const response = await fetch("/api/layout", { method: "POST", body: formData });
      const json = (await response.json().catch(() => null)) as { error?: string } | null;
      if (response.ok) {
        window.location.replace("/danke?layout=1");
        return;
      }
      setStatus(json?.error || "Senden fehlgeschlagen.");
    } catch {
      setStatus("Senden fehlgeschlagen. Bitte später erneut versuchen.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="layout-step-label">Schritt 1</div>
      <h2>Anlass wählen</h2>
      <div className="layout-chips">
        {OCCASIONS.map((o) => (
          <label key={o.id} className={`layout-chip${occasion === o.id ? " active" : ""}`}>
            <input
              type="radio"
              name="occasionChoice"
              value={o.id}
              checked={occasion === o.id}
              onChange={() => setOccasion(o.id)}
            />
            <span className="layout-chip-title">{o.label}</span>
            <span className="layout-chip-hint">{o.hint}</span>
          </label>
        ))}
      </div>

      <div className="layout-step-label">Schritt 2</div>
      <h2>Format wählen</h2>
      <div className="layout-format-row">
        <div className="layout-format-list">
          {FORMATS.map((f) => (
            <label key={f.id} className={`layout-fmt-line${format === f.id ? " active" : ""}`}>
              <input
                type="radio"
                name="formatChoice"
                value={f.id}
                checked={format === f.id}
                onChange={() => setFormat(f.id)}
              />
              <span className="layout-fmt-radio" aria-hidden="true" />
              <span>
                <strong>{f.label}</strong>
                <em>{f.hint}</em>
              </span>
            </label>
          ))}
        </div>
        <div className="layout-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewSrc} alt={`${selOcc.label} ${selFmt.label} Vorschau`} loading="lazy" decoding="async" />
          <a href={templateSrc} className="layout-fmt-dl" target="_blank" rel="noopener noreferrer">
            ↓ Diese Vorlage herunterladen (PDF)
          </a>
        </div>
      </div>

      <div className="layout-step-label">Schritt 3</div>
      <h2>Dein Logo &amp; deine Wünsche</h2>
      <p className="layout-intro-note">
        Am einfachsten: Schick uns dein Logo und deine Wünsche – wir gestalten dein Layout final für den Druck.
      </p>
      <div className="admin-card">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="layout-hp" aria-hidden="true" />

        <label className="admin-field"><span>Name *</span><input name="name" required /></label>
        <label className="admin-field"><span>E-Mail *</span><input name="email" type="email" required /></label>
        <label className="admin-field"><span>Telefon</span><input name="phone" /></label>
        <label className="admin-field"><span>Event-Datum</span><input name="eventDate" type="date" /></label>
        <label className="admin-field">
          <span>Namen / Text fürs Layout</span>
          <input name="printText" placeholder="z. B. Namen, Datum, Spruch" />
        </label>
        <label className="admin-field">
          <span>Farbwünsche / Stil</span>
          <input name="colors" placeholder="z. B. Firmenfarben, Logo oben mittig" />
        </label>

        <div className="admin-field">
          <span>Dein Logo oder Design hochladen</span>
          <label className="layout-dropzone">
            <input
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf"
              onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
            />
            <span className="layout-dropzone-icon" aria-hidden="true">⬆</span>
            <span className="layout-dropzone-text">
              {fileName ? <strong>{fileName}</strong> : <><strong>Datei auswählen</strong> oder hierher ziehen</>}
            </span>
            <span className="layout-dropzone-hint">JPG, PNG, PDF, SVG · max. 30 MB</span>
          </label>
        </div>

        <label className="admin-field">
          <span>Nachricht (optional)</span>
          <textarea name="message" rows={3} placeholder="Weitere Wünsche oder Hinweise …" />
        </label>

        <button className="btn" type="submit" disabled={sending}>
          {sending ? "Wird gesendet …" : "Layout absenden"}
        </button>
        {status && <p className="admin-status">{status}</p>}
      </div>
    </form>
  );
}
