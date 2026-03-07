import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import { DEFAULT_IMPRESSUM_TEXT } from "@/lib/legalDefaults";

export const dynamic = "force-dynamic";

export default async function ImpressumPage() {
  const content = await readCmsContent();
  const impressumText = (content.legal?.impressumText || DEFAULT_IMPRESSUM_TEXT).trim();

  const blocks = impressumText.split("\n\n");

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <section className="page-hero">
          <div className="container">
            <h1>Impressum</h1>
            <p>Angaben gemaess § 5 ECG</p>
          </div>
        </section>

        <section className="container" style={{ paddingBottom: "4rem" }}>
          <div className="admin-card">
            {blocks.map((block, index) => (
              <p key={`impressum-block-${index}`} style={{ marginBottom: "1rem", whiteSpace: "pre-line" }}>
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
