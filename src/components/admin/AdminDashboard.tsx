"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { AccessoryItem, CMSContent, Feature, FaqItem, GalleryItem, OccasionItem } from "@/lib/types";
import { DEFAULT_AGB_B2B_TEXT, DEFAULT_AGB_TEXT, DEFAULT_DATENSCHUTZ_TEXT, DEFAULT_IMPRESSUM_TEXT } from "@/lib/legalDefaults";

type CmsUpdater = (prev: CMSContent) => CMSContent;
type SectionId =
  | "overview"
  | "hero"
  | "features"
  | "aiPage"
  | "occasions"
  | "accessories"
  | "space"
  | "spaceLayout"
  | "pricing"
  | "media"
  | "reviews"
  | "wizard"
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
  { id: "aiPage", label: "KI-Seite" },
  { id: "occasions", label: "Anlässe" },
  { id: "accessories", label: "Accessoires" },
  { id: "space", label: "Platzbedarf" },
  { id: "spaceLayout", label: "Layout/Gestaltung" },
  { id: "pricing", label: "Preise" },
  { id: "reviews", label: "Rezensionen" },
  { id: "wizard", label: "Layout Wizard" },
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

function getPreviewPathForTab(tab: SectionId) {
  switch (tab) {
    case "aiPage":
      return "/ki-fotobox-tirol";
    case "occasions":
      return "/fotobox-anlaesse";
    case "pricing":
      return "/preisgestaltung";
    case "contact":
    case "inquiry":
      return "/kontakt";
    case "thanks":
      return "/danke?paket=Premium&eventDate=2026-06-14&location=Innsbruck";
    case "accessories":
      return "/#accessoires";
    case "reviews":
      return "/#reviews";
    case "faq":
      return "/#faq";
    case "legal":
      return "/impressum";
    case "seo":
      return "/fotobox-anlaesse";
    case "wizard":
      return "/vorlagen-test";
    default:
      return "/";
  }
}

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

const DEFAULT_OCCASIONS_SECTIONS: OccasionItem[] = [
  {
    id: "hochzeit",
    eyebrow: "Der Klassiker für Brautpaare",
    title: "Romantische",
    titleBold: "Hochzeitsfotobox",
    subtitle: "Fotobox mieten für den schönsten Tag in Tirol",
    description:
      "Eine Hochzeitsfotobox bringt eure Gäste zusammen, lockert die Stimmung auf und liefert Erinnerungen, die direkt mitgenommen werden können. Gerade auf Hochzeiten in Innsbruck, Seefeld oder ganz Tirol wird sie schnell zum Treffpunkt für ehrliche Momente und starke Bilder.",
    benefits: [
      "Unlimitierter Druck für Gästebuch und Erinnerungen",
      "Liebevoll ausgewählte Requisiten und Accessoires",
      "Personalisiertes Print-Layout mit Namen und Datum",
      "Online-Galerie für alle Hochzeitsgäste"
    ],
    imageUrl: "/uploads/1772725494493-46ba177e-2411-4843-9112-5f417a6cc0c6-fotobox-fotoautomat-selfie-photobooth-tirol-innsbruck-foto-16-optimized.jpg",
    imageAlt: "Fotobox Tirol bei einer Hochzeit",
    warm: false
  },
  {
    id: "geburtstag",
    eyebrow: "Action für eure Party",
    title: "Eure",
    titleBold: "Geburtstagsfotobox",
    subtitle: "Das Party-Highlight für lockere Geburtstagsfeiern",
    description:
      "Eine Geburtstagsfotobox sorgt sofort für Bewegung, Spaß und spontane Gruppenbilder. Ob runder Geburtstag oder große Familienfeier: Gäste posieren, lachen und nehmen ihre Bilder direkt mit. So wird aus der Feier ein Erlebnis, über das noch lange gesprochen wird.",
    benefits: [
      "Direkter Download per QR-Code auf das Handy",
      "Lustige Accessoires für jede Altersgruppe",
      "Kompakter Aufbau für kleine und große Locations",
      "Professionelles Licht für starke Party-Selfies"
    ],
    imageUrl: "/uploads/1772527968262-29cb30f5-f5ab-43a6-af6c-f34ad26ed587-carli-2.jpg",
    imageAlt: "Geburtstagsfotobox mit lockerer Partystimmung",
    warm: true
  },
  {
    id: "firma",
    eyebrow: "Branding und Mitarbeiter-Erlebnis",
    title: "Professionelles",
    titleBold: "Firmenevent",
    subtitle: "Fotoboxen für Unternehmen, Feiern und Markenauftritte",
    description:
      "Für Firmenfeiern, Weihnachtsfeiern, Sommerfeste oder Jubiläen ist die Fotobox ein starker Mix aus Unterhaltung und Markenwirkung. Layouts, Ausdrucke und Bildsprache lassen sich an euer Corporate Design anpassen und schaffen Content mit Wiedererkennungswert.",
    benefits: [
      "Logo und Branding direkt im Layout integrierbar",
      "DSGVO-konforme Bildspeicherung und Übergabe",
      "Professioneller Thermosublimations-Druck",
      "Technischer Support für einen reibungslosen Ablauf"
    ],
    imageUrl: "/uploads/1772726001232-9db6432f-2bb2-41d2-985a-c749f522c620-fotobox-fotoautomat-selfie-photobooth-tirol-innsbruck-foto-11-optimized.jpg",
    imageAlt: "Fotobox Tirol bei einem Firmenevent",
    warm: false
  },
  {
    id: "event",
    eyebrow: "Maximale Aufmerksamkeit",
    title: "Fotobox mieten für",
    titleBold: "Events",
    subtitle: "Ideal für Messen, Festivals und öffentliche Veranstaltungen",
    description:
      "Wenn viele Menschen zusammenkommen, braucht es einen Programmpunkt mit Sogwirkung. Eine Eventfotobox zieht Aufmerksamkeit an, schafft Interaktion und liefert Bilder, die geteilt werden. Genau deshalb ist sie für Messen, Festivals und größere Events in Tirol besonders stark.",
    benefits: [
      "Hohe Aufmerksamkeit am Stand oder Eventbereich",
      "Direkte Social-Media-taugliche Inhalte",
      "Flexibel mit Branding und Aktionslogik kombinierbar",
      "Starker Publikumsmagnet mit echtem Erlebnisfaktor"
    ],
    imageUrl: "/uploads/1772725616835-a3643f1b-9ec6-4d07-b20d-6227a314c187-fotobox-fotoautomat-selfie-photobooth-tirol-innsbruck-foto-18-optimized.jpg",
    imageAlt: "Eventfotobox bei einer größeren Veranstaltung",
    warm: true
  }
];

const DEFAULT_OCCASIONS_SEO_COLUMNS: Feature[] = [
  {
    title: "Fotobox mieten Tirol",
    description: "Wir liefern eure Fotobox in ganz Tirol, von Innsbruck bis Kitzbühel. Lieferung, Aufbau und eine kurze Einweisung sind so abgestimmt, dass euer Anlass entspannt starten kann."
  },
  {
    title: "Häufige Suchanfragen",
    description: "Hochzeitsfotobox mieten Innsbruck\nFotobox für Firmenevent Preise\nGeburtstagsfotobox Tirol\nFotobox mit Druck-Flatrate mieten"
  },
  {
    title: "Qualität & Technik",
    description: "Wir arbeiten mit echter DSLR-Technik und professionellem Studiolicht. Dadurch liegt die Bildqualität sichtbar über klassischen Standard-Fotoboxen."
  }
];

const DEFAULT_OCCASIONS_FAQ_ITEMS: FaqItem[] = [
  {
    question: "Für welche Anlässe eignet sich die Fotobox?",
    answer: "Unsere Fotobox passt ideal zu Hochzeiten, Geburtstagen, Firmenfeiern, Messen und vielen weiteren Veranstaltungen in Tirol."
  },
  {
    question: "Können Bilder und Layouts individuell angepasst werden?",
    answer: "Ja. Drucklayouts, Branding, Requisiten und Bildstil lassen sich passend zu eurem Anlass abstimmen."
  }
];

export default function AdminDashboard() {
  const [content, setContent] = useState<CMSContent | null>(null);
  const contentRef = useRef<CMSContent | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [status, setStatus] = useState("");
  const [dirty, setDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<SectionId>("overview");
  const [homepageOrder, setHomepageOrder] = useState<HomepageBlockId[]>(DEFAULT_HOMEPAGE_ORDER);
  const [pendingHeroImageUrl, setPendingHeroImageUrl] = useState<string | null>(null);
  const [pendingHeroAbsoluteUrl, setPendingHeroAbsoluteUrl] = useState<string>("");
  const [mediaLibraryUrls, setMediaLibraryUrls] = useState<string[]>([]);
  const [mediaLibraryPendingFiles, setMediaLibraryPendingFiles] = useState<File[]>([]);
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string>("");
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);

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
    const normalizedAi = {
      ...json.ai,
      descriptionText: normalizedAiDescriptionText,
      descriptionHtml: textToParagraphHtml(normalizedAiDescriptionText),
      heroBadge: json.ai.heroBadge || "NEU: KÜNSTLICHE INTELLIGENZ",
      heroTitleTop: json.ai.heroTitleTop || "Perfekte Bilder.",
      heroTitleAccent: json.ai.heroTitleAccent || "Magisch",
      heroLead: json.ai.heroLead || "Unsere KI-Fotobox analysiert jedes Motiv in Echtzeit und veredelt Licht, Farben, Hauttöne und Overlays für einen sichtbar hochwertigeren Event-Look.",
      featureTitle: json.ai.featureTitle || "Autofokus auf /Ihre Schokoladenseite.",
      featureLead: json.ai.featureLead || normalizedAiDescriptionText.split(/\n\s*\n/)[0] || "",
      featureCards: (json.ai.featureCards && json.ai.featureCards.length > 0)
        ? json.ai.featureCards
        : [
            {
              title: "Smart Lighting",
              description: "Die KI hebt Gesichter hervor, gleicht Schatten aus und sorgt selbst bei schwierigen Lichtverhaeltnissen für deutlich bessere Ergebnisse."
            },
            {
              title: "Natürliche Hauttöne",
              description: "Ruhigere Haut, klarere Farben und ein hochwertiger Gesamteindruck, ohne dass die Bilder künstlich oder überzeichnet wirken."
            },
            {
              title: "Eventgerechte Looks",
              description: "Hochzeit, Firmenfeier oder Gala: Layouts, Farben und Bildwirkung können passend zum Anlass inszeniert werden."
            },
            {
              title: "Sofort einsetzbar",
              description: "Die KI ist nicht nur Demo, sondern Teil eines echten Event-Workflows mit Fotobox, Bedienung, Galerie und auf Wunsch Druck."
            }
          ],
      demoBadge: json.ai.demoBadge || "Live Preview",
      demoTitle: json.ai.demoTitle || "Intelligente /Design-Overlays.",
      demoLead: json.ai.demoLead || "Unsere KI analysiert die Bildkomposition und platziert Texte, Daten oder Logos dort, wo sie wirken und trotzdem genug Raum fürs Motiv bleibt.",
      demoItems: (json.ai.demoItems && json.ai.demoItems.length > 0)
        ? json.ai.demoItems
        : [
            {
              title: "Dynamic Text Engine",
              description: "Namen, Daten oder Claim werden so gesetzt, dass Lesbarkeit und Motiv harmonisch zusammenpassen."
            },
            {
              title: "Contextual Branding",
              description: "Firmenlogos und Event-Branding können sichtbar eingebunden werden, ohne das Bild unruhig zu machen."
            }
          ],
      useCasesTitle: json.ai.useCasesTitle || "Für welche Events ist die KI Fotobox stark?",
      useCasesLead: json.ai.useCasesLead || normalizedAiDescriptionText.split(/\n\s*\n/)[1] || "Mit wenigen Klicks entstehen einzigartige Bilder für Events mit Erlebnis, Aufmerksamkeit und modernem Branding.",
      useCases: (json.ai.useCases && json.ai.useCases.length > 0)
        ? json.ai.useCases
        : [
            "Hochzeiten mit individuellem Storytelling und Wow-Effekt",
            "Firmenfeiern, Messen und Markenauftritte mit Social Sharing",
            "Gala-Abende, Weihnachtsfeiern und Sommerfeste",
            "Produktpräsentationen, Roadshows und Promotion-Aktionen"
          ],
      standardTitle: json.ai.standardTitle || "Standard in allen Fotoboxen.",
      standardLead: json.ai.standardLead || "Wir machen keine Kompromisse bei der Bildwirkung. Die KI-Grundoptimierung ist in jedem unserer Setups als veredelnde Komponente mitdenkbar und lässt sich je nach Eventcharakter intensiver inszenieren.",
      finalTitle: json.ai.finalTitle || "Direkt zur KI-Fotobox beraten lassen",
      finalLead: json.ai.finalLead || "Wir schauen gemeinsam, ob die KI-Fotobox besser als eigenständige Attraktion oder als Upgrade zur klassischen Fotobox für dein Event passt.",
      pageCompareBeforeUrl: json.ai.pageCompareBeforeUrl || json.ai.compareLeftBeforeUrl || "",
      pageCompareAfterUrl: json.ai.pageCompareAfterUrl || json.ai.compareLeftAfterUrl || "",
      pageDemoImageUrl: json.ai.pageDemoImageUrl || json.ai.compareRightAfterUrl || json.ai.compareRightBeforeUrl || json.ai.previewImageUrl || ""
    };
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
      heading: json.accessories?.heading || "Passende Requisiten für jeden Anlass",
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
      badge: json.thanks?.badge || "Anfrage gesendet",
      heading: json.thanks?.heading || "danke/anfrage",
      message: json.thanks?.message || "Ihre Anfrage ist erfolgreich bei uns eingegangen. Wir prüfen die Verfügbarkeit für Ihren Wunschtermin und melden uns in Kürze.",
      summaryTitle: json.thanks?.summaryTitle || "Anfrage-Zusammenfassung",
      summaryPackageLabel: json.thanks?.summaryPackageLabel || "Paket",
      summaryDateLabel: json.thanks?.summaryDateLabel || "Voraussichtlicher Termin",
      summaryLocationLabel: json.thanks?.summaryLocationLabel || "Ort der Feier",
      summaryReferenceLabel: json.thanks?.summaryReferenceLabel || "Referenz-ID",
      inspirationTitle: json.thanks?.inspirationTitle || "Bleiben Sie inspiriert",
      inspirationText: json.thanks?.inspirationText || "Folgen Sie uns auf Instagram für die neuesten Requisiten, KI-Features und Einblicke von Tiroler Hochzeiten.",
      inspirationButtonText: json.thanks?.inspirationButtonText || "",
      priceLabel: json.thanks?.priceLabel || "GESCHÄTZTER PREIS",
      priceNote: json.thanks?.priceNote || "*Inkl. MwSt. Endgültiger Preis folgt im Angebot.",
      stepsTitle: json.thanks?.stepsTitle || "Wie geht es weiter?",
      step1Title: json.thanks?.step1Title || "Anfrage-Check",
      step1Text: json.thanks?.step1Text || "Wir prüfen die Verfügbarkeit für Ihren Termin innerhalb von 24 Stunden.",
      step2Title: json.thanks?.step2Title || "Unverbindliches Angebot",
      step2Text: json.thanks?.step2Text || "Sie erhalten ein detailliertes Angebot per E-Mail inkl. aller Inklusivleistungen.",
      step3Title: json.thanks?.step3Title || "Termin Fixierung",
      step3Text: json.thanks?.step3Text || "Nach Ihrer Bestätigung wird die Fotobox fest für Ihren besonderen Tag reserviert.",
      footerText: json.thanks?.footerText || "Haben Sie in der Zwischenzeit Fragen? Kontaktieren Sie uns direkt unter",
      questionsTitle: json.thanks?.questionsTitle || "Haben Sie Fragen?",
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
    const normalizedOccasions = {
      seoTitle: json.occasions?.seoTitle || "Fotobox für jeden Anlass in Tirol | Hochzeit, Geburtstag und Events",
      seoDescription:
        json.occasions?.seoDescription ||
        "Fotobox mieten in Tirol für Hochzeit, Geburtstag, Firmenevent und weitere Anlässe. Moderne Fotobox-Lösungen mit Sofortdruck, Branding und starkem Erinnerungswert.",
      heroEyebrow: json.occasions?.heroEyebrow || "Professionelle Vermietung in Tirol",
      heroTitle: json.occasions?.heroTitle || "Fotobox für",
      heroTitleAccent: json.occasions?.heroTitleAccent || "jeden/anlass",
      heroLead:
        json.occasions?.heroLead ||
        "Entdeckt maßgeschneiderte Fotobox-Lösungen für Hochzeiten, Geburtstage, Firmenfeiern und Events in Tirol. Modern, hochwertig und gemacht für bleibende Erinnerungen.",
      heroImageUrl:
        json.occasions?.heroImageUrl ||
        "/uploads/1772725458356-dcdb983d-1a6d-4d1b-bfcd-de04366260ca-fotobox-tirol-selfie-bilder-7-optimized.jpg",
      sections: (json.occasions?.sections && json.occasions.sections.length > 0) ? json.occasions.sections : DEFAULT_OCCASIONS_SECTIONS,
      seoColumns: (json.occasions?.seoColumns && json.occasions.seoColumns.length > 0) ? json.occasions.seoColumns : DEFAULT_OCCASIONS_SEO_COLUMNS,
      searchTerms:
        (json.occasions?.searchTerms && json.occasions.searchTerms.length > 0)
          ? json.occasions.searchTerms
          : [
              "Hochzeitsfotobox mieten Innsbruck",
              "Fotobox für Firmenevent Preise",
              "Geburtstagsfotobox Tirol",
              "Fotobox mit Druck-Flatrate mieten"
            ],
      faqHeading: json.occasions?.faqHeading || "fragen/anlässe",
      faqItems: (json.occasions?.faqItems && json.occasions.faqItems.length > 0) ? json.occasions.faqItems : DEFAULT_OCCASIONS_FAQ_ITEMS,
      ctaMeta: json.occasions?.ctaMeta || "Alle Pakete inklusive Setup und Support",
      ctaTitle: json.occasions?.ctaTitle || "Unverbindlich Termin anfragen",
      ctaButtonText: json.occasions?.ctaButtonText || "Jetzt anfragen",
      ctaButtonHref: json.occasions?.ctaButtonHref || "/kontakt"
    };
    const normalizedTemplateWizard = {
      step1: {
        title: json.templateWizard?.step1?.title || "layout/vorlagen",
        subtitle: json.templateWizard?.step1?.subtitle || "Wählen Sie eine professionelle Design-Grundlage für Ihre Fotos."
      },
      step2: {
        title: json.templateWizard?.step2?.title || "logo/branding",
        subtitle: json.templateWizard?.step2?.subtitle || "Laden Sie Ihr Logo hoch und platzieren Sie es auf Ihrem Design."
      },
      step3: {
        title: json.templateWizard?.step3?.title || "farben/anpassung",
        subtitle: json.templateWizard?.step3?.subtitle || "Personalisieren Sie Ihr Layout passend zu Ihrem Event-Design."
      },
      step4: {
        title: json.templateWizard?.step4?.title || "fast/fertig",
        subtitle: json.templateWizard?.step4?.subtitle || "Prüfen Sie Ihre Auswahl und senden Sie uns Ihre unverbindliche Anfrage."
      }
    };
    const normalizedPricing = {
      ...json.pricing,
      pageTitle: json.pricing?.pageTitle || "Preisgestaltung",
      pageIntro: json.pricing?.pageIntro || "Eigene Übersichtsseite für Pakete, Druckformate und Leistungen.",
      pageHeading: json.pricing?.pageHeading || "all/inclusive",
      pagePlans: (json.pricing?.pagePlans && json.pricing.pagePlans.length > 0)
        ? json.pricing.pagePlans
        : (json.pricing?.plans && json.pricing.plans.length > 0)
          ? json.pricing.plans.map((plan) => ({
              name: plan.name,
              price: plan.price,
              meta: "/ Event",
              featured: plan.featured,
              cta: plan.cta,
              items: [...plan.items]
            }))
            : [
              {
                name: "Basic",
                price: 400,
                meta: "/ Selbstabholung",
                featured: false,
                cta: "Anfragen",
                items: [
                  "Selbst Abholung",
                  "Aufbau Einschulung",
                  "Digitale Bilder",
                  "Sofortdruck (300 Prints)",
                  "Requisiten"
                ]
              },
              {
                name: "Premium",
                price: 600,
                meta: "/ Event",
                featured: true,
                cta: "Anfragen",
                items: [
                  "Ganzen Abend Mietdauer",
                  "Sofortdruck (unbegrenzt)",
                  "Accessoires",
                  "Online Galerie",
                  "Requisiten",
                  "Normale Fotobox"
                ]
              },
              {
                name: "Business",
                price: 800,
                meta: "/ Event",
                featured: false,
                cta: "Anfragen",
                items: [
                  "Ganzen Abend Mietdauer",
                  "Sofortdruck (unbegrenzt)",
                  "Accessoires",
                  "Online Galerie",
                  "QR Code Upload",
                  "Normal oder KI-Features Modul",
                  "Individuelles Layout"
                ]
              }
            ],
      technologyHeading: json.pricing?.technologyHeading || "technik/bedienung",
      technologyItems: (json.pricing?.technologyItems && json.pricing.technologyItems.length > 0)
        ? json.pricing.technologyItems
        : [
            {
              title: "Studioqualität",
              description: "Integrierte DSLR-Kamera und professioneller Studioblitz sorgen für sauber ausgeleuchtete Bilder in jeder Event-Umgebung."
            },
            {
              title: "Touch Bedienung",
              description: "Intuitive Benutzerführung über den großen Touchscreen, damit sich auch Gäste ohne Einweisung sofort zurechtfinden."
            },
            {
              title: "Sofortdruck",
              description: "High-Speed Fotodruck in Sekunden mit klaren Ausdrucken in Laborqualität, abgestimmt auf euer Event oder Branding."
            }
          ],
      faqHeading: json.pricing?.faqHeading || json.faq?.heading || "häufige/fragen",
      referencesHeading: json.pricing?.referencesHeading || "referenzen/partner",
      references: (json.pricing?.references && json.pricing.references.length > 0)
        ? json.pricing.references
        : [
            { name: "Fiegl+Spielberger", href: "https://www.fiegl.co.at", logoDomain: "fiegl.co.at" },
            { name: "Congress Messe Innsbruck", href: "https://www.cmi.at", logoDomain: "cmi.at" },
            { name: "Kloster Bräu Seefeld", href: "https://klosterbraeu.com", logoDomain: "klosterbraeu.com" },
            { name: "Tiroler Versicherung", href: "https://www.tiroler-versicherung.at", logoDomain: "tiroler-versicherung.at" },
            { name: "Völkl Ski", href: "https://www.voelkl.com", logoDomain: "voelkl.com" },
            { name: "Recycling Ahrental", href: "https://www.rz-ahrental.at", logoDomain: "rz-ahrental.at" },
            { name: "Sandoz", href: "https://www.sandoz.com", logoDomain: "sandoz.com" },
            { name: "Interalpen Hotel", href: "https://www.interalpen.com", logoDomain: "interalpen.com" },
            { name: "Wetscher", href: "https://www.wetscher.com", logoDomain: "wetscher.com" },
            { name: "Burton", href: "https://www.burton.com", logoDomain: "burton.com" },
            { name: "Tiroler Wasserkraft", href: "https://www.tiwag.at", logoDomain: "tiwag.at" },
            { name: "Woods Seefeld", href: "https://www.woods-seefeld.com", logoDomain: "woods-seefeld.com" },
            { name: "OFA", href: "https://www.ofa.at", logoDomain: "ofa.at" },
            { name: "Bayrischer Hof", href: "https://www.bayerischerhof.de/de/", logoDomain: "bayerischerhof.de", initials: "BH" },
            { name: "VOGUE Germany", href: "https://www.vogue.de", logoDomain: "vogue.de" },
            { name: "Adlers Hotel", href: "https://www.adlers-innsbruck.com", logoDomain: "adlers-innsbruck.com" },
            { name: "Hypo Tirol Bank", href: "https://www.hypotirol.com", logoDomain: "hypotirol.com" },
            { name: "Aqua Dome", href: "https://www.aqua-dome.at", logoDomain: "aqua-dome.at" },
            { name: "Aufschnaiter", href: "https://www.aufschnaiter.com", logoDomain: "aufschnaiter.com" },
            { name: "Salt Schweiz", href: "https://www.salt.ch", logoDomain: "salt.ch" },
            { name: "Büro im Laden", href: "https://www.xn--dasbroimladen-zob.at/im-laden", logoDomain: "xn--dasbroimladen-zob.at" },
            { name: "Donau Versicherung", href: "https://www.donauversicherung.at", logoDomain: "donauversicherung.at" },
            {
              name: "Tirol Werbung",
              href: "https://www.tirolwerbung.at",
              logoDomain: "tirolwerbung.at",
              logoSrc: "https://www.tirolwerbung.at/_Resources/Static/Packages/imx.bestpractice/images/PageHeader/tirol.svg?bust=20775f4e"
            },
            {
              name: "Innsbruck Tourismus",
              href: "https://www.innsbruck.info",
              logoDomain: "innsbruck.info",
              logoSrc: "https://www.innsbruckphoto.at/logos/INNSBRUCK/RGB/Logo_INNSBRUCK_rgb.jpg"
            },
            { name: "Thöni Telfs", href: "https://www.thoeni.com", logoDomain: "thoeni.com" },
            { name: "Kaufhaus Tyrol", href: "https://kaufhaus-tyrol.at", logoDomain: "kaufhaus-tyrol.at" },
            { name: "DEZ Einkaufszentrum", href: "https://www.dez.at", logoDomain: "dez.at" },
            { name: "Löffler", href: "https://www.loeffler.at", logoDomain: "loeffler.at" },
            { name: "Innio / Jenbach", href: "https://www.innio.com", logoDomain: "innio.com" }
          ],
      contactTitle: json.pricing?.contactTitle || "Direkt anfragen"
    };

    const nextContent = {
      ...json,
      ai: normalizedAi,
      footer: normalizedFooter,
      legal: normalizedLegal,
      accessories: normalizedAccessories,
      thanks: normalizedThanks,
      contact: normalizedContact,
      occasions: normalizedOccasions,
      space: normalizedSpace,
      reviews: normalizedReviews,
      templateWizard: normalizedTemplateWizard,
      pricing: normalizedPricing,
      layout: {
        ...json.layout,
        homepageOrder: normalizedHomepageOrder
      }
    };
    contentRef.current = nextContent;
    setContent(nextContent);
    setHomepageOrder(normalizedHomepageOrder);
    setActiveTab((prev) => (SECTION_TABS.some((tab) => tab.id === prev) ? prev : "overview"));
    setAuthorized(true);
    setDirty(false);
    setStatus("Inhalte geladen.");
  }

  useEffect(() => {
    loadContent();
  }, []);

  function updateContent(update: CmsUpdater) {
    setContent((prev) => {
      if (!prev) return prev;
      const next = update(prev);
      contentRef.current = next;
      return next;
    });
    setDirty(true);
  }

  async function persistContent(nextContent: CMSContent, successMessage = "Gespeichert.") {
    try {
      setStatus("Speichere...");
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextContent)
      });

      if (response.status === 401) {
        setAuthorized(false);
        setStatus("Session abgelaufen. Bitte neu einloggen.");
        return false;
      }

      if (!response.ok) {
        const json = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus(json?.error || "Fehler beim Speichern.");
        return false;
      }

      setDirty(false);
      setStatus(successMessage);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Netzwerkfehler beim Speichern.";
      setStatus(`Speichern fehlgeschlagen: ${message}`);
      return false;
    }
  }

  async function saveContent() {
    const latestContent = contentRef.current;
    if (!latestContent) return;
    await persistContent(latestContent);
  }

  async function saveAndOpenPreview(tab: SectionId) {
    const latestContent = contentRef.current;
    if (!latestContent) return;

    let saved = true;
    if (dirty) {
      saved = await persistContent(latestContent, "Gespeichert. Vorschau wird geöffnet...");
    }

    if (!saved) return;

    const previewPath = getPreviewPathForTab(tab);
    window.open(`${previewPath}${previewPath.includes("?") ? "&" : "?"}v=${Date.now()}`, "_blank");
  }

  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);

    try {
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
        const rawBody = await response.text().catch(() => "");
        let detail = "Upload fehlgeschlagen.";
        if (rawBody) {
          try {
            const parsed = JSON.parse(rawBody) as { error?: string };
            detail = parsed.error || rawBody;
          } catch {
            detail = rawBody;
          }
        }
        setStatus(`Upload fehlgeschlagen (${response.status}): ${detail}`);
        return null;
      }

      const json = (await response.json()) as { url: string };
      if (!json?.url) {
        setStatus("Upload fehlgeschlagen: Keine URL vom Server erhalten.");
        return null;
      }
      setLastUploadedUrl(normalizeImageUrl(json.url));
      setStatus(`Bild hochgeladen: ${json.url}`);
      setDirty(true);
      return json.url;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Netzwerkfehler beim Upload.";
      setStatus(`Upload fehlgeschlagen: ${message}`);
      return null;
    }
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    applyUpdate: (prev: CMSContent, url: string) => CMSContent,
    loadingText: string,
    successText = "Bild hochgeladen und gespeichert."
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus(loadingText);
    const url = await uploadImage(file);
    if (!url) return;

    const normalizedUrl = normalizeImageUrl(url);
    let nextContent: CMSContent | null = null;
    setContent((prev) => {
      if (!prev) return prev;
      const next = applyUpdate(prev, normalizedUrl);
      nextContent = next;
      return next;
    });
    setDirty(true);
    event.target.value = "";

    if (nextContent) {
      await persistContent(nextContent, successText);
    }
  }

  async function handleHeroImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !content) return;

    setStatus("Lade Hero-Bild hoch...");
    const url = await uploadImage(file);
    if (!url) return;

    const nextHeroImageUrl = normalizeImageUrl(url);
    const absoluteUrl = nextHeroImageUrl.startsWith("http")
      ? nextHeroImageUrl
      : `${window.location.origin}${nextHeroImageUrl.startsWith("/") ? "" : "/"}${nextHeroImageUrl}`;
    const nextContent: CMSContent = {
      ...content,
      hero: {
        ...content.hero,
        imageUrl: nextHeroImageUrl
      }
    };

    setPendingHeroImageUrl(nextHeroImageUrl);
    setPendingHeroAbsoluteUrl(absoluteUrl);
    contentRef.current = nextContent;
    setContent(nextContent);
    event.target.value = "";
    await persistContent(nextContent, "Hero Bild hochgeladen und gespeichert.");
  }

  async function handleMediaLibraryUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    setMediaLibraryPendingFiles(files);
    if (files.length > 0) {
      setStatus(`${files.length} Datei(en) gewählt. Bitte auf "Upload starten" klicken.`);
    }
  }

  function toAbsoluteUrl(url: string): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (typeof window === "undefined") return url;
    return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  async function uploadPendingMediaLibraryFiles() {
    const files = [...mediaLibraryPendingFiles];
    if (files.length === 0) return;

    setStatus(`Lade ${files.length} Bild(er) hoch...`);
    const createdUrls: string[] = [];

    for (const file of files) {
      const url = await uploadImage(file);
      if (url) {
        const normalized = normalizeImageUrl(url);
        createdUrls.push(normalized);
      }
    }

    if (createdUrls.length > 0) {
      setMediaLibraryUrls((prev) => [...createdUrls, ...prev]);
      setStatus(`${createdUrls.length} Bild(er) hochgeladen. URLs unten kopieren.`);
      setMediaLibraryPendingFiles([]);
    }
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
                <div className="admin-actions">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => heroFileInputRef.current?.click()}
                  >
                    Hero Bild auswählen
                  </button>
                </div>
                <input
                  ref={heroFileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  style={{ display: "none" }}
                  onChange={handleHeroImageUpload}
                />
              </label>
              {pendingHeroImageUrl ? (
                <label className="admin-field">
                  <span>Neue Upload-URL</span>
                  <input
                    value={pendingHeroImageUrl}
                    readOnly
                    onFocus={(event) => event.currentTarget.select()}
                  />
                </label>
              ) : null}
              {pendingHeroAbsoluteUrl ? (
                <label className="admin-field">
                  <span>Neue Upload-URL (vollständig)</span>
                  <input
                    value={pendingHeroAbsoluteUrl}
                    readOnly
                    onFocus={(event) => event.currentTarget.select()}
                  />
                </label>
              ) : null}
              {pendingHeroImageUrl ? (
                <div className="admin-actions">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      updateContent((prev) => ({ ...prev, hero: { ...prev.hero, imageUrl: pendingHeroImageUrl } }));
                      setPendingHeroImageUrl(null);
                      setPendingHeroAbsoluteUrl("");
                      setStatus("Hero Bild übernommen. Bitte speichern.");
                    }}
                  >
                    Hero Bild übernehmen
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={async () => {
                      if (!content) return;
                      const nextContent: CMSContent = {
                        ...content,
                        hero: { ...content.hero, imageUrl: pendingHeroImageUrl }
                      };
                      setContent(nextContent);
                      setPendingHeroImageUrl(null);
                      setPendingHeroAbsoluteUrl("");
                      await persistContent(nextContent, "Hero Bild übernommen und gespeichert.");
                    }}
                  >
                    Übernehmen & speichern
                  </button>
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => {
                      setPendingHeroImageUrl(null);
                      setPendingHeroAbsoluteUrl("");
                    }}
                  >
                    Verwerfen
                  </button>
                </div>
              ) : null}
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
              {pendingHeroImageUrl ? (
                <img
                  src={pendingHeroImageUrl}
                  alt="Hero Upload Vorschau"
                  className="admin-preview"
                />
              ) : null}
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

    if (section === "features" || section === "aiPage") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>{section === "aiPage" ? "KI-Seite" : "Features & KI"}</h2>
            <p>{section === "aiPage" ? "Texte und Bilder der Unterseite `ki-fotobox-tirol`." : "Feature-Texte, KI-Bereich und Detailtexte."}</p>
            {section === "aiPage" ? (
              <div className="admin-section-actions">
                <button className="btn" type="button" onClick={saveContent}>
                  {dirty ? "KI-Seite speichern" : "gespeichert"}
                </button>
                <button className="btn btn-outline" type="button" onClick={() => saveAndOpenPreview(section)}>
                  KI-Seite speichern und öffnen
                </button>
                <span className="admin-inline-status">{dirty ? "Ungespeicherte Änderungen" : "Alles gespeichert"}</span>
              </div>
            ) : null}
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
                <span>KI Seite Badge</span>
                <input
                  value={content.ai.heroBadge || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, heroBadge: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>KI Seite Titel Zeile 1</span>
                <input
                  value={content.ai.heroTitleTop || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, heroTitleTop: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>KI Seite Akzentwort</span>
                <input
                  value={content.ai.heroTitleAccent || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, heroTitleAccent: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>KI Hero Einleitung</span>
                <textarea
                  rows={5}
                  value={content.ai.heroLead || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, heroLead: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Feature Titel (mit / für Zeilenbruch)</span>
                <input
                  value={content.ai.featureTitle || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, featureTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Feature Einleitung</span>
                <textarea
                  rows={5}
                  value={content.ai.featureLead || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, featureLead: e.target.value } }))}
                />
              </label>
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>Feature Karten (Titel | Text, eine Zeile pro Karte)</span>
                <textarea
                  rows={8}
                  value={(content.ai.featureCards || []).map((item) => `${item.title} | ${item.description}`).join("\n")}
                  onChange={(e) => {
                    const featureCards = e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [title, ...rest] = line.split("|");
                        return {
                          title: (title || "").trim(),
                          description: rest.join("|").trim()
                        };
                      })
                      .filter((item) => item.title && item.description);
                    updateContent((prev) => ({ ...prev, ai: { ...prev.ai, featureCards } }));
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Demo Badge</span>
                <input
                  value={content.ai.demoBadge || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, demoBadge: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Demo Titel (mit / für Zeilenbruch)</span>
                <input
                  value={content.ai.demoTitle || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, demoTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Demo Einleitung</span>
                <textarea
                  rows={4}
                  value={content.ai.demoLead || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, demoLead: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Demo Punkte (Titel | Text, eine Zeile pro Punkt)</span>
                <textarea
                  rows={6}
                  value={(content.ai.demoItems || []).map((item) => `${item.title} | ${item.description}`).join("\n")}
                  onChange={(e) => {
                    const demoItems = e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [title, ...rest] = line.split("|");
                        return {
                          title: (title || "").trim(),
                          description: rest.join("|").trim()
                        };
                      })
                      .filter((item) => item.title && item.description);
                    updateContent((prev) => ({ ...prev, ai: { ...prev.ai, demoItems } }));
                  }}
                />
              </label>
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>KI Unterseite Vergleich Vorher hochladen</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (prev, url) => ({ ...prev, ai: { ...prev.ai, pageCompareBeforeUrl: url } }),
                      "Lade KI Unterseite Vorher hoch...",
                      "KI Unterseite Vorher gespeichert."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>KI Unterseite Vergleich Vorher URL</span>
                <input
                  value={content.ai.pageCompareBeforeUrl || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, pageCompareBeforeUrl: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>KI Unterseite Vergleich Nachher hochladen</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (prev, url) => ({ ...prev, ai: { ...prev.ai, pageCompareAfterUrl: url } }),
                      "Lade KI Unterseite Nachher hoch...",
                      "KI Unterseite Nachher gespeichert."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>KI Unterseite Vergleich Nachher URL</span>
                <input
                  value={content.ai.pageCompareAfterUrl || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, pageCompareAfterUrl: e.target.value } }))}
                />
              </label>
              {content.ai.pageCompareAfterUrl ? <img src={content.ai.pageCompareAfterUrl} alt="KI Unterseite Nachher" className="admin-preview" /> : null}
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>KI Unterseite Demo Bild hochladen</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (prev, url) => ({ ...prev, ai: { ...prev.ai, pageDemoImageUrl: url } }),
                      "Lade KI Unterseite Demo Bild hoch...",
                      "KI Unterseite Demo Bild gespeichert."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>KI Unterseite Demo Bild URL</span>
                <input
                  value={content.ai.pageDemoImageUrl || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, pageDemoImageUrl: e.target.value } }))}
                />
              </label>
              {content.ai.pageDemoImageUrl ? <img src={content.ai.pageDemoImageUrl} alt="KI Unterseite Demo" className="admin-preview" /> : null}
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>Startseite Links Vorher hochladen</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (prev, url) => ({ ...prev, ai: { ...prev.ai, compareLeftBeforeUrl: url } }),
                      "Lade KI links vorher hoch...",
                      "KI links vorher Bild gespeichert."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Startseite Links Vorher URL</span>
                <input
                  value={content.ai.compareLeftBeforeUrl || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, compareLeftBeforeUrl: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Startseite Links Nachher hochladen</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (prev, url) => ({ ...prev, ai: { ...prev.ai, compareLeftAfterUrl: url } }),
                      "Lade KI links nachher hoch...",
                      "KI links nachher Bild gespeichert."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Startseite Links Nachher URL</span>
                <input
                  value={content.ai.compareLeftAfterUrl || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, compareLeftAfterUrl: e.target.value } }))}
                />
              </label>
              {content.ai.compareLeftAfterUrl ? <img src={content.ai.compareLeftAfterUrl} alt="KI Links Nachher" className="admin-preview" /> : null}
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>Startseite Rechts Vorher hochladen</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (prev, url) => ({ ...prev, ai: { ...prev.ai, compareRightBeforeUrl: url } }),
                      "Lade KI rechts vorher hoch...",
                      "KI rechts vorher Bild gespeichert."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Startseite Rechts Vorher URL</span>
                <input
                  value={content.ai.compareRightBeforeUrl || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, compareRightBeforeUrl: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Startseite Rechts Nachher hochladen</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (prev, url) => ({ ...prev, ai: { ...prev.ai, compareRightAfterUrl: url } }),
                      "Lade KI rechts nachher hoch...",
                      "KI rechts nachher Bild gespeichert."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Startseite Rechts Nachher URL</span>
                <input
                  value={content.ai.compareRightAfterUrl || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, compareRightAfterUrl: e.target.value } }))}
                />
              </label>
              {content.ai.compareRightAfterUrl ? <img src={content.ai.compareRightAfterUrl} alt="KI Rechts Nachher" className="admin-preview" /> : null}
            </div>
          </div>

          <div className="admin-grid-3">
            <div className="admin-panel">
              <label className="admin-field">
                <span>Use Cases Titel</span>
                <input
                  value={content.ai.useCasesTitle || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, useCasesTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Use Cases Einleitung</span>
                <textarea
                  rows={5}
                  value={content.ai.useCasesLead || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, useCasesLead: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Use Cases Liste (eine Zeile pro Punkt)</span>
                <textarea
                  rows={6}
                  value={(content.ai.useCases || []).join("\n")}
                  onChange={(e) => {
                    const useCases = e.target.value.split("\n").map((line) => line.trim()).filter(Boolean);
                    updateContent((prev) => ({ ...prev, ai: { ...prev.ai, useCases } }));
                  }}
                />
              </label>
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>Standard Block Titel</span>
                <input
                  value={content.ai.standardTitle || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, standardTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Standard Block Text</span>
                <textarea
                  rows={5}
                  value={content.ai.standardLead || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, standardLead: e.target.value } }))}
                />
              </label>
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>Abschluss Titel</span>
                <input
                  value={content.ai.finalTitle || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, finalTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Abschluss Text</span>
                <textarea
                  rows={5}
                  value={content.ai.finalLead || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, ai: { ...prev.ai, finalLead: e.target.value } }))}
                />
              </label>
            </div>
          </div>
        </section>
      );
    }

    if (section === "occasions") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Anlässe</h2>
            <p>Hero, Texte, Bilder und CTA der Unterseite `fotobox-anlaesse`.</p>
          </div>

          <div className="admin-grid-2">
            <div className="admin-panel">
              <label className="admin-field">
                <span>SEO Titel</span>
                <input
                  value={content.occasions?.seoTitle || ""}
                  onChange={(e) => updateContent((prev) => ({
                    ...prev,
                    occasions: { ...prev.occasions!, seoTitle: e.target.value }
                  }))}
                />
              </label>
              <label className="admin-field">
                <span>SEO Beschreibung</span>
                <textarea
                  rows={4}
                  value={content.occasions?.seoDescription || ""}
                  onChange={(e) => updateContent((prev) => ({
                    ...prev,
                    occasions: { ...prev.occasions!, seoDescription: e.target.value }
                  }))}
                />
              </label>
              <label className="admin-field">
                <span>Hero Eyebrow</span>
                <input
                  value={content.occasions?.heroEyebrow || ""}
                  onChange={(e) => updateContent((prev) => ({
                    ...prev,
                    occasions: { ...prev.occasions!, heroEyebrow: e.target.value }
                  }))}
                />
              </label>
              <label className="admin-field">
                <span>Hero Überschrift</span>
                <input
                  value={content.occasions?.heroTitleAccent || ""}
                  onChange={(e) => updateContent((prev) => ({
                    ...prev,
                    occasions: { ...prev.occasions!, heroTitleAccent: e.target.value }
                  }))}
                />
              </label>
              <label className="admin-field">
                <span>Hero Einleitung</span>
                <textarea
                  rows={5}
                  value={content.occasions?.heroLead || ""}
                  onChange={(e) => updateContent((prev) => ({
                    ...prev,
                    occasions: { ...prev.occasions!, heroLead: e.target.value }
                  }))}
                />
              </label>
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>Hero Bild hochladen</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    handleImageUpload(
                      event,
                      (prev, url) => ({
                        ...prev,
                        occasions: { ...prev.occasions!, heroImageUrl: url }
                      }),
                      "Lade Anlässe Hero Bild hoch...",
                      "Anlässe Hero Bild gespeichert."
                    );
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Hero Bild URL</span>
                <input
                  value={content.occasions?.heroImageUrl || ""}
                  onChange={(e) => updateContent((prev) => ({
                    ...prev,
                    occasions: { ...prev.occasions!, heroImageUrl: normalizeImageUrl(e.target.value) }
                  }))}
                />
              </label>
              {content.occasions?.heroImageUrl ? (
                <img src={content.occasions.heroImageUrl} alt="Anlässe Hero" className="admin-preview" />
              ) : null}
              <label className="admin-field">
                <span>CTA Hinweis</span>
                <input
                  value={content.occasions?.ctaMeta || ""}
                  onChange={(e) => updateContent((prev) => ({
                    ...prev,
                    occasions: { ...prev.occasions!, ctaMeta: e.target.value }
                  }))}
                />
              </label>
              <label className="admin-field">
                <span>CTA Titel</span>
                <input
                  value={content.occasions?.ctaTitle || ""}
                  onChange={(e) => updateContent((prev) => ({
                    ...prev,
                    occasions: { ...prev.occasions!, ctaTitle: e.target.value }
                  }))}
                />
              </label>
              <label className="admin-field">
                <span>CTA Button Text</span>
                <input
                  value={content.occasions?.ctaButtonText || ""}
                  onChange={(e) => updateContent((prev) => ({
                    ...prev,
                    occasions: { ...prev.occasions!, ctaButtonText: e.target.value }
                  }))}
                />
              </label>
              <label className="admin-field">
                <span>CTA Button Link</span>
                <input
                  value={content.occasions?.ctaButtonHref || ""}
                  onChange={(e) => updateContent((prev) => ({
                    ...prev,
                    occasions: { ...prev.occasions!, ctaButtonHref: e.target.value }
                  }))}
                />
              </label>
            </div>
          </div>

          {(content.occasions?.sections || []).map((occasion, index) => (
            <div className="admin-subcard" key={`${occasion.id}-${index}`}>
              <div className="admin-section-head" style={{ marginBottom: "1rem" }}>
                <h3>{occasion.id}</h3>
                <p>Text und Bild für diesen Anlass.</p>
              </div>
              <div className="admin-grid-2">
                <div className="admin-panel">
                  <label className="admin-field">
                    <span>Übertitel</span>
                    <input
                      value={occasion.eyebrow}
                      onChange={(e) => {
                        const sections = [...(content.occasions?.sections || [])];
                        sections[index] = { ...occasion, eyebrow: e.target.value };
                        updateContent((prev) => ({ ...prev, occasions: { ...prev.occasions!, sections } }));
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Titel links</span>
                    <input
                      value={occasion.title}
                      onChange={(e) => {
                        const sections = [...(content.occasions?.sections || [])];
                        sections[index] = { ...occasion, title: e.target.value };
                        updateContent((prev) => ({ ...prev, occasions: { ...prev.occasions!, sections } }));
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Titel fett</span>
                    <input
                      value={occasion.titleBold}
                      onChange={(e) => {
                        const sections = [...(content.occasions?.sections || [])];
                        sections[index] = { ...occasion, titleBold: e.target.value };
                        updateContent((prev) => ({ ...prev, occasions: { ...prev.occasions!, sections } }));
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Untertitel</span>
                    <input
                      value={occasion.subtitle}
                      onChange={(e) => {
                        const sections = [...(content.occasions?.sections || [])];
                        sections[index] = { ...occasion, subtitle: e.target.value };
                        updateContent((prev) => ({ ...prev, occasions: { ...prev.occasions!, sections } }));
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Beschreibung</span>
                    <textarea
                      rows={6}
                      value={occasion.description}
                      onChange={(e) => {
                        const sections = [...(content.occasions?.sections || [])];
                        sections[index] = { ...occasion, description: e.target.value };
                        updateContent((prev) => ({ ...prev, occasions: { ...prev.occasions!, sections } }));
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Vorteile (eine Zeile pro Punkt)</span>
                    <textarea
                      rows={6}
                      value={occasion.benefits.join("\n")}
                      onChange={(e) => {
                        const sections = [...(content.occasions?.sections || [])];
                        sections[index] = {
                          ...occasion,
                          benefits: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean)
                        };
                        updateContent((prev) => ({ ...prev, occasions: { ...prev.occasions!, sections } }));
                      }}
                    />
                  </label>
                </div>

                <div className="admin-panel">
                  <label className="admin-field">
                    <span>Bild hochladen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        handleImageUpload(
                          event,
                          (prev, url) => {
                            const sections = [...(prev.occasions?.sections || [])];
                            const current = sections[index];
                            if (!current) return prev;
                            sections[index] = { ...current, imageUrl: url };
                            return { ...prev, occasions: { ...prev.occasions!, sections } };
                          },
                          `Lade Bild für ${occasion.id} hoch...`,
                          `Bild für ${occasion.id} gespeichert.`
                        );
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Bild URL</span>
                    <input
                      value={occasion.imageUrl || ""}
                      onChange={(e) => {
                        const sections = [...(content.occasions?.sections || [])];
                        sections[index] = { ...occasion, imageUrl: normalizeImageUrl(e.target.value) };
                        updateContent((prev) => ({ ...prev, occasions: { ...prev.occasions!, sections } }));
                      }}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Alt Text</span>
                    <input
                      value={occasion.imageAlt || ""}
                      onChange={(e) => {
                        const sections = [...(content.occasions?.sections || [])];
                        sections[index] = { ...occasion, imageAlt: e.target.value };
                        updateContent((prev) => ({ ...prev, occasions: { ...prev.occasions!, sections } }));
                      }}
                    />
                  </label>
                  <label className="admin-field inline">
                    <input
                      type="checkbox"
                      checked={Boolean(occasion.warm)}
                      onChange={(e) => {
                        const sections = [...(content.occasions?.sections || [])];
                        sections[index] = { ...occasion, warm: e.target.checked };
                        updateContent((prev) => ({ ...prev, occasions: { ...prev.occasions!, sections } }));
                      }}
                    />
                    <span>Warmer Hintergrund</span>
                  </label>
                  {occasion.imageUrl ? (
                    <img src={occasion.imageUrl} alt={occasion.imageAlt || occasion.titleBold} className="admin-preview" />
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </section>
      );
    }

    if (section === "pricing") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Preise</h2>
            <p>Homepage-Preise und eigene Inhalte für die Preisgestaltungs-Seite.</p>
          </div>
          <div className="admin-grid-2">
            <div className="admin-panel">
              <label className="admin-field">
                <span>Preis-Seite Titel</span>
                <input
                  value={content.pricing.pageTitle || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, pageTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Preis-Seite Einleitung</span>
                <textarea
                  rows={4}
                  value={content.pricing.pageIntro || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, pageIntro: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Preispakete Überschrift (mit /)</span>
                <input
                  value={content.pricing.pageHeading || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, pageHeading: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Technik/Bedienung Überschrift</span>
                <input
                  value={content.pricing.technologyHeading || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, technologyHeading: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>FAQ Überschrift</span>
                <input
                  value={content.pricing.faqHeading || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, faqHeading: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Referenzen Überschrift</span>
                <input
                  value={content.pricing.referencesHeading || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, referencesHeading: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Kontaktblock Titel</span>
                <input
                  value={content.pricing.contactTitle || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, contactTitle: e.target.value } }))}
                />
              </label>
            </div>

            <div className="admin-panel">
              <label className="admin-field">
                <span>Technik/Bedienung Karten (Titel | Text, eine Zeile pro Karte)</span>
                <textarea
                  rows={7}
                  value={(content.pricing.technologyItems || []).map((item) => `${item.title} | ${item.description}`).join("\n")}
                  onChange={(e) => {
                    const technologyItems = e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [title, ...rest] = line.split("|");
                        return {
                          title: (title || "").trim(),
                          description: rest.join("|").trim()
                        };
                      })
                      .filter((item) => item.title && item.description);
                    updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, technologyItems } }));
                  }}
                />
              </label>
              <label className="admin-field">
                <span>Referenzen (Name | URL | Domain | Logo URL optional | Initialen optional)</span>
                <textarea
                  rows={10}
                  value={(content.pricing.references || [])
                    .map((item) => [item.name, item.href, item.logoDomain, item.logoSrc || "", item.initials || ""].join(" | "))
                    .join("\n")}
                  onChange={(e) => {
                    const references = e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [name, href, logoDomain, logoSrc, initials] = line.split("|").map((part) => part.trim());
                        return { name, href, logoDomain, logoSrc: logoSrc || undefined, initials: initials || undefined };
                      })
                      .filter((item) => item.name && item.href && item.logoDomain);
                    updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, references } }));
                  }}
                />
              </label>
            </div>
          </div>

          <div className="admin-section-head" style={{ marginTop: "1.5rem" }}>
            <h3>Preis-Seite Pakete</h3>
            <p>Pakete für die Unterseite `preisgestaltung`.</p>
          </div>
          {(content.pricing.pagePlans || []).map((plan, index) => (
            <div className="admin-subcard" key={`page-${plan.name}-${index}`}>
              <div className="admin-grid-3">
                <label className="admin-field">
                  <span>Name</span>
                  <input
                    value={plan.name}
                    onChange={(e) => {
                      const pagePlans = [...(content.pricing.pagePlans || [])];
                      pagePlans[index] = { ...plan, name: e.target.value };
                      updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, pagePlans } }));
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Preis in Euro</span>
                  <input
                    type="number"
                    value={plan.price}
                    onChange={(e) => {
                      const pagePlans = [...(content.pricing.pagePlans || [])];
                      pagePlans[index] = { ...plan, price: Number(e.target.value) };
                      updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, pagePlans } }));
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Preis Meta</span>
                  <input
                    value={plan.meta || ""}
                    onChange={(e) => {
                      const pagePlans = [...(content.pricing.pagePlans || [])];
                      pagePlans[index] = { ...plan, meta: e.target.value };
                      updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, pagePlans } }));
                    }}
                  />
                </label>
                <label className="admin-field">
                  <span>Button Text</span>
                  <input
                    value={plan.cta}
                    onChange={(e) => {
                      const pagePlans = [...(content.pricing.pagePlans || [])];
                      pagePlans[index] = { ...plan, cta: e.target.value };
                      updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, pagePlans } }));
                    }}
                  />
                </label>
              </div>
              <label className="admin-field inline">
                <input
                  type="checkbox"
                  checked={plan.featured}
                  onChange={(e) => {
                    const pagePlans = [...(content.pricing.pagePlans || [])];
                    pagePlans[index] = { ...plan, featured: e.target.checked };
                    updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, pagePlans } }));
                  }}
                />
                <span>Als hervorgehoben markieren</span>
              </label>
              <label className="admin-field">
                <span>Leistungen (eine pro Zeile)</span>
                <textarea
                  rows={5}
                  value={plan.items.join("\n")}
                  onChange={(e) => {
                    const pagePlans = [...(content.pricing.pagePlans || [])];
                    pagePlans[index] = {
                      ...plan,
                      items: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean)
                    };
                    updateContent((prev) => ({ ...prev, pricing: { ...prev.pricing, pagePlans } }));
                  }}
                />
              </label>
            </div>
          ))}

          <div className="admin-section-head" style={{ marginTop: "1.5rem" }}>
            <h3>Homepage Preise</h3>
            <p>Preis-Pakete für die Startseite.</p>
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

    if (section === "wizard") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Layout Wizard</h2>
            <p>Überschriften und Untertitel für die Testseite unter <code>/vorlagen-test</code>.</p>
          </div>
          <div className="admin-grid-2">
            {([
              { key: "step1", label: "Schritt 1" },
              { key: "step2", label: "Schritt 2" },
              { key: "step3", label: "Schritt 3" },
              { key: "step4", label: "Schritt 4" }
            ] as const).map((step) => (
              <div className="admin-panel" key={step.key}>
                <label className="admin-field">
                  <span>{step.label} Titel</span>
                  <input
                    value={content.templateWizard?.[step.key].title || ""}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        templateWizard: {
                          ...prev.templateWizard!,
                          [step.key]: {
                            ...prev.templateWizard?.[step.key],
                            title: e.target.value
                          }
                        }
                      }))
                    }
                  />
                </label>
                <label className="admin-field">
                  <span>{step.label} Untertitel</span>
                  <textarea
                    rows={3}
                    value={content.templateWizard?.[step.key].subtitle || ""}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        templateWizard: {
                          ...prev.templateWizard!,
                          [step.key]: {
                            ...prev.templateWizard?.[step.key],
                            subtitle: e.target.value
                          }
                        }
                      }))
                    }
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
              <h2>Mediathek Upload</h2>
              <p>Hier kannst du beliebige Bilder hochladen und die erzeugten URLs direkt kopieren.</p>
            </div>
            <label className="admin-field">
              <span>Bilder auswählen (mehrere möglich)</span>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.gif,.avif,.heic,.heif"
                onChange={handleMediaLibraryUpload}
              />
            </label>
            <div className="admin-actions">
              <button
                className="btn"
                type="button"
                onClick={uploadPendingMediaLibraryFiles}
                disabled={mediaLibraryPendingFiles.length === 0}
              >
                Upload starten
              </button>
            </div>
            {lastUploadedUrl ? (
              <label className="admin-field">
                <span>Letzte erzeugte URL</span>
                <input
                  value={toAbsoluteUrl(lastUploadedUrl)}
                  readOnly
                  onFocus={(event) => event.currentTarget.select()}
                />
              </label>
            ) : null}
            {mediaLibraryUrls.length > 0 ? (
              <div className="admin-grid-2">
                {mediaLibraryUrls.map((url, index) => (
                  <label className="admin-field" key={`${url}-${index}`}>
                    <span>Upload URL {index + 1}</span>
                    <input
                      value={toAbsoluteUrl(url)}
                      readOnly
                      onFocus={(event) => event.currentTarget.select()}
                    />
                  </label>
                ))}
              </div>
            ) : null}
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
                          (prev, url) => {
                            const items = [...prev.gallery.items];
                            const current = items[index];
                            if (!current) return prev;
                            items[index] = { ...current, imageUrl: url };
                            return { ...prev, gallery: { ...prev.gallery, items } };
                          },
                          `Lade Galerie-Bild ${index + 1} hoch...`,
                          `Galerie-Bild ${index + 1} gespeichert.`
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
                    (prev, url) => ({ ...prev, space: { ...prev.space, imageUrl: url } }),
                    "Lade Platzbedarf-Bild hoch...",
                    "Platzbedarf-Bild gespeichert."
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
                    (prev, url) => ({ ...prev, space: { ...prev.space, layoutOneImageUrl: url } }),
                    "Lade Layout/Gestaltung 1 Bild hoch...",
                    "Layout/Gestaltung 1 Bild gespeichert."
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
                    (prev, url) => ({ ...prev, space: { ...prev.space, layoutTwoImageUrl: url } }),
                    "Lade Layout/Gestaltung 2 Bild hoch...",
                    "Layout/Gestaltung 2 Bild gespeichert."
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

    if (section === "accessories") {
      return (
        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Accessoires (Startseite)</h2>
            <p>Querformat, 4 Bilder pro Reihe, Swipe-Buttons und mindestens 10 CMS-Bilder mit Alt-Text.</p>
          </div>

          <div className="admin-subcard">
            <div className="admin-actions">
              <button className="btn" type="button" onClick={addAccessoryItem}>Accessoire-Bild hinzufügen</button>
            </div>
            <div className="admin-grid-2">
              <div>
                <label className="admin-field">
                  <span>Übertitel</span>
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
                          (prev, url) => {
                            const items = [...prev.accessories.items];
                            const current = items[index];
                            if (!current) return prev;
                            items[index] = { ...current, imageUrl: url };
                            return { ...prev, accessories: { ...prev.accessories, items } };
                          },
                          `Lade Accessoire-Bild ${index + 1} hoch...`,
                          `Accessoire-Bild ${index + 1} gespeichert.`
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
                <span>Badge</span>
                <input
                  value={content.thanks.badge || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, badge: e.target.value } }))}
                />
              </label>
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
              <label className="admin-field">
                <span>Zusammenfassung Titel</span>
                <input
                  value={content.thanks.summaryTitle || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, summaryTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Label Paket</span>
                <input
                  value={content.thanks.summaryPackageLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, summaryPackageLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Label Termin</span>
                <input
                  value={content.thanks.summaryDateLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, summaryDateLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Label Ort</span>
                <input
                  value={content.thanks.summaryLocationLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, summaryLocationLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Label Referenz-ID</span>
                <input
                  value={content.thanks.summaryReferenceLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, summaryReferenceLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Preis Titel</span>
                <input
                  value={content.thanks.priceLabel || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, priceLabel: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Preis Hinweis</span>
                <textarea
                  rows={3}
                  value={content.thanks.priceNote || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, priceNote: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Inspiration Titel</span>
                <input
                  value={content.thanks.inspirationTitle || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, inspirationTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Inspiration Text</span>
                <textarea
                  rows={4}
                  value={content.thanks.inspirationText || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, inspirationText: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Inspiration Button Text</span>
                <input
                  value={content.thanks.inspirationButtonText || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, inspirationButtonText: e.target.value } }))}
                  placeholder="Leer = Kontakt E-Mail"
                />
              </label>
            </div>
            <div className="admin-panel">
              <label className="admin-field">
                <span>Schritte Titel</span>
                <input
                  value={content.thanks.stepsTitle || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, stepsTitle: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Schritt 1 Titel</span>
                <input
                  value={content.thanks.step1Title || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, step1Title: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Schritt 1 Text</span>
                <textarea
                  rows={3}
                  value={content.thanks.step1Text || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, step1Text: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Schritt 2 Titel</span>
                <input
                  value={content.thanks.step2Title || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, step2Title: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Schritt 2 Text</span>
                <textarea
                  rows={3}
                  value={content.thanks.step2Text || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, step2Text: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Schritt 3 Titel</span>
                <input
                  value={content.thanks.step3Title || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, step3Title: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Schritt 3 Text</span>
                <textarea
                  rows={3}
                  value={content.thanks.step3Text || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, step3Text: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Footer Text</span>
                <textarea
                  rows={3}
                  value={content.thanks.footerText || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, footerText: e.target.value } }))}
                />
              </label>
              <label className="admin-field">
                <span>Fragen Titel</span>
                <input
                  value={content.thanks.questionsTitle || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, thanks: { ...prev.thanks, questionsTitle: e.target.value } }))}
                />
              </label>
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
            <p>Detaillierte Steuerung für jetzt/anfragen: klar nach Bereichen aufgeteilt.</p>
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
              <h3>Abschnitte Aufdruck, Kontakt & Paket</h3>
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
                <span>Abschnitt 5 Titel (Paket)</span>
                <input
                  value={content.inquiry.packageSectionTitle || ""}
                  onChange={(e) => updateContent((prev) => ({ ...prev, inquiry: { ...prev.inquiry, packageSectionTitle: e.target.value } }))}
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
            <p>Inhalte für Impressum und Datenschutzerklärung auf den eigenen Unterseiten.</p>
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
                <span>Datenschutzerklärung Text</span>
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
                    (prev, url) => ({
                      ...prev,
                      navigation: { ...prev.navigation, logoUrl: url }
                    }),
                    "Lade Logo hoch...",
                    "Logo gespeichert."
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
              onClick={() => saveAndOpenPreview(activeTab)}
            >
              Geänderte Seite öffnen
            </button>
            <p className="admin-status">{dirty ? "Ungespeicherte Änderungen" : "Alles gespeichert"}</p>
            <p className="admin-note">{status}</p>
          </div>
        </aside>

        <main className="admin-main">{renderSection(activeTab, content)}</main>
      </div>
    </div>
  );
}
