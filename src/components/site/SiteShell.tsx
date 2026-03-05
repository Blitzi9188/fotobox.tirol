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
  return (
    <header>
      <div className="container nav-wrap">
        <Link href="/">
          <Brand content={content} />
        </Link>
        <nav>
          <ul>
            <li><Link href="/#space">Platz</Link></li>
            <li><Link href="/#accessories">Requisitten</Link></li>
            <li><Link href="/#layout">Layout</Link></li>
            <li><Link href="/#ai">KI</Link></li>
            <li><Link href="/#faq">Fragen</Link></li>
            <li><Link href="/kontakt" className="accent-link">Anfragen</Link></li>
          </ul>
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
