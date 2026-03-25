import type { CMSContent } from "@/lib/types";

export const DEFAULT_LAYOUT_PAGE_CONTENT: NonNullable<CMSContent["layoutPage"]> = {
  seoTitle: "Layout Fotobox Tirol | Formate und Gestaltung",
  seoDescription:
    "Individuelle Fotobox Layouts in 5x15 und 10x15. Entdecke Formate, Vorteile und Gestaltungsmöglichkeiten für Hochzeiten, Geburtstage und Firmenfeiern.",
  badge: "individuelle gestaltung",
  heading: "layout/gestaltung",
  lead:
    "Deine Feier ist einzigartig. Genau so sollten auch die Erinnerungen daran aussehen. Mit einem individuell gestalteten Fotobox-Layout werden Schnappschüsse zu echten Event-Erinnerungen.",
  primaryCtaText: "Jetzt Layout besprechen",
  primaryCtaHref: "/kontakt",
  secondaryCtaText: "Formate entdecken",
  secondaryCtaHref: "#layout-formate",
  formatSections: [
    {
      eyebrow: "Das Original",
      heading: "fotostreifen/5x15",
      lead:
        "Der klassische Fotostreifen ist handlich, charmant und auf Events sofort wiedererkennbar. Er eignet sich perfekt für Hochzeiten, Geburtstage und Feiern mit persönlichem Look.",
      imageUrl: "/uploads/layout-one-optimized.jpg",
      imageAlt: "Fotobox Eventfoto im klassischen 5x15 Format mit personalisiertem Design für Hochzeit oder Firmenfeier",
      items: [
        {
          title: "Vorteile",
          text: "Kompakt, beliebt und ideal als Erinnerung zum Mitnehmen oder fürs Gästebuch."
        },
        {
          title: "Einsatzbereiche",
          text: "Besonders stark bei Hochzeiten, Geburtstagen und lockeren Events mit persönlicher Note."
        },
        {
          title: "Personalisierung",
          text: "Platz für Namen, Datum, Claim oder kleines Branding am unteren Rand des Streifens."
        }
      ]
    },
    {
      eyebrow: "Maximale Fläche",
      heading: "klassisches/10x15",
      lead:
        "Wenn mehr Raum für Gestaltung, Gruppenbilder und Details gefragt ist, bietet das 10x15-Format die größte Flexibilität. So entstehen hochwertige Eventprints mit viel Platz für Motiv und Design.",
      imageUrl: "/uploads/layout-two-optimized.jpg",
      imageAlt: "Fotobox Bild im Format 10x15 mit individuellem Layout für Hochzeit mit Namen und Datum des Brautpaares",
      items: [
        {
          title: "Vorteile",
          text: "Mehr Fläche für Collagen, Logos, Textelemente und größere Bildkompositionen."
        },
        {
          title: "Warum es beliebt ist",
          text: "Das vertraute Fotoformat wirkt hochwertig, lässt sich gut rahmen und direkt ins Gästebuch kleben."
        },
        {
          title: "Verwendung",
          text: "Ideal für Firmenfeiern, elegante Hochzeiten und Events, bei denen Layout und Branding stärker wirken sollen."
        }
      ]
    }
  ],
  advantagesTitle: "deine/vorteile",
  advantagesLead: "Warum sich ein individuell abgestimmtes Fotobox-Design für dein Event sichtbar auszahlt.",
  advantages: [
    {
      title: "100% Einzigartigkeit",
      text: "Wir passen das Layout an Dekoration, Einladung oder Corporate Design an, damit das Gesamtbild stimmig bleibt."
    },
    {
      title: "Perfektes Gastgeschenk",
      text: "Ein individuell gestalteter Print wirkt persönlicher und bleibt als Erinnerung länger präsent."
    },
    {
      title: "Starke Markenpräsenz",
      text: "Gerade bei Business-Events, Messen und Promotions transportiert das Layout Marke und Eventbotschaft direkt mit."
    },
    {
      title: "Smarte Integration",
      text: "Slogan, Event-Hashtag, Namen oder QR-Code lassen sich elegant einbauen, ohne das Bild zu überladen."
    }
  ],
  finalTitle: "bereit für dein layout?",
  finalLead:
    "Gemeinsam definieren wir Format, Stil und Inhalte so, dass die Fotobox perfekt zu Hochzeit, Geburtstag oder Firmenfeier passt.",
  finalPrimaryCtaText: "Unverbindlich anfragen",
  finalPrimaryCtaHref: "/kontakt",
  finalSecondaryCtaText: "Preise ansehen",
  finalSecondaryCtaHref: "/preisgestaltung"
};
