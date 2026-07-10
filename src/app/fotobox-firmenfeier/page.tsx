import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import ReferencesCarousel from "@/components/site/ReferencesCarousel";

export const revalidate = 3600;
const SITE_URL = "https://www.fotobox.tirol";

const BLOCKED_REFERENCE_DOMAINS = ["sailer-seefeld.at"];

const DEFAULT_REFERENCES = [
  { name: "Fiegl+Spielberger", href: "https://www.fiegl.co.at", logoDomain: "fiegl.co.at" },
  { name: "Congress Messe Innsbruck", href: "https://www.cmi.at", logoDomain: "cmi.at" },
  { name: "Tiroler Versicherung", href: "https://www.tiroler.at", logoDomain: "tiroler.at" },
  { name: "Interalpen Hotel", href: "https://www.interalpen.com", logoDomain: "interalpen.com" },
  { name: "Burton", href: "https://www.burton.com", logoDomain: "burton.com" },
  { name: "Tiroler Wasserkraft", href: "https://www.tiwag.at", logoDomain: "tiwag.at" }
];

const FIRMEN_FAQ = [
  {
    question: "Bekommen wir eine ordentliche Rechnung mit ausgewiesener USt.?",
    answer:
      "Ja. Für Firmenkunden stellen wir selbstverständlich eine ordnungsgemäße Rechnung mit ausgewiesener Umsatzsteuer aus. Auf Wunsch klären wir vorab alle Details zu Angebot, Auftrag und AGB für Geschäftskunden."
  },
  {
    question: "Können wir unser Firmenlogo auf die Ausdrucke bringen?",
    answer:
      "Absolut. Wir gestalten das Print-Layout vorab in eurem Corporate Design – mit Firmenlogo, Eventtitel, Farben und Claim. So wird jeder Ausdruck zum gebrandeten Werbeträger, den eure Gäste mit nach Hause nehmen."
  },
  {
    question: "Ist die Fotobox DSGVO-konform?",
    answer:
      "Ja. Wir gehen sorgfältig mit den Aufnahmen um und richten den Ablauf datenschutzkonform ein. Auf Wunsch besprechen wir vorab, wie Fotos gespeichert, weitergegeben oder nach dem Event gelöscht werden."
  },
  {
    question: "Wie zuverlässig ist der Aufbau bei einem Firmenevent?",
    answer:
      "Die Fotobox ist in unter zehn Minuten einsatzbereit und wartungsarm. Auf Wunsch liefern wir, bauen auf und schulen kurz ein. Sollte während des Events etwas sein, sind wir über unsere Service-Hotline erreichbar."
  },
  {
    question: "Eignet sich die Fotobox auch für Messen und größere Events?",
    answer:
      "Ja. Ob Weihnachtsfeier, Firmenjubiläum, Produktlaunch, Gala oder Messestand – die Fotobox ist ein Publikumsmagnet, sorgt für Interaktion am Stand und liefert gebrandete Erinnerungen mit Werbewirkung."
  },
  {
    question: "Was kostet eine Fotobox für Firmenevents in Tirol?",
    answer:
      "Unsere Fotobox ist ab 400 € buchbar. Den genauen Preis richten wir nach Paket, Mietdauer, Branding und Leistungen – alle Details findet ihr auf unserer Preisseite."
  }
];

export const metadata: Metadata = {
  title: "Fotobox Firmenfeier Tirol | Für Events & Firmen mieten",
  description:
    "Fotobox für Firmenfeiern und Events in Tirol: gebrandete Ausdrucke im Corporate Design, Rechnung mit USt., DSGVO-konform, zuverlässiger Aufbau. Ab 400 €. Referenzen namhafter Tiroler Unternehmen.",
  alternates: { canonical: "/fotobox-firmenfeier" },
  openGraph: {
    title: "Fotobox Firmenfeier Tirol | Für Events & Firmen mieten",
    description:
      "Fotobox für Firmenevents in Tirol – gebrandete Ausdrucke, Rechnung mit USt., DSGVO-konform. Ab 400 €. Vertrauen namhafter Tiroler Unternehmen.",
    url: `${SITE_URL}/fotobox-firmenfeier`,
    type: "article",
    locale: "de_AT",
    siteName: "Fotobox Tirol"
  },
  twitter: {
    card: "summary",
    title: "Fotobox Firmenfeier Tirol | Für Events & Firmen mieten",
    description:
      "Fotobox für Firmenevents in Tirol – gebrandete Ausdrucke, Rechnung mit USt., DSGVO-konform. Ab 400 €."
  }
};

export default async function FotoboxFirmenfeierPage() {
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
        "@id": `${SITE_URL}/fotobox-firmenfeier#page`,
        name: "Fotobox Firmenfeier Tirol",
        url: `${SITE_URL}/fotobox-firmenfeier`,
        description:
          "Fotobox für Firmenfeiern und Events in Tirol mieten – gebrandete Ausdrucke, Rechnung mit USt., DSGVO-konform."
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/fotobox-firmenfeier#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Anlässe", item: `${SITE_URL}/fotobox-anlaesse` },
          { "@type": "ListItem", position: 3, name: "Firmenfeier", item: `${SITE_URL}/fotobox-firmenfeier` }
        ]
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/fotobox-firmenfeier#service`,
        name: "Fotobox für Firmenfeiern Tirol",
        serviceType: "Fotobox Vermietung für Firmenevents",
        description:
          "Vermietung einer Fotobox für Firmenfeiern, Weihnachtsfeiern, Messen und Events in Tirol – mit gebrandeten Ausdrucken im Corporate Design, Rechnung mit USt. und DSGVO-konformem Ablauf.",
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
          priceSpecification: { "@type": "PriceSpecification", minPrice: "400", priceCurrency: "EUR" },
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/preise`
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/fotobox-firmenfeier#faq`,
        mainEntity: FIRMEN_FAQ.map((item) => ({
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
            <span className="pricing-hero-badge">Vertrauen namhafter Tiroler Unternehmen</span>
            <h1>Fotobox Firmenfeier Tirol – für Events &amp; Firmen mieten</h1>
            <p>
              Die Fotobox, die euer Firmenevent zum Gesprächsthema macht: gebrandete Ausdrucke im Corporate Design,
              zuverlässiger Aufbau und ein Publikumsmagnet, der für Interaktion und beste Stimmung sorgt – von der
              Weihnachtsfeier bis zum Messestand.
            </p>
            <div className="seo-landing-bottom-cta">
              <Link href="/kontakt" className="btn">Unverbindlich anfragen</Link>
              <Link href="/preise" className="btn">Preise ab 400 €</Link>
            </div>
          </div>
        </section>

        {/* Kern + Überblick */}
        <section className="seo-landing-section">
          <div className="container seo-landing-grid">
            <article className="admin-card">
              <h2>Warum eine Fotobox für euer Firmenevent?</h2>
              <p>
                Eine Fotobox bringt Menschen zusammen, lockert die Stimmung und schafft echte Interaktion – ob bei der
                Weihnachtsfeier, dem Firmenjubiläum, einem Produktlaunch, einer Gala oder am Messestand. Jeder Ausdruck
                verlässt euer Event als gebrandeter Werbeträger im Corporate Design.
              </p>
              <p>
                Wir arbeiten seit Jahren mit namhaften Tiroler Unternehmen zusammen und wissen, worauf es bei
                Firmenevents ankommt: Zuverlässigkeit, professioneller Auftritt und ein reibungsloser Ablauf – ohne
                Überraschungen.
              </p>
            </article>

            <aside className="admin-card">
              <h2>Auf einen Blick</h2>
              <ul className="seo-landing-list">
                <li>Gebrandete Ausdrucke im Corporate Design</li>
                <li>Firmenlogo, Eventtitel und Farben aufs Print-Layout</li>
                <li>Rechnung mit ausgewiesener USt.</li>
                <li>DSGVO-konformer Ablauf</li>
                <li>Zuverlässiger Aufbau in unter 10 Minuten</li>
                <li>Service-Hotline während des Events</li>
                <li>Ideal für Messen, Galas und Weihnachtsfeiern</li>
              </ul>
              <Link href="/kontakt" className="btn seo-landing-cta">Angebot anfragen</Link>
            </aside>
          </div>
        </section>

        {/* Leistungen */}
        <section className="seo-landing-section seo-landing-alt">
          <div className="container seo-landing-grid">
            <article className="admin-card">
              <h2>Branding &amp; Werbewirkung</h2>
              <p>
                Das Print-Layout gestalten wir vorab in eurem Corporate Design – mit Logo, Eventtitel, Farben und
                Claim. Jeder Gast nimmt einen gebrandeten Ausdruck mit nach Hause, der eure Marke über das Event
                hinaus präsent hält. Auf Wunsch ergänzen wir optionale KI-Effekte als besonderes Highlight.
              </p>
            </article>

            <article className="admin-card">
              <h2>Professionell &amp; unkompliziert</h2>
              <p>
                Ordnungsgemäße Rechnung mit USt., klare Absprachen und ein DSGVO-konformer Ablauf sind für uns
                selbstverständlich. Wir liefern, bauen auf und schulen kurz ein – und sind während des Events über
                unsere Service-Hotline erreichbar. So könnt ihr euch voll auf eure Gäste konzentrieren.
              </p>
            </article>
          </div>
        </section>

        {/* Ablauf */}
        <section className="seo-landing-section">
          <div className="container">
            <div className="admin-card">
              <h2>So läuft euer Firmenevent mit der Fotobox ab</h2>
              <ul className="seo-landing-list">
                <li>
                  <strong>Anfrage &amp; Angebot:</strong> Ihr nennt uns Event, Datum, Location und Wünsche – wir
                  erstellen ein passendes Angebot inklusive Branding-Optionen.
                </li>
                <li>
                  <strong>Layout im Corporate Design:</strong> Wir gestalten euer Print-Layout mit Logo, Farben und
                  Eventtitel, rechtzeitig vor dem Termin.
                </li>
                <li>
                  <strong>Lieferung &amp; Aufbau:</strong> Wir bringen die Fotobox, bauen sie auf und erklären kurz
                  alles. In unter 10 Minuten ist sie startklar.
                </li>
                <li>
                  <strong>Event &amp; Service:</strong> Während des Events sind wir über unsere Service-Hotline
                  erreichbar. Nach dem Event erhaltet ihr eine ordnungsgemäße Rechnung.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Referenzen */}
        <section className="seo-landing-section seo-landing-alt">
          <div className="container">
            <h2>Vertrauen namhafter Tiroler Unternehmen</h2>
            <p>
              Von Industrie über Versicherung bis Hotellerie und Handel: Zahlreiche namhafte Unternehmen setzen bei
              ihren Events auf unsere Fotobox.
            </p>
            <ReferencesCarousel items={safeReferences} />
          </div>
        </section>

        {/* FAQ */}
        <section className="seo-landing-section seo-landing-faq">
          <div className="container">
            <h2>Häufige Fragen von Firmenkunden</h2>
            <div className="faq-wrap">
              {FIRMEN_FAQ.map((item) => (
                <details className="faq-item" key={item.question}>
                  <summary className="faq-question">{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
            <div className="seo-landing-bottom-cta">
              <Link href="/kontakt" className="btn">Fotobox für Firmenevent anfragen</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
