import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import { readCmsContent } from "@/lib/cms";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type DankePageProps = {
  searchParams?: {
    paket?: string;
  };
};

export default async function DankePage({ searchParams }: DankePageProps) {
  const content = await readCmsContent();
  const selectedPackage = (searchParams?.paket || "").trim();
  const packageMatch =
    content.pricing.plans.find(
      (plan) => plan.name.toLowerCase() === selectedPackage.toLowerCase()
    ) || content.pricing.plans.find((plan) => plan.featured) || content.pricing.plans[0];

  const packageLabel = packageMatch?.name || "Fotobox Paket";
  const packagePrice = packageMatch?.price ? `${packageMatch.price}€` : "Auf Anfrage";
  const contactEmail = content.contact.email || "info@fotobox.tirol";

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
              Wir haben Ihre Anfrage fuer das{" "}
              <strong>{packageLabel}</strong> erhalten. Unser Team prueft nun die
              Verfuegbarkeit fuer Ihren Termin und meldet sich zeitnah bei Ihnen.
            </p>
          </section>

          <section className={styles.grid}>
            <div className={styles.stepsCard}>
              <h2>Naechste Schritte</h2>
              <div className={styles.steps}>
                <div className={`${styles.step} ${styles.stepActive}`}>
                  <div className={styles.stepIndex}>1</div>
                  <div>
                    <h3>Verfuegbarkeits-Check</h3>
                    <p>
                      Wir pruefen, ob die Fotobox an Ihrem Wunschdatum noch frei ist.
                      Sie erhalten in der Regel innerhalb von 24 Stunden Rueckmeldung.
                    </p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepIndex}>2</div>
                  <div>
                    <h3>Unverbindliches Angebot</h3>
                    <p>
                      Anschliessend senden wir Ihnen ein klares Angebot inklusive
                      aller Details und optionaler Erweiterungen zu.
                    </p>
                  </div>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepIndex}>3</div>
                  <div>
                    <h3>Fixe Buchung</h3>
                    <p>
                      Sobald Sie bestaetigen, ist die Fotobox fuer Ihr Event fix
                      reserviert und wir stimmen die weiteren Details gemeinsam ab.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className={styles.summaryCard}>
              <h2>Zusammenfassung</h2>
              <div className={styles.summaryList}>
                <div>
                  <span>Gewaehltes Paket</span>
                  <strong>{packageLabel}</strong>
                </div>
                <div>
                  <span>Ihr Ansprechpartner</span>
                  <strong>Fotobox Tirol Team</strong>
                </div>
                <div>
                  <span>Geschaetzte Investition</span>
                  <strong className={styles.price}>{packagePrice}</strong>
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
              Haben Sie keine E-Mail erhalten? Bitte pruefen Sie Ihren Spam-Ordner
              oder kontaktieren Sie uns direkt unter{" "}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
