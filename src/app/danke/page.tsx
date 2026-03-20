import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import { readCmsContent } from "@/lib/cms";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type DankePageProps = {
  searchParams?: {
    paket?: string;
    eventDate?: string;
    location?: string;
  };
};

export default async function DankePage({ searchParams }: DankePageProps) {
  const content = await readCmsContent();
  const selectedPackage = (searchParams?.paket || "").trim();
  const rawEventDate = (searchParams?.eventDate || "").trim();
  const rawLocation = (searchParams?.location || "").trim();
  const packageMatch =
    content.pricing.plans.find(
      (plan) => plan.name.toLowerCase() === selectedPackage.toLowerCase()
    ) || content.pricing.plans.find((plan) => plan.featured) || content.pricing.plans[0];

  const packageLabel = packageMatch?.name || "Fotobox Paket";
  const packagePrice = packageMatch?.price ? `${packageMatch.price}€` : "Auf Anfrage";
  const contactEmail = content.contact.email || "info@fotobox.tirol";
  const contactPhone = content.contact.phone || "+43 664 3918 228";
  const contactPhoneHref = `tel:${contactPhone.replace(/\s+/g, "")}`;
  const thanks = content.thanks;
  const eventDate = rawEventDate
    ? new Intl.DateTimeFormat("de-AT", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date(rawEventDate))
    : "Wird mit Ihnen abgestimmt";
  const location = rawLocation || "Wird mit Ihnen abgestimmt";

  return (
    <>
      <SiteHeader content={content} />
      <main className={styles.main}>
        <div className={`container ${styles.shell}`}>
          <section className={styles.hero}>
            <div className={styles.checkmarkWrap} aria-hidden="true">
              <svg className={styles.checkmark} viewBox="0 0 52 52">
                <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" />
                <path
                  className={styles.checkmarkPath}
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
            <span className={styles.badge}>{thanks.badge || "Anfrage gesendet"}</span>
            <h1><span>{thanks.heading}</span></h1>
            <p className={styles.lead}>{thanks.message}</p>
          </section>

          <section className={styles.grid}>
            <div className={styles.summaryCardLight}>
              <h2>{thanks.summaryTitle || "Anfrage-Zusammenfassung"}</h2>
              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span>{thanks.summaryPackageLabel || "Paket"}</span>
                  <strong>{packageLabel}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>{thanks.summaryDateLabel || "Voraussichtlicher Termin"}</span>
                  <strong>{eventDate}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>{thanks.summaryLocationLabel || "Ort der Feier"}</span>
                  <strong>{location}</strong>
                </div>
              </div>
              <div className={styles.priceBox}>
                <div className={styles.priceLine}>
                  <span>{thanks.priceLabel || "GESCHÄTZTER PREIS"}</span>
                  <strong>{packagePrice}</strong>
                </div>
                <p>{thanks.priceNote || "*Inkl. MwSt. Endgueltiger Preis folgt im Angebot."}</p>
              </div>
            </div>

            <aside className={styles.summaryCard}>
              <h2>{thanks.stepsTitle || "Wie geht es weiter?"}</h2>
              <div className={styles.steps}>
                <div className={`${styles.step} ${styles.stepActive}`}>
                  <div className={styles.stepIndex}>1</div>
                  <div>
                    <h3>{thanks.step1Title || "Anfrage-Check"}</h3>
                    <p>{thanks.step1Text || "Wir pruefen die Verfuegbarkeit fuer Ihren Termin innerhalb von 24 Stunden."}</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepIndex}>2</div>
                  <div>
                    <h3>{thanks.step2Title || "Unverbindliches Angebot"}</h3>
                    <p>{thanks.step2Text || "Sie erhalten ein detailliertes Angebot per E-Mail inkl. aller Inklusivleistungen."}</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepIndex}>3</div>
                  <div>
                    <h3>{thanks.step3Title || "Termin Fixierung"}</h3>
                    <p>{thanks.step3Text || "Nach Ihrer Bestaetigung wird die Fotobox fest fuer Ihren besonderen Tag reserviert."}</p>
                  </div>
                </div>
              </div>
              <div className={styles.summaryActions}>
                <Link href={thanks.primaryButtonHref} className="btn btn-outline">
                  {thanks.primaryButtonText}
                </Link>
              </div>
            </aside>
          </section>

          <section className={styles.footnote}>
            <p>
              {thanks.footerText || "Haben Sie in der Zwischenzeit Fragen? Kontaktieren Sie uns direkt unter"}{" "}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
          </section>

          <section className={styles.quickActions}>
            <Link href={thanks.primaryButtonHref || "/"} className={styles.backButton}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10 19l-7-7 7-7" />
                <path d="M3 12h18" />
              </svg>
              Zurück zur Startseite
            </Link>
            <a href={contactPhoneHref} className={styles.callButton}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .95.68l1.49 4.49a1 1 0 0 1-.5 1.21l-2.26 1.13a11.04 11.04 0 0 0 5.52 5.52l1.13-2.26a1 1 0 0 1 1.21-.5l4.49 1.49a1 1 0 0 1 .69.95V19a2 2 0 0 1-2 2h-1C9.72 21 3 14.28 3 6V5Z" />
              </svg>
              Sofort-Kontakt
            </a>
          </section>

        </div>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
