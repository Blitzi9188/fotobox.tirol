import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
            <h1>Fotobox Hochzeit Tirol</h1>
            <p className="seo-landing-subtitle">Hochzeitsfotobox mieten</p>
            <p>
              Die Hochzeitsfotobox für den schönsten Tag in Tirol: hochwertig, kinderleicht zu bedienen
              und in unter zehn Minuten startklar. Für ehrliche Momente und Erinnerungen zum Mitnehmen.
            </p>
            <div className="seo-landing-bottom-cta">
              <Link href="/kontakt" className="btn">Termin anfragen</Link>
              <Link href="/preise" className="btn">Preise ab 400 €</Link>
            </div>
          </div>
        </section>

        {/* Bild + Text: Warum */}
        <section className="seo-landing-section">
          <div className="container">
            <div className="space-grid">
              <div className="space-visual">
                <Image
                  src="/uploads/hochzeit-braut-ich-dabei.jpg"
                  alt="Braut mit Fotobox-Requisiten bei einer Hochzeit in Tirol"
                  className="cover-image"
                  width={1400}
                  height={933}
                  sizes="(max-width: 800px) 100vw, 600px"
                />
              </div>
              <div className="space-copy">
                <h2>Der Treffpunkt eurer Feier</h2>
                <p>
                  Unsere selbst gebaute Fotobox arbeitet mit echter Spiegelreflexkamera und hochwertigem
                  Touchscreen – für saubere, professionell ausgeleuchtete Bilder in jeder Location.
                </p>
                <p>
                  Ob im Bergpanorama, im Festsaal oder im Freien: Die Fotobox bringt eure Gäste zusammen
                  und liefert Erinnerungen, die direkt mitgenommen werden können – vom Sektempfang bis
                  spät in die Nacht.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights als Karten */}
        <section className="features">
          <div className="container">
            <h2>Das ist bei jeder Hochzeit dabei</h2>
            <div className="grid grid-3" style={{ marginTop: "1.6rem" }}>
              <article className="feature-item">
                <h3>Sofortdruck inklusive</h3>
                <p>
                  Je nach Layout sind 600 bis 800 Ausdrucke inklusive – jeder Gast nimmt seine Erinnerung
                  direkt mit nach Hause.
                </p>
              </article>
              <article className="feature-item">
                <h3>Euer eigenes Design</h3>
                <p>
                  Das Print-Layout gestalten wir vorab mit euren Namen, dem Datum und euren Farben – passend
                  zum Stil eures Tages.
                </p>
              </article>
              <article className="feature-item">
                <h3>Requisiten &amp; KI-Effekte</h3>
                <p>
                  Eine liebevolle Auswahl an Requisiten sorgt für gelöste Stimmung. Auf Wunsch mit
                  optionalen KI-Effekten als Highlight.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Brautpaar-Bild */}
        <section className="seo-landing-section">
          <div className="container">
            <div style={{ borderRadius: "1rem", overflow: "hidden", maxHeight: "520px" }}>
              <Image
                src="/uploads/hochzeit-brautpaar-selfie.png"
                alt="Lachendes Brautpaar mit Herzsonnenbrille und Champagner an der Hochzeitsfotobox in Tirol"
                width={893}
                height={1340}
                style={{ width: "100%", height: "520px", objectFit: "cover", objectPosition: "top", display: "block" }}
                sizes="(max-width: 800px) 100vw, 900px"
              />
            </div>
          </div>
        </section>

        {/* Bild + Text: Sofortdruck / Design (Bild rechts) */}
        <section className="seo-landing-section seo-landing-alt">
          <div className="container">
            <div className="space-grid">
              <div className="space-copy">
                <h2>Erinnerungen zum Mitnehmen</h2>
                <p>
                  Jeder Ausdruck passt zum Stil eurer Hochzeit und wird zur bleibenden Erinnerung, die ihr
                  auch ins Gästebuch kleben könnt. Solange der Formatbereich reicht, drucken wir ohne
                  Aufpreis.
                </p>
                <p>
                  So entsteht ganz nebenbei ein gemeinsames Erinnerungsstück an euren schönsten Tag.
                </p>
              </div>
              <div className="space-visual">
                <Image
                  src="/uploads/hochzeit-braut-love.jpg"
                  alt="Braut mit Love-Schild an der Hochzeitsfotobox in Tirol"
                  className="cover-image"
                  width={1400}
                  height={933}
                  sizes="(max-width: 800px) 100vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Ablauf */}
        <section className="seo-landing-section">
          <div className="container">
            <h2>So läuft eure Hochzeit mit der Fotobox ab</h2>
            <div className="grid grid-3" style={{ marginTop: "1.6rem" }}>
              <article className="feature-item">
                <h3>1 · Anfrage &amp; Absprache</h3>
                <p>Ihr schildert uns euren Tag, Location und Wünsche – gemeinsam legen wir Paket und Layout fest.</p>
              </article>
              <article className="feature-item">
                <h3>2 · Design gestalten</h3>
                <p>Wir gestalten euer persönliches Print-Layout mit Namen, Datum und Farben, rechtzeitig vor der Feier.</p>
              </article>
              <article className="feature-item">
                <h3>3 · Abholung oder Lieferung</h3>
                <p>Je nach Paket holt ihr die Box ab oder wir liefern, bauen auf und erklären kurz alles – in unter 10 Minuten startklar.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Vertrauen / Locations */}
        <section className="seo-landing-section seo-landing-alt">
          <div className="container">
            <div className="space-grid">
              <div className="space-visual">
                <Image
                  src="/uploads/hochzeit-kussmund.jpg"
                  alt="Hochzeitsgast mit Kussmund-Requisit an der Fotobox in Tirol"
                  className="cover-image"
                  width={1400}
                  height={933}
                  sizes="(max-width: 800px) 100vw, 600px"
                />
              </div>
              <div className="space-copy">
                <h2>Erprobt auf Tirols schönsten Hochzeiten</h2>
                <p>
                  Seit 2013 sind wir jährlich auf rund 50 Hochzeiten in ganz Tirol im Einsatz – von der
                  intimen Feier bis zum großen Fest. Unter anderem waren wir hier dabei:
                </p>
                <ul className="seo-landing-list">
                  {WEDDING_VENUES.map((venue) => (
                    <li key={venue}>{venue}</li>
                  ))}
                </ul>
              </div>
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
