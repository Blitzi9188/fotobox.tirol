import BookingInquiryForm from "@/components/site/BookingInquiryForm";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import { readCmsContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function KontaktPage({
  searchParams
}: {
  searchParams?: { paket?: string | string[] };
}) {
  const content = await readCmsContent();
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
      </main>
      <SiteFooter content={content} />
    </>
  );
}
