"use client";

import { useMemo, useState } from "react";

const formatTabs = [
  "3er Streifen",
  "10x15 Querformat",
  "1 Bild Hoch",
  "1 Bild Quer",
  "Individuell"
];

const filterTabs = ["Alle", "Hochzeit", "Firmenfeier", "Geburtstag", "Messe"];

const accentColors = [
  { name: "Tirol Rot", value: "#ea2c2c" },
  { name: "Royal Blau", value: "#2c58ea" },
  { name: "Mint Grün", value: "#2cea82" },
  { name: "Magenta", value: "#ea2ca6" },
  { name: "Schwarz", value: "#111111" }
];

const backgroundColors = [
  { name: "Weiß", value: "#ffffff" },
  { name: "Hellgrau", value: "#f5f5f5" },
  { name: "Creme", value: "#faf8f5" },
  { name: "Dunkel", value: "#111111" },
  { name: "Anthrazit", value: "#222222" }
];

const fontOptions = [
  { name: "Modern Sans", className: "" },
  { name: "Elegant Serif", className: "templates-colors-font-serif" },
  { name: "Minimalist Mono", className: "templates-colors-font-mono" }
];

const templateCards = [
  { badge: "3er Streifen · 5x15cm", name: "Classic Strip", layout: "strip3", label: "Logo · Event", labelClass: "" },
  { badge: "3er Streifen · 5x15cm", name: "Red Line", layout: "strip3 red-line", label: "Event 2025", labelClass: "accent" },
  { badge: "3er Streifen · 5x15cm", name: "Midnight Dark", layout: "strip3 dark-theme", label: "Midnight", labelClass: "dark" },
  { badge: "10x15 Querformat · 3 Bilder", name: "Trio Landscape", layout: "postcard-land", label: "Logo · Datum", labelClass: "" },
  { badge: "10x15 Querformat · 3 Bilder", name: "Boho Trio", layout: "postcard-land boho", label: "Just Married", labelClass: "boho" },
  { badge: "1 Bild · 10x15cm Hochformat", name: "Portrait Full", layout: "single-portrait", label: "Firmenname · 2025", labelClass: "accent" },
  { badge: "1 Bild · 15x10cm Querformat", name: "Landscape Full", layout: "single-land", label: "Logo · Datum", labelClass: "" }
];

function WizardSteps({
  currentStep,
  maxUnlockedStep,
  onStepChange
}: {
  currentStep: number;
  maxUnlockedStep: number;
  onStepChange: (step: number) => void;
}) {
  const items = ["Template", "Logo", "Farben", "Bestätigen"];

  return (
    <div className="templates-test-steps">
      {items.map((item, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const isUnlocked = step <= maxUnlockedStep;

        return (
          <div className="templates-test-step-wrap" key={item}>
            <button
              type="button"
              className={`templates-test-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
              onClick={() => onStepChange(step)}
              disabled={!isUnlocked}
            >
              <div className="templates-test-step-num">{isCompleted && step === 1 ? "✓" : step}</div>
              <span>{item}</span>
            </button>
            {step < items.length ? <div className="templates-test-line" /> : null}
          </div>
        );
      })}
    </div>
  );
}

export default function TemplateWizardTest() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(templateCards[0]);
  const [selectedAccent, setSelectedAccent] = useState(accentColors[0]);
  const [selectedBackground, setSelectedBackground] = useState(backgroundColors[0]);
  const [selectedFont, setSelectedFont] = useState(fontOptions[0]);

  const openStep = (step: number) => {
    if (step <= maxUnlockedStep) {
      setCurrentStep(step);
    }
  };

  const goToStep = (step: number) => {
    setMaxUnlockedStep((previous) => Math.max(previous, step));
    setCurrentStep(step);
  };

  const logoScale = 80;

  const accentLabel = useMemo(
    () => `${selectedAccent.value.toUpperCase()} (${selectedAccent.name})`,
    [selectedAccent]
  );

  const heroCopy = useMemo(() => {
    if (currentStep === 2) {
      return {
        titleLeft: "logo",
        titleRight: "branding",
        text: "Laden Sie Ihr Logo hoch und platzieren Sie es auf Ihrem Design."
      };
    }

    if (currentStep === 3) {
      return {
        titleLeft: "farben",
        titleRight: "anpassung",
        text: "Personalisieren Sie Ihr Layout passend zu Ihrem Event-Design."
      };
    }

    if (currentStep === 4) {
      return {
        titleLeft: "fast",
        titleRight: "fertig",
        text: "Prüfen Sie Ihre Auswahl und senden Sie uns Ihre unverbindliche Anfrage."
      };
    }

    return {
      titleLeft: "layout",
      titleRight: "vorlagen",
      text: "Wählen Sie eine professionelle Design-Grundlage für Ihre Fotos."
    };
  }, [currentStep]);

  return (
    <main className="templates-test-page">
      <section className="templates-test-header container">
        <h1>
          {heroCopy.titleLeft}
          <span className="accent-slash">/</span>
          <span>{heroCopy.titleRight}</span>
        </h1>
        <p>{heroCopy.text}</p>
      </section>

      {currentStep === 1 ? (
        <section className="container">
          <WizardSteps currentStep={1} maxUnlockedStep={maxUnlockedStep} onStepChange={openStep} />

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
                  <button
                    type="button"
                    className="templates-test-select"
                    onClick={() => {
                      setSelectedTemplate(card);
                      goToStep(2);
                    }}
                  >
                    Auswählen
                  </button>
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
                <button
                  type="button"
                  className="templates-test-select templates-test-select-custom"
                  onClick={() => goToStep(2)}
                >
                  Anfragen
                </button>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      {currentStep === 2 ? (
        <section className="container templates-logo-test-section">
          <WizardSteps currentStep={2} maxUnlockedStep={maxUnlockedStep} onStepChange={openStep} />

          <div className="templates-logo-editor-grid">
            <div className="templates-logo-preview-area">
              <span className="templates-logo-preview-label">Vorschau: {selectedTemplate.name}</span>
              <div className="templates-logo-strip-preview">
                <div className="templates-logo-photo-placeholder"><div className="templates-logo-photo-icon" /></div>
                <div className="templates-logo-photo-placeholder"><div className="templates-logo-photo-icon" /></div>
                <div className="templates-logo-photo-placeholder"><div className="templates-logo-photo-icon" /></div>
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
                    <span>{logoScale}%</span>
                  </div>
                  <input type="range" className="templates-logo-range-slider" min="10" max="100" value={logoScale} readOnly />
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
                <button type="button" className="templates-logo-btn templates-logo-btn-secondary" onClick={() => setCurrentStep(1)}>
                  Zurück
                </button>
                <button type="button" className="templates-logo-btn templates-logo-btn-primary" onClick={() => goToStep(3)}>
                  Weiter zu Farben
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {currentStep === 3 ? (
        <section className="container templates-colors-test-section">
          <WizardSteps currentStep={3} maxUnlockedStep={maxUnlockedStep} onStepChange={openStep} />

          <div className="templates-colors-configurator-grid">
            <div className="templates-colors-preview-panel">
              <span className="templates-colors-preview-label">Vorschau: {selectedTemplate.name}</span>

              <div className="templates-colors-live-preview-template" style={{ background: selectedBackground.value }}>
                <div className="templates-colors-live-photo" style={{ borderBottomColor: selectedAccent.value }} />
                <div className="templates-colors-live-photo" style={{ borderBottomColor: selectedAccent.value }} />
                <div className="templates-colors-live-photo" style={{ borderBottomColor: selectedAccent.value }} />
                <div className="templates-colors-live-footer" style={{ background: selectedBackground.value }}>
                  <div className="templates-colors-live-logo-placeholder" style={{ background: selectedAccent.value }} />
                  <div className={`templates-colors-live-text ${selectedFont.className}`}>LUCAS &amp; SOPHIE · 2025</div>
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
                  {accentColors.map((color) => (
                    <button
                      type="button"
                      key={color.value}
                      className={`templates-colors-color-swatch ${selectedAccent.value === color.value ? "active" : ""}`}
                      style={{ background: color.value }}
                      aria-label={color.name}
                      onClick={() => setSelectedAccent(color)}
                    />
                  ))}
                </div>
                <div className="templates-colors-custom-input-wrap">
                  <input type="text" className="templates-colors-hex-input" value={selectedAccent.value} readOnly />
                  <div className="templates-colors-color-swatch templates-colors-custom-preview" style={{ background: selectedAccent.value }} />
                </div>
              </div>

              <div className="templates-colors-control-group">
                <label className="templates-colors-control-label">Hintergrund</label>
                <div className="templates-colors-color-options">
                  {backgroundColors.map((color) => (
                    <button
                      type="button"
                      key={color.value}
                      className={`templates-colors-color-swatch ${selectedBackground.value === color.value ? "active" : ""} ${color.value === "#ffffff" ? "templates-colors-light-border" : ""}`}
                      style={{ background: color.value }}
                      aria-label={color.name}
                      onClick={() => setSelectedBackground(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="templates-colors-control-group">
                <label className="templates-colors-control-label">Schriftart</label>
                <div className="templates-colors-font-options">
                  {fontOptions.map((font) => (
                    <button
                      type="button"
                      key={font.name}
                      className={`templates-colors-font-item ${font.className} ${selectedFont.name === font.name ? "active" : ""}`}
                      onClick={() => setSelectedFont(font)}
                    >
                      <span>{font.name}</span>
                      <span className="templates-colors-font-aa">Aa</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="templates-colors-navigation-btns">
                <button type="button" className="templates-colors-btn-back" onClick={() => setCurrentStep(2)}>← Zurück</button>
                <button type="button" className="templates-colors-btn-next" onClick={() => goToStep(4)}>Vorschau Bestätigen</button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {currentStep === 4 ? (
        <section className="container templates-confirm-test-section">
          <WizardSteps currentStep={4} maxUnlockedStep={maxUnlockedStep} onStepChange={openStep} />

          <div className="templates-confirm-view">
            <div className="templates-confirm-preview-panel">
              <div className="templates-confirm-print-mockup">
                <div className="templates-confirm-mock-photo" />
                <div className="templates-confirm-mock-photo" />
                <div className="templates-confirm-mock-photo" />
                <div className="templates-confirm-logo-area">
                  <div className="templates-confirm-logo-svg" style={{ color: selectedAccent.value }}>+</div>
                  <span className={`templates-confirm-event-text ${selectedFont.className}`}>Sommerfest 2025</span>
                </div>
              </div>
            </div>

            <div className="templates-confirm-summary-panel">
              <div className="templates-confirm-summary-card">
                <span className="templates-confirm-summary-label">Gewähltes Layout</span>
                <div className="templates-confirm-summary-value">{selectedTemplate.name}</div>
              </div>

              <div className="templates-confirm-summary-card">
                <span className="templates-confirm-summary-label">Logo &amp; Branding</span>
                <div className="templates-confirm-summary-value">Firmenlogo_2025_v2.png</div>
              </div>

              <div className="templates-confirm-summary-card">
                <span className="templates-confirm-summary-label">Akzentfarbe</span>
                <div className="templates-confirm-summary-value">
                  <div className="templates-confirm-color-dot" style={{ background: selectedAccent.value }} />
                  <span>{accentLabel}</span>
                </div>
              </div>

              <div className="templates-confirm-cta-section">
                <button type="button" className="templates-confirm-btn-primary">Jetzt anfragen</button>
                <button type="button" className="templates-confirm-btn-back" onClick={() => setCurrentStep(3)}>Zurück zur Bearbeitung</button>
              </div>

              <p className="templates-confirm-note">
                Nach Ihrer Anfrage senden wir Ihnen ein detailliertes Angebot sowie einen Korrekturabzug Ihres Designs zu.
              </p>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
