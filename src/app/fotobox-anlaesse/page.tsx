import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader, SlashHeading } from "@/components/site/SiteShell";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fotobox für jeden Anlass in Tirol | Hochzeit, Geburtstag und Events",
  description:
    "Fotobox mieten in Tirol für Hochzeit, Geburtstag, Firmenevent und weitere Anlässe. Moderne Fotobox-Lösungen mit Sofortdruck, Branding und starkem Erinnerungswert.",
  alternates: {
    canonical: "/fotobox-anlaesse"
  },
  openGraph: {
    title: "Fotobox für jeden Anlass in Tirol",
    description:
      "Fotobox mieten in Tirol für Hochzeit, Geburtstag, Firmenfeier und Events. Modern, hochwertig und gemacht für bleibende Erinnerungen.",
    url: "https://fotoboxtirol-production.up.railway.app/fotobox-anlaesse",
    type: "article"
  }
};

const OCCASIONS = [
  {
    id: "hochzeit",
    navLabel: "Hochzeit",
    eyebrow: "Der Klassiker für Brautpaare",
    title: "Romantische",
    titleBold: "Hochzeitsfotobox",
    subtitle: "Fotobox mieten für den schönsten Tag in Tirol",
    description:
      "Eine Hochzeitsfotobox bringt eure Gäste zusammen, lockert die Stimmung auf und liefert Erinnerungen, die direkt mitgenommen werden können. Gerade auf Hochzeiten in Innsbruck, Seefeld oder ganz Tirol wird sie schnell zum Treffpunkt für ehrliche Momente und starke Bilder.",
    benefits: [
      "Unlimitierter Druck für Gästebuch und Erinnerungen",
      "Liebevoll ausgewählte Requisiten und Accessoires",
      "Personalisiertes Print-Layout mit Namen und Datum",
      "Online-Galerie für alle Hochzeitsgäste"
    ],
    imageSrc:
      "/uploads/1772725494493-46ba177e-2411-4843-9112-5f417a6cc0c6-fotobox-fotoautomat-selfie-photobooth-tirol-innsbruck-foto-16-optimized.jpg",
    imageAlt: "Fotobox Tirol bei einer Hochzeit",
    warm: false
  },
  {
    id: "geburtstag",
    navLabel: "Geburtstag",
    eyebrow: "Action für eure Party",
    title: "Eure",
    titleBold: "Geburtstagsfotobox",
    subtitle: "Das Party-Highlight für lockere Geburtstagsfeiern",
    description:
      "Eine Geburtstagsfotobox sorgt sofort für Bewegung, Spaß und spontane Gruppenbilder. Ob runder Geburtstag oder große Familienfeier: Gäste posieren, lachen und nehmen ihre Bilder direkt mit. So wird aus der Feier ein Erlebnis, über das noch lange gesprochen wird.",
    benefits: [
      "Direkter Download per QR-Code auf das Handy",
      "Lustige Accessoires für jede Altersgruppe",
      "Kompakter Aufbau für kleine und große Locations",
      "Professionelles Licht für starke Party-Selfies"
    ],
    imageSrc: "/uploads/1772527968262-29cb30f5-f5ab-43a6-af6c-f34ad26ed587-carli-2.jpg",
    imageAlt: "Geburtstagsfotobox mit lockerer Partystimmung",
    warm: true
  },
  {
    id: "firma",
    navLabel: "Firmenevent",
    eyebrow: "Branding und Mitarbeiter-Erlebnis",
    title: "Professionelles",
    titleBold: "Firmenevent",
    subtitle: "Fotoboxen für Unternehmen, Feiern und Markenauftritte",
    description:
      "Für Firmenfeiern, Weihnachtsfeiern, Sommerfeste oder Jubiläen ist die Fotobox ein starker Mix aus Unterhaltung und Markenwirkung. Layouts, Ausdrucke und Bildsprache lassen sich an euer Corporate Design anpassen und schaffen Content mit Wiedererkennungswert.",
    benefits: [
      "Logo und Branding direkt im Layout integrierbar",
      "DSGVO-konforme Bildspeicherung und Übergabe",
      "Professioneller Thermosublimations-Druck",
      "Technischer Support für einen reibungslosen Ablauf"
    ],
    imageSrc:
      "/uploads/1772726001232-9db6432f-2bb2-41d2-985a-c749f522c620-fotobox-fotoautomat-selfie-photobooth-tirol-innsbruck-foto-11-optimized.jpg",
    imageAlt: "Fotobox Tirol bei einem Firmenevent",
    warm: false
  },
  {
    id: "event",
    navLabel: "Events & Messen",
    eyebrow: "Maximale Aufmerksamkeit",
    title: "Fotobox mieten für",
    titleBold: "Events",
    subtitle: "Ideal für Messen, Festivals und öffentliche Veranstaltungen",
    description:
      "Wenn viele Menschen zusammenkommen, braucht es einen Programmpunkt mit Sogwirkung. Eine Eventfotobox zieht Aufmerksamkeit an, schafft Interaktion und liefert Bilder, die geteilt werden. Genau deshalb ist sie für Messen, Festivals und größere Events in Tirol besonders stark.",
    benefits: [
      "Hohe Aufmerksamkeit am Stand oder Eventbereich",
      "Direkte Social-Media-taugliche Inhalte",
      "Flexibel mit Branding und Aktionslogik kombinierbar",
      "Starker Publikumsmagnet mit echtem Erlebnisfaktor"
    ],
    imageSrc:
      "/uploads/1772725616835-a3643f1b-9ec6-4d07-b20d-6227a314c187-fotobox-fotoautomat-selfie-photobooth-tirol-innsbruck-foto-18-optimized.jpg",
    imageAlt: "Eventfotobox bei einer größeren Veranstaltung",
    warm: true
  }
];

const FAQ_ITEMS = [
  {
    question: "Für welche Anlässe kann man die Fotobox in Tirol mieten?",
    answer:
      "Die Fotobox eignet sich für Hochzeiten, Geburtstage, Firmenfeiern, Messen, Sommerfeste, Weihnachtsfeiern, Jubiläen und viele weitere private oder geschäftliche Events in Tirol."
  },
  {
    question: "Ist die Fotobox für Hochzeiten in Tirol geeignet?",
    answer:
      "Ja. Gerade für Hochzeiten ist die Fotobox besonders beliebt, weil sie Gäste zusammenbringt, spontane Erinnerungen schafft und auf Wunsch mit Sofortdruck, Layout und Requisiten kombiniert werden kann."
  },
  {
    question: "Kann man die Fotobox auch für Firmenfeiern und Events buchen?",
    answer:
      "Ja. Für Firmenfeiern und Events kann die Fotobox mit Branding, individuellem Layout und auf das Event abgestimmtem Auftritt eingesetzt werden."
  },
  {
    question: "Wo kann man die Fotobox in Tirol anfragen?",
    answer:
      "Die Anfrage läuft direkt über die Kontaktseite von Fotobox Tirol. Dort kann das Wunschdatum unverbindlich übermittelt werden."
  }
];

const SEARCH_TERMS = [
  "Hochzeitsfotobox mieten Innsbruck",
  "Fotobox für Firmenevent Preise",
  "Geburtstagsfotobox Tirol",
  "Fotobox mit Druck-Flatrate mieten"
];

function BenefitItem({ text }: { text: string }) {
  return (
    <li className={styles.benefitItem}>
      <span className={styles.benefitIcon}>✓</span>
      <span>{text}</span>
    </li>
  );
}

export default async function FotoboxAnlaessePage() {
  const content = await readCmsContent();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Fotobox für jeden Anlass in Tirol",
        url: "https://fotoboxtirol-production.up.railway.app/fotobox-anlaesse",
        description:
          "Fotobox mieten in Tirol für Hochzeit, Geburtstag, Firmenfeier und Event."
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }
    ]
  };

  return (
    <>
      <SiteHeader content={content} />
      <main className={styles.page}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section className={styles.hero}>
          <div className={styles.heroImage} aria-hidden="true" />
          <div className={`container ${styles.heroInner}`}>
            <p className={styles.heroEyebrow}>Professionelle Vermietung in Tirol</p>
            <h1 className={styles.heroTitle}>
              Fotobox für <span>jeden Anlass</span> mieten
            </h1>
            <p className={styles.heroLead}>
              Entdeckt maßgeschneiderte Fotobox-Lösungen für Hochzeiten, Geburtstage, Firmenfeiern und Events in Tirol.
              Modern, hochwertig und gemacht für bleibende Erinnerungen.
            </p>
          </div>
        </section>

        <section className={styles.tabBar}>
          <div className="container">
            <nav className={styles.tabNav} aria-label="Anlass Navigation">
              {OCCASIONS.map((occasion) => (
                <a key={occasion.id} href={`#${occasion.id}`} className={styles.tabLink}>
                  {occasion.navLabel}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {OCCASIONS.map((occasion, index) => (
          <section
            id={occasion.id}
            key={occasion.id}
            className={`${styles.occasionSection} ${occasion.warm ? styles.warmSection : ""}`}
          >
            <div className={`container ${styles.occasionGrid}`}>
              <div className={`${styles.occasionCopy} ${index % 2 === 1 ? styles.copyOrderTwo : ""}`}>
                <span className={styles.eyebrow}>{occasion.eyebrow}</span>
                <h2 className={styles.sectionTitle}>
                  {occasion.title} <strong>{occasion.titleBold}</strong>
                </h2>
                <h3 className={styles.sectionSubtitle}>{occasion.subtitle}</h3>
                <p className={styles.sectionText}>{occasion.description}</p>
                <ul className={styles.benefits}>
                  {occasion.benefits.map((benefit) => (
                    <BenefitItem key={benefit} text={benefit} />
                  ))}
                </ul>
              </div>

              <div className={`${styles.occasionImageWrap} ${index % 2 === 1 ? styles.imageOrderOne : ""}`}>
                <img src={occasion.imageSrc} alt={occasion.imageAlt} className={styles.occasionImage} />
              </div>
            </div>
          </section>
        ))}

        <section className={styles.seoFooter}>
          <div className={`container ${styles.seoGrid}`}>
            <article>
              <h2>Fotobox mieten Tirol</h2>
              <p>
                Wir liefern eure Fotobox in ganz Tirol, von Innsbruck bis Kitzbühel. Lieferung, Aufbau und eine kurze
                Einweisung sind so abgestimmt, dass euer Anlass entspannt starten kann.
              </p>
            </article>
            <article>
              <h2>Häufige Suchanfragen</h2>
              <ul className={styles.searchList}>
                {SEARCH_TERMS.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
            </article>
            <article>
              <h2>Qualität & Technik</h2>
              <p>
                Wir arbeiten mit echter DSLR-Technik und professionellem Studiolicht. Dadurch liegt die Bildqualität
                sichtbar über klassischen Standard-Fotoboxen.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.faqSection}>
          <div className="container">
            <h2 className={styles.faqTitle}>
              <SlashHeading value="fragen/anlässe" />
            </h2>
            <div className="faq-wrap">
              {FAQ_ITEMS.map((item) => (
                <details className="faq-item" key={item.question}>
                  <summary className="faq-question">{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className={styles.stickyCta}>
        <div className={`container ${styles.stickyCtaInner}`}>
          <div>
            <span className={styles.ctaMeta}>Alle Pakete inklusive Setup und Support</span>
            <strong className={styles.ctaPrice}>Unverbindlich Termin anfragen</strong>
          </div>
          <Link href="/kontakt" className={styles.ctaButton}>Jetzt anfragen</Link>
        </div>
      </div>

      <SiteFooter content={content} />
    </>
  );
}
