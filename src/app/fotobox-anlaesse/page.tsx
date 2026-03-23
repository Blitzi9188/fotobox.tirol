import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import type { CMSContent } from "@/lib/types";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import OccasionSectionNav from "./OccasionSectionNav";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const DEFAULT_OCCASIONS = [
  {
    id: "hochzeit",
    orderLabel: "Hochzeitsfotobox",
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
    imageUrl:
      "/uploads/1772725494493-46ba177e-2411-4843-9112-5f417a6cc0c6-fotobox-fotoautomat-selfie-photobooth-tirol-innsbruck-foto-16-optimized.jpg",
    imageAlt: "Fotobox Tirol bei einer Hochzeit",
    warm: false
  },
  {
    id: "geburtstag",
    orderLabel: "Geburtstagsfotobox",
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
    imageUrl: "/uploads/1772527968262-29cb30f5-f5ab-43a6-af6c-f34ad26ed587-carli-2.jpg",
    imageAlt: "Geburtstagsfotobox mit lockerer Partystimmung",
    warm: true
  },
  {
    id: "firma",
    orderLabel: "Firmen-Event",
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
    imageUrl:
      "/uploads/1772726001232-9db6432f-2bb2-41d2-985a-c749f522c620-fotobox-fotoautomat-selfie-photobooth-tirol-innsbruck-foto-11-optimized.jpg",
    imageAlt: "Fotobox Tirol bei einem Firmenevent",
    warm: false
  },
  {
    id: "event",
    orderLabel: "Events",
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
    imageUrl:
      "/uploads/1772725616835-a3643f1b-9ec6-4d07-b20d-6227a314c187-fotobox-fotoautomat-selfie-photobooth-tirol-innsbruck-foto-18-optimized.jpg",
    imageAlt: "Eventfotobox bei einer größeren Veranstaltung",
    warm: true
  }
];

export async function generateMetadata(): Promise<Metadata> {
  const content = await readCmsContent();
  const occasions = content.occasions;
  const title = occasions?.seoTitle || "Fotobox für jeden Anlass in Tirol | Hochzeit, Geburtstag und Events";
  const description =
    occasions?.seoDescription ||
    "Fotobox mieten in Tirol für Hochzeit, Geburtstag, Firmenevent und weitere Anlässe. Moderne Fotobox-Lösungen mit Sofortdruck, Branding und starkem Erinnerungswert.";

  return {
    title,
    description,
    alternates: {
      canonical: "/fotobox-anlaesse"
    },
    openGraph: {
      title,
      description,
      url: "https://fotoboxtirol-production.up.railway.app/fotobox-anlaesse",
      type: "article"
    }
  };
}

function splitHeroTitle(value?: string) {
  const [left, right] = (value || "jeden/anlass").split("/");
  return { left: (left || "jeden").trim(), right: (right || "anlass").trim() };
}

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
  const occasions: NonNullable<CMSContent["occasions"]> = content.occasions || {
    heroEyebrow: "Professionelle Vermietung in Tirol",
    heroTitle: "Fotobox für",
    heroTitleAccent: "jeden/anlass",
    heroLead:
      "Entdeckt maßgeschneiderte Fotobox-Lösungen für Hochzeiten, Geburtstage, Firmenfeiern und Events in Tirol. Modern, hochwertig und gemacht für bleibende Erinnerungen.",
    heroImageUrl: "/uploads/1772725458356-dcdb983d-1a6d-4d1b-bfcd-de04366260ca-fotobox-tirol-selfie-bilder-7-optimized.jpg",
    sections: DEFAULT_OCCASIONS,
    seoColumns: [],
    searchTerms: [],
    faqHeading: "",
    faqItems: [],
    ctaMeta: "Alle Pakete inklusive Setup und Support",
    ctaTitle: "Unverbindlich Termin anfragen",
    ctaButtonText: "Jetzt anfragen",
    ctaButtonHref: "/kontakt"
  };
  const heroTitle = splitHeroTitle(occasions.heroTitleAccent);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: occasions.seoTitle || "Fotobox für jeden Anlass in Tirol",
        url: "https://fotoboxtirol-production.up.railway.app/fotobox-anlaesse",
        description: occasions.seoDescription || "Fotobox mieten in Tirol für Hochzeit, Geburtstag, Firmenfeier und Event."
      }
    ]
  };

  return (
    <>
      <SiteHeader content={content} />
      <main className={styles.page}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <p className={styles.heroEyebrow}>{occasions.heroEyebrow}</p>
            <h1 className={styles.heroTitle}>
              <strong>{heroTitle.left}</strong>
              <span className="accent-slash">/</span>
              <span>{heroTitle.right}</span>
            </h1>
            <p className={styles.heroLead}>{occasions.heroLead}</p>
            <OccasionSectionNav
              items={occasions.sections.map((occasion) => ({
                id: occasion.id,
                label: occasion.orderLabel || occasion.titleBold
              }))}
            />
          </div>
        </section>

        {occasions.sections.map((occasion, index) => (
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
                <img src={occasion.imageUrl || ""} alt={occasion.imageAlt || occasion.titleBold} className={styles.occasionImage} />
              </div>
            </div>
          </section>
        ))}

      </main>

      <div className={styles.stickyCta}>
        <div className={`container ${styles.stickyCtaInner}`}>
          <div>
            <span className={styles.ctaMeta}>{occasions.ctaMeta}</span>
            <strong className={styles.ctaPrice}>{occasions.ctaTitle}</strong>
          </div>
          <Link href={occasions.ctaButtonHref} className={styles.ctaButton}>{occasions.ctaButtonText}</Link>
        </div>
      </div>

      <SiteFooter content={content} />
    </>
  );
}
