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
          {content.footer.infoLinks.map((link) =>
            isInternalHref(link.href) ? (
              <Link key={`${link.label}-${link.href}`} href={link.href}>{link.label}</Link>
            ) : (
              <a key={`${link.label}-${link.href}`} href={link.href}>{link.label}</a>
            )
          )}
        </div>
        <div>
          <h4>{content.footer.legalTitle}</h4>
          {content.footer.legalLinks.map((link) =>
            isInternalHref(link.href) ? (
              <Link key={`${link.label}-${link.href}`} href={link.href}>{link.label}</Link>
            ) : (
              <a key={`${link.label}-${link.href}`} href={link.href}>{link.label}</a>
            )
          )}
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
