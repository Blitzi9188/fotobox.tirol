import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import { DEFAULT_AGB_B2B_TEXT } from "@/lib/legalDefaults";

export const dynamic = "force-dynamic";

export default async function AgbB2bPage() {
  const content = await readCmsContent();
  const agbB2bText = (content.legal?.agbB2bText || DEFAULT_AGB_B2B_TEXT).trim();
  const blocks = agbB2bText.split("\n\n");

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <section className="page-hero">
          <div className="container">
            <h1>AGB (B2B)</h1>
            <p>Allgemeine Geschäftsbedingungen für Unternehmensgeschäfte</p>
          </div>
        </section>

        <section className="container" style={{ paddingBottom: "4rem" }}>
          <div className="admin-card">
            {blocks.map((block, index) => (
              <p key={`agb-b2b-block-${index}`} style={{ marginBottom: "1rem", whiteSpace: "pre-line" }}>
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
