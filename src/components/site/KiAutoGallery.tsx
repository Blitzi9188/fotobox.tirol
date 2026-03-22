"use client";

import { useEffect, useMemo, useState } from "react";

type Slide = {
  imageUrl: string;
  altText: string;
};

function shuffleSlides(slides: Slide[]) {
  const shuffled = [...slides];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export default function KiAutoGallery({
  slides
}: {
  slides: Slide[];
}) {
  const items = useMemo(() => {
    const filtered = slides.filter((item) => item.imageUrl.trim());
    return filtered.length > 0 ? filtered : [];
  }, [slides]);
  const [orderedSlides, setOrderedSlides] = useState<Slide[]>(items);

  const [visibleCount, setVisibleCount] = useState(5);
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    setOrderedSlides(shuffleSlides(items));
    setIndex(0);
  }, [items]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
    const applyVisibleCount = (isMobile: boolean) => setVisibleCount(isMobile ? 2 : 5);
    applyVisibleCount(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => applyVisibleCount(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const maxIndex = Math.max(0, orderedSlides.length - visibleCount);
  const canSwipe = maxIndex > 0;
  const loopSlides = useMemo(
    () => (canSwipe ? [...orderedSlides, ...orderedSlides.slice(0, visibleCount)] : orderedSlides),
    [canSwipe, orderedSlides, visibleCount]
  );

  useEffect(() => {
    if (!canSwipe) return;

    const timer = setInterval(() => {
      setIndex((current) => current + 1);
    }, 3000);

    return () => clearInterval(timer);
  }, [canSwipe]);

  function prevPage() {
    if (!canSwipe) return;
    setAnimated(true);
    setIndex((current) => (current <= 0 ? maxIndex : current - 1));
  }

  function nextPage() {
    if (!canSwipe) return;
    setAnimated(true);
    setIndex((current) => current + 1);
  }

  function handleTrackTransitionEnd() {
    if (!canSwipe) return;
    if (index <= maxIndex) return;

    setAnimated(false);
    setIndex(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOrderedSlides((current) => shuffleSlides(current));
        setAnimated(true);
      });
    });
  }

  if (orderedSlides.length === 0) return null;

  return (
    <div className="ki-auto-gallery accessories-section" aria-label="KI Bildgalerie">
      <div className="accessories-carousel-shell">
        <button
          type="button"
          className="accessories-arrow"
          onClick={prevPage}
          aria-label="Vorherige Bilder"
          disabled={!canSwipe}
        >
          ‹
        </button>
        <div className="accessories-viewport ki-auto-gallery-viewport">
          <div
            className="accessories-track ki-auto-gallery-track"
            style={{
              transform: `translateX(-${index * (100 / visibleCount)}%)`,
              transition: animated ? undefined : "none"
            }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {loopSlides.map((item, slideIndex) => (
              <figure
                className="accessories-slide ki-auto-gallery-slide"
                key={`${item.imageUrl}-${slideIndex}`}
                style={{ ["--accessories-visible" as string]: String(visibleCount) }}
              >
                <img src={item.imageUrl} alt={item.altText} />
              </figure>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="accessories-arrow"
          onClick={nextPage}
          aria-label="Nächste Bilder"
          disabled={!canSwipe}
        >
          ›
        </button>
      </div>
    </div>
  );
}
