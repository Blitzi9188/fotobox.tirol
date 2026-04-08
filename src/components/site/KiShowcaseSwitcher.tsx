"use client";

import { useState } from "react";
import KiLivePreviewRotator from "@/components/site/KiLivePreviewRotator";

type PreviewItem = {
  imageUrl: string;
  altText: string;
};

type GallerySlide = {
  imageUrl: string;
  altText: string;
};

export default function KiShowcaseSwitcher({
  livePreviewImages,
  demoBadge,
  demoLead,
  faceSwapSlides
}: {
  livePreviewImages: readonly PreviewItem[];
  demoBadge: string;
  demoLead: string;
  faceSwapSlides: GallerySlide[];
}) {
  const [activeTab, setActiveTab] = useState<"ki-photo-box" | "face-swap">("ki-photo-box");
  const selectableItems = [
    {
      key: "ki-photo-box" as const,
      title: "ki-fotobox",
      description:
        "Die KI-Fotobox erschafft komplett neue Bildwelten und kreative Looks. Sie verwandelt Fotos in einzigartige, überraschende Szenen mit echtem Wow-Effekt."
    },
    {
      key: "face-swap" as const,
      title: "face swap",
      description:
        "Beim Face Swap werden Gesichter in Bildern ausgetauscht. Das sorgt für lustige, unerwartete Ergebnisse und garantiert jede Menge Spaß auf jedem Event."
    }
  ];

  return (
    <div className="ki-demo-shell">
      <div className="ki-demo-glow" aria-hidden="true" />
      <div className="ki-showcase-switch">
        <div className="ki-demo-grid">
          <div className="ki-demo-visual">
            <div className="ki-demo-image-wrap" role="tabpanel">
              <KiLivePreviewRotator
                items={activeTab === "ki-photo-box" ? livePreviewImages : faceSwapSlides}
                intervalMs={3000}
              />
            </div>
          </div>

          <div className="ki-demo-copy">
            <div className="ki-demo-badge">{demoBadge}</div>
            <p>
              {demoLead}
            </p>
            <div className="ki-demo-list">
              {selectableItems.map((item) => (
                <button
                  type="button"
                  key={item.key}
                  className={`ki-demo-item ki-demo-item-button ${activeTab === item.key ? "is-active" : ""}`}
                  onClick={() => setActiveTab(item.key)}
                  aria-pressed={activeTab === item.key}
                >
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <span className="ki-demo-item-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
