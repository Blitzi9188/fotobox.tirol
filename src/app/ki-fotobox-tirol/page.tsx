import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "KI Fotobox Tirol | Kreative KI-Erlebnisse fuer Events",
  description:
    "Eigene Unterseite fuer die KI Fotobox Tirol mit Vorher/Nachher-Beispielen, Live-Demo und Anfrage-CTA."
};

function toParagraphs(value?: string) {
  return (value || "")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatPhoneForHref(value?: string) {
  return (value || "").replace(/[^+\d]/g, "");
}

function splitSlashTitle(value?: string, fallbackTop?: string, fallbackBottom?: string) {
  const source = (value || "").trim();
  if (!source) {
    return { top: fallbackTop || "", bottom: fallbackBottom || "" };
  }

  const [top, ...rest] = source.split("/");
  return {
    top: top.trim() || fallbackTop || "",
    bottom: rest.join("/").trim() || fallbackBottom || ""
  };
}

export default async function KiFotoboxTirolPage() {
  const content = await readCmsContent();
  const paragraphs = toParagraphs(content.ai.descriptionText);
  const leftBefore = content.ai.compareLeftBeforeUrl || "/uploads/hero-optimized.jpg";
  const leftAfter = content.ai.compareLeftAfterUrl || leftBefore;
  const rightAfter = content.ai.compareRightAfterUrl || content.ai.compareRightBeforeUrl || leftBefore;
  const contactEmail = content.contact.email || "info@fotobox.tirol";
  const contactPhone = content.contact.phone || "+43 664 3918 228";
  const featureTitle = splitSlashTitle(content.ai.featureTitle, "Autofokus auf", "Ihre Schokoladenseite.");
  const demoTitle = splitSlashTitle(content.ai.demoTitle, "Intelligente", "Design-Overlays.");
  const heroLineTop = content.ai.heroTitleTop || "Perfekte Bilder.";
  const heroAccent = content.ai.heroTitleAccent || "Magisch";

  const featureCards = (content.ai.featureCards && content.ai.featureCards.length > 0
    ? content.ai.featureCards
    : [
        {
          title: "Smart Lighting",
          description: "Die KI hebt Gesichter hervor, gleicht Schatten aus und sorgt selbst bei schwierigen Lichtverhaeltnissen fuer deutlich bessere Ergebnisse."
        },
        {
          title: "Natuerliche Hauttoene",
          description: "Ruhigere Haut, klarere Farben und ein hochwertiger Gesamteindruck, ohne dass die Bilder kuenstlich oder ueberzeichnet wirken."
        },
        {
          title: "Eventgerechte Looks",
          description: "Hochzeit, Firmenfeier oder Gala: Layouts, Farben und Bildwirkung koennen passend zum Anlass inszeniert werden."
        },
        {
          title: "Sofort einsetzbar",
          description: "Die KI ist nicht nur Demo, sondern Teil eines echten Event-Workflows mit Fotobox, Bedienung, Galerie und auf Wunsch Druck."
        }
      ]).map((item, index) => ({
        ...item,
        icon: (
          index === 0 ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2" />
              <path d="M12 21v2" />
              <path d="M4.22 4.22l1.42 1.42" />
              <path d="M18.36 18.36l1.42 1.42" />
              <path d="M1 12h2" />
              <path d="M21 12h2" />
              <path d="M4.22 19.78l1.42-1.42" />
              <path d="M18.36 5.64l1.42-1.42" />
            </svg>
          ) : index === 1 ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            </svg>
          ) : index === 2 ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16" />
              <path d="M4 12h10" />
              <path d="M4 18h8" />
              <path d="M18 8l2 2-5 5H13v-2Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          )
        )
      }));

  const demoFeatures = content.ai.demoItems && content.ai.demoItems.length > 0
    ? content.ai.demoItems
    : [
        {
          title: "Dynamic Text Engine",
          description: "Namen, Daten oder Claim werden so gesetzt, dass Lesbarkeit und Motiv harmonisch zusammenpassen."
        },
        {
          title: "Contextual Branding",
          description: "Firmenlogos und Event-Branding koennen sichtbar eingebunden werden, ohne das Bild unruhig zu machen."
        }
      ];

  const useCases = content.ai.useCases && content.ai.useCases.length > 0
    ? content.ai.useCases
    : [
        "Hochzeiten mit individuellem Storytelling und Wow-Effekt",
        "Firmenfeiern, Messen und Markenauftritte mit Social Sharing",
        "Gala-Abende, Weihnachtsfeiern und Sommerfeste",
        "Produktpraesentationen, Roadshows und Promotion-Aktionen"
      ];

  return (
    <>
      <SiteHeader content={content} />
      <main className="ki-page">
        <section className="ki-hero">
          <div className="ki-hero-glow" aria-hidden="true" />
          <div className="container ki-hero-inner">
            <div className="ki-badge">
              <span className="ki-badge-dot" aria-hidden="true" />
              {content.ai.heroBadge || "New: Artificial Intelligence"}
            </div>
            <h1>
              {heroLineTop}<br />
              <span>{heroAccent}</span> einfach.
            </h1>
            <p>
              {content.ai.heroLead || "Unsere KI-Fotobox analysiert jedes Motiv in Echtzeit und veredelt Licht, Farben, Hauttoene und Overlays fuer einen sichtbar hochwertigeren Event-Look."}
            </p>
            <div className="ki-hero-actions">
              <Link href="#ki-demo" className="btn btn-primary">Demo ansehen</Link>
              <Link href="#ki-features" className="btn btn-secondary">Wie es funktioniert</Link>
            </div>
          </div>
        </section>

        <section id="ki-features" className="ki-section ki-section-pattern">
          <div className="container ki-feature-layout">
            <div className="ki-feature-copy">
              <div className="ki-icon-tile" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              <h2>
                {featureTitle.top} <br />{featureTitle.bottom}
              </h2>
              <p>
                {content.ai.featureLead ||
                  paragraphs[0] ||
                  "Vergessen Sie schwieriges Licht, unruhige Hintergruende oder flache Handyfilter. Unsere KI erkennt die Szene in Millisekunden und optimiert das Bild automatisch fuer einen professionelleren Look."}
              </p>
              <div className="ki-feature-grid">
                {featureCards.map((item) => (
                  <article className="ki-feature-card" key={item.title}>
                    <div className="ki-feature-card-icon">{item.icon}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="ki-compare-shell">
              <div className="ki-compare-card">
                <div className="ki-compare-stage">
                  <img src={leftAfter} alt="KI optimiertes Beispiel" className="ki-compare-after" />
                  <div className="ki-compare-before-wrap">
                    <img src={leftBefore} alt="Vorher Beispiel" className="ki-compare-before" />
                  </div>
                  <button type="button" className="ki-compare-swipe-button" aria-label="Bildvergleich swipen">
                    <span className="ki-compare-swipe-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M8 6 2 12l6 6" />
                        <path d="M16 6l6 6-6 6" />
                      </svg>
                    </span>
                    Swipe
                  </button>
                  <div className="ki-compare-handle" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </div>
                  <span className="ki-chip ki-chip-dark">VORHER</span>
                  <span className="ki-chip ki-chip-accent">KI OPTIMIERT</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ki-demo" className="ki-section ki-demo-section">
          <div className="container">
            <div className="ki-demo-shell">
              <div className="ki-demo-glow" aria-hidden="true" />
              <div className="ki-demo-grid">
                <div className="ki-demo-visual">
                  <div className="ki-demo-image-wrap">
                    <img src={rightAfter} alt="KI Demo Motiv" className="ki-demo-image" />
                    <div className="ki-demo-overlay">
                      <div className="ki-demo-overlay-mark">
                        <h3>SARAH &amp; TIM</h3>
                        <p>15. Juni 2024 • Seegrube</p>
                      </div>
                    </div>
                  </div>
                  <div className="ki-demo-status">
                    <div className="ki-demo-status-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                      </svg>
                    </div>
                    <div>
                      <span>Status</span>
                      <strong>Overlay Generated</strong>
                    </div>
                  </div>
                </div>

                <div className="ki-demo-copy">
                  <div className="ki-demo-badge">{content.ai.demoBadge || "Live Preview"}</div>
                  <h2>
                    {demoTitle.top} <br />{demoTitle.bottom}
                  </h2>
                  <p>
                    {content.ai.demoLead || "Unsere KI analysiert die Bildkomposition und platziert Texte, Daten oder Logos dort, wo sie wirken und trotzdem genug Raum fuers Motiv bleibt."}
                  </p>
                  <div className="ki-demo-list">
                    {demoFeatures.map((item, index) => (
                      <article className={`ki-demo-item ${index === 0 ? "is-active" : ""}`} key={item.title}>
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                        </div>
                        <span className="ki-demo-item-check" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </span>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ki-section ki-section-light">
          <div className="container ki-usecase-grid">
            <article className="ki-copy-card">
              <h2>{content.ai.useCasesTitle || "Fuer welche Events ist die KI Fotobox stark?"}</h2>
              <p>
                {content.ai.useCasesLead ||
                  paragraphs[1] ||
                  "Besonders gut funktioniert die KI Fotobox bei Events, auf denen Erlebnis, Aufmerksamkeit und modernes Branding zusammenkommen. Dadurch entsteht nicht nur ein Foto, sondern ein echter Gespraechsanlass."}
              </p>
              <ul className="ki-check-list">
                {useCases.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="ki-copy-card ki-copy-card-dark">
              <h2>{content.ai.standardTitle || "Standard in allen Fotoboxen."}</h2>
              <p>
                {content.ai.standardLead || "Wir machen keine Kompromisse bei der Bildwirkung. Die KI-Grundoptimierung ist in jedem unserer Setups als veredelnde Komponente mitdenkbar und laesst sich je nach Eventcharakter intensiver inszenieren."}
              </p>
              <div className="ki-contact-links">
                <Link href="/kontakt" className="btn btn-primary">Termin anfragen</Link>
                <Link href="/preisgestaltung" className="btn btn-secondary btn-secondary-light">Pakete vergleichen</Link>
              </div>
            </article>
          </div>
        </section>

        <section className="ki-section ki-footer-cta">
          <div className="container ki-footer-cta-inner">
            <div>
              <h2>{content.ai.finalTitle || "Direkt zur KI-Fotobox beraten lassen"}</h2>
              <p>
                {content.ai.finalLead || "Wir schauen gemeinsam, ob die KI-Fotobox besser als eigenstaendige Attraktion oder als Upgrade zur klassischen Fotobox fuer dein Event passt."}
              </p>
            </div>
            <div className="ki-direct-contact">
              <a href={`tel:${formatPhoneForHref(contactPhone)}`}>{contactPhone}</a>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              <span>{content.contact.address || "Rohracker 6 | 6092 Birgitz"}</span>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
