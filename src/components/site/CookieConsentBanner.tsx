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

function readConsentCookie() {
  const cookieEntry = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_NAME}=`));
  if (!cookieEntry) return null;
  try {
    return JSON.parse(decodeURIComponent(cookieEntry.split("=").slice(1).join("="))) as Partial<ConsentState>;
  } catch {
    return null;
  }
}

function createConsentState(analytics: boolean, marketing: boolean): ConsentState {
  return { essential: true, analytics, marketing, savedAt: new Date().toISOString() };
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as Partial<ConsentState>) : readConsentCookie();
      if (!parsed) { setVisible(true); return; }
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
    persistConsent(createConsentState(true, true));
  }

  function onlyEssential() {
    persistConsent(createConsentState(false, false));
  }

  function confirmSelection() {
    persistConsent(createConsentState(analytics, marketing));
  }

  if (!visible) return null;

  return (
    <div className="ccb-bar" role="dialog" aria-live="polite" aria-label="Cookie-Einstellungen">
      <div className="ccb-inner">
        <p className="ccb-text">
          Wir verwenden Cookies für die Funktionalität dieser Website sowie – mit deiner Zustimmung – für Statistik und Marketing.{" "}
          <Link href="/datenschutzerklaerung" className="ccb-link">Datenschutz</Link>
          {!expanded && (
            <>
              {" · "}
              <button type="button" className="ccb-link" onClick={() => setExpanded(true)}>
                Einstellungen
              </button>
            </>
          )}
        </p>

        {expanded && (
          <div className="ccb-settings">
            <label className="ccb-option ccb-option-required">
              <input type="checkbox" checked readOnly />
              <span>Essenzielle Cookies (immer aktiv)</span>
            </label>
            <label className="ccb-option">
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
              <span>Statistik</span>
            </label>
            <label className="ccb-option">
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
              <span>Marketing</span>
            </label>
            <button type="button" className="ccb-btn-ghost" onClick={confirmSelection}>
              Auswahl speichern
            </button>
          </div>
        )}

        <div className="ccb-actions">
          <button type="button" className="ccb-btn ccb-btn-primary" onClick={acceptAll}>
            Alle akzeptieren
          </button>
          <button type="button" className="ccb-btn ccb-btn-secondary" onClick={onlyEssential}>
            Nur essenzielle
          </button>
        </div>
      </div>
    </div>
  );
}
