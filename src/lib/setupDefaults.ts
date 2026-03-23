import type { CMSContent } from "@/lib/types";

export const DEFAULT_SETUP_CONTENT: NonNullable<CMSContent["setup"]> = {
  seoTitle: "Technische Daten & Aufbau der Fotobox | Fotobox Tirol",
  seoDescription: "Alle technischen Daten, der Platzbedarf und der einfache Aufbau der Fotobox Tirol auf einen Blick.",
  badge: "aufbau & technik",
  heading: "platzbedarf/aufbau",
  lead: "Alle wichtigen Eckdaten auf einen Blick, damit Aufbau, Platzbedarf und Einsatz vor Ort sauber planbar bleiben.",
  overviewImageUrl: "/uploads/setup-tech-main.jpg",
  overviewImageAlt: "Fotobox Tirol für technische Daten und Aufbau",
  specs: [
    { label: "Kamera", value: "Hochwertige Kamera für klare Bilder", icon: "camera" },
    { label: "Drucker", value: "Sofortdruck in hoher Qualität", icon: "print" },
    { label: "Bildschirm", value: "Intuitive Bedienung über Touchscreen", icon: "screen" },
    { label: "Beleuchtung", value: "Integriertes Licht für optimale Ausleuchtung", icon: "light" },
    { label: "Strom", value: "Standard 230V Anschluss", icon: "power" },
    { label: "Einsatz", value: "Für Hochzeiten, Geburtstage und Firmenevents", icon: "event" },
    { label: "Ausdrucke", value: "Je nach Paket verfügbar", icon: "photos" },
    { label: "Aufbauzeit", value: "Schnell und unkompliziert", icon: "time" }
  ],
  stepsTitle: "aufbau/so funktioniert's",
  stepsLead: "Der Ablauf ist bewusst einfach gehalten. So ist die Fotobox schnell vorbereitet und in kurzer Zeit einsatzbereit.",
  videoUrl: "",
  steps: [
    { title: "Platz auswählen", description: "Wählt eine ruhige Fläche mit genügend Freiraum vor der Box." },
    { title: "Unterbau aufstellen", description: "Die Basis wird stabil positioniert und sauber ausgerichtet." },
    { title: "Oberbau montieren", description: "Der obere Teil wird aufgesetzt und für Kamera, Licht und Screen vorbereitet." },
    { title: "Verschrauben und fixieren", description: "Alle Verbindungen werden fixiert, damit der Aufbau sicher steht." },
    { title: "Strom anschließen", description: "Ein Standard-230V-Anschluss reicht für den Betrieb aus." },
    { title: "Licht einschalten", description: "Das integrierte Licht sorgt direkt für eine saubere Ausleuchtung." },
    { title: "Drucker verbinden", description: "Der Drucker wird gekoppelt und ist je nach Paket sofort einsatzbereit." },
    { title: "Testfoto machen", description: "Mit einem kurzen Testbild wird alles final kontrolliert." },
    { title: "Requisiten platzieren", description: "Zum Schluss werden Requisiten platziert und die Fläche wirkt komplett." }
  ],
  spaceTitle: "platzbedarf/empfehlung",
  spaceLead: "Für einen entspannten Ablauf reicht meist schon wenig Fläche. Mit etwas mehr Raum wirkt die Fotobox im Einsatz aber deutlich angenehmer, vor allem bei Gruppenfotos.",
  noteTitle: "Hinweis",
  noteText: "Ein Outdoor-Einsatz ist grundsätzlich möglich, jedoch nur an einem geschützten Standort. Die Fotobox sollte keiner direkten Witterung ausgesetzt sein. Insbesondere Regen, Wind, hohe Luftfeuchtigkeit und starke Sonneneinstrahlung sollten vermieden werden. Ideal ist ein überdachter Bereich, etwa unter einem Pavillon, Vordach oder in einem Zelt.",
  spaceImageUrl: "/uploads/setup-space-requirements.png.webp",
  spaceImageAlt: "Platzbedarf der Fotobox mit empfohlenen Abständen und Stellfläche",
  spaceItems: [
    { label: "Mindestplatz", value: "ca. 2 x 3 Meter" },
    { label: "Untergrund", value: "Ebener Boden empfohlen" },
    { label: "Standort", value: "Indoor ideal, outdoor nur geschützt" }
  ],
  checklistTitle: "was wird/benötigt",
  checklistItems: [
    "Stromanschluss in der Nähe",
    "Trockener / überdachter Standort",
    "Für die KI-Fotobox wird ein stabiles WLAN-Netz benötigt",
    "Ein neutraler Hintergrund",
    "Ausreichend Platz vor der Fotobox",
    "Optional ein kleiner Tisch für Requisiten"
  ],
  featureTitle: "zusätzliche/features",
  featureItems: [
    { title: "Schneller Einsatz", description: "Die Fotobox ist in kurzer Zeit startklar und passt damit auch zu eng getakteten Event-Abläufen." },
    { title: "Saubere Kabelführung", description: "Die Technik bleibt ordentlich und sicher integriert, damit die Fläche ruhig und hochwertig wirkt." },
    { title: "Stabile Bauweise", description: "Der Aufbau ist auf viele Einsätze ausgelegt und bleibt auch bei stark frequentierten Events zuverlässig." }
  ],
  ctaTitle: "Passt perfekt zu eurem Event?",
  ctaLead: "Wenn ihr schon wisst, wo die Fotobox stehen soll, können wir euch schnell sagen, welches Setup, welcher Platzbedarf und welches Paket am besten passt.",
  primaryCtaText: "Jetzt anfragen",
  primaryCtaHref: "/kontakt",
  secondaryCtaText: "Pakete vergleichen",
  secondaryCtaHref: "/preisgestaltung"
};
