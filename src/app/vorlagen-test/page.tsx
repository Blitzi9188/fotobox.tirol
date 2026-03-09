import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import { readCmsContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

const formatTabs = [
  "3er Streifen",
  "10x15 Querformat",
  "1 Bild Hoch",
  "1 Bild Quer",
  "Individuell"
];

const filterTabs = ["Alle", "Hochzeit", "Firmenfeier", "Geburtstag", "Messe"];

const templateCards = [
  { badge: "3er Streifen · 5x15cm", name: "Classic Strip", layout: "strip3", label: "Logo · Event", labelClass: "" },
  { badge: "3er Streifen · 5x15cm", name: "Red Line", layout: "strip3 red-line", label: "Event 2025", labelClass: "accent" },
  { badge: "3er Streifen · 5x15cm", name: "Midnight Dark", layout: "strip3 dark-theme", label: "Midnight", labelClass: "dark" },
  { badge: "10x15 Querformat · 3 Bilder", name: "Trio Landscape", layout: "postcard-land", label: "Logo · Datum", labelClass: "" },
  { badge: "10x15 Querformat · 3 Bilder", name: "Boho Trio", layout: "postcard-land boho", label: "Just Married", labelClass: "boho" },
  { badge: "1 Bild · 10x15cm Hochformat", name: "Portrait Full", layout: "single-portrait", label: "Firmenname · 2025", labelClass: "accent" },
  { badge: "1 Bild · 15x10cm Querformat", name: "Landscape Full", layout: "single-land", label: "Logo · Datum", labelClass: "" }
];

export default async function VorlagenTestPage() {
  const content = await readCmsContent();

  return (
    <>
      <SiteHeader content={content} />
      <main className="templates-test-page">
        <section className="templates-test-header container">
          <h1>
            layout<span className="accent-slash">/</span>
            <span>vorlagen</span>
          </h1>
          <p>Wählen Sie eine professionelle Design-Grundlage für Ihre Fotos.</p>
        </section>

        <section className="container" id="step-template">
          <div className="templates-test-steps">
            <a href="#step-template" className="templates-test-step active">
              <div className="templates-test-step-num">1</div>
              <span>Template</span>
            </a>
            <div className="templates-test-line" />
            <a href="#step-logo" className="templates-test-step">
              <div className="templates-test-step-num">2</div>
              <span>Logo</span>
            </a>
            <div className="templates-test-line" />
            <a href="#step-colors" className="templates-test-step">
              <div className="templates-test-step-num">3</div>
              <span>Farben</span>
            </a>
            <div className="templates-test-line" />
            <a href="#step-confirm" className="templates-test-step">
              <div className="templates-test-step-num">4</div>
              <span>Bestätigen</span>
            </a>
          </div>

          <div className="templates-test-format-tabs">
            {formatTabs.map((tab, index) => (
              <button
                type="button"
                key={tab}
                className={`templates-test-format-tab ${index === 0 ? "active" : ""} ${tab === "Individuell" ? "custom" : ""}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="templates-test-filter-bar">
            {filterTabs.map((tab, index) => (
              <button
                type="button"
                key={tab}
                className={`templates-test-filter-btn ${index === 0 ? "active" : ""}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="templates-test-gallery">
            {templateCards.map((card) => (
              <article className="templates-test-card" key={card.name}>
                <div className="templates-test-preview">
                  <div className={`templates-test-mock ${card.layout}`}>
                    <div className="templates-test-photo" />
                    {card.layout.includes("postcard-land") ? (
                      <>
                        <div className="templates-test-photo" />
                        <div className="templates-test-photo" />
                      </>
                    ) : null}
                    {card.layout.includes("strip3") ? (
                      <>
                        <div className="templates-test-photo" />
                        <div className="templates-test-photo" />
                      </>
                    ) : null}
                    <div className={`templates-test-label ${card.labelClass}`}>{card.label}</div>
                  </div>
                </div>

                <div className="templates-test-info">
                  <span className="templates-test-badge">{card.badge}</span>
                  <h3>{card.name}</h3>
                  <a href="#step-logo" className="templates-test-select">Auswählen</a>
                </div>
              </article>
            ))}

            <article className="templates-test-card templates-test-card-custom">
              <div className="templates-test-preview templates-test-preview-custom">
                <div className="templates-test-custom-icon">+</div>
                <p>Eigenes Design hochladen</p>
              </div>
              <div className="templates-test-info">
                <span className="templates-test-badge templates-test-badge-custom">Individuell · Alle Formate</span>
                <h3 className="templates-test-custom-title">Individuelles Design</h3>
                <Link href="/kontakt" className="templates-test-select templates-test-select-custom">Anfragen</Link>
              </div>
            </article>
          </div>
        </section>

        <section className="container templates-logo-test-section" id="step-logo">
          <div className="templates-logo-test-header">
            <h2>
              logo<span className="accent-slash">/</span>
              <span>branding</span>
            </h2>
            <p>Laden Sie Ihr Logo hoch und platzieren Sie es auf Ihrem Design.</p>
          </div>

          <div className="templates-test-steps">
            <a href="#step-template" className="templates-test-step completed">
              <div className="templates-test-step-num">✓</div>
              <span>Template</span>
            </a>
            <div className="templates-test-line" />
            <a href="#step-logo" className="templates-test-step active">
              <div className="templates-test-step-num">2</div>
              <span>Logo</span>
            </a>
            <div className="templates-test-line" />
            <a href="#step-colors" className="templates-test-step">
              <div className="templates-test-step-num">3</div>
              <span>Farben</span>
            </a>
            <div className="templates-test-line" />
            <a href="#step-confirm" className="templates-test-step">
              <div className="templates-test-step-num">4</div>
              <span>Bestätigen</span>
            </a>
          </div>

          <div className="templates-logo-editor-grid">
            <div className="templates-logo-preview-area">
              <span className="templates-logo-preview-label">Vorschau: Classic Strip</span>
              <div className="templates-logo-strip-preview">
                <div className="templates-logo-photo-placeholder">
                  <div className="templates-logo-photo-icon" />
                </div>
                <div className="templates-logo-photo-placeholder">
                  <div className="templates-logo-photo-icon" />
                </div>
                <div className="templates-logo-photo-placeholder">
                  <div className="templates-logo-photo-icon" />
                </div>
                <div className="templates-logo-display-zone">
                  <div className="templates-logo-placeholder-text">IHR LOGO</div>
                </div>
              </div>
            </div>

            <div className="templates-logo-controls-panel">
              <div className="templates-logo-control-group">
                <span className="templates-logo-control-label">Logo Upload</span>
                <div className="templates-logo-upload-box">
                  <div className="templates-logo-upload-icon">↑</div>
                  <p><span>Datei auswählen</span> oder per Drag &amp; Drop hierher ziehen</p>
                  <p className="templates-logo-upload-hint">PNG, JPG oder SVG (max. 5MB)</p>
                </div>
              </div>

              <div className="templates-logo-control-group">
                <span className="templates-logo-control-label">Größe anpassen</span>
                <div className="templates-logo-setting-row">
                  <div className="templates-logo-setting-head">
                    <span>Skalierung</span>
                    <span>80%</span>
                  </div>
                  <input type="range" className="templates-logo-range-slider" min="10" max="100" value="80" readOnly />
                </div>
              </div>

              <div className="templates-logo-control-group">
                <span className="templates-logo-control-label">Ausrichtung</span>
                <div className="templates-logo-position-grid">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`templates-logo-pos-btn ${index === 4 ? "active" : ""}`}
                      aria-label={`Position ${index + 1}`}
                    >
                      <span />
                    </button>
                  ))}
                </div>
              </div>

              <div className="templates-logo-actions-footer">
                <a href="#step-template" className="templates-logo-btn templates-logo-btn-secondary">Zurück</a>
                <a href="#step-colors" className="templates-logo-btn templates-logo-btn-primary">Weiter zu Farben</a>
              </div>
            </div>
          </div>
        </section>

        <section className="container templates-colors-test-section" id="step-colors">
          <div className="templates-colors-test-header">
            <h2>
              farben<span className="accent-slash">/</span>
              <span>anpassung</span>
            </h2>
            <p>Personalisieren Sie Ihr Layout passend zu Ihrem Event-Design.</p>
          </div>

          <div className="templates-test-steps">
            <a href="#step-template" className="templates-test-step completed">
              <div className="templates-test-step-num">1</div>
              <span>Template</span>
            </a>
            <div className="templates-test-line" />
            <a href="#step-logo" className="templates-test-step completed">
              <div className="templates-test-step-num">2</div>
              <span>Logo</span>
            </a>
            <div className="templates-test-line" />
            <a href="#step-colors" className="templates-test-step active">
              <div className="templates-test-step-num">3</div>
              <span>Farben</span>
            </a>
            <div className="templates-test-line" />
            <a href="#step-confirm" className="templates-test-step">
              <div className="templates-test-step-num">4</div>
              <span>Bestätigen</span>
            </a>
          </div>

          <div className="templates-colors-configurator-grid">
            <div className="templates-colors-preview-panel">
              <span className="templates-colors-preview-label">Vorschau: Red Line (3er Streifen)</span>

              <div className="templates-colors-live-preview-template">
                <div className="templates-colors-live-photo" />
                <div className="templates-colors-live-photo" />
                <div className="templates-colors-live-photo" />
                <div className="templates-colors-live-footer">
                  <div className="templates-colors-live-logo-placeholder" />
                  <div className="templates-colors-live-text">LUCAS &amp; SOPHIE · 2025</div>
                </div>
              </div>

              <div className="templates-colors-preview-note">
                * Die Vorschau zeigt eine ungefähre Darstellung. Farben können im Druck leicht abweichen.
              </div>
            </div>

            <div className="templates-colors-controls-panel">
              <div className="templates-colors-control-group">
                <label className="templates-colors-control-label">Akzentfarbe (Linien &amp; Details)</label>
                <div className="templates-colors-color-options">
                  <div className="templates-colors-color-swatch active" style={{ background: "#ea2c2c" }} />
                  <div className="templates-colors-color-swatch" style={{ background: "#2c58ea" }} />
                  <div className="templates-colors-color-swatch" style={{ background: "#2cea82" }} />
                  <div className="templates-colors-color-swatch" style={{ background: "#ea2ca6" }} />
                  <div className="templates-colors-color-swatch" style={{ background: "#111111" }} />
                </div>
                <div className="templates-colors-custom-input-wrap">
                  <input type="text" className="templates-colors-hex-input" value="#ea2c2c" readOnly />
                  <div className="templates-colors-color-swatch templates-colors-custom-preview" style={{ background: "#ea2c2c" }} />
                </div>
              </div>

              <div className="templates-colors-control-group">
                <label className="templates-colors-control-label">Hintergrund</label>
                <div className="templates-colors-color-options">
                  <div className="templates-colors-color-swatch active templates-colors-light-border" style={{ background: "#ffffff" }} />
                  <div className="templates-colors-color-swatch" style={{ background: "#f5f5f5" }} />
                  <div className="templates-colors-color-swatch" style={{ background: "#faf8f5" }} />
                  <div className="templates-colors-color-swatch" style={{ background: "#111111" }} />
                  <div className="templates-colors-color-swatch" style={{ background: "#222222" }} />
                </div>
              </div>

              <div className="templates-colors-control-group">
                <label className="templates-colors-control-label">Schriftart</label>
                <div className="templates-colors-font-options">
                  <div className="templates-colors-font-item active">
                    <span>Modern Sans</span>
                    <span className="templates-colors-font-aa">Aa</span>
                  </div>
                  <div className="templates-colors-font-item templates-colors-font-serif">
                    <span>Elegant Serif</span>
                    <span className="templates-colors-font-aa">Aa</span>
                  </div>
                  <div className="templates-colors-font-item templates-colors-font-mono">
                    <span>Minimalist Mono</span>
                    <span className="templates-colors-font-aa">Aa</span>
                  </div>
                </div>
              </div>

              <div className="templates-colors-navigation-btns">
                <a href="#step-logo" className="templates-colors-btn-back">← Zurück</a>
                <a href="#step-confirm" className="templates-colors-btn-next">Vorschau Bestätigen</a>
              </div>
            </div>
          </div>
        </section>

        <section className="container templates-confirm-test-section" id="step-confirm">
          <div className="templates-confirm-test-header">
            <h2>
              fast<span className="accent-slash">/</span>
              <span>fertig</span>
            </h2>
            <p>Prüfen Sie Ihre Auswahl und senden Sie uns Ihre unverbindliche Anfrage.</p>
          </div>

          <div className="templates-test-steps">
            <a href="#step-template" className="templates-test-step">
              <div className="templates-test-step-num">1</div>
              <span>Template</span>
            </a>
            <div className="templates-test-line" />
            <a href="#step-logo" className="templates-test-step">
              <div className="templates-test-step-num">2</div>
              <span>Logo</span>
            </a>
            <div className="templates-test-line" />
            <a href="#step-colors" className="templates-test-step">
              <div className="templates-test-step-num">3</div>
              <span>Farben</span>
            </a>
            <div className="templates-test-line" />
            <a href="#step-confirm" className="templates-test-step active">
              <div className="templates-test-step-num">4</div>
              <span>Bestätigen</span>
            </a>
          </div>

          <div className="templates-confirm-view">
            <div className="templates-confirm-preview-panel">
              <div className="templates-confirm-print-mockup">
                <div className="templates-confirm-mock-photo" />
                <div className="templates-confirm-mock-photo" />
                <div className="templates-confirm-mock-photo" />
                <div className="templates-confirm-logo-area">
                  <div className="templates-confirm-logo-svg">+</div>
                  <span className="templates-confirm-event-text">Sommerfest 2025</span>
                </div>
              </div>
            </div>

            <div className="templates-confirm-summary-panel">
              <div className="templates-confirm-summary-card">
                <span className="templates-confirm-summary-label">Gewähltes Layout</span>
                <div className="templates-confirm-summary-value">Classic Strip (3er Streifen)</div>
              </div>

              <div className="templates-confirm-summary-card">
                <span className="templates-confirm-summary-label">Logo &amp; Branding</span>
                <div className="templates-confirm-summary-value">Firmenlogo_2025_v2.png</div>
              </div>

              <div className="templates-confirm-summary-card">
                <span className="templates-confirm-summary-label">Akzentfarbe</span>
                <div className="templates-confirm-summary-value">
                  <div className="templates-confirm-color-dot" />
                  <span>#EA2C2C (Tirol Rot)</span>
                </div>
              </div>

              <div className="templates-confirm-cta-section">
                <button type="button" className="templates-confirm-btn-primary">Jetzt anfragen</button>
                <a href="#step-colors" className="templates-confirm-btn-back">Zurück zur Bearbeitung</a>
              </div>

              <p className="templates-confirm-note">
                Nach Ihrer Anfrage senden wir Ihnen ein detailliertes Angebot sowie einen Korrekturabzug Ihres Designs zu.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
