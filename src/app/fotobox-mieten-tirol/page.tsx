import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";

const SITE_URL = "https://fotoboxtirol-production.up.railway.app";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fotobox mieten Tirol | Fotobox Tirol das Original",
  description:
    "Fotobox mieten in Tirol für Hochzeiten, Firmenfeiern, Geburtstage und Events. Fotobox Tirol das Original mit Druck, Branding, Requisiten und KI-Funktionen.",
  alternates: {
    canonical: "/fotobox-mieten-tirol"
  },
  openGraph: {
    title: "Fotobox mieten Tirol | Fotobox Tirol das Original",
    description:
      "Premium Fotobox mieten in Tirol für Hochzeiten, Firmenfeiern, Geburtstage und Events.",
    url: `${SITE_URL}/fotobox-mieten-tirol`,
    type: "article"
  }
};

export default async function FotoboxMietenTirolPage() {
  const content = await readCmsContent();
  const faqItems = content.faq.items.slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Fotobox mieten Tirol",
        url: `${SITE_URL}/fotobox-mieten-tirol`,
        description:
          "Fotobox Tirol für Hochzeiten, Firmenfeiern, Geburtstage und Events in Tirol."
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Startseite",
            item: SITE_URL
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Fotobox mieten Tirol",
            item: `${SITE_URL}/fotobox-mieten-tirol`
          }
        ]
      }
    ]
  };

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section className="page-hero seo-landing-hero">
          <div className="container">
            <h1>Fotobox mieten Tirol</h1>
            <p>
              Fotobox Tirol das Original für Hochzeiten, Firmenfeiern, Geburtstage, Messen und Events in Tirol.
              Mit Sofortdruck, individuellem Branding, Requisiten und optionaler KI-Fotobox.
            </p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="container seo-landing-grid">
            <article className="admin-card">
              <h2>Warum eine Fotobox in Tirol mieten?</h2>
              <p>
                Wer eine Fotobox in Tirol mieten will, sucht in der Regel eine unkomplizierte Lösung, die auf
                Hochzeiten, Firmenfeiern und privaten Events sofort funktioniert. Genau darauf ist Fotobox Tirol
                ausgelegt: schneller Aufbau, einfache Bedienung, hochwertige Ausdrucke und Bilder, die direkt vor Ort
                und danach digital verfügbar sind.
              </p>
              <p>
                Besonders bei Hochzeiten in Innsbruck, Seefeld, Kitzbühel, Telfs oder im gesamten Tiroler Oberland ist
                eine Fotobox ein fixer Stimmungsmacher. Für Firmenkunden kommen individuelle Layouts, Logos und
                gebrandete Ausdrucke dazu. Damit wird aus der Fotobox nicht nur Unterhaltung, sondern ein echter Teil
                des Event-Konzepts.
              </p>
            </article>

            <aside className="admin-card">
              <h2>Schnellüberblick</h2>
              <ul className="seo-landing-list">
                <li>Fotobox für Hochzeit, Firmenfeier, Geburtstag und Messe</li>
                <li>Sofortdruck in Laborqualität</li>
                <li>Individuelle Layouts und Branding</li>
                <li>Accessoires und Requisiten</li>
                <li>Optional mit KI-Fotobox</li>
                <li>Servicegebiet: Tirol und Umgebung</li>
              </ul>
              <Link href="/kontakt" className="btn seo-landing-cta">Jetzt anfragen</Link>
            </aside>
          </div>
        </section>

        <section className="seo-landing-section seo-landing-alt">
          <div className="container seo-landing-grid">
            <article className="admin-card">
              <h2>Fotobox für Hochzeiten in Tirol</h2>
              <p>
                Eine Fotobox für Hochzeiten in Tirol sorgt dafür, dass Gäste unkompliziert Erinnerungsfotos
                mitnehmen können. Beliebt sind vor allem individuelle Drucklayouts mit Namen des Brautpaares,
                Hochzeitsdatum und auf Wunsch einem abgestimmten Design im Format 5x15 oder 10x15.
              </p>
              <p>
                Gerade bei Hochzeiten in Innsbruck, Seefeld, Hall in Tirol oder Kufstein ist der Sofortdruck ein
                stärker Mehrwert, weil die Bilder direkt als Erinnerung mitgenommen oder ins Gästebuch geklebt werden
                können.
              </p>
            </article>

            <article className="admin-card">
              <h2>Fotobox für Firmenfeiern und Events</h2>
              <p>
                Für Firmenfeiern, Weihnachtsfeiern, Sommerfeste und Messen in Tirol ist eine gebrandete Fotobox
                besonders interessant. Logos, Farben und Botschaften lassen sich direkt auf die Ausdrucke und Layouts
                abstimmen. Dadurch entstehen nicht nur Fotos, sondern auch sichtbare Markenkontakte.
              </p>
              <p>
                Wenn gewünscht, lässt sich die normale Fotobox auch mit KI-Funktionen kombinieren. Das ist besonders
                auf Messen und Business-Events ein starker Blickfang.
              </p>
            </article>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="container">
            <div className="admin-card">
              <h2>Häufig gesuchte Begriffe rund um Fotobox Tirol</h2>
              <p>
                Diese Seite ist bewusst für Suchanfragen wie <strong>Fotobox mieten Tirol</strong>,{" "}
                <strong>Fotobox Hochzeit Tirol</strong>, <strong>Fotobox Firmenfeier Innsbruck</strong> und{" "}
                <strong>Selfie Fotobox Tirol</strong> aufgebaut. Wenn du eine Fotobox für dein Event suchst, findest du
                über die Anfrage-Seite direkt das passende Paket und kannst dein Wunschdatum unverbindlich anfragen.
              </p>
            </div>
          </div>
        </section>

        <section className="seo-landing-section seo-landing-faq">
          <div className="container">
            <h2>Fragen zur Fotobox in Tirol</h2>
            <div className="faq-wrap">
              {faqItems.map((item) => (
                <details className="faq-item" key={item.question}>
                  <summary className="faq-question">{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
            <div className="seo-landing-bottom-cta">
              <Link href="/kontakt" className="btn">Fotobox in Tirol anfragen</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
