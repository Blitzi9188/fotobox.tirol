"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { AccessoryItem, CMSContent, GalleryItem } from "@/lib/types";
import { DEFAULT_AGB_B2B_TEXT, DEFAULT_AGB_TEXT, DEFAULT_DATENSCHUTZ_TEXT, DEFAULT_IMPRESSUM_TEXT } from "@/lib/legalDefaults";

type CmsUpdater = (prev: CMSContent) => CMSContent;
type SectionId =
  | "overview"
  | "hero"
  | "features"
  | "space"
  | "spaceLayout"
  | "pricing"
  | "media"
  | "reviews"
  | "faq"
  | "inquiry"
  | "thanks"
  | "contact"
  | "footer"
  | "legal"
  | "seo";
type HomepageBlockId = "hero" | "features" | "space" | "media" | "pricing" | "reviews" | "faq";

const SECTION_TABS: Array<{ id: SectionId; label: string }> = [
  { id: "overview", label: "Übersicht" },
  { id: "hero", label: "Hero" },
  { id: "features", label: "Features" },
  { id: "space", label: "Platzbedarf" },
  { id: "spaceLayout", label: "Layout/Gestaltung" },
  { id: "pricing", label: "Preise" },
  { id: "reviews", label: "Rezensionen" },
  { id: "media", label: "Bilder" },
  { id: "faq", label: "FAQ" },
  { id: "inquiry", label: "Anfrage" },
  { id: "thanks", label: "Danke" },
  { id: "contact", label: "Kontakt" },
  { id: "footer", label: "Footer" },
  { id: "legal", label: "Rechtliches" },
  { id: "seo", label: "SEO (CEO)" }
];

const HOMEPAGE_BLOCKS: Array<{ id: HomepageBlockId; label: string; note: string }> = [
  { id: "hero", label: "Hero", note: "Hauptbereich mit Titel und Hintergrundbild." },
  { id: "features", label: "Features", note: "Technik- und Leistungsmerkmale." },
  { id: "space", label: "Platzbedarf", note: "Block für benötigte Fläche und Grafik." },
  { id: "media", label: "Media", note: "KI-Vergleich und Galerie." },
  { id: "pricing", label: "Preise", note: "Paketübersicht und CTA Buttons." },
  { id: "reviews", label: "Rezensionen", note: "Kundenbewertungen und Score-Bereich." },
  { id: "faq", label: "FAQ", note: "Häufige Fragen und Antworten." }
];
const DEFAULT_HOMEPAGE_ORDER: HomepageBlockId[] = HOMEPAGE_BLOCKS.map((block) => block.id);

function htmlToPlainText(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|ul|ol|h1|h2|h3|h4|h5|h6)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function textToParagraphHtml(value: string) {
  const paragraphs = value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return "";
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function parseFooterLinks(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [labelPart, hrefPart] = line.split("|");
      return {
        label: (labelPart || "").trim(),
        href: (hrefPart || "#").trim() || "#"
      };
    })
    .filter((item) => item.label);
}

function footerLinksToText(links: Array<{ label: string; href: string }>) {
  return links.map((item) => `${item.label} | ${item.href}`).join("\n");
}

function normalizeImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("www.")) return `https://${trimmed}`;
  return trimmed;
}

export default function AdminDashboard() {
  const [content, setContent] = useState<CMSContent | null>(null);
  const [history, setHistory] = useState<CMSContent[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [status, setStatus] = useState("");
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<SectionId>("overview");
  const [homepageOrder, setHomepageOrder] = useState<HomepageBlockId[]>(DEFAULT_HOMEPAGE_ORDER);

  async function loadContent() {
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    if (response.status === 401) {
      setAuthorized(false);
      setStatus("Session abgelaufen. Bitte neu einloggen.");
      return;
    }

    const json = (await response.json()) as CMSContent;
    const persistedHomepageOrder = [...new Set(json.layout?.homepageOrder || [])];
    const normalizedHomepageOrder: HomepageBlockId[] = [
      ...persistedHomepageOrder.filter((id): id is HomepageBlockId =>
        DEFAULT_HOMEPAGE_ORDER.includes(id as HomepageBlockId)
      ),
      ...DEFAULT_HOMEPAGE_ORDER.filter((id) => !persistedHomepageOrder.includes(id))
    ];

    const normalizedAiDescriptionText = (json.ai.descriptionText || htmlToPlainText(json.ai.descriptionHtml || "")).trim();
    const normalizedFooter = {
      questionsTitle: json.footer?.questionsTitle || "Du hast Fragen?",
      questionsText: json.footer?.questionsText || "",
      phoneLabel: json.footer?.phoneLabel || "Tel.",
      emailLabel: json.footer?.emailLabel || "Email",
      socialTitle: json.footer?.socialTitle || "Social Media",
      socialIntro: json.footer?.socialIntro || "",
      socialLinks: json.footer?.socialLinks || [],
      infoTitle: json.footer?.infoTitle || "Informationen",
      infoLinks: json.footer?.infoLinks || [],
      legalTitle: json.footer?.legalTitle || "Rechtliches",
      legalLinks: json.footer?.legalLinks || [],
      copyrightLine: json.footer?.copyrightLine || "",
      taglineLine: json.footer?.taglineLine || ""
    };
    const normalizedLegal = {
      impressumText: json.legal?.impressumText || DEFAULT_IMPRESSUM_TEXT,
      datenschutzerklaerungText: json.legal?.datenschutzerklaerungText || DEFAULT_DATENSCHUTZ_TEXT,
      agbText: json.legal?.agbText || DEFAULT_AGB_TEXT,
      agbB2bText: json.legal?.agbB2bText || DEFAULT_AGB_B2B_TEXT
    };
    const fallbackAccessories: AccessoryItem[] = (json.gallery?.items || []).slice(0, 10).map((item, index) => ({
      title: item.title || `Accessoire ${index + 1}`,
      imageUrl: item.imageUrl || "",
      altText: item.altText || item.title || `Accessoire ${index + 1}`,
      color: item.color || "#e5e7eb",
      linkUrl: ""
    }));
    const accessoriesSource = (json.accessories?.items && json.accessories.items.length > 0
      ? json.accessories.items
      : fallbackAccessories
    );
    while (accessoriesSource.length < 10) {
      accessoriesSource.push({
        title: `Accessoire ${accessoriesSource.length + 1}`,
        imageUrl: "",
        altText: `Accessoire ${accessoriesSource.length + 1}`,
        color: "#e5e7eb",
        linkUrl: ""
      });
    }
    const normalizedAccessories = {
      overtitle: json.accessories?.overtitle || "Accessoires",
      heading: json.accessories?.heading || "Passende Requisiten fuer jeden Anlass",
      items: accessoriesSource
    };
    const normalizedContact = {
      heading: json.contact?.heading || "kontakt/anfrage",
      introHtml: json.contact?.introHtml || "",
      phone: json.contact?.phone || "",
      email: json.contact?.email || "",
      address: json.contact?.address || "",
      references: json.contact?.references || []
    };
    const normalizedThanks = {
      heading: json.thanks?.heading || "danke/anfrage",
      message: json.thanks?.message || "Danke, wir haben deine Anfrage erhalten und melden uns so schnell als möglich zurück.",
      primaryButtonText: json.thanks?.primaryButtonText || "Zur Startseite",
      primaryButtonHref: json.thanks?.primaryButtonHref || "/",
      secondaryButtonText: json.thanks?.secondaryButtonText || "Neue Anfrage",
      secondaryButtonHref: json.thanks?.secondaryButtonHref || "/kontakt"
    };
    const normalizedSpace = {
      heading: json.space?.heading || "wie viel platz/brauchen wir",
      description: json.space?.description || "",
      imageUrl: json.space?.imageUrl || "",
      layoutOneHeading: json.space?.layoutOneHeading || "layout/gestaltung",
      layoutOneDescription: json.space?.layoutOneDescription || json.space?.description || "",
      layoutOneImageUrl: json.space?.layoutOneImageUrl || json.space?.imageUrl || "",
      layoutOneImageAlt: json.space?.layoutOneImageAlt || "Layout Gestaltung Bild 1",
      layoutTwoHeading: json.space?.layoutTwoHeading || "layout/gestaltung",
      layoutTwoDescription: json.space?.layoutTwoDescription || json.space?.description || "",
      layoutTwoImageUrl: json.space?.layoutTwoImageUrl || json.space?.imageUrl || "",
      layoutTwoImageAlt: json.space?.layoutTwoImageAlt || "Layout Gestaltung Bild 2"
    };
    const normalizedReviews = {
      heading: json.reviews?.heading || "kunden/bewertungen",
      sourceLabel: json.reviews?.sourceLabel || "Google Bewertungen",
      score: json.reviews?.score || "4.9",
      reviewCountLabel: json.reviews?.reviewCountLabel || "Basierend auf 47 Bewertungen",
      ctaLabel: json.reviews?.ctaLabel || "Alle Bewertungen auf Google ansehen",
      ctaHref: json.reviews?.ctaHref || "https://g.page/fotoboxtirol/review",
      items: (json.reviews?.items && json.reviews.items.length > 0)
        ? json.reviews.items
        : [
            {
              name: "Sarah M.",
              date: "Oktober 2024",
              text: "Absolut begeistert! Die Fotobox war der Highlight unserer Hochzeit.",
              initials: "SM",
              avatarColor: "#ea2c2c",
              rating: 5
            },
            {
              name: "Thomas K.",
              date: "September 2024",
              text: "Für unsere Firmenfeier genau das Richtige. Klare Empfehlung!",
              initials: "TK",
              avatarColor: "#1a1a1a",
              rating: 5
            },
            {
              name: "Laura B.",
              date: "August 2024",
              text: "Top Bildqualität und reibungsloser Ablauf.",
              initials: "LB",
              avatarColor: "#666666",
              rating: 5
            }
          ]
    };

    setContent({
      ...json,
      ai: {
        ...json.ai,
        descriptionText: normalizedAiDescriptionText,
        descriptionHtml: textToParagraphHtml(normalizedAiDescriptionText)
      },
      footer: normalizedFooter,
      legal: normalizedLegal,
      accessories: normalizedAccessories,
      thanks: normalizedThanks,
      contact: normalizedContact,
      space: normalizedSpace,
      reviews: normalizedReviews,
      layout: {
        ...json.layout,
        homepageOrder: normalizedHomepageOrder
      }
    });
    setHomepageOrder(normalizedHomepageOrder);
    setActiveTab((prev) => (SECTION_TABS.some((tab) => tab.id === prev) ? prev : "overview"));
    setAuthorized(true);
    setDirty(false);
    setHistory([]);
    setStatus("Inhalte geladen.");
  }

  useEffect(() => {
    loadContent();
  }, []);

  function updateContent(update: CmsUpdater) {
    setContent((prev) => {
      if (!prev) return prev;
      const next = update(prev);
      setHistory((current) => [...current.slice(-39), prev]);
      return next;
    });
    setDirty(true);
  }

  function undoLastChange() {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) {
        setStatus("Keine Änderung zum Rückgängig machen.");
        return prevHistory;
      }

      const nextHistory = [...prevHistory];
      const previousContent = nextHistory.pop();
      if (!previousContent) return prevHistory;

      const restoredOrderRaw = [...new Set(previousContent.layout?.homepageOrder || [])];
      const restoredOrder: HomepageBlockId[] = [
        ...restoredOrderRaw.filter((id): id is HomepageBlockId =>
          DEFAULT_HOMEPAGE_ORDER.includes(id as HomepageBlockId)
        ),
        ...DEFAULT_HOMEPAGE_ORDER.filter((id) => !restoredOrderRaw.includes(id))
      ];

      setContent({
        ...previousContent,
        layout: {
          ...previousContent.layout,
          homepageOrder: restoredOrder
        }
      });
      setHomepageOrder(restoredOrder);
      setDirty(nextHistory.length > 0);
      setStatus("Letzte Änderung rückgängig gemacht.");

      return nextHistory;
    });
  }

  async function saveContent() {
    if (!content) return;

    setStatus("Speichere...");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content)
    });

    if (response.status === 401) {
      setAuthorized(false);
      setStatus("Session abgelaufen. Bitte neu einloggen.");
      return;
    }

    if (!response.ok) {
      const json = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus(json?.error || "Fehler beim Speichern.");
      return;
    }

    setDirty(false);
    setHistory([]);
    setStatus("Gespeichert.");
  }

  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData
    });

    if (response.status === 401) {
      setAuthorized(false);
      setStatus("Session abgelaufen. Bitte neu einloggen.");
      return null;
    }

    if (!response.ok) {
      const json = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus(json?.error || "Upload fehlgeschlagen.");
      return null;
    }

    const json = (await response.json()) as { url: string };
    setStatus("Bild hochgeladen. Bitte speichern.");
    setDirty(true);
    return json.url;
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    applyUrl: (url: string) => void,
    loadingText: string
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus(loadingText);
    const url = await uploadImage(file);
    if (!url) return;

    applyUrl(url);
    event.target.value = "";
  }

  function updateGalleryItem(index: number, nextItem: GalleryItem) {
    updateContent((prev) => {
      const items = [...prev.gallery.items];
      items[index] = nextItem;
      return { ...prev, gallery: { ...prev.gallery, items } };
    });
  }

  function updateAccessoryItem(index: number, nextItem: AccessoryItem) {
    updateContent((prev) => {
      const items = [...prev.accessories.items];
      items[index] = nextItem;
      return {
        ...prev,
        accessories: {
          ...prev.accessories,
          items
        }
      };
    });
  }

  function addAccessoryItem() {
    updateContent((prev) => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        items: [
          ...prev.accessories.items,
          {
            title: `Accessoire ${prev.accessories.items.length + 1}`,
            imageUrl: "",
            altText: `Accessoire ${prev.accessories.items.length + 1}`,
            color: "#e5e7eb",
            linkUrl: ""
          }
        ]
      }
    }));
  }

  function removeAccessoryItem(index: number) {
    updateContent((prev) => {
      if (prev.accessories.items.length <= 4) return prev;
      return {
        ...prev,
        accessories: {
          ...prev.accessories,
          items: prev.accessories.items.filter((_, itemIndex) => itemIndex !== index)
        }
      };
    });
  }

  function addGalleryItem() {
    updateContent((prev) => ({
      ...prev,
      gallery: {
        ...prev.gallery,
        items: [
          ...prev.gallery.items,
          {
            title: `Neues Bild ${prev.gallery.items.length + 1}`,
            color: "#e5e5e5",
            imageUrl: "",
            altText: "",
            linkUrl: "",
            height: 340
          }
        ]
      }
    }));
  }

  function removeGalleryItem(index: number) {
    updateContent((prev) => {
      const items = prev.gallery.items.filter((_, itemIndex) => itemIndex !== index);
      return { ...prev, gallery: { ...prev.gallery, items } };
    });
  }

  function moveHomepageBlock(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= homepageOrder.length) return;

    const next = [...homepageOrder];
    const [item] = next.splice(index, 1);
    next.splice(newIndex, 0, item);

    setHomepageOrder(next);
    updateContent((current) => ({
      ...current,
      layout: {
        ...current.layout,
        homepageOrder: next
      }
    }));
  }

  const stats = useMemo(() => {
    if (!content) {
      return { images: 0, plans: 0, faq: 0, gallery: 0 };
    }

    const uploadedImages = [
      content.hero.imageUrl,
      content.ai.previewImageUrl,
      content.ai.compareLeftBeforeUrl,
      content.ai.compareLeftAfterUrl,
      content.ai.compareRightBeforeUrl,
      content.ai.compareRightAfterUrl,
      content.navigation.logoUrl,
      ...content.accessories.items.map((item) => item.imageUrl),
      ...content.gallery.items.map((item) => item.imageUrl)
    ].filter(Boolean).length;

    return {
      images: uploadedImages,
      plans: content.pricing.plans.length,
      faq: content.faq.items.length,
      gallery: content.gallery.items.length
    };
  }, [content]);

  if (authorized === null) {
    return <div className="admin-wrap"><p>Lade CMS...</p></div>;
  }

  if (!authorized) {
    return (
      <div className="admin-wrap">
        <AdminLoginForm onSuccess={loadContent} />
      </div>
    );
  }

  if (!content) {
    return <div className="admin-wrap"><p>Keine Daten geladen.</p></div>;
  }

  function renderSection(section: SectionId, content: CMSContent) {
    if (section === "overview") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Übersicht</h2>
            <p>Aktueller Stand deiner Website-Inhalte.</p>
          </div>
          <div className="admin-stats-grid">
            <article className="admin-stat"><span>Bilder aktiv</span><strong>{stats.images}</strong></article>
            <article className="admin-stat"><span>Preis-Pakete</span><strong>{stats.plans}</strong></article>
            <article className="admin-stat"><span>FAQ Einträge</span><strong>{stats.faq}</strong></article>
            <article className="admin-stat"><span>Galerie Slots</span><strong>{stats.gallery}</strong></article>
          </div>

          <div className="admin-section-head admin-builder-head">
            <h2>Seitenaufbau</h2>
            <p>Hier siehst du die komplette Reihenfolge der Homepage-Blöcke und kannst sie nach oben/unten verschieben.</p>
          </div>

          <div className="admin-block-list">
            {homepageOrder.map((blockId, index) => {
              const block = HOMEPAGE_BLOCKS.find((entry) => entry.id === blockId);
              if (!block) return null;

              return (
                <article className="admin-block-card" key={block.id}>
                  <div className="admin-block-order">{index + 1}</div>
                  <div className="admin-block-content">
                    <h3>{block.label}</h3>
                    <p>{block.note}</p>
                  </div>
                  <div className="admin-block-actions">
                    <button type="button" onClick={() => moveHomepageBlock(index, -1)} disabled={index === 0}>
                      Nach oben
                    </button>
                    <button
                      type="button"
                      onClick={() => moveHomepageBlock(index, 1)}
                      disabled={index === homepageOrder.length - 1}
                    >
                      Nach unten
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      );
    }

    if (section === "hero") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Hero Bereich</h2>
            <p>Haupttitel, Untertitel und zentrales Hero-Bild.</p>
          </div>
          <div className="admin-grid-2">
            <div className="admin-panel">
              <label className="admin-field">
                <span>Titel</span>
                <input
                  value={content.hero.title}
                  onChange={(e) => updateContent((prev) => ({ ...prev, hero: { ...prev.hero, title: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Untertitel (Text, ohne Punkt/Liste)</span>
                <textarea
                  rows={4}
                  value={content.hero.subtitleText || ""}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        subtitleText: e.target.value,
                        subtitleHtml: e.target.value
                      }
                    }))
                  }
                  placeholder="Stilvolle Erinnerungen für Events und Feiern"
                />
              </label>
              <label className="admin-field">
                <span>Button Text</span>
                <input
                  value={content.hero.ctaText}
                  onChange={(e) => updateContent((prev) => ({ ...prev, hero: { ...prev.hero, ctaText: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Button 2 Text (Mehr erfahren)</span>
                <input
                  value={content.hero.secondaryCtaText || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, hero: { ...prev.hero, secondaryCtaText: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Button 2 Link</span>
                <input
                  value={content.hero.secondaryCtaHref || "/#features"}
                  onChange={(e) => updateContent((prev) => ({ ...prev, hero: { ...prev.hero, secondaryCtaHref: e.target.value } }))}
                  placeholder="/#features"
                />
              </label>
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>Hero Bild hochladen</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (url) => updateContent((prev) => ({ ...prev, hero: { ...prev.hero, imageUrl: normalizeImageUrl(url) } })),
                      "Lade Hero-Bild hoch..."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Hero Bild URL</span>
                <input
                  value={content.hero.imageUrl || ""}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, imageUrl: normalizeImageUrl(e.target.value) }
                    }))
                  }
                />
              </label>
              {content.hero.imageUrl ? (
                <img
                  src={content.hero.imageUrl}
                  alt="Hero Vorschau"
                  className="admin-preview"
                  onError={() => setStatus("Hero Bild URL ungültig oder Bild nicht erreichbar.")}
                />
              ) : null}
            </div>
          </div>
        </section>
      );
    }

    if (section === "features") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Features & KI</h2>
            <p>Feature-Texte, KI-Bereich und Detailtexte.</p>
          </div>
          <div className="admin-panel">
            <label className="admin-field">
              <span>Feature Überschrift (mit /)</span>
              <input
                value={content.features.heading}
                onChange={(e) => updateContent((prev) => ({ ...prev, features: { ...prev.features, heading: e.target.value } }))}
              />
            </label>
            {content.features.items.map((feature, index) => (
              <div className="admin-subcard" key={`${feature.title}-${index}`}>
                <label className="admin-field">
                  <span>Feature {index + 1} Titel</span>
                  <input
                    value={feature.title}
                    onChange={(e) => {
                      const items = [...content.features.items];
                      items[index] = { ...feature, title: e.target.value };
                      updateContent((prev) => ({ ...prev, features: { ...prev.features, items } }));
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Beschreibung</span>
                  <textarea
                    rows={3}
                    value={feature.description}
                    onChange={(e) => {
                      const items = [...content.features.items];
                      items[index] = { ...feature, description: e.target.value };
                      updateContent((prev) => ({ ...prev, features: { ...prev.features, items } }));
                    }}
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="admin-grid-3">
            <div className="admin-panel">
              <label className="admin-field">
                <span>KI Badge</span>
                <input
                  value={content.ai.badge}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, badge: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>KI Überschrift (mit /)</span>
                <input
                  value={content.ai.heading}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, heading: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>KI Beschreibung (Plain Text)</span>
                <textarea
                  rows={8}
                  value={content.ai.descriptionText || ""}
                  onChange={(e) => {
                    const descriptionText = e.target.value;
                    updateContent((prev) => ({
                      ...prev,
                      ai: {
                        ...prev.ai,
                        descriptionText,
                        descriptionHtml: textToParagraphHtml(descriptionText)
                      }
                    }));
                  }}
                />
              </label>
              <label className="admin-field">
                <span>KI Bulletpoints (eine Zeile pro Punkt)</span>
                <textarea
                  rows={5}
                  value={content.ai.bullets.join("\n")}
                  onChange={(e) => {
                    const bullets = e.target.value.split("\n").map((line) => line.trim()).filter(Boolean);
                    updateContent((prev) => ({ ...prev, ai: { ...prev.ai, bullets } }));
                  }}
                />
              </label>
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>Links Vorher hochladen</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (url) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, compareLeftBeforeUrl: url } })),
                      "Lade KI links vorher hoch..."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Links Vorher URL</span>
                <input
                  value={content.ai.compareLeftBeforeUrl || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, compareLeftBeforeUrl: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Links Nachher hochladen</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (url) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, compareLeftAfterUrl: url } })),
                      "Lade KI links nachher hoch..."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Links Nachher URL</span>
                <input
                  value={content.ai.compareLeftAfterUrl || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, compareLeftAfterUrl: e.target.value } }))}
                />
              </label>
              {content.ai.compareLeftAfterUrl ? <img src={content.ai.compareLeftAfterUrl} alt="KI Links Nachher" className="admin-preview" /> : null}
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>Rechts Vorher hochladen</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (url) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, compareRightBeforeUrl: url } })),
                      "Lade KI rechts vorher hoch..."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Rechts Vorher URL</span>
                <input
                  value={content.ai.compareRightBeforeUrl || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, compareRightBeforeUrl: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Rechts Nachher hochladen</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (url) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, compareRightAfterUrl: url } })),
                      "Lade KI rechts nachher hoch..."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Rechts Nachher URL</span>
                <input
                  value={content.ai.compareRightAfterUrl || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, compareRightAfterUrl: e.target.value } }))}
                />
              </label>
              {content.ai.compareRightAfterUrl ? <img src={content.ai.compareRightAfterUrl} alt="KI Rechts Nachher" className="admin-preview" /> : null}
            </div>
          </div>
        </section>
      );
    }

    if (section === "pricing") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Preise</h2>
            <p>Preis-Pakete inkl. Inhalte, Highlight und CTA.</p>
          </div>
          {content.pricing.plans.map((plan, index) => (
            <div className="admin-subcard" key={`${plan.name}-${index}`}>
              <div className="admin-grid-3">
                <label className="admin-field">
                  <span>Name</span>
                  <input
                    value={plan.name}
                    onChange={(e) => {
                      const plans = [...content.pricing.plans];
                      plans[index] = { ...plan, name: e.target.value };
                      updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, plans } }));
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Preis in Euro</span>
                  <input
                    type="number"
                    value={plan.price}
                    onChange={(e) => {
                      const plans = [...content.pricing.plans];
                      plans[index] = { ...plan, price: Number(e.target.value) };
                      updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, plans } }));
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Button Text</span>
                  <input
                    value={plan.cta}
                    onChange={(e) => {
                      const plans = [...content.pricing.plans];
                      plans[index] = { ...plan, cta: e.target.value };
                      updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, plans } }));
                    }}
                  />
                </label>
              </div>
              <label className="admin-field inline">
                <input
                  type="checkbox"
                  checked={plan.featured}
                  onChange={(e) => {
                    const plans = [...content.pricing.plans];
                    plans[index] = { ...plan, featured: e.target.checked };
                    updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, plans } }));
                  }}
                />
                <span>Als &quot;Beliebt&quot; markieren</span>
              </label>
              <label className="admin-field">
                <span>Leistungen (eine pro Zeile)</span>
                <textarea
                  rows={5}
                  value={plan.items.join("\n")}
                  onChange={(e) => {
                    const plans = [...content.pricing.plans];
                    plans[index] = {
                      ...plan,
                      items: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean)
                    };
                    updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, plans } }));
                  }}
                />
              </label>
            </div>
          ))}
        </section>
      );
    }

    if (section === "reviews") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Rezensionen</h2>
            <p>Kundenbewertungen im Stil von Google-Rezensionen.</p>
          </div>
          <div className="admin-grid-2">
            <div className="admin-panel">
              <label className="admin-field">
                <span>Überschrift (mit /)</span>
                <input
                  value={content.reviews.heading}
                  onChange={(e) => updateContent((prev) => ({ ...prev, reviews: { ...prev.reviews, heading: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Quelle Label</span>
                <input
                  value={content.reviews.sourceLabel}
                  onChange={(e) => updateContent((prev) => ({ ...prev, reviews: { ...prev.reviews, sourceLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Score</span>
                <input
                  value={content.reviews.score}
                  onChange={(e) => updateContent((prev) => ({ ...prev, reviews: { ...prev.reviews, score: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Anzahl Label</span>
                <input
                  value={content.reviews.reviewCountLabel}
                  onChange={(e) => updateContent((prev) => ({ ...prev, reviews: { ...prev.reviews, reviewCountLabel: e.target.value } }))}
                />
              </label>
            </div>
            <div className="admin-panel">
              <label className="admin-field">
                <span>CTA Text</span>
                <input
                  value={content.reviews.ctaLabel}
                  onChange={(e) => updateContent((prev) => ({ ...prev, reviews: { ...prev.reviews, ctaLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>CTA URL</span>
                <input
                  value={content.reviews.ctaHref}
                  onChange={(e) => updateContent((prev) => ({ ...prev, reviews: { ...prev.reviews, ctaHref: e.target.value } }))}
                />
              </label>
            </div>
          </div>

          <div className="admin-grid-3">
            {content.reviews.items.map((review, index) => (
              <div className="admin-panel" key={`${review.name}-${index}`}>
                <h3>Bewertung {index + 1}</h3>
                <label className="admin-field">
                  <span>Name</span>
                  <input
                    value={review.name}
                    onChange={(e) => {
                      const items = [...content.reviews.items];
                      items[index] = { ...review, name: e.target.value };
                      updateContent((prev) => ({ ...prev, reviews: { ...prev.reviews, items } }));
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Datum</span>
                  <input
                    value={review.date}
                    onChange={(e) => {
                      const items = [...content.reviews.items];
                      items[index] = { ...review, date: e.target.value };
                      updateContent((prev) => ({ ...prev, reviews: { ...prev.reviews, items } }));
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Initialen</span>
                  <input
                    value={review.initials}
                    onChange={(e) => {
                      const items = [...content.reviews.items];
                      items[index] = { ...review, initials: e.target.value };
                      updateContent((prev) => ({ ...prev, reviews: { ...prev.reviews, items } }));
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Avatar Farbe</span>
                  <input
                    value={review.avatarColor || ""}
                    onChange={(e) => {
                      const items = [...content.reviews.items];
                      items[index] = { ...review, avatarColor: e.target.value };
                      updateContent((prev) => ({ ...prev, reviews: { ...prev.reviews, items } }));
                    }}
                    placeholder="#ea2c2c"
                  />
                </label>
                <label className="admin-field">
                  <span>Sterne (1-5)</span>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={review.rating}
                    onChange={(e) => {
                      const items = [...content.reviews.items];
                      items[index] = { ...review, rating: Math.max(1, Math.min(5, Number(e.target.value) || 5)) };
                      updateContent((prev) => ({ ...prev, reviews: { ...prev.reviews, items } }));
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Text</span>
                  <textarea
                    rows={5}
                    value={review.text}
                    onChange={(e) => {
                      const items = [...content.reviews.items];
                      items[index] = { ...review, text: e.target.value };
                      updateContent((prev) => ({ ...prev, reviews: { ...prev.reviews, items } }));
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (section === "media") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Bilder Galerie</h2>
            <p>Beliebig viele Bilder einfügen, ersetzen oder entfernen.</p>
          </div>

          <div className="admin-subcard">
            <div className="admin-section-head">
              <h2>Accessoires (Startseite)</h2>
              <p>Querformat, 4 Bilder pro Reihe, Swipe-Buttons und mindestens 10 CMS-Bilder mit Alt-Text.</p>
            </div>
            <div className="admin-actions">
              <button className="btn" type="button" onClick={addAccessoryItem}>Accessoire-Bild hinzufügen</button>
            </div>
            <div className="admin-grid-2">
              <div>
                <label className="admin-field">
                  <span>Uebertitel</span>
                  <input
                    value={content.accessories.overtitle}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        accessories: { ...prev.accessories, overtitle: e.target.value }
                      }))
                    }
                  />
                </label>
                <label className="admin-field">
                  <span>Titel</span>
                  <input
                    value={content.accessories.heading}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        accessories: { ...prev.accessories, heading: e.target.value }
                      }))
                    }
                  />
                </label>
              </div>
            </div>

            <div className="admin-grid-3">
              {content.accessories.items.map((item, index) => (
                <div className="admin-panel" key={`accessory-${index}`}>
                  <div className="admin-subcard-head">
                    <h3>Accessoire Bild {index + 1}</h3>
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => removeAccessoryItem(index)}
                      disabled={content.accessories.items.length <= 1}
                    >
                      Entfernen
                    </button>
                  </div>
                  <label className="admin-field">
                    <span>Titel</span>
                    <input
                      value={item.title || ""}
                      onChange={(e) => updateAccessoryItem(index, { ...item, title: e.target.value })}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Alt Text</span>
                    <input
                      value={item.altText || ""}
                      onChange={(e) => updateAccessoryItem(index, { ...item, altText: e.target.value })}
                      placeholder="Beschreibung des Bildinhalts"
                    />
                  </label>
                  <label className="admin-field">
                    <span>Fallback Farbe</span>
                    <input
                      value={item.color || "#e5e7eb"}
                      onChange={(e) => updateAccessoryItem(index, { ...item, color: e.target.value })}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Bild hochladen</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                      onChange={(event) => {
                        handleImageUpload(
                          event,
                          (url) => updateAccessoryItem(index, { ...item, imageUrl: url }),
                          `Lade Accessoire-Bild ${index + 1} hoch...`
                        );
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Bild URL</span>
                    <input
                      value={item.imageUrl || ""}
                      onChange={(e) => updateAccessoryItem(index, { ...item, imageUrl: e.target.value })}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Verlinkung (optional)</span>
                    <input
                      value={item.linkUrl || ""}
                      onChange={(e) => updateAccessoryItem(index, { ...item, linkUrl: e.target.value })}
                      placeholder="https://... oder /kontakt"
                    />
                  </label>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.altText || item.title || `Accessoire ${index + 1}`} className="admin-preview" />
                  ) : (
                    <div className="admin-empty-preview" style={{ background: item.color || "#e5e7eb" }}>
                      Kein Bild hinterlegt
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="admin-actions">
            <button className="btn" type="button" onClick={addGalleryItem}>Galerie-Slot hinzufügen</button>
          </div>
          {content.gallery.items.map((item, index) => (
            <div className="admin-subcard" key={`${item.title}-${index}`}>
              <div className="admin-subcard-head">
                <h3>Galerie Bild {index + 1}</h3>
                <button className="btn btn-outline" type="button" onClick={() => removeGalleryItem(index)}>Entfernen</button>
              </div>
              <div className="admin-grid-2">
                <div>
                  <label className="admin-field">
                    <span>Titel</span>
                    <input
                      value={item.title}
                      onChange={(e) => updateGalleryItem(index, { ...item, title: e.target.value })}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Fallback Farbe</span>
                    <input
                      value={item.color}
                      onChange={(e) => updateGalleryItem(index, { ...item, color: e.target.value })}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Bild hochladen</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                      onChange={(event) => {
                        handleImageUpload(
                          event,
                          (url) => updateGalleryItem(index, { ...item, imageUrl: url }),
                          `Lade Galerie-Bild ${index + 1} hoch...`
                        );
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Bild URL</span>
                    <input
                      value={item.imageUrl || ""}
                      onChange={(e) => updateGalleryItem(index, { ...item, imageUrl: e.target.value })}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Alt Text</span>
                    <input
                      value={item.altText || ""}
                      onChange={(e) => updateGalleryItem(index, { ...item, altText: e.target.value })}
                      placeholder="Beschreibung für Suchmaschinen und Barrierefreiheit"
                    />
                  </label>
                  <label className="admin-field">
                    <span>Verlinkung (optional)</span>
                    <input
                      value={item.linkUrl || ""}
                      onChange={(e) => updateGalleryItem(index, { ...item, linkUrl: e.target.value })}
                      placeholder="https://... oder /kontakt"
                    />
                  </label>
                  <label className="admin-field">
                    <span>Bildhöhe in px</span>
                    <input
                      type="number"
                      min={180}
                      max={900}
                      value={item.height || 340}
                      onChange={(e) => updateGalleryItem(index, { ...item, height: Number(e.target.value) || 340 })}
                    />
                  </label>
                </div>
                <div>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="admin-preview" />
                  ) : (
                    <div className="admin-empty-preview" style={{ background: item.color }}>
                      Kein Bild hinterlegt
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      );
    }

    if (section === "space") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Platzbedarf</h2>
            <p>Block für Fläche/Platzbedarf der Fotobox (erster Bereich).</p>
          </div>
          <div className="admin-subcard">
            <label className="admin-field">
              <span>Überschrift (mit /)</span>
              <input
                value={content.space.heading}
                onChange={(e) => updateContent((prev) => ({ ...prev, space: { ...prev.space, heading: e.target.value } }))}
              />
            </label>
            <label className="admin-field">
              <span>Beschreibung</span>
              <textarea
                rows={3}
                value={content.space.description}
                onChange={(e) => updateContent((prev) => ({ ...prev, space: { ...prev.space, description: e.target.value } }))}
              />
            </label>
            <label className="admin-field">
              <span>Platzbedarf Bild hochladen</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                onChange={(event) => {
                  handleImageUpload(
                    event,
                    (url) => updateContent((prev) => ({ ...prev, space: { ...prev.space, imageUrl: url } })),
                    "Lade Platzbedarf-Bild hoch..."
                  );
                }}
              />
            </label>
            <label className="admin-field">
              <span>Platzbedarf Bild URL</span>
              <input
                value={content.space.imageUrl || ""}
                onChange={(e) => updateContent((prev) => ({ ...prev, space: { ...prev.space, imageUrl: e.target.value } }))}
              />
            </label>
            {content.space.imageUrl ? <img src={content.space.imageUrl} alt="Platzbedarf Vorschau" className="admin-preview" /> : null}
          </div>
        </section>
      );
    }

    if (section === "spaceLayout") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Layout/Gestaltung</h2>
            <p>Bearbeitung beider Layout/Gestaltung Blöcke auf der Startseite.</p>
          </div>
          <div className="admin-subcard">
            <h3 style={{ marginBottom: "1rem" }}>Block 1 (Text links, Bild rechts)</h3>
            <label className="admin-field">
              <span>Überschrift (mit /)</span>
              <input
                value={content.space.layoutOneHeading || ""}
                onChange={(e) => updateContent((prev) => ({ ...prev, space: { ...prev.space, layoutOneHeading: e.target.value } }))}
              />
            </label>
            <label className="admin-field">
              <span>Beschreibung</span>
              <textarea
                rows={3}
                value={content.space.layoutOneDescription || ""}
                onChange={(e) => updateContent((prev) => ({ ...prev, space: { ...prev.space, layoutOneDescription: e.target.value } }))}
              />
            </label>
            <label className="admin-field">
              <span>Bild hochladen</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                onChange={(event) => {
                  handleImageUpload(
                    event,
                    (url) => updateContent((prev) => ({ ...prev, space: { ...prev.space, layoutOneImageUrl: url } })),
                    "Lade Layout/Gestaltung 1 Bild hoch..."
                  );
                }}
              />
            </label>
            <label className="admin-field">
              <span>Bild URL</span>
              <input
                value={content.space.layoutOneImageUrl || ""}
                onChange={(e) => updateContent((prev) => ({ ...prev, space: { ...prev.space, layoutOneImageUrl: e.target.value } }))}
              />
            </label>
            <label className="admin-field">
              <span>Alt Text</span>
              <input
                value={content.space.layoutOneImageAlt || ""}
                onChange={(e) => updateContent((prev) => ({ ...prev, space: { ...prev.space, layoutOneImageAlt: e.target.value } }))}
                placeholder="Beschreibung des Bildinhalts"
              />
            </label>
            {content.space.layoutOneImageUrl ? <img src={content.space.layoutOneImageUrl} alt="Layout/Gestaltung 1 Vorschau" className="admin-preview" /> : null}
          </div>
          <div className="admin-subcard">
            <h3 style={{ marginBottom: "1rem" }}>Block 2 (Bild links, Text rechts)</h3>
            <label className="admin-field">
              <span>Überschrift (mit /)</span>
              <input
                value={content.space.layoutTwoHeading || ""}
                onChange={(e) => updateContent((prev) => ({ ...prev, space: { ...prev.space, layoutTwoHeading: e.target.value } }))}
              />
            </label>
            <label className="admin-field">
              <span>Beschreibung</span>
              <textarea
                rows={3}
                value={content.space.layoutTwoDescription || ""}
                onChange={(e) => updateContent((prev) => ({ ...prev, space: { ...prev.space, layoutTwoDescription: e.target.value } }))}
              />
            </label>
            <label className="admin-field">
              <span>Bild hochladen</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                onChange={(event) => {
                  handleImageUpload(
                    event,
                    (url) => updateContent((prev) => ({ ...prev, space: { ...prev.space, layoutTwoImageUrl: url } })),
                    "Lade Layout/Gestaltung 2 Bild hoch..."
                  );
                }}
              />
            </label>
            <label className="admin-field">
              <span>Bild URL</span>
              <input
                value={content.space.layoutTwoImageUrl || ""}
                onChange={(e) => updateContent((prev) => ({ ...prev, space: { ...prev.space, layoutTwoImageUrl: e.target.value } }))}
              />
            </label>
            <label className="admin-field">
              <span>Alt Text</span>
              <input
                value={content.space.layoutTwoImageAlt || ""}
                onChange={(e) => updateContent((prev) => ({ ...prev, space: { ...prev.space, layoutTwoImageAlt: e.target.value } }))}
                placeholder="Beschreibung des Bildinhalts"
              />
            </label>
            {content.space.layoutTwoImageUrl ? <img src={content.space.layoutTwoImageUrl} alt="Layout/Gestaltung 2 Vorschau" className="admin-preview" /> : null}
          </div>
        </section>
      );
    }

    if (section === "faq") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>FAQ</h2>
            <p>Fragen und Antworten für Besucher.</p>
          </div>
          {content.faq.items.map((faq, index) => (
            <div className="admin-subcard" key={`${faq.question}-${index}`}>
              <label className="admin-field">
                <span>Frage</span>
                <input
                  value={faq.question}
                  onChange={(e) => {
                    const items = [...content.faq.items];
                    items[index] = { ...faq, question: e.target.value };
                    updateContent((prev) => ({ ...prev, faq: { ...prev.faq, items } }));
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Antwort</span>
                <textarea
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => {
                    const items = [...content.faq.items];
                    items[index] = { ...faq, answer: e.target.value };
                    updateContent((prev) => ({ ...prev, faq: { ...prev.faq, items } }));
                  }}
                />
              </label>
            </div>
          ))}
        </section>
      );
    }

    if (section === "contact") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Kontakt</h2>
            <p>Kontaktdaten und Intro-Text für die Kontaktseite.</p>
          </div>
          <div className="admin-grid-2">
            <div className="admin-panel">
              <RichTextEditor
                label="Kontakt Intro"
                value={content.contact.introHtml}
                onChange={(value) => updateContent((prev) => ({ ...prev, contact: { ...prev.contact, introHtml: value } }))}
              />
            </div>
            <div className="admin-panel">
              <label className="admin-field">
                <span>Telefon</span>
                <input
                  value={content.contact.phone}
                  onChange={(e) => updateContent((prev) => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>E-Mail</span>
                <input
                  value={content.contact.email}
                  onChange={(e) => updateContent((prev) => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Adresse</span>
                <input
                  value={content.contact.address}
                  onChange={(e) => updateContent((prev) => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Referenzen (eine Zeile: Label | URL)</span>
                <textarea
                  rows={12}
                  value={footerLinksToText(content.contact.references || [])}
                  onChange={(e) =>
                    updateContent((prev) => ({ ...prev, contact: { ...prev.contact, references: parseFooterLinks(e.target.value) } }))
                  }
                />
              </label>
            </div>
          </div>
        </section>
      );
    }

    if (section === "thanks") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Danke Seite</h2>
            <p>Inhalte und Buttons für die Seite nach erfolgreicher Anfrage.</p>
          </div>
          <div className="admin-grid-2">
            <div className="admin-panel">
              <label className="admin-field">
                <span>Überschrift (mit /)</span>
                <input
                  value={content.thanks.heading}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, heading: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Text</span>
                <textarea
                  rows={8}
                  value={content.thanks.message}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, message: e.target.value } }))}
                />
              </label>
            </div>
            <div className="admin-panel">
              <label className="admin-field">
                <span>Button 1 Text</span>
                <input
                  value={content.thanks.primaryButtonText}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, primaryButtonText: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Button 1 Link</span>
                <input
                  value={content.thanks.primaryButtonHref}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, primaryButtonHref: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Button 2 Text</span>
                <input
                  value={content.thanks.secondaryButtonText}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, secondaryButtonText: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Button 2 Link</span>
                <input
                  value={content.thanks.secondaryButtonHref}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, secondaryButtonHref: e.target.value } }))}
                />
              </label>
            </div>
          </div>
        </section>
      );
    }

    if (section === "footer") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Footer</h2>
            <p>Footer-Gestaltung und Linklisten bearbeiten.</p>
          </div>
          <div className="admin-grid-2">
            <div className="admin-panel">
              <label className="admin-field">
                <span>Fragen Titel</span>
                <input
                  value={content.footer.questionsTitle}
                  onChange={(e) => updateContent((prev) => ({ ...prev, footer: { ...prev.footer, questionsTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Fragen Text</span>
                <textarea
                  rows={3}
                  value={content.footer.questionsText}
                  onChange={(e) => updateContent((prev) => ({ ...prev, footer: { ...prev.footer, questionsText: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Telefon Label</span>
                <input
                  value={content.footer.phoneLabel}
                  onChange={(e) => updateContent((prev) => ({ ...prev, footer: { ...prev.footer, phoneLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Email Label</span>
                <input
                  value={content.footer.emailLabel}
                  onChange={(e) => updateContent((prev) => ({ ...prev, footer: { ...prev.footer, emailLabel: e.target.value } }))}
                />
              </label>
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>Social Titel</span>
                <input
                  value={content.footer.socialTitle}
                  onChange={(e) => updateContent((prev) => ({ ...prev, footer: { ...prev.footer, socialTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Social Intro</span>
                <input
                  value={content.footer.socialIntro}
                  onChange={(e) => updateContent((prev) => ({ ...prev, footer: { ...prev.footer, socialIntro: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Social Links (eine Zeile: Label | URL)</span>
                <textarea
                  rows={6}
                  value={footerLinksToText(content.footer.socialLinks)}
                  onChange={(e) =>
                    updateContent((prev) => ({ ...prev, footer: { ...prev.footer, socialLinks: parseFooterLinks(e.target.value) } }))
                  }
                />
              </label>
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-panel">
              <label className="admin-field">
                <span>Informationen Titel</span>
                <input
                  value={content.footer.infoTitle}
                  onChange={(e) => updateContent((prev) => ({ ...prev, footer: { ...prev.footer, infoTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Informationen Links (eine Zeile: Label | URL)</span>
                <textarea
                  rows={7}
                  value={footerLinksToText(content.footer.infoLinks)}
                  onChange={(e) =>
                    updateContent((prev) => ({ ...prev, footer: { ...prev.footer, infoLinks: parseFooterLinks(e.target.value) } }))
                  }
                />
              </label>
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>Rechtliches Titel</span>
                <input
                  value={content.footer.legalTitle}
                  onChange={(e) => updateContent((prev) => ({ ...prev, footer: { ...prev.footer, legalTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Rechtliches Links (eine Zeile: Label | URL)</span>
                <textarea
                  rows={7}
                  value={footerLinksToText(content.footer.legalLinks)}
                  onChange={(e) =>
                    updateContent((prev) => ({ ...prev, footer: { ...prev.footer, legalLinks: parseFooterLinks(e.target.value) } }))
                  }
                />
              </label>
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-panel">
              <label className="admin-field">
                <span>Copyright Zeile</span>
                <input
                  value={content.footer.copyrightLine}
                  onChange={(e) => updateContent((prev) => ({ ...prev, footer: { ...prev.footer, copyrightLine: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Tagline Zeile</span>
                <input
                  value={content.footer.taglineLine}
                  onChange={(e) => updateContent((prev) => ({ ...prev, footer: { ...prev.footer, taglineLine: e.target.value } }))}
                />
              </label>
            </div>
          </div>
        </section>
      );
    }

    if (section === "inquiry") {
      const renderOptionEditor = (
        title: string,
        options: Array<{ label: string; desc: string }> | undefined,
        count: number,
        updateOptions: (next: Array<{ label: string; desc: string }>) => void
      ) => (
        <div className="admin-panel">
          <h3>{title}</h3>
          {Array.from({ length: count }).map((_, idx) => {
            const option = options?.[idx] || { label: "", desc: "" };
            return (
              <div className="admin-subcard" key={`${title}-${idx}`}>
                <label className="admin-field">
                  <span>Option {idx + 1} Titel</span>
                  <input
                    value={option.label}
                    onChange={(e) => {
                      const next = [...(options || [])];
                      next[idx] = { ...(next[idx] || { label: "", desc: "" }), label: e.target.value };
                      updateOptions(next);
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Option {idx + 1} Beschreibung</span>
                  <input
                    value={option.desc}
                    onChange={(e) => {
                      const next = [...(options || [])];
                      next[idx] = { ...(next[idx] || { label: "", desc: "" }), desc: e.target.value };
                      updateOptions(next);
                    }}
                  />
                </label>
              </div>
            );
          })}
        </div>
      );

      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Anfrage Seite</h2>
            <p>Detaillierte Steuerung fuer jetzt/anfragen: klar nach Bereichen aufgeteilt.</p>
          </div>

          <div className="admin-grid-2">
            <div className="admin-panel">
              <h3>Basis</h3>
              <label className="admin-field">
                <span>Haupttitel (mit /)</span>
                <input
                  value={content.inquiry.heading}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, heading: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Intro Text</span>
                <textarea
                  rows={4}
                  value={content.inquiry.introText}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, introText: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Button Text</span>
                <input
                  value={content.inquiry.submitText}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, submitText: e.target.value } }))}
                />
              </label>
            </div>

            <div className="admin-panel">
              <h3>Schritt Navigation</h3>
              <label className="admin-field">
                <span>Step 2 Label</span>
                <input
                  value={content.inquiry.stepPrint}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, stepPrint: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Step 3 Label</span>
                <input
                  value={content.inquiry.stepContact}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, stepContact: e.target.value } }))}
                />
              </label>
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-panel">
              <h3>Abschnitte Event & Datum</h3>
              <label className="admin-field">
                <span>Abschnitt 1 Titel (Event)</span>
                <input
                  value={content.inquiry.eventSectionTitle}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, eventSectionTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Abschnitt 2 Titel (Datum)</span>
                <input
                  value={content.inquiry.dateSectionTitle}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, dateSectionTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Datumsfeld Label</span>
                <input
                  value={content.inquiry.dateLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, dateLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Ortsfeld Label</span>
                <input
                  value={content.inquiry.locationLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, locationLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Ort Placeholder</span>
                <input
                  value={content.inquiry.locationPlaceholder || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, locationPlaceholder: e.target.value } }))}
                />
              </label>
            </div>
            <div className="admin-panel">
              <h3>Abschnitte Aufdruck & Kontakt</h3>
              <label className="admin-field">
                <span>Abschnitt 3 Titel (Aufdruck)</span>
                <input
                  value={content.inquiry.printSectionTitle}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, printSectionTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Abschnitt 4 Titel (Kontakt)</span>
                <input
                  value={content.inquiry.contactSectionTitle}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, contactSectionTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Aufdruck Label</span>
                <input
                  value={content.inquiry.printTextLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, printTextLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Druckformat Label</span>
                <input
                  value={content.inquiry.printFormatLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, printFormatLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Fotobox Auswahl Label</span>
                <input
                  value={content.inquiry.boxTypeLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, boxTypeLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Betreuung Label</span>
                <input
                  value={content.inquiry.supportLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, supportLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Aufdruck Placeholder</span>
                <input
                  value={content.inquiry.printTextPlaceholder || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, printTextPlaceholder: e.target.value } }))}
                />
              </label>
            </div>
          </div>

          <div className="admin-grid-2">
            {renderOptionEditor("Event Optionen", content.inquiry.eventOptions, 3, (eventOptions) =>
              updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, eventOptions } }))
            )}
            {renderOptionEditor("Aufdruck Optionen", content.inquiry.printOptions, 3, (printOptions) =>
              updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, printOptions } }))
            )}
          </div>

          <div className="admin-grid-2">
            {renderOptionEditor("Druckformat Auswahl", content.inquiry.printFormatOptions, 2, (printFormatOptions) =>
              updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, printFormatOptions } }))
            )}
            {renderOptionEditor("Fotobox Variante", content.inquiry.boxTypeOptions, 2, (boxTypeOptions) =>
              updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, boxTypeOptions } }))
            )}
          </div>

          <div className="admin-grid-2">
            {renderOptionEditor("Betreuung Auswahl", content.inquiry.supportOptions, 2, (supportOptions) =>
              updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, supportOptions } }))
            )}
            <div className="admin-panel">
              <h3>Kontakt Hinweise</h3>
              <p className="admin-note">
                Diese Einstellungen steuern die Texte auf der Anfrage-Seite. Reihenfolge und Inhalt bleiben beim Speichern erhalten.
              </p>
            </div>
          </div>

          <div className="admin-grid-2">
            <div className="admin-panel">
              <h3>Kontaktdaten Felder</h3>
              <label className="admin-field">
                <span>Name Label</span>
                <input
                  value={content.inquiry.nameLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, nameLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Name Placeholder</span>
                <input
                  value={content.inquiry.namePlaceholder || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, namePlaceholder: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>E-Mail Label</span>
                <input
                  value={content.inquiry.emailLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, emailLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>E-Mail Placeholder</span>
                <input
                  value={content.inquiry.emailPlaceholder || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, emailPlaceholder: e.target.value } }))}
                />
              </label>
            </div>
            <div className="admin-panel">
              <h3>Nachricht & Status</h3>
              <label className="admin-field">
                <span>Telefon Label</span>
                <input
                  value={content.inquiry.phoneLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, phoneLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Telefon Placeholder</span>
                <input
                  value={content.inquiry.phonePlaceholder || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, phonePlaceholder: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Nachricht Label</span>
                <input
                  value={content.inquiry.messageLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, messageLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Nachricht Placeholder</span>
                <input
                  value={content.inquiry.messagePlaceholder || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, messagePlaceholder: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Erfolgsmeldung</span>
                <input
                  value={content.inquiry.successText || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, successText: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Fehlermeldung</span>
                <input
                  value={content.inquiry.errorText || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, errorText: e.target.value } }))}
                />
              </label>
            </div>
          </div>
        </section>
      );
    }

    if (section === "legal") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Rechtliches</h2>
            <p>Inhalte fuer Impressum und Datenschutzerklaerung auf den eigenen Unterseiten.</p>
          </div>
          <div className="admin-grid-2">
            <div className="admin-panel">
              <label className="admin-field">
                <span>Impressum Text</span>
                <textarea
                  rows={24}
                  value={content.legal.impressumText}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      legal: { ...prev.legal, impressumText: e.target.value }
                    }))
                  }
                />
              </label>
            </div>
            <div className="admin-panel">
              <label className="admin-field">
                <span>Datenschutzerklaerung Text</span>
                <textarea
                  rows={24}
                  value={content.legal.datenschutzerklaerungText}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      legal: { ...prev.legal, datenschutzerklaerungText: e.target.value }
                    }))
                  }
                />
              </label>
            </div>
            <div className="admin-panel">
              <label className="admin-field">
                <span>AGB Text</span>
                <textarea
                  rows={24}
                  value={content.legal.agbText}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      legal: { ...prev.legal, agbText: e.target.value }
                    }))
                  }
                />
              </label>
            </div>
            <div className="admin-panel">
              <label className="admin-field">
                <span>AGB (B2B) Text</span>
                <textarea
                  rows={24}
                  value={content.legal.agbB2bText}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      legal: { ...prev.legal, agbB2bText: e.target.value }
                    }))
                  }
                />
              </label>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="admin-section">
        <div className="admin-section-head">
          <h2>SEO & Branding</h2>
          <p>Seitentitel, Description und Markenname im Header.</p>
        </div>
        <div className="admin-grid-2">
          <div className="admin-panel">
            <label className="admin-field">
              <span>SEO Titel</span>
              <input
                value={content.seo.title}
                onChange={(e) => updateContent((prev) => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))}
              />
            </label>
            <label className="admin-field">
              <span>SEO Beschreibung</span>
              <textarea
                rows={3}
                value={content.seo.description}
                onChange={(e) => updateContent((prev) => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))}
              />
            </label>
          </div>
          <div className="admin-panel">
            <label className="admin-field">
              <span>Brand Linke Hälfte</span>
              <input
                value={content.navigation.brandLeft}
                onChange={(e) => updateContent((prev) => ({
                  ...prev,
                  navigation: { ...prev.navigation, brandLeft: e.target.value }
                }))}
              />
            </label>
            <label className="admin-field">
              <span>Brand Rechte Hälfte</span>
              <input
                value={content.navigation.brandRight}
                onChange={(e) => updateContent((prev) => ({
                  ...prev,
                  navigation: { ...prev.navigation, brandRight: e.target.value }
                }))}
              />
            </label>
            <label className="admin-field">
              <span>Logo hochladen</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                onChange={(event) => {
                  handleImageUpload(
                    event,
                    (url) => updateContent((prev) => ({
                      ...prev,
                      navigation: { ...prev.navigation, logoUrl: url }
                    })),
                    "Lade Logo hoch..."
                  );
                }}
              />
            </label>
            <label className="admin-field">
              <span>Logo URL</span>
              <input
                value={content.navigation.logoUrl || ""}
                onChange={(e) => updateContent((prev) => ({
                  ...prev,
                  navigation: { ...prev.navigation, logoUrl: e.target.value }
                }))}
              />
            </label>
            {content.navigation.logoUrl ? (
              <img src={content.navigation.logoUrl} alt="Logo Vorschau" className="admin-preview logo-preview" />
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="admin-wrap admin-backend-wrap">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div>
            <p className="admin-kicker">fotobox/tirol</p>
            <h1>Admin Backend</h1>
            <span className="admin-sidebar-badge">{content.ai.badge || "KI-Powered"}</span>
            <p className="admin-note">Texte, Preise und Bilder an einem Ort verwalten.</p>
          </div>

          <nav className="admin-section-nav">
            {SECTION_TABS.map((tab) => (
              <button
                type="button"
                key={tab.id}
                className={`admin-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-actions">
            <button className="btn" type="button" onClick={saveContent}>Änderungen speichern</button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={undoLastChange}
              disabled={history.length === 0}
            >
              Rückgängig
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => window.open(`/?v=${Date.now()}`, "_blank")}
            >
              Geänderte Seite öffnen
            </button>
            <button className="btn btn-outline" type="button" onClick={loadContent}>Neu laden</button>
            <p className="admin-status">{dirty ? "Ungespeicherte Änderungen" : "Alles gespeichert"}</p>
            <p className="admin-note">{status}</p>
          </div>
        </aside>

        <main className="admin-main">{renderSection(activeTab, content)}</main>
      </div>
    </div>
  );
}
