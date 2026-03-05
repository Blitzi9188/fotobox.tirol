import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader, SlashHeading } from "@/components/site/SiteShell";

export const dynamic = "force-dynamic";

export default async function PreisePage() {
  const content = await readCmsContent();

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <section className="page-hero">
          <div className="container">
            <h1>Preise</h1>
            <p>Transparente Pakete für Hochzeiten, Events und Firmenfeiern.</p>
          </div>
        </section>

        <section id="pricing" className="pricing">
          <div className="container">
            <h2><SlashHeading value={content.pricing.heading} /></h2>
            <div className="grid grid-3">
              {content.pricing.plans.map((plan) => (
                <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
                  <div className="price-header">
                    <h3>{plan.name}</h3>
                    <div className="price-amount">{plan.price}<span>€</span></div>
                  </div>
                  <ul className="price-list">
                    {plan.items.map((item) => <li key={item}>✓ {item}</li>)}
                  </ul>
                  <Link
                    href={`/kontakt?paket=${encodeURIComponent(plan.name)}`}
                    className={plan.featured ? "btn" : "btn btn-outline"}
                  >
                    {plan.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
