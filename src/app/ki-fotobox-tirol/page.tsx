import type { Metadata } from "next";
import Link from "next/link";
import BeforeAfterSlider from "@/components/site/BeforeAfterSlider";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "KI Fotobox Tirol | Kreative KI-Erlebnisse fuer Events",
  description:
    "Eigene Unterseite fuer die KI Fotobox Tirol mit Beispielen, Einsatzbereichen und Anfrage-CTA."
};

function toParagraphs(value?: string) {
  return (value || "")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function KiFotoboxTirolPage() {
  const content = await readCmsContent();
  const paragraphs = toParagraphs(content.ai.descriptionText);
  const useCases = [
    "Firmenfeiern mit starkem Wow-Effekt und Social Sharing",
    "Messen, Roadshows und Produktpraesentationen",
    "Hochzeiten mit kreativen Themenwelten",
    "Sommerfeste, Weihnachtsfeiern und Gala-Abende"
  ];
  const processSteps = [
    {
      title: "Motiv waehlen",
      text: "Gaeste starten wie an einer klassischen Fotobox und bekommen in wenigen Klicks eine KI-Transformation."
    },
    {
      title: "Bild erzeugen",
      text: "Die KI erstellt direkt vor Ort ein kreatives Ergebnis, das sich klar vom Standardfoto abhebt."
    },
    {
      title: "Teilen oder drucken",
      text: "Das Ergebnis kann digital genutzt oder mit dem restlichen Eventkonzept kombiniert werden."
    }
  ];
  const formatBenefits = [
    "Starker Gespraechsanlass direkt am Event",
    "Hohe Interaktion statt rein passiver Nutzung",
    "Marken- oder Eventthemen koennen sichtbar eingebunden werden",
    "Perfekt als Upgrade zur klassischen Fotobox"
  ];

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <section className="page-hero seo-landing-hero">
          <div className="container">
            <h1>KI Fotobox Tirol</h1>
            <p>
              Moderne Eventunterhaltung mit kuenstlicher Intelligenz, Sofortdruck und starken
              Vorher/Nachher-Effekten fuer Hochzeiten, Firmenfeiern und Markenauftritte.
            </p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="container seo-landing-grid">
            <article className="admin-card">
              <h2>Was die KI Fotobox besonders macht</h2>
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>

            <aside className="admin-card">
              <h2>Schnellueberblick</h2>
              <ul className="seo-landing-list">
                <li>Ideal fuer Hochzeiten, Sommerfeste, Messen und Firmenfeiern</li>
                <li>Visuelle Transformationen in wenigen Sekunden</li>
                <li>Starker Blickfang fuer Social Content und Event-Highlights</li>
                <li>Kombinierbar mit Branding, Druck und klassischer Fotobox</li>
              </ul>
              <Link href="/kontakt" className="btn seo-landing-cta">KI Fotobox anfragen</Link>
            </aside>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="container">
            <div className="seo-detail-strip">
              {processSteps.map((step, index) => (
                <article className="admin-card seo-detail-card" key={step.title}>
                  <span className="seo-step-index">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="seo-landing-section seo-landing-alt">
          <div className="container">
            <div className="ki-landing-grid">
              <div className="admin-card">
                <h2>Beispiel 1</h2>
                <BeforeAfterSlider
                  title="KI Beispiel Links"
                  beforeImageUrl={content.ai.compareLeftBeforeUrl}
                  afterImageUrl={content.ai.compareLeftAfterUrl}
                />
              </div>
              <div className="admin-card">
                <h2>Beispiel 2</h2>
                <BeforeAfterSlider
                  title="KI Beispiel Rechts"
                  beforeImageUrl={content.ai.compareRightBeforeUrl}
                  afterImageUrl={content.ai.compareRightAfterUrl}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="container seo-landing-grid">
            <article className="admin-card">
              <h2>Fuer welche Events eignet sich die KI Fotobox?</h2>
              <p>
                Besonders stark funktioniert die KI Fotobox dort, wo Aufmerksamkeit und Erlebnis
                wichtig sind: auf Firmenfeiern, Messen, Produktpraesentationen, Weihnachtsfeiern
                und Hochzeiten. Die Gaeste bekommen nicht nur ein normales Foto, sondern eine
                klar erkennbare Transformation mit Wow-Effekt.
              </p>
              <p>
                Im Unternehmenskontext ist das spannend fuer Reichweite, Markeninszenierung und
                Social Sharing. Bei privaten Feiern sorgt die KI-Funktion fuer kreative Motive und
                mehr Interaktion rund um die Fotobox.
              </p>
            </article>

            <article className="admin-card">
              <h2>Kombination mit klassischer Fotobox</h2>
              <p>
                Die KI Fotobox muss nicht isoliert gedacht werden. Sie kann als Upgrade zur
                klassischen Fotobox eingesetzt werden. Damit bleibt die bewaehrte Nutzung mit
                Druck, Layout und Galerie erhalten, waehrend die KI-Komponente ein zusaetzliches
                Highlight schafft.
              </p>
              <p>
                So bekommst du eine Seite, die die KI sauber verkauft, ohne das Hauptangebot der
                Fotobox Tirol zu verlassen.
              </p>
            </article>
          </div>
        </section>

        <section className="seo-landing-section seo-landing-alt">
          <div className="container seo-landing-grid">
            <article className="admin-card">
              <h2>Besonders geeignet fuer</h2>
              <ul className="seo-landing-list">
                {useCases.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>

            <article className="admin-card">
              <h2>Warum Veranstalter das buchen</h2>
              <ul className="seo-landing-list">
                {formatBenefits.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link href="/kontakt" className="btn seo-landing-cta">KI Einsatz anfragen</Link>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
