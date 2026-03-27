"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CMSContent } from "@/lib/types";
import BackToTopButton from "@/components/site/BackToTopButton";
import CookieConsentBanner from "@/components/site/CookieConsentBanner";
import { normalizePhoneForTel } from "@/lib/phone";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "startseite" },
    { href: "/fotobox-anlaesse", label: "anlass" },
    { href: "/technische-daten-aufbau", label: "platz" },
    { href: "/layout-gestaltung", label: "layout" },
    { href: "/ki-fotobox-tirol", label: "ki-magie" },
    { href: "/preisgestaltung", label: "preise" },
    { href: "/kontakt", label: "anfrage", className: "accent-link" }
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleScroll() {
      setMobileMenuOpen(false);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

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
                <Link
                  href={item.href}
                  className={`${item.className || ""}${pathname === item.href ? " nav-link-active" : ""}`.trim()}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-nav-menu">
            <button
              type="button"
              className="mobile-nav-toggle"
              aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <span className="mobile-nav-hamburger" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>
      </div>
      {mobileMenuOpen ? (
        <div className="mobile-nav-panel">
          <div className="mobile-nav-panel-inner">
            <ul className="mobile-nav-list">
              {navItems.map((item) => (
                <li key={`mobile-${item.href}`}>
                  <Link
                    href={item.href}
                    className={`${item.className || ""}${pathname === item.href ? " nav-link-active" : ""}`.trim()}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter({ content }: { content: CMSContent }) {
  const isInternalHref = (href: string) => href.startsWith("/");
  const INSTAGRAM_URL = "https://www.instagram.com/fotobox.blitzkneisser/";
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

  const legalLinks = content.footer.legalLinks || [];
  const legalDatenschutzLabel =
    legalLinks.find((link) => normalizeLabel(link.label).includes("datenschutz"))?.label || "Datenschutzerklärung";
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
  const socialLinks = (content.footer.socialLinks || []).map((link) => {
    const normalizedLabel = normalizeLabel(link.label);
    const normalizedHref = (link.href || "").trim().toLowerCase();

    if (normalizedLabel === "e-mail" || normalizedLabel === "email" || normalizedHref.startsWith("mailto:")) {
      return {
        ...link,
        label: "Instagram",
        href: INSTAGRAM_URL,
        newTab: true
      };
    }

    return link;
  });
  const phoneHref = `tel:${normalizePhoneForTel(content.contact.phone)}`;
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
            {socialLinks.map((link) => (
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
          <Link href="/datenschutzerklaerung">{legalDatenschutzLabel}</Link>
          <Link href="/agb">{legalAgbLabel}</Link>
          <Link href="/agb-b2b">{legalAgbB2bLabel}</Link>
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
