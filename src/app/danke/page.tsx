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
            <span className={styles.badge}>Anfrage gesendet</span>
            <h1>
              vielen dank<span className="accent-slash">/</span>herzlichst
            </h1>
            <p className={styles.lead}>
              Ihre Anfrage ist erfolgreich bei uns eingegangen. Wir pruefen die
              Verfuegbarkeit fuer Ihren Wunschtermin und melden uns in Kuerze.
            </p>
          </section>

          <section className={styles.grid}>
            <div className={styles.summaryCardLight}>
              <h2>Anfrage-Zusammenfassung</h2>
              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span>Paket</span>
                  <strong>{packageLabel}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Voraussichtlicher Termin</span>
                  <strong>{eventDate}</strong>
                </div>
                <div className={styles.summaryRow}>
                  <span>Ort der Feier</span>
                  <strong>{location}</strong>
                </div>
              </div>
              <div className={styles.priceBox}>
                <div className={styles.priceLine}>
                  <span>GESCHÄTZTER PREIS</span>
                  <strong>{packagePrice}</strong>
                </div>
                <p>*Inkl. MwSt. Endgueltiger Preis folgt im Angebot.</p>
              </div>
            </div>

            <aside className={styles.summaryCard}>
              <h2>Wie geht es weiter?</h2>
              <div className={styles.steps}>
                <div className={`${styles.step} ${styles.stepActive}`}>
                  <div className={styles.stepIndex}>1</div>
                  <div>
                    <h3>Anfrage-Check</h3>
                    <p>
                      Wir pruefen die Verfuegbarkeit fuer Ihren Termin innerhalb
                      von 24 Stunden.
                    </p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepIndex}>2</div>
                  <div>
                    <h3>Unverbindliches Angebot</h3>
                    <p>
                      Sie erhalten ein detailliertes Angebot per E-Mail inkl.
                      aller Inklusivleistungen.
                    </p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepIndex}>3</div>
                  <div>
                    <h3>Termin Fixierung</h3>
                    <p>
                      Nach Ihrer Bestaetigung wird die Fotobox fest fuer Ihren
                      besonderen Tag reserviert.
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.summaryActions}>
                <Link href="/" className="btn btn-outline">
                  Zurueck zur Startseite
                </Link>
              </div>
            </aside>
          </section>

          <section className={styles.footnote}>
            <p>
              Haben Sie in der Zwischenzeit Fragen? Kontaktieren Sie uns direkt unter{" "}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
