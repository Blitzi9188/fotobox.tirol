import Link from "next/link";
import { CMSContent } from "@/lib/types";
import BackToTopButton from "@/components/site/BackToTopButton";
import CookieConsentBanner from "@/components/site/CookieConsentBanner";

function Brand({ content }: { content: CMSContent }) {
  return (
    <span className="brand-wrap">
      {content.navigation.logoUrl ? (
        <img src={content.navigation.logoUrl} alt="Fotobox Tirol Logo" className="brand-logo" />
      ) : null}
      <span className="brand">
        {content.navigation.brandLeft}
        <span className="accent-slash">/</span>
        <span>{content.navigation.brandRight}</span>
      </span>
    </span>
  );
}

export function SiteHeader({ content }: { content: CMSContent }) {
  const navItems = [
    { href: "/#space", label: "Platz" },
    { href: "/#accessories", label: "Requisitten" },
    { href: "/#layout", label: "Layout" },
    { href: "/#ai", label: "KI" },
    { href: "/#faq", label: "Fragen" },
    { href: "/kontakt", label: "Anfragen", className: "accent-link" }
  ];

  return (
    <header>
      <div className="container nav-wrap">
        <Link href="/">
          <Brand content={content} />
        </Link>
        <nav className="site-nav">
          <ul className="nav-list-desktop">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={item.className}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <details className="mobile-nav-menu">
            <summary aria-label="Menü öffnen" title="Menü öffnen">
              <span>•••</span>
            </summary>
            <ul className="mobile-nav-list">
              {navItems.map((item) => (
                <li key={`mobile-${item.href}`}>
                  <Link href={item.href} className={item.className}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ content }: { content: CMSContent }) {
  const isInternalHref = (href: string) => href.startsWith("/");
  const normalizeLabel = (value: string) =>
    (value || "")
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .trim();

  const resolveFooterHref = (label: string, href: string) => {
    const normalizedLabel = normalizeLabel(label);
    if (normalizedLabel.includes("datenschutz")) return "/datenschutzerklaerung";
    if (normalizedLabel.includes("agb") && normalizedLabel.includes("b2b")) return "/agb-b2b";
    if (normalizedLabel === "agb" || normalizedLabel.startsWith("agb ")) return "/agb";
    if (normalizedLabel.includes("impressum")) return "/impressum";

    const trimmed = (href || "").trim();
    if (trimmed && trimmed !== "#") return trimmed;
    return "#";
  };

  const resolveLegalHref = (label: string, href: string, index: number) => {
    const normalizedLabel = normalizeLabel(label);
    if (normalizedLabel.includes("datenschutz")) return "/datenschutzerklaerung";
    if (normalizedLabel.includes("agb") && normalizedLabel.includes("b2b")) return "/agb-b2b";
    if (normalizedLabel === "agb" || normalizedLabel.startsWith("agb ")) return "/agb";

    const trimmed = (href || "").trim();
    if (trimmed && trimmed !== "#") return trimmed;

    // Harte Reihenfolge-Fallbacks fuer Rechtliches, falls CMS-Label/URL fehlerhaft sind.
    if (index === 0) return "/datenschutzerklaerung";
    if (index === 1) return "/agb";
    if (index === 2) return "/agb-b2b";
    return "#";
  };
  const legalLinks = content.footer.legalLinks || [];
  const legalDatenschutzLabel =
    legalLinks.find((link) => normalizeLabel(link.label).includes("datenschutz"))?.label || "Datenschutzerklaerung";
  const legalAgbB2bLabel =
    legalLinks.find((link) => {
      const label = normalizeLabel(link.label);
      return label.includes("agb") && label.includes("b2b");
    })?.label || "AGB (B2B)";
  const legalAgbLabel =
    legalLinks.find((link) => {
      const label = normalizeLabel(link.label);
      return label === "agb" || label.startsWith("agb ");
    })?.label || "AGB";
  const forcedLegalLinks = [
    { label: legalDatenschutzLabel, href: "/datenschutzerklaerung" },
    { label: legalAgbLabel, href: "/agb" },
    { label: legalAgbB2bLabel, href: "/agb-b2b" }
  ];
  const phoneHref = `tel:${content.contact.phone.replace(/\s+/g, "")}`;
  const emailHref = `mailto:${content.contact.email}`;

  return (
    <>
      <footer>
        <div className="container footer-grid">
          <div>
            <h4>{content.footer.questionsTitle}</h4>
            <p>{content.footer.questionsText}</p>
            <p className="footer-contact-inline">
              <span className="footer-contact-item">
                <strong>{content.footer.phoneLabel}:</strong>{" "}
                <a href={phoneHref}>{content.contact.phone}</a>
              </span>
              <span className="footer-contact-item">
                <strong>{content.footer.emailLabel}:</strong>{" "}
                <a href={emailHref}>{content.contact.email}</a>
              </span>
            </p>
          </div>
          <div>
            <h4>{content.footer.socialTitle}</h4>
            <p>{content.footer.socialIntro}</p>
            {content.footer.socialLinks.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target={link.newTab ? "_blank" : undefined}
                rel={link.newTab ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div>
          <h4>{content.footer.infoTitle}</h4>
          {content.footer.infoLinks.map((link) => {
            const resolvedHref = resolveFooterHref(link.label, link.href);
            return isInternalHref(resolvedHref) ? (
              <Link key={`${link.label}-${resolvedHref}`} href={resolvedHref}>{link.label}</Link>
            ) : (
              <a key={`${link.label}-${resolvedHref}`} href={resolvedHref}>{link.label}</a>
            );
          })}
        </div>
        <div>
          <h4>{content.footer.legalTitle}</h4>
          {forcedLegalLinks.map((link) => {
            const resolvedHref = resolveLegalHref(link.label, link.href, 0);
            return isInternalHref(resolvedHref) ? (
              <Link key={`${link.label}-${resolvedHref}`} href={resolvedHref}>{link.label}</Link>
            ) : (
              <a key={`${link.label}-${resolvedHref}`} href={resolvedHref}>{link.label}</a>
            );
          })}
        </div>
      </div>

        <div className="container footer-bottom">
          {content.navigation.logoUrl ? (
            <img src={content.navigation.logoUrl} alt="Fotobox Tirol Logo" className="footer-logo footer-logo-contact" />
          ) : null}
          <div className="footer-bottom-copy">
            <p>{content.footer.copyrightLine}</p>
            <p>{content.footer.taglineLine}</p>
          </div>
        </div>
      </footer>
      <CookieConsentBanner />
      <BackToTopButton />
    </>
  );
}

export function SlashHeading({ value }: { value: string }) {
  const [left, right] = value.split("/");
  return (
    <>
      {left}
      <span className="accent-slash">/</span>
      <span>{right || ""}</span>
    </>
  );
}
