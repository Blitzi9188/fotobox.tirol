"use client";

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
      {items.map((item, index) => (
        <img
          key={`${item.imageUrl}-${index}`}
          src={item.imageUrl}
          alt={index === activeIndex ? item.altText : ""}
          aria-hidden={index === activeIndex ? undefined : true}
          className={`ki-demo-image ki-live-preview-image${index === activeIndex ? " is-active" : ""}`}
        />
      ))}
    </div>
  );
}
