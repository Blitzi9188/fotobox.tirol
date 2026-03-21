import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader, SlashHeading } from "@/components/site/SiteShell";
import ReferencesCarousel from "@/components/site/ReferencesCarousel";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE_PLANS = [
  {
    name: "Essential",
    price: 490,
    meta: "/ Event",
    featured: false,
    cta: "Anfragen",
    items: [
      "4 Stunden Laufzeit",
      "Digitale Flatrate (Online Galerie)",
      "Standard KI-Retusche",
      "Auf- & Abbau inklusive"
    ]
  },
  {
    name: "Premium",
    price: 790,
    meta: "/ Event",
    featured: true,
    cta: "Jetzt buchen",
    items: [
      "Open-End Laufzeit (max. 12h)",
      "Sofort-Druck Flatrate (400 Prints)",
      "Premium Hochzeits-Filter & Overlay",
      "QR-Code Sofort-Download",
      "Requisiten Box (Hochzeit-Edition)"
    ]
  },
  {
    name: "Black Label",
    price: 1290,
    meta: "/ Event",
    featured: false,
    cta: "Anfragen",
    items: [
      "Alles aus dem Premium-Paket",
      "Live-Slideshow auf TV/Beamer",
      "Persönlicher Operator vor Ort",
      "High-End Gästebuch & Klebe-Service"
    ]
  }
];

const DEFAULT_TECHNOLOGY_ITEMS = [
  {
    title: "Studioqualität",
    description:
      "Integrierte DSLR-Kamera und professioneller Studioblitz sorgen für sauber ausgeleuchtete Bilder in jeder Event-Umgebung."
  },
  {
    title: "Touch Bedienung",
    description:
      "Intuitive Benutzerführung über den großen Touchscreen, damit sich auch Gäste ohne Einweisung sofort zurechtfinden."
  },
  {
    title: "Sofortdruck",
    description:
      "High-Speed Fotodruck in Sekunden mit klaren Ausdrucken in Laborqualität, abgestimmt auf euer Event oder Branding."
  },
  {
    title: "QR-Code Download",
    description:
      "Gäste laden ihre Bilder direkt aufs Handy, ohne App und ohne Wartezeit."
  }
];

const DEFAULT_REFERENCES = [
  { name: "Fiegl+Spielberger", href: "https://www.fiegl.co.at", logoDomain: "fiegl.co.at" },
  { name: "Congress Messe Innsbruck", href: "https://www.cmi.at", logoDomain: "cmi.at" },
  { name: "Kloster Bräu Seefeld", href: "https://klosterbraeu.com", logoDomain: "klosterbraeu.com" },
  { name: "Tiroler Versicherung", href: "https://www.tiroler-versicherung.at", logoDomain: "tiroler-versicherung.at" },
  { name: "Völkl Ski", href: "https://www.voelkl.com", logoDomain: "voelkl.com" },
  { name: "Recycling Ahrental", href: "https://www.rz-ahrental.at", logoDomain: "rz-ahrental.at" },
  { name: "Sandoz", href: "https://www.sandoz.com", logoDomain: "sandoz.com" },
  { name: "Interalpen Hotel", href: "https://www.interalpen.com", logoDomain: "interalpen.com" },
  { name: "Wetscher", href: "https://www.wetscher.com", logoDomain: "wetscher.com" },
  { name: "Burton", href: "https://www.burton.com", logoDomain: "burton.com" },
  { name: "Tiroler Wasserkraft", href: "https://www.tiwag.at", logoDomain: "tiwag.at" },
  { name: "Woods Seefeld", href: "https://www.woods-seefeld.com", logoDomain: "woods-seefeld.com" },
  { name: "OFA", href: "https://www.ofa.at", logoDomain: "ofa.at" },
  { name: "Bayrischer Hof", href: "https://www.bayerischerhof.de/de/", logoDomain: "bayerischerhof.de", initials: "BH" },
  { name: "VOGUE Germany", href: "https://www.vogue.de", logoDomain: "vogue.de" },
  { name: "Adlers Hotel", href: "https://www.adlers-innsbruck.com", logoDomain: "adlers-innsbruck.com" },
  { name: "Hypo Tirol Bank", href: "https://www.hypotirol.com", logoDomain: "hypotirol.com" },
  { name: "Aqua Dome", href: "https://www.aqua-dome.at", logoDomain: "aqua-dome.at" }
];

export const metadata: Metadata = {
  title: "Preisgestaltung Fotobox Tirol | Pakete und Leistungen",
  description:
    "Eigene Preisgestaltungsseite für Pakete, Formate und Leistungen der Fotobox Tirol."
};

function CheckIcon() {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
      style={{ width: 20, height: 20, color: "#ea2c2c", flexShrink: 0 }}
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getPlanDescription(name: string) {
  const value = name.toLowerCase();

  if (value.includes("premium")) {
    return "Das beliebteste Paket für Hochzeiten und große Feiern.";
  }
  if (value.includes("black") || value.includes("exclusive") || value.includes("luxury")) {
    return "Maximale Qualität ohne Kompromisse für besondere Ansprüche.";
  }
  if (value.includes("essential") || value.includes("basic")) {
    return "Der starke Einstieg für kleinere Feiern und klare Entscheidungen.";
  }

  return "Transparent kalkuliert und passend auf euer Event abgestimmt.";
}

function getPlanMeta(plan: { meta?: string; featured?: boolean; name: string }) {
  if (plan.meta?.trim()) return plan.meta;
  return "/ Event";
}

function getTechnologyHighlights(items: Array<{ title: string; description: string }>) {
  return items.slice(0, 4);
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("de-AT").format(value);
}

export default async function PreisgestaltungPage() {
  const content = await readCmsContent();
  const pricingPackages =
    content.pricing.pagePlans && content.pricing.pagePlans.length > 0
      ? content.pricing.pagePlans
      : DEFAULT_PAGE_PLANS;
  const technologyItems =
    content.pricing.technologyItems && content.pricing.technologyItems.length > 0
      ? content.pricing.technologyItems
      : DEFAULT_TECHNOLOGY_ITEMS;
  const technologyHighlights = getTechnologyHighlights(technologyItems);
  const references =
    content.pricing.references && content.pricing.references.length > 0
      ? content.pricing.references
      : DEFAULT_REFERENCES;

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <section className="page-hero seo-landing-hero pricing-hero">
          <div className="container">
            <span className="pricing-hero-badge">Transparente Angebote</span>
            <h1>
              <SlashHeading value={content.pricing.pageTitle || "preise/pakete"} />
            </h1>
            <p>
              {content.pricing.pageIntro ||
                "Wählt das passende Paket für eure Feier. Keine versteckten Kosten, klare Leistungen und moderne Technik aus Tirol."}
            </p>
          </div>
        </section>

        <section className="seo-landing-section pricing-package-section">
          <div className="container">
            <div className="pricing-offer-grid">
              {pricingPackages.map((plan) => {
                const isFeatured = Boolean(plan.featured);
                return (
                  <article
                    key={plan.name}
                    className={`pricing-offer-card${isFeatured ? " is-featured" : ""}`}
                  >
                    {isFeatured ? <span className="pricing-offer-badge">Beliebteste Wahl</span> : null}
                    <div className="pricing-offer-head">
                      <h2>{plan.name}</h2>
                      <p>{getPlanDescription(plan.name)}</p>
                    </div>
                    <div className="pricing-offer-price">
                      <span>€{formatPrice(plan.price)}</span>
                      <small>{getPlanMeta(plan)}</small>
                    </div>
                    <ul className="pricing-offer-list">
                      {plan.items.map((item) => (
                        <li key={item}>
                          <CheckIcon />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/kontakt?paket=${encodeURIComponent(plan.name)}`}
                      className={`pricing-offer-button${isFeatured ? " is-featured" : ""}`}
                    >
                      {plan.cta || "Jetzt anfragen"}
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="container">
            <div className="pricing-guarantee-panel">
              <div>
                <h2 className="pricing-guarantee-title">
                  Alle Pakete beinhalten<br />
                  <span>unsere Tirol-Garantie:</span>
                </h2>
                <div className="pricing-guarantee-grid">
                  {technologyHighlights.map((item) => (
                    <div key={item.title} className="pricing-guarantee-item">
                      <p>{item.title}</p>
                      <span>{item.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pricing-guarantee-visual-wrap">
                <div className="pricing-guarantee-visual">
                  <div className="pricing-guarantee-orb" />
                  <div className="pricing-guarantee-stack">
                    <div className="pricing-guarantee-stack-card is-top">
                      <strong>Premium Setup</strong>
                      <span>DSLR, Studioblitz, Druck, QR-Download</span>
                    </div>
                    <div className="pricing-guarantee-stack-card">
                      <strong>Persönliches Layout</strong>
                      <span>Abgestimmt auf Hochzeit, Firmenfeier oder Event</span>
                    </div>
                    <div className="pricing-guarantee-note">
                      <p>Upgrade-Option</p>
                      <strong>Individuelle Requisiten und Branding-Elemente möglich</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="container">
            <h2 className="faq-title"><SlashHeading value={content.pricing.faqHeading || content.faq.heading} /></h2>
            <div className="faq-wrap">
              {content.faq.items.map((item) => (
                <details className="faq-item" key={item.question}>
                  <summary className="faq-question">{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="seo-landing-section seo-landing-alt">
          <div className="container">
            <h2><SlashHeading value={content.pricing.referencesHeading || "referenzen/partner"} /></h2>
            <ReferencesCarousel items={references} />
          </div>
        </section>

        <section className="seo-landing-section pricing-contact-section" id="anfragen">
          <div className="container">
            <section className="pricing-contact-panel">
              <div className="pricing-contact-copy">
                <h2>{content.pricing.contactTitle || "Direkt anfragen"}</h2>
                <p className="pricing-contact-intro">
                  Wenn keines der Pakete exakt passt, erstellen wir euch gerne ein individuelles Angebot für Hochzeit,
                  Firmenfeier oder Event in Tirol.
                </p>
                <div className="pricing-contact-details">
                  <div>
                    <h4>Telefon</h4>
                    <p><a href={`tel:${content.contact.phone.replace(/[^+\d]/g, "")}`}>{content.contact.phone}</a></p>
                  </div>
                  <div>
                    <h4>E-Mail</h4>
                    <p><a href={`mailto:${content.contact.email}`}>{content.contact.email}</a></p>
                  </div>
                  <div>
                    <h4>Adresse</h4>
                    <p>{content.contact.address}</p>
                  </div>
                </div>
              </div>
              <div className="pricing-contact-actions">
                <Link href="/kontakt" className="pricing-contact-primary">
                  Unverbindliche Anfrage senden
                </Link>
                <p className="pricing-contact-note">
                  Antwort in der Regel innerhalb von 24 Stunden.
                </p>
              </div>
            </section>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
