import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import { DEFAULT_DATENSCHUTZ_TEXT } from "@/lib/legalDefaults";

export default async function DatenschutzerklaerungPage() {
  const content = await readCmsContent();
  const datenschutzText = (content.legal?.datenschutzerklaerungText || DEFAULT_DATENSCHUTZ_TEXT).trim();
  const blocks = datenschutzText.split("\n\n");

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <section className="page-hero">
          <div className="container">
            <h1>Datenschutzerklaerung</h1>
            <p>Informationen zur Verarbeitung personenbezogener Daten</p>
          </div>
        </section>

        <section className="container" style={{ paddingBottom: "4rem" }}>
          <div className="admin-card">
            {blocks.map((block, index) => (
              <p key={`datenschutz-block-${index}`} style={{ marginBottom: "1rem", whiteSpace: "pre-line" }}>
                {block}
              </p>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
