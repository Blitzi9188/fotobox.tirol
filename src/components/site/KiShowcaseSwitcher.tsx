"use client";

import { useMemo, useState } from "react";
import KiAutoGallery from "@/components/site/KiAutoGallery";
import KiLivePreviewRotator from "@/components/site/KiLivePreviewRotator";

type PreviewItem = {
  imageUrl: string;
  altText: string;
};

type DemoFeature = {
  title: string;
  description: string;
};

type GallerySlide = {
  imageUrl: string;
  altText: string;
};

export default function KiShowcaseSwitcher({
  livePreviewImages,
  demoBadge,
  demoLead,
  demoFeatures,
  faceSwapSlides
}: {
  livePreviewImages: readonly PreviewItem[];
  demoBadge: string;
  demoLead: string;
  demoFeatures: DemoFeature[];
  faceSwapSlides: GallerySlide[];
}) {
  const [activeTab, setActiveTab] = useState<"ki-photo-box" | "face-swap">("ki-photo-box");

  const faceSwapItems = useMemo(
    () => [
      {
        title: "Mehrere Looks",
        description: "Verschiedene Motive und Figuren werden direkt als wechselnde Galerie sichtbar."
      },
      {
        title: "Schneller Wechsel",
        description: "Per Klick springst du sofort zwischen KI Photo Box und Face/Swap, ohne die Seite zu verlassen."
      }
    ],
    []
  );

  return (
    <div className="ki-demo-shell">
      <div className="ki-demo-glow" aria-hidden="true" />
      <div className="ki-showcase-switch">
        <div className="ki-showcase-tabs" role="tablist" aria-label="KI Galerie Auswahl">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "ki-photo-box"}
            className={`ki-showcase-tab${activeTab === "ki-photo-box" ? " is-active" : ""}`}
            onClick={() => setActiveTab("ki-photo-box")}
          >
            KI Photo Box
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "face-swap"}
            className={`ki-showcase-tab${activeTab === "face-swap" ? " is-active" : ""}`}
            onClick={() => setActiveTab("face-swap")}
          >
            Face/Swap
          </button>
        </div>

        <div className="ki-demo-grid">
          <div className="ki-demo-visual">
            {activeTab === "ki-photo-box" ? (
              <div className="ki-demo-image-wrap" role="tabpanel">
                <KiLivePreviewRotator items={livePreviewImages} intervalMs={3000} />
              </div>
            ) : (
              <div className="ki-showcase-gallery-panel" role="tabpanel">
                <KiAutoGallery slides={faceSwapSlides} />
              </div>
            )}
          </div>

          <div className="ki-demo-copy">
            <div className="ki-demo-badge">
              {activeTab === "ki-photo-box" ? demoBadge : "Face/Swap Galerie"}
            </div>
            <p>
              {activeTab === "ki-photo-box"
                ? demoLead
                : "Hier läuft die Face/Swap Galerie direkt im selben Bereich. So kannst du zwischen klassischer KI-Vorschau und Motivauswahl mit einem Klick wechseln."}
            </p>
            <div className="ki-demo-list">
              {(activeTab === "ki-photo-box" ? demoFeatures : faceSwapItems).map((item, index) => (
                <article className={`ki-demo-item ${index === 0 ? "is-active" : ""}`} key={item.title}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <span className="ki-demo-item-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
