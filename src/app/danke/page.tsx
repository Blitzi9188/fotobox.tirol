import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/SiteShell";
import { readCmsContent } from "@/lib/cms";

export default async function DankePage() {
  const content = await readCmsContent();
  const thanks = content.thanks || {
    heading: "danke/anfrage",
    message: "Danke, wir haben deine Anfrage erhalten und melden uns so schnell als möglich zurück.",
    primaryButtonText: "Zur Startseite",
    primaryButtonHref: "/",
    secondaryButtonText: "Neue Anfrage",
    secondaryButtonHref: "/kontakt"
  };
  const [thanksLeft, thanksRight] = thanks.heading.split("/");

  return (
    <>
      <SiteHeader content={content} />
      <main className="thanks-main">
        <section className="thanks-hero">
          <div className="container">
            <div className="thanks-card">
              <h1>{thanksLeft}<span className="accent-slash">/</span>{thanksRight || ""}</h1>
              <p>{thanks.message}</p>
              <div className="thanks-actions">
                <Link href={thanks.primaryButtonHref || "/"} className="btn">{thanks.primaryButtonText || "Zur Startseite"}</Link>
                <Link href={thanks.secondaryButtonHref || "/kontakt"} className="btn btn-outline">{thanks.secondaryButtonText || "Neue Anfrage"}</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
