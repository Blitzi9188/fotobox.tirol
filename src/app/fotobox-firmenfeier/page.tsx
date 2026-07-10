import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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

const HIGHLIGHTS = [
  { icon: "🎨", title: "Corporate Design", text: "Logo, Farben und Claim auf jedem Ausdruck" },
  { icon: "🧾", title: "Rechnung mit USt.", text: "Ordnungsgemäße Abrechnung für Firmenkunden" },
  { icon: "🔒", title: "DSGVO-konform", text: "Datenschutzkonformer Ablauf, transparent" },
  { icon: "⚡", title: "Aufbau in 10 Min.", text: "Zuverlässig, wartungsarm, sofort startklar" },
  { icon: "📞", title: "Service-Hotline", text: "Erreichbar während des gesamten Events" },
  { icon: "🏆", title: "Namhafte Referenzen", text: "Vertrauen führender Tiroler Unternehmen" }
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

        {/* ── HERO MIT HEADER-BILD ── */}
        <section style={{ position: "relative", overflow: "hidden", minHeight: "480px", display: "flex", alignItems: "center" }}>
          <Image
            src="/uploads/1774027269897-931f7683-3961-4e1f-b3a9-c35edf7e8346-hero-hader-fotobox-tirol-1.jpg"
            alt="Fotobox Firmenfeier Tirol"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
            sizes="100vw"
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 100%)" }} />
          <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "5rem 1.5rem" }}>
            <span style={{
              display: "inline-block",
              marginBottom: "1.2rem",
              padding: "0.35rem 0.9rem",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase"
            }}>
              Vertrauen namhafter Tiroler Unternehmen
            </span>
            <h1 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.08, marginBottom: "1.1rem", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
              Fotobox für Firmenfeiern &amp; Events in Tirol
            </h1>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: "680px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
              Gebrandete Ausdrucke im Corporate Design, zuverlässiger Aufbau und ein Publikumsmagnet,
              der für Interaktion sorgt – von der Weihnachtsfeier bis zum Messestand.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/kontakt" className="btn">Unverbindlich anfragen</Link>
              <Link href="/preise" className="btn" style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.6)", color: "#fff" }}>
                Preise ab 400 €
              </Link>
            </div>
          </div>
        </section>

        {/* ── HIGHLIGHTS GRID ── */}
        <section style={{ padding: "4rem 0", background: "#fff" }}>
          <div className="container" style={{ maxWidth: "960px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c-accent)", marginBottom: "0.6rem" }}>
              Auf einen Blick
            </p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", marginBottom: "2.5rem" }}>
              Was ihr von uns bekommt
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {HIGHLIGHTS.map((h) => (
                <div key={h.title} style={{
                  padding: "1.8rem 1.5rem",
                  borderRadius: "14px",
                  border: "1px solid #e8ecf0",
                  background: "#fafbfc",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.7rem" }}>{h.icon}</div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{h.title}</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--c-muted)", margin: 0, lineHeight: 1.5 }}>{h.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WARUM FOTOBOX ── */}
        <section style={{ padding: "4rem 0", background: "#f7f8fa" }}>
          <div className="container" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c-accent)", marginBottom: "0.6rem" }}>
              Der Mehrwert
            </p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", marginBottom: "1.5rem" }}>
              Warum eine Fotobox für euer Firmenevent?
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--c-text)", marginBottom: "1.2rem" }}>
              Eine Fotobox bringt Menschen zusammen, lockert die Stimmung und schafft echte Interaktion –
              ob bei der Weihnachtsfeier, dem Firmenjubiläum, einem Produktlaunch, einer Gala oder am Messestand.
              Jeder Ausdruck verlässt euer Event als gebrandeter Werbeträger im Corporate Design.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--c-text)" }}>
              Wir arbeiten seit Jahren mit namhaften Tiroler Unternehmen zusammen und wissen, worauf es bei
              Firmenevents ankommt: Zuverlässigkeit, professioneller Auftritt und ein reibungsloser Ablauf –
              ohne Überraschungen.
            </p>
          </div>
        </section>

        {/* ── BRANDING + PROFESSIONELL ── */}
        <section style={{ padding: "4rem 0", background: "#fff" }}>
          <div className="container" style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "2.2rem 2rem", borderRadius: "16px", border: "1px solid #e4e8ee", background: "#fafbfc" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--c-accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.2rem" }}>
                  <span style={{ fontSize: "1.3rem" }}>🎨</span>
                </div>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "0.8rem" }}>Branding &amp; Werbewirkung</h2>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "var(--c-muted)" }}>
                  Das Print-Layout gestalten wir vorab in eurem Corporate Design – mit Logo, Eventtitel, Farben
                  und Claim. Jeder Gast nimmt einen gebrandeten Ausdruck mit nach Hause, der eure Marke über
                  das Event hinaus präsent hält. Auf Wunsch ergänzen wir optionale KI-Effekte als besonderes Highlight.
                </p>
              </div>
              <div style={{ padding: "2.2rem 2rem", borderRadius: "16px", border: "1px solid #e4e8ee", background: "#fafbfc" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--c-accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.2rem" }}>
                  <span style={{ fontSize: "1.3rem" }}>✅</span>
                </div>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "0.8rem" }}>Professionell &amp; unkompliziert</h2>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "var(--c-muted)" }}>
                  Ordnungsgemäße Rechnung mit USt., klare Absprachen und ein DSGVO-konformer Ablauf sind für uns
                  selbstverständlich. Wir liefern, bauen auf und schulen kurz ein – und sind während des Events
                  über unsere Service-Hotline erreichbar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ABLAUF ── */}
        <section style={{ padding: "4rem 0", background: "#f7f8fa" }}>
          <div className="container" style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c-accent)", marginBottom: "0.6rem" }}>
              Ablauf
            </p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", marginBottom: "2.5rem" }}>
              So läuft euer Firmenevent ab
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", textAlign: "left" }}>
              {[
                { nr: "01", title: "Anfrage & Angebot", text: "Ihr nennt uns Event, Datum, Location und Wünsche – wir erstellen ein passendes Angebot inklusive Branding-Optionen." },
                { nr: "02", title: "Layout im Corporate Design", text: "Wir gestalten euer Print-Layout mit Logo, Farben und Eventtitel, rechtzeitig vor dem Termin." },
                { nr: "03", title: "Lieferung & Aufbau", text: "Wir bringen die Fotobox, bauen sie auf und erklären kurz alles. In unter 10 Minuten ist sie startklar." },
                { nr: "04", title: "Event & Service", text: "Während des Events sind wir über unsere Service-Hotline erreichbar. Nach dem Event erhaltet ihr eine ordnungsgemäße Rechnung." }
              ].map((step) => (
                <div key={step.nr} style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start", background: "#fff", borderRadius: "14px", padding: "1.4rem 1.6rem", border: "1px solid #e8ecf0" }}>
                  <span style={{ flexShrink: 0, fontWeight: 800, fontSize: "1.1rem", color: "var(--c-accent)", minWidth: "2rem" }}>{step.nr}</span>
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.3rem", fontSize: "0.97rem" }}>{step.title}</strong>
                    <span style={{ fontSize: "0.9rem", color: "var(--c-muted)", lineHeight: 1.6 }}>{step.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REFERENZEN ── */}
        <section style={{ padding: "4rem 0", background: "#fff" }}>
          <div className="container" style={{ maxWidth: "960px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c-accent)", marginBottom: "0.6rem" }}>
              Referenzen
            </p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", marginBottom: "0.8rem" }}>
              Vertrauen namhafter Tiroler Unternehmen
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--c-muted)", marginBottom: "2rem", maxWidth: "580px", margin: "0 auto 2rem" }}>
              Von Industrie über Versicherung bis Hotellerie und Handel – zahlreiche Unternehmen setzen bei ihren Events auf unsere Fotobox.
            </p>
            <ReferencesCarousel items={safeReferences} />
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: "4rem 0", background: "#f7f8fa" }}>
          <div className="container" style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c-accent)", marginBottom: "0.6rem" }}>
              FAQ
            </p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", marginBottom: "2rem" }}>
              Häufige Fragen von Firmenkunden
            </h2>
            <div className="faq-wrap" style={{ textAlign: "left" }}>
              {FIRMEN_FAQ.map((item) => (
                <details className="faq-item" key={item.question}>
                  <summary className="faq-question">{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
            <div style={{ marginTop: "2.5rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/kontakt" className="btn">Fotobox für Firmenevent anfragen</Link>
              <Link href="/preise" className="btn" style={{ background: "#f1f3f5", color: "var(--c-text)", border: "1px solid #dbe2ec" }}>
                Alle Preise ansehen
              </Link>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter content={content} />
    </>
  );
}
