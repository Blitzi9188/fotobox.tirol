import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import ReferencesCarousel from "@/components/site/ReferencesCarousel";

export const revalidate = 3600; // ISR: statisch, stuendlich aktualisiert
const SITE_URL = "https://www.fotobox.tirol";

const BLOCKED_REFERENCE_DOMAINS = ["sailer-seefeld.at"];

const DEFAULT_REFERENCES = [
  { name: "Fiegl+Spielberger", href: "https://www.fiegl.co.at", logoDomain: "fiegl.co.at" },
  { name: "Congress Messe Innsbruck", href: "https://www.cmi.at", logoDomain: "cmi.at" },
  { name: "Kloster Bräu Seefeld", href: "https://klosterbraeu.com", logoDomain: "klosterbraeu.com" },
  { name: "Interalpen Hotel", href: "https://www.interalpen.com", logoDomain: "interalpen.com" },
  { name: "Adlers Hotel", href: "https://www.adlers-innsbruck.com", logoDomain: "adlers-innsbruck.com" },
  { name: "Aqua Dome", href: "https://www.aqua-dome.at", logoDomain: "aqua-dome.at" }
];

// Locations, auf denen die Fotobox schon im Einsatz war. Schreibweisen bei Bedarf anpassen.
const WEDDING_VENUES = [
  "Grünfeld",
  "Bergisel 1809, Innsbruck",
  "Strandperle Seefeld",
  "Bio-Hotel Stanglwirt, Going",
  "Congress Innsbruck",
  "Park Igls"
];

const WEDDING_FAQ = [
  {
    question: "Sind alle Ausdrucke inklusive?",
    answer:
      "Ja. Solange der Formatbereich reicht, sind alle Ausdrucke inklusive. Je nach Layoutgestaltung sind zwischen 600 und 800 Ausdrucke möglich – ohne versteckte Zusatzkosten."
  },
  {
    question: "Wie schnell ist die Fotobox einsatzbereit?",
    answer:
      "Unsere selbst gebaute Fotobox ist in weniger als zehn Minuten aufgebaut und startklar. Die Bedienung über den hochwertigen Touchscreen ist kinderleicht, sodass sich alle Gäste sofort zurechtfinden."
  },
  {
    question: "Können wir die Fotobox selbst abholen oder wird sie geliefert?",
    answer:
      "Beides ist möglich. Je nach Paket holt ihr die Fotobox direkt bei uns ab, oder wir bringen sie zu eurer Location, stellen sie auf und erklären kurz, wie alles funktioniert."
  },
  {
    question: "Lässt sich das Print-Layout an unsere Hochzeit anpassen?",
    answer:
      "Ja, das Layout gestalten wir vorab individuell mit euren Namen, dem Hochzeitsdatum und euren Farben, damit jeder Ausdruck perfekt zu eurem Tag passt."
  },
  {
    question: "Was passiert, wenn während der Feier ein Problem auftritt?",
    answer:
      "Die Fotobox ist wartungsarm und einfach zu bedienen. Sollte dennoch etwas sein, sind wir über unsere Service-Hotline erreichbar und helfen sofort weiter."
  },
  {
    question: "Was kostet eine Hochzeitsfotobox in Tirol?",
    answer:
      "Unsere Hochzeitsfotobox ist ab 400 € buchbar. Den genauen Preis richten wir nach Paket, Mietdauer und Leistungen – alle Details findet ihr auf unserer Preisseite."
  }
];

export const metadata: Metadata = {
  title: "Fotobox Hochzeit Tirol | Hochzeitsfotobox mieten",
  description:
    "Hochzeitsfotobox in Tirol mieten: hochwertige Fotobox mit Spiegelreflexkamera, Sofortdruck, individuellem Layout und Requisiten. Ab 400 €. Seit 2013, rund 50 Hochzeiten pro Jahr.",
  alternates: { canonical: "/fotobox-hochzeit" },
  openGraph: {
    title: "Fotobox Hochzeit Tirol | Hochzeitsfotobox mieten",
    description:
      "Hochzeitsfotobox in Tirol mit Sofortdruck, individuellem Layout, Requisiten und optionalen KI-Effekten. Ab 400 €, seit 2013 auf Tirols schönsten Hochzeiten.",
    url: `${SITE_URL}/fotobox-hochzeit`,
    type: "article",
    locale: "de_AT",
    siteName: "Fotobox Tirol"
  },
  twitter: {
    card: "summary",
    title: "Fotobox Hochzeit Tirol | Hochzeitsfotobox mieten",
    description:
      "Hochzeitsfotobox in Tirol mit Sofortdruck, individuellem Layout und Requisiten. Ab 400 €, seit 2013 auf Tirols schönsten Hochzeiten."
  }
};

export default async function FotoboxHochzeitPage() {
  const content = await readCmsContent();

  const references =
    content.pricing?.references && content.pricing.references.length > 0
      ? content.pricing.references
      : DEFAULT_REFERENCES;
  const safeReferences = references.filter((item) => {
    const haystack = `${item.href || ""} ${item.logoDomain || ""} ${item.name || ""}`.toLowerCase();
    return !BLOCKED_REFERENCE_DOMAINS.some((domain) => haystack.includes(domain));
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/fotobox-hochzeit#page`,
        name: "Fotobox Hochzeit Tirol",
        url: `${SITE_URL}/fotobox-hochzeit`,
        description:
          "Hochzeitsfotobox in Tirol mieten – mit Sofortdruck, individuellem Layout, Requisiten und optionalen KI-Effekten."
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/fotobox-hochzeit#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Anlässe", item: `${SITE_URL}/fotobox-anlaesse` },
          { "@type": "ListItem", position: 3, name: "Hochzeit", item: `${SITE_URL}/fotobox-hochzeit` }
        ]
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/fotobox-hochzeit#service`,
        name: "Hochzeitsfotobox Tirol",
        serviceType: "Fotobox Vermietung für Hochzeiten",
        description:
          "Vermietung einer hochwertigen Hochzeitsfotobox in Tirol mit Spiegelreflexkamera, Sofortdruck, individuellem Print-Layout, Requisiten und optionalen KI-Effekten.",
        areaServed: { "@type": "State", name: "Tirol" },
        provider: {
          "@type": "LocalBusiness",
          name: "Fotobox Tirol",
          url: SITE_URL,
          telephone: content.contact?.phone,
          email: content.contact?.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: content.contact?.address,
            addressLocality: "Birgitz",
            postalCode: "6092",
            addressRegion: "Tirol",
            addressCountry: "AT"
          }
        },
        offers: {
          "@type": "Offer",
          price: "400",
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: "400",
            priceCurrency: "EUR"
          },
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/preise`
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/fotobox-hochzeit#faq`,
        mainEntity: WEDDING_FAQ.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer }
        }))
      }
    ]
  };

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Hero */}
        <section className="page-hero seo-landing-hero">
          <div className="container">
            <span className="pricing-hero-badge">Seit 2013 · rund 50 Hochzeiten pro Jahr</span>
            <h1>Fotobox Hochzeit Tirol – Hochzeitsfotobox mieten</h1>
            <p>
              Die Hochzeitsfotobox für den schönsten Tag in Tirol – hochwertig, kinderleicht zu bedienen und in
              weniger als zehn Minuten einsatzbereit. Für ehrliche Momente, gelöste Stimmung und Erinnerungen zum
              Mitnehmen.
            </p>
            <div className="seo-landing-bottom-cta">
              <Link href="/kontakt" className="btn">Termin anfragen</Link>
              <Link href="/preise" className="btn">Preise ab 400 €</Link>
            </div>
          </div>
        </section>

        {/* Kern + Schnellüberblick */}
        <section className="seo-landing-section">
          <div className="container seo-landing-grid">
            <article className="admin-card">
              <h2>Warum eine Hochzeitsfotobox in Tirol?</h2>
              <p>
                Unsere selbst gebaute Fotobox arbeitet mit einer echten Spiegelreflexkamera und einem hochwertigen
                Touchscreen – für saubere, professionell ausgeleuchtete Bilder in jeder Location. Sie bringt eure
                Gäste zusammen, lockert die Stimmung und liefert Erinnerungen, die direkt mitgenommen werden können.
              </p>
              <p>
                Ob im Bergpanorama, im Festsaal oder im Freien: Die Hochzeitsfotobox wird schnell zum Treffpunkt eurer
                Feier – vom Sektempfang bis spät in die Nacht. Seit 2013 sind wir jährlich auf rund 50 Hochzeiten in
                ganz Tirol im Einsatz.
              </p>
            </article>

            <aside className="admin-card">
              <h2>Schnellüberblick</h2>
              <ul className="seo-landing-list">
                <li>Spiegelreflexkamera und hochwertiger Touchscreen</li>
                <li>In unter 10 Minuten einsatzbereit</li>
                <li>Sofortdruck – 600 bis 800 Ausdrucke inklusive</li>
                <li>Individuelles Layout mit Namen, Datum und Farben</li>
                <li>Requisiten und Accessoires inklusive</li>
                <li>Optional mit KI-Effekten</li>
                <li>Abholung oder Lieferung mit Aufbau</li>
              </ul>
              <Link href="/kontakt" className="btn seo-landing-cta">Jetzt anfragen</Link>
            </aside>
          </div>
        </section>

        {/* Leistungen */}
        <section className="seo-landing-section seo-landing-alt">
          <div className="container seo-landing-grid">
            <article className="admin-card">
              <h2>Sofortdruck &amp; individuelles Design</h2>
              <p>
                Jeder Gast nimmt seine Erinnerung direkt mit nach Hause. Je nach Layout sind zwischen 600 und 800
                Ausdrucke inklusive, solange der Formatbereich reicht. Das Print-Layout gestalten wir vorab passend zu
                eurer Hochzeit – mit euren Namen, dem Datum und euren Farben.
              </p>
              <p>
                So passt jeder Ausdruck zum Stil eures Tages und wird zur bleibenden Erinnerung, die ihr auch ins
                Gästebuch kleben könnt.
              </p>
            </article>

            <article className="admin-card">
              <h2>Requisiten &amp; optionale KI-Effekte</h2>
              <p>
                Eine liebevoll ausgewählte Auswahl an Requisiten und Accessoires sorgt für gelöste Stimmung und
                ehrliche, lustige Bilder. Auf Wunsch verwandeln optionale KI-Effekte eure Aufnahmen in besondere,
                stilisierte Bilder.
              </p>
              <p>
                Ein Highlight, über das eure Gäste noch lange sprechen – und das eure Hochzeit von einer gewöhnlichen
                Fotobox abhebt.
              </p>
            </article>
          </div>
        </section>

        {/* Ablauf */}
        <section className="seo-landing-section">
          <div className="container">
            <div className="admin-card">
              <h2>So läuft eure Hochzeit mit der Fotobox ab</h2>
              <ul className="seo-landing-list">
                <li>
                  <strong>Anfrage &amp; Absprache:</strong> Ihr schildert uns euren Tag, Location und Wünsche –
                  gemeinsam legen wir Paket und Layout fest.
                </li>
                <li>
                  <strong>Design vorab gestalten:</strong> Wir gestalten euer persönliches Print-Layout mit Namen,
                  Datum und euren Farben, rechtzeitig vor der Feier.
                </li>
                <li>
                  <strong>Abholung oder Lieferung:</strong> Je nach Paket holt ihr die Fotobox bei uns ab, oder wir
                  bringen sie vorbei, bauen sie auf und erklären kurz alles. In unter 10 Minuten ist sie startklar.
                </li>
                <li>
                  <strong>Feiern &amp; Service-Hotline:</strong> Die Box ist kinderleicht zu bedienen. Sollte doch
                  etwas sein, erreicht ihr uns jederzeit über unsere Service-Hotline.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Vertrauen / Locations */}
        <section className="seo-landing-section seo-landing-alt">
          <div className="container">
            <div className="admin-card">
              <h2>Erprobt auf Tirols schönsten Hochzeiten</h2>
              <p>
                Seit 2013 sind wir jährlich auf rund 50 Hochzeiten in ganz Tirol im Einsatz – von der intimen Feier
                bis zum großen Fest. Unter anderem waren wir bereits an diesen Locations dabei:
              </p>
              <ul className="seo-landing-list">
                {WEDDING_VENUES.map((venue) => (
                  <li key={venue}>{venue}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Referenzen */}
        <section className="seo-landing-section">
          <div className="container">
            <h2>Vertrauen namhafter Kunden</h2>
            <ReferencesCarousel items={safeReferences} />
          </div>
        </section>

        {/* FAQ */}
        <section className="seo-landing-section seo-landing-faq">
          <div className="container">
            <h2>Häufige Fragen zur Hochzeitsfotobox</h2>
            <div className="faq-wrap">
              {WEDDING_FAQ.map((item) => (
                <details className="faq-item" key={item.question}>
                  <summary className="faq-question">{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
            <div className="seo-landing-bottom-cta">
              <Link href="/kontakt" className="btn">Hochzeitsfotobox anfragen</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
