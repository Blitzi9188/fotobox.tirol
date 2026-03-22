import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import { DEFAULT_AGB_TEXT } from "@/lib/legalDefaults";

export const dynamic = "force-dynamic";

export default async function AgbPage() {
  const content = await readCmsContent();
  const agbText = (content.legal?.agbText || DEFAULT_AGB_TEXT).trim();
  const blocks = agbText.split("\n\n");

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <section className="page-hero">
          <div className="container">
            <h1>AGB</h1>
            <p>Allgemeine Geschäftsbedingungen für Verbrauchergeschäfte</p>
          </div>
        </section>

        <section className="container" style={{ paddingBottom: "4rem" }}>
          <div className="admin-card">
            {blocks.map((block, index) => (
              <p key={`agb-block-${index}`} style={{ marginBottom: "1rem", whiteSpace: "pre-line" }}>
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
