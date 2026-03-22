"use client";

import { useEffect, useState } from "react";

type PopupType = "impressum" | "datenschutz";

export default function LegalPopupLink({
  type,
  label
}: {
  type: PopupType;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const title = type === "impressum" ? "Impressum" : "Datenschutzerklärung";

  return (
    <>
      <button type="button" className="footer-popup-trigger" onClick={() => setOpen(true)}>
        {label}
      </button>

      {open ? (
        <div className="legal-modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="legal-modal-card"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(event) => event.stopPropagation()}
          >
            <h3>{title}</h3>
            {type === "impressum" ? (
              <div className="legal-modal-content">
                <p><strong>Angaben gemäß § 5 ECG</strong></p>
                <p>Fotobox Tirol</p>
                <p>Rohracker 6 | 6092 Birgitz | Österreich</p>
                <p>Telefon: +43 664 3918 228</p>
                <p>E-Mail: info@fotobox.tirol</p>
                <p>UID: auf Anfrage</p>
              </div>
            ) : (
              <div className="legal-modal-content">
                <p><strong>Datenschutzhinweis</strong></p>
                <p>
                  Wir verarbeiten personenbezogene Daten ausschließlich zur Bearbeitung von Anfragen
                  und zur Vertragserfüllung.
                </p>
                <p>
                  Betroffene Daten: Name, E-Mail, Telefonnummer, Veranstaltungsdaten und freiwillige
                  Zusatzangaben.
                </p>
                <p>
                  Auskunft, Berichtigung oder Löschung: bitte per E-Mail an info@fotobox.tirol.
                </p>
              </div>
            )}

            <button type="button" className="legal-modal-close" onClick={() => setOpen(false)}>
              Schließen
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
