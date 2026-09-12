import type { Metadata } from "next";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import LayoutForm from "@/components/site/LayoutForm";

export const revalidate = 3600;
const SITE_URL = "https://www.fotobox.tirol";

export const metadata: Metadata = {
  title: "Layout erstellen | Fotobox Tirol",
  description:
    "Gestalte dein persönliches Fotobox-Layout: Format wählen, Vorlage herunterladen und dein Logo mit deinen Wünschen hochladen. Wir setzen es final für den Druck um.",
  alternates: { canonical: "/layout-erstellen" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Layout erstellen | Fotobox Tirol",
    description:
      "Wähle dein Format, lade dein Logo hoch und schick uns deine Wünsche – wir gestalten dein Fotobox-Layout.",
    url: `${SITE_URL}/layout-erstellen`,
    type: "website",
    locale: "de_AT",
    siteName: "Fotobox Tirol"
  }
};

export default async function LayoutErstellenPage() {
  const content = await readCmsContent();

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <section className="page-hero seo-landing-hero">
          <div className="container">
            <span className="pricing-hero-badge">Nach der Buchung</span>
            <h1>Gestalte dein persönliches Fotobox-Layout</h1>
            <p>
              Wähle dein Format, lade dir die passende Vorlage herunter und schick uns dein Logo mit deinen
              Wünschen. Wir setzen dein Layout final für den Druck um – professionell und passgenau.
            </p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="container layout-erstellen">
            <LayoutForm />
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
