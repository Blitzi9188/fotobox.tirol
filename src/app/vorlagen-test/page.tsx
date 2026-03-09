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

        <section className="container">
          <div className="templates-test-steps">
            <div className="templates-test-step active">
              <div className="templates-test-step-num">1</div>
              <span>Template</span>
            </div>
            <div className="templates-test-line" />
            <div className="templates-test-step">
              <div className="templates-test-step-num">2</div>
              <span>Logo</span>
            </div>
            <div className="templates-test-line" />
            <div className="templates-test-step">
              <div className="templates-test-step-num">3</div>
              <span>Farben</span>
            </div>
            <div className="templates-test-line" />
            <div className="templates-test-step">
              <div className="templates-test-step-num">4</div>
              <span>Bestätigen</span>
            </div>
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
                  <button type="button" className="templates-test-select">Auswählen</button>
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
      </main>
      <SiteFooter content={content} />
    </>
  );
}
