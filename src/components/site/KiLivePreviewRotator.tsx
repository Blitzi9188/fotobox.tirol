"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type KiLivePreviewItem = {
  imageUrl: string;
  altText: string;
};

export default function KiLivePreviewRotator({
  items,
  intervalMs = 3000
}: {
  items: readonly KiLivePreviewItem[];
  intervalMs?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % items.length);
  }

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, items.length]);

  if (!items.length) return null;

  return (
    <div className="ki-live-preview-rotator" aria-live="polite">
      <div className="ki-live-preview-stage">
        {items.map((item, index) => (
          <Image
            key={`${item.imageUrl}-${index}`}
            src={item.imageUrl}
            alt={index === activeIndex ? item.altText : ""}
            fill
            sizes="(max-width: 700px) 70vw, 23rem"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            aria-hidden={index === activeIndex ? undefined : true}
            className={`ki-demo-image ki-live-preview-image${index === activeIndex ? " is-active" : ""}`}
          />
        ))}
      </div>
      {items.length > 1 ? (
        <>
          <button
            type="button"
            className="ki-live-preview-arrow ki-live-preview-arrow-prev"
            onClick={showPrevious}
            aria-label="Vorheriges Bild anzeigen"
          >
            ‹
          </button>
          <button
            type="button"
            className="ki-live-preview-arrow ki-live-preview-arrow-next"
            onClick={showNext}
            aria-label="Nächstes Bild anzeigen"
          >
            ›
          </button>
        </>
      ) : null}
    </div>
  );
}
