import BookingInquiryForm from "@/components/site/BookingInquiryForm";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import { readCmsContent } from "@/lib/cms";
import { formatReviewDateWithCurrentYear, getSortedLatestReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function KontaktPage({
  searchParams
}: {
  searchParams?: { paket?: string | string[] };
}) {
  const content = await readCmsContent();
  const stars = (count: number) => Array.from({ length: Math.max(0, Math.min(5, Math.round(count))) }, (_, i) => (
    <span className="star" key={i}>★</span>
  ));
  const paketParam = searchParams?.paket;
  const requestedPackage = Array.isArray(paketParam) ? paketParam[0] : paketParam;
  const hasPackage = content.pricing.plans.some((plan) => plan.name === requestedPackage);
  const initialPackage = hasPackage ? requestedPackage : content.pricing.plans[0]?.name;
  const fallbackReferences = [
    { label: "Fiegl+Spielberger", href: "https://www.fiegl.co.at" },
    { label: "Congress Messe Innsbruck", href: "https://www.cmi.at" },
    { label: "Kloster Bräu Seefeld", href: "https://www.klosterbraeu.com" },
    { label: "Tiroler Versicherung", href: "https://www.tiroler.at" },
    { label: "Völkl Ski", href: "https://www.voelkl.com" },
    { label: "Recycling Ahrental", href: "https://www.recycling-ahrental.at" },
    { label: "Sandoz", href: "https://www.sandoz.com" },
    { label: "Sailer Seefeld", href: "https://www.sailer-seefeld.at" },
    { label: "Interalpen Hotel", href: "https://www.interalpen.com" },
    { label: "Wetscher", href: "https://www.wetscher.com" },
    { label: "Burton", href: "https://www.burton.com" },
    { label: "Tiroler Wasserkraft", href: "https://www.tiwag.at" },
    { label: "Woods Seefeld", href: "https://www.woods-kitchen.at" },
    { label: "OFA", href: "https://www.ofa.de" },
    { label: "Bayrischer Hof", href: "https://www.bayerischerhof.de" },
    { label: "VOGUE Germany", href: "https://www.vogue.de" },
    { label: "Adlers Hotel", href: "https://www.adlers-innsbruck.com" },
    { label: "Hypo Tirol Bank", href: "https://www.hypotirol.com" },
    { label: "Aqua Dome", href: "https://www.aqua-dome.at" },
    { label: "Aufschnaiter", href: "https://www.aufschnaiter.com" },
    { label: "Salt Schweiz", href: "https://www.salt.ch" },
    { label: "Büro im Laden", href: "https://www.buero-im-laden.at" },
    { label: "Donau Versicherung", href: "https://www.donauversicherung.at" },
    { label: "Tirol Werbung", href: "https://www.tirolwerbung.at" },
    { label: "Innsbruck Torismus", href: "https://www.innsbruck.info" },
    { label: "Thöni Telfs", href: "https://www.thoeni.com" },
    { label: "Kaufhaus Tyrol", href: "https://www.kaufhaus-tyrol.at" },
    { label: "DEZ Einkaufszentrum", href: "https://www.dez.at" },
    { label: "Löffler", href: "https://www.loeffler.at" }
  ];
  const references = content.contact.references && content.contact.references.length > 0
    ? content.contact.references
    : fallbackReferences;
  const reviewsDefaults = {
    heading: "kunden/bewertungen",
    sourceLabel: "Google Bewertungen",
    score: "4.9",
    reviewCountLabel: "Basierend auf 47 Bewertungen",
    ctaLabel: "Alle Bewertungen auf Google ansehen",
    ctaHref: "https://g.page/fotoboxtirol/review",
    items: [
      { initials: "SM", name: "Sarah M.", date: "Oktober 2024", rating: 5, text: "Absolut begeistert! Die Fotobox war das Highlight unserer Hochzeit.", avatarColor: "#ea2c2c" },
      { initials: "TK", name: "Thomas K.", date: "September 2024", rating: 5, text: "Für unsere Firmenfeier genau das Richtige. Professionelle Abwicklung.", avatarColor: "#1a1a1a" },
      { initials: "LB", name: "Laura B.", date: "August 2024", rating: 5, text: "Top Bildqualität und super Service. Gerne wieder!", avatarColor: "#555555" }
    ]
  };
  const reviews = {
    ...reviewsDefaults,
    ...(content.reviews || {}),
    items:
      Array.isArray(content.reviews?.items) && content.reviews.items.length > 0
        ? content.reviews.items
        : reviewsDefaults.items
  };
  const latestReviews = getSortedLatestReviews(reviews.items);

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <section className="inquiry-hero">
          <div className="container inquiry-hero-inner">
            <h1>{content.inquiry.heading.split("/")[0]}<span className="accent-slash">/</span>{content.inquiry.heading.split("/")[1] || ""}</h1>
            <p>{content.inquiry.introText}</p>
          </div>
        </section>

        <section className="container inquiry-layout">
          <BookingInquiryForm plans={content.pricing.plans} initialPackage={initialPackage} inquiry={content.inquiry} />
          <aside className="inquiry-sidecard">
            <h2>Direktkontakt</h2>
            <p>
              <strong>Telefon:</strong>{" "}
              <a href={`tel:${content.contact.phone.replace(/\s+/g, "")}`}>{content.contact.phone}</a>
            </p>
            <p>
              <strong>E-Mail:</strong>{" "}
              <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
            </p>
            <p><strong>Adresse:</strong> {content.contact.address}</p>
            <div className="inquiry-references">
              <h3>Referenzen</h3>
              <ul>
                {references.map((reference) => (
                  <li key={reference.label}>
                    <a href={reference.href} target="_blank" rel="noopener noreferrer">
                      {reference.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>
        <section id="reviews" className="reviews">
          <div className="container">
            <div className="overall-rating">
              <div className="reviews-header">
                <h2 style={{ marginBottom: "0.35rem" }}>{reviews.heading.split("/")[0]}<span className="accent-slash">/</span>{reviews.heading.split("/")[1] || ""}</h2>
              </div>
              <div className="reviews-fixed-stars" aria-label="5 von 5 Sterne">★★★★★</div>
            </div>
            <div className="reviews-grid">
              {latestReviews.map((review, index) => (
                <article className="review-card" key={`${review.name}-${index}`}>
                  <div className="review-top">
                    <div className="reviewer-avatar" style={{ background: review.avatarColor || "#ea2c2c" }}>{review.initials}</div>
                    <div>
                      <div className="reviewer-name">{review.name}</div>
                      <div className="review-date">{formatReviewDateWithCurrentYear(review.date)}</div>
                    </div>
                  </div>
                  <div className="review-stars">{stars(review.rating)}</div>
                  <p className="review-text">{review.text}</p>
                </article>
              ))}
            </div>
            <div className="reviews-cta">
              <a href={reviews.ctaHref} target="_blank" rel="noopener noreferrer">
                {reviews.ctaLabel}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
