import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import BeforeAfterSlider from "@/components/site/BeforeAfterSlider";
import KiAutoGallery from "@/components/site/KiAutoGallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "KI Fotobox Tirol | Kreative KI-Erlebnisse für Events",
  description:
    "Eigene Unterseite für die KI Fotobox Tirol mit Vorher/Nachher-Beispielen, Live-Demo und Anfrage-CTA."
};

function toParagraphs(value?: string) {
  return (value || "")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
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

function normalizeHeroSegment(value?: string) {
  return (value || "")
    .replace(/[.!?]+$/g, "")
    .trim()
    .toLowerCase();
}

function normalizeHeroBadge(value?: string) {
  const source = (value || "").trim();
  if (!source) return "NEU: KÜNSTLICHE INTELLIGENZ";

  const normalized = source.toLowerCase();
  if (
    normalized === "new: artificial intelligence" ||
    normalized === "neu: künstliche intelligenz" ||
    normalized === "neu: kunstliche intelligenz"
  ) {
    return "NEU: KÜNSTLICHE INTELLIGENZ";
  }

  return source;
}

function normalizeLegacyHeroTitle(top?: string, accent?: string) {
  const normalizedTop = normalizeHeroSegment(top);
  const normalizedAccent = normalizeHeroSegment(accent);
  const combined = `${normalizedTop}/${normalizedAccent}`;

  if (
    combined === "perfekte bilder/magisch einfach" ||
    combined === "perfekte bilder/magisch"
  ) {
    return { top: "intelligente", bottom: "technologien" };
  }

  return {
    top: normalizedTop,
    bottom: normalizedAccent
  };
}

export default async function KiFotoboxTirolPage() {
  const content = await readCmsContent();
  const paragraphs = toParagraphs(content.ai.descriptionText);
  const leftBefore = content.ai.compareLeftBeforeUrl || content.ai.pageCompareBeforeUrl || "/uploads/hero-optimized.jpg";
  const leftAfter = content.ai.compareLeftAfterUrl || content.ai.pageCompareAfterUrl || leftBefore;
  const demoImage = content.ai.pageDemoImageUrl || content.ai.compareRightAfterUrl || content.ai.compareRightBeforeUrl || leftAfter;
  const featureTitle = splitSlashTitle(content.ai.featureTitle, "Autofokus auf", "Ihre Schokoladenseite.");
  const heroLineTop = content.ai.heroTitleTop || "Perfekte Bilder.";
  const heroAccent = content.ai.heroTitleAccent || "Magisch";
  const heroBadge = normalizeHeroBadge(content.ai.heroBadge);
  const heroTitle = normalizeLegacyHeroTitle(heroLineTop, heroAccent);

  const featureCards = (content.ai.featureCards && content.ai.featureCards.length > 0
    ? content.ai.featureCards
    : [
        {
          title: "Smart Lighting",
          description: "Die KI hebt Gesichter hervor, gleicht Schatten aus und sorgt selbst bei schwierigen Lichtverhältnissen für deutlich bessere Ergebnisse."
        },
        {
          title: "Natürliche Hauttöne",
          description: "Ruhigere Haut, klarere Farben und ein hochwertiger Gesamteindruck, ohne dass die Bilder künstlich oder überzeichnet wirken."
        },
        {
          title: "Eventgerechte Looks",
          description: "Hochzeit, Firmenfeier oder Gala: Layouts, Farben und Bildwirkung können passend zum Anlass inszeniert werden."
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
          description: "Firmenlogos und Event-Branding können sichtbar eingebunden werden, ohne das Bild unruhig zu machen."
        }
      ];

  const kiGallerySlides = [
    {
      imageUrl: "/uploads/ki-faceswap-gallery-01.png",
      altText: "Face Swap Motiv 1"
    },
    {
      imageUrl: "/uploads/ki-faceswap-gallery-02.png",
      altText: "Face Swap Motiv 2"
    },
    {
      imageUrl: "/uploads/ki-faceswap-gallery-03.png",
      altText: "Face Swap Motiv 3"
    },
    {
      imageUrl: "/uploads/ki-faceswap-gallery-04.png",
      altText: "Face Swap Motiv 4"
    },
    {
      imageUrl: "/uploads/ki-faceswap-gallery-05.png",
      altText: "Face Swap Motiv 5"
    },
    {
      imageUrl: "/uploads/ki-faceswap-gallery-06.png",
      altText: "Face Swap Motiv 6"
    },
    {
      imageUrl: "/uploads/ki-faceswap-gallery-07.png",
      altText: "Face Swap Motiv 7"
    },
    {
      imageUrl: "/uploads/ki-faceswap-gallery-08.png",
      altText: "Face Swap Motiv 8"
    }
  ];

  const useCases = content.ai.useCases && content.ai.useCases.length > 0
    ? content.ai.useCases
    : [
        "Hochzeiten mit individuellem Storytelling und Wow-Effekt",
        "Firmenfeiern, Messen und Markenauftritte mit Social Sharing",
        "Gala-Abende, Weihnachtsfeiern und Sommerfeste",
        "Produktpräsentationen, Roadshows und Promotion-Aktionen"
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
              {heroBadge}
            </div>
            <h1 className="ki-hero-slash-title">
              <span>{heroTitle.top}</span>
              <span className="accent-slash">/</span>
              <span>{heroTitle.bottom}</span>
            </h1>
            <p>
              {content.ai.heroLead || "Unsere KI-Fotobox analysiert jedes Motiv in Echtzeit und veredelt Licht, Farben, Hauttöne und Overlays für einen sichtbar hochwertigeren Event-Look."}
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
              <h2>
                {featureTitle.top} <br />{featureTitle.bottom}
              </h2>
              <p>
                {content.ai.featureLead ||
                  paragraphs[0] ||
                  "Vergessen Sie schwieriges Licht, unruhige Hintergründe oder flache Handyfilter. Unsere KI erkennt die Szene in Millisekunden und optimiert das Bild automatisch für einen professionelleren Look."}
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
                <BeforeAfterSlider
                  title="KI Bildvergleich"
                  beforeImageUrl={leftBefore}
                  afterImageUrl={leftAfter}
                />
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
                    <img src={demoImage} alt="KI Demo Motiv" className="ki-demo-image" />
                  </div>
                </div>

                <div className="ki-demo-copy">
                  <div className="ki-demo-badge">{content.ai.demoBadge || "Live Preview"}</div>
                  <p>
                    {content.ai.demoLead || "Unsere KI analysiert die Bildkomposition und platziert Texte, Daten oder Logos dort, wo sie wirken und trotzdem genug Raum fürs Motiv bleibt."}
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

        <section className="ki-section">
          <div className="container ki-gallery-heading-wrap">
            <h2 className="ki-gallery-slash-title">
              <span>face</span>
              <span className="accent-slash">/</span>
              <span>swap</span>
            </h2>
            <KiAutoGallery slides={kiGallerySlides} />
          </div>
        </section>

        <section className="ki-section ki-section-light">
          <div className="container ki-usecase-grid">
            <article className="ki-copy-card">
              <h2>{content.ai.useCasesTitle || "Für welche Events ist die KI Fotobox stark?"}</h2>
              <p>
                {content.ai.useCasesLead ||
                  paragraphs[1] ||
                  "Besonders gut funktioniert die KI Fotobox bei Events, auf denen Erlebnis, Aufmerksamkeit und modernes Branding zusammenkommen. Dadurch entsteht nicht nur ein Foto, sondern ein echter Gesprächsanlass."}
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
                {content.ai.standardLead || "Wir machen keine Kompromisse bei der Bildwirkung. Die KI-Grundoptimierung ist in jedem unserer Setups als veredelnde Komponente mitdenkbar und lässt sich je nach Eventcharakter intensiver inszenieren."}
              </p>
              <div className="ki-contact-links">
                <Link href="/kontakt" className="btn btn-primary">Termin anfragen</Link>
                <Link href="/preisgestaltung" className="btn btn-secondary btn-secondary-light">Pakete vergleichen</Link>
              </div>
            </article>
          </div>
        </section>

      </main>
      <SiteFooter content={content} />
    </>
  );
}
