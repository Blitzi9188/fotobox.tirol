"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
};

const STORAGE_KEY = "fotobox_cookie_consent_v1";
const COOKIE_NAME = "cookie_consent";

function writeConsentCookie(value: string) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
        return;
      }

      const parsed = JSON.parse(stored) as Partial<ConsentState>;
      setAnalytics(Boolean(parsed.analytics));
      setMarketing(Boolean(parsed.marketing));
      setVisible(false);
    } catch {
      setVisible(true);
    }
  }, []);

  function persistConsent(next: ConsentState) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    writeConsentCookie(JSON.stringify(next));
    setVisible(false);
  }

  function acceptAll() {
    const next: ConsentState = {
      essential: true,
      analytics: true,
      marketing: true,
      savedAt: new Date().toISOString()
    };
    setAnalytics(true);
    setMarketing(true);
    persistConsent(next);
  }

  function onlyEssential() {
    const next: ConsentState = {
      essential: true,
      analytics: false,
      marketing: false,
      savedAt: new Date().toISOString()
    };
    setAnalytics(false);
    setMarketing(false);
    persistConsent(next);
  }

  if (!visible) return null;

  return (
    <div className="cookie-consent-wrap" role="dialog" aria-live="polite" aria-label="Datenschutz-Präferenz">
      <div className="cookie-consent-card">
        <button
          type="button"
          className="cookie-consent-close"
          aria-label="Popup schließen"
          onClick={() => setVisible(false)}
        >
          ×
        </button>
        <p className="cookie-consent-kicker">Datenschutz</p>
        <h3>Verwendung von Cookies</h3>
        <p>
          Wir verwenden Cookies, um die Funktionalität unserer Website sicherzustellen, um besser zu verstehen, wie unsere Website verwendet wird, und um unsere Werbung zu Marketingzwecken besser auf Ihre Interessen abzustimmen. Weitere Informationen zu unserer Datenverarbeitung mit Hilfe von Cookies finden Sie in der Datenschutzerklärung.
        </p>

        <div className="cookie-consent-options">
          <label className="cookie-option cookie-option-required">
            <input type="checkbox" checked readOnly />
            <span>Essenzielle Cookies (immer aktiv)</span>
          </label>
          <label className="cookie-option">
            <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} />
            <span>Statistik-Cookies</span>
          </label>
          <label className="cookie-option">
            <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} />
            <span>Marketing-Cookies</span>
          </label>
        </div>

        <div className="cookie-consent-actions">
          <button type="button" className="btn cookie-btn-primary" onClick={acceptAll}>Ich akzeptiere alle</button>
          <button type="button" className="btn btn-outline" onClick={onlyEssential}>Nur essenzielle Cookies akzeptieren</button>
          <Link href="/datenschutzerklaerung" className="btn btn-outline cookie-consent-btn-link">Datenschutz öffnen</Link>
        </div>
      </div>
    </div>
  );
}
