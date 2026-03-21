import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import ConfettiOverlay from "@/components/site/ConfettiOverlay";
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

function createReferenceId(rawDate: string, rawLocation: string, packageLabel: string) {
  const base = `${rawDate}|${rawLocation}|${packageLabel}`;
  let hash = 0;
  for (let i = 0; i < base.length; i += 1) {
    hash = (hash * 31 + base.charCodeAt(i)) % 10000;
  }
  const year = rawDate ? new Date(rawDate).getFullYear() : new Date().getFullYear();
  return `#FT-${year}-${String(hash || 8832).padStart(4, "0")}`;
}

export default async function DankePage({ searchParams }: DankePageProps) {
  const content = await readCmsContent();
  const selectedPackage = (searchParams?.paket || "").trim();
  const rawEventDate = (searchParams?.eventDate || "").trim();
  const rawLocation = (searchParams?.location || "").trim();

  const packageMatch =
    content.pricing.plans.find(
      (plan) => plan.name.toLowerCase() === selectedPackage.toLowerCase()
    ) || content.pricing.plans.find((plan) => plan.featured) || content.pricing.plans[0];

  const packageLabel = packageMatch?.name || "Premium Wedding Box";
  const eventDate = rawEventDate
    ? new Intl.DateTimeFormat("de-AT", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(new Date(rawEventDate))
    : "Wird mit Ihnen abgestimmt";
  const location = rawLocation || "Wird mit Ihnen abgestimmt";
  const referenceId = createReferenceId(rawEventDate, rawLocation, packageLabel);
  const thanks = content.thanks;
  const contactEmail = content.contact.email || "hallo@fotoboxtirol.at";
  const contactPhone = content.contact.phone || "+43 664 3918 228";
  const contactPhoneHref = `tel:${contactPhone.replace(/\s+/g, "")}`;
  const contactEmailHref = `mailto:${contactEmail}`;

  return (
    <>
      <SiteHeader content={content} />
      <main className={styles.main}>
        <ConfettiOverlay />
        <div className={`container ${styles.shell}`}>
          <section className={styles.hero}>
            <div className={styles.checkWrap} aria-hidden="true">
              <svg className={styles.checkIcon} viewBox="0 0 52 52">
                <circle className={styles.checkCircle} cx="26" cy="26" r="25" />
                <path className={styles.checkPath} d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <span className={styles.badge}>{thanks.badge || "Anfrage gesendet"}</span>
            <h1><span>{thanks.heading}</span></h1>
            <p className={styles.lead}>{thanks.message}</p>
          </section>

          <section className={styles.grid}>
            <div className={styles.leftColumn}>
              <article className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8" />
                    <path d="M8 17h8" />
                    <path d="M8 9h1" />
                  </svg>
                  Ihre Zusammenfassung
                </h2>

                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span>Event Datum</span>
                    <strong>{eventDate}</strong>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Location</span>
                    <strong>{location}</strong>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Gewähltes Paket</span>
                    <strong>{packageLabel}</strong>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>{thanks.summaryReferenceLabel || "Referenz-ID"}</span>
                    <strong className={styles.referenceId}>{referenceId}</strong>
                  </div>
                </div>
              </article>

              <article className={styles.inspirationCard}>
                <div className={styles.inspirationGlow} aria-hidden="true" />
                <h2>{thanks.inspirationTitle || "Bleiben Sie inspiriert"}</h2>
                <p>{thanks.inspirationText || "Folgen Sie uns auf Instagram für die neuesten Requisiten, KI-Features und Einblicke von Tiroler Hochzeiten."}</p>
                <a
                  href={contactEmailHref}
                  className={styles.instagramButton}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M22 6 12 13 2 6" />
                  </svg>
                  {thanks.inspirationButtonText || contactEmail}
                </a>
              </article>
            </div>

            <aside className={styles.sideCard}>
              <h2 className={styles.cardTitle}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                Wie es weitergeht
              </h2>

              <div className={styles.steps}>
                <div className={`${styles.step} ${styles.stepActive}`}>
                  <div className={styles.stepIndex}>1</div>
                  <div>
                    <h3>E-Mail Bestätigung</h3>
                    <p>
                      Sie erhalten in Kürze eine Zusammenfassung per E-Mail
                      (bitte auch im Spam-Ordner nachsehen).
                    </p>
                  </div>
                </div>

                <div className={styles.step}>
                  <div className={styles.stepIndex}>2</div>
                  <div>
                    <h3>Verfügbarkeits-Check</h3>
                    <p>Unser Team prüft den Termin innerhalb von 24 Stunden persönlich.</p>
                  </div>
                </div>

                <div className={styles.step}>
                  <div className={styles.stepIndex}>3</div>
                  <div>
                    <h3>Unverbindliches Angebot</h3>
                    <p>
                      Wir senden Ihnen ein detailliertes Angebot inklusive aller Optionen für
                      Ihre Hochzeitslocation.
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.questions}>
                <span>{thanks.questionsTitle || "Haben Sie Fragen?"}</span>
                <a href={contactPhoneHref} className={styles.mailLink}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .95.68l1.49 4.49a1 1 0 0 1-.5 1.21l-2.26 1.13a11.04 11.04 0 0 0 5.52 5.52l1.13-2.26a1 1 0 0 1 1.21-.5l4.49 1.49a1 1 0 0 1 .69.95V19a2 2 0 0 1-2 2h-1C9.72 21 3 14.28 3 6V5Z" />
                  </svg>
                  {contactPhone}
                </a>
              </div>
            </aside>
          </section>

          <section className={styles.bottomAction}>
            <Link href={thanks.primaryButtonHref || "/"} className={styles.backLink}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              {thanks.primaryButtonText || "Zur Startseite"}
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
