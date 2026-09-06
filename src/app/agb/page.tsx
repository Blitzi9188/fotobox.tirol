import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import { DEFAULT_AGB_TEXT } from "@/lib/legalDefaults";

export const revalidate = 3600; // ISR: statisch, stuendlich aktualisiert

function renderAgbBlock(block: string, index: number) {
  const trimmed = block.trim();
  if (trimmed.startsWith("## ")) {
    return (
      <h2 key={`agb-${index}`} style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.5rem" }}>
        {trimmed.replace(/^## /, "")}
      </h2>
    );
  }
  if (trimmed.startsWith("# ")) {
    return (
      <h1 key={`agb-${index}`} style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.75rem" }}>
        {trimmed.replace(/^# /, "")}
      </h1>
    );
  }
  const withBold = trimmed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return (
    <p
      key={`agb-${index}`}
      style={{ marginBottom: "0.9rem", whiteSpace: "pre-line", lineHeight: 1.65 }}
      dangerouslySetInnerHTML={{ __html: withBold }}
    />
  );
}

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
            <p>Allgemeine Geschäftsbedingungen – Fotobox-Vermietung</p>
          </div>
        </section>

        <section className="container" style={{ paddingBottom: "4rem" }}>
          <div className="admin-card">
            {blocks.map((block, index) => renderAgbBlock(block, index))}
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
