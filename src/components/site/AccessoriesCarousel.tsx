"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CMSContent } from "@/lib/types";
import { SlashHeading } from "@/components/site/SiteShell";

type AccessoryItem = CMSContent["accessories"]["items"][number];

export default function AccessoriesCarousel({
  heading,
  items
}: {
  heading: string;
  items: AccessoryItem[];
}) {
  const slides = useMemo(() => {
    const filled = items.filter((item) => item.imageUrl || item.color || item.title);
    const base = filled.length > 0 ? filled : [
      { title: "Accessoire Set 1", imageUrl: "", altText: "Accessoire Set 1", color: "#f3f4f6", linkUrl: "" },
      { title: "Accessoire Set 2", imageUrl: "", altText: "Accessoire Set 2", color: "#eceff3", linkUrl: "" },
      { title: "Accessoire Set 3", imageUrl: "", altText: "Accessoire Set 3", color: "#e5e7eb", linkUrl: "" },
      { title: "Accessoire Set 4", imageUrl: "", altText: "Accessoire Set 4", color: "#dee3ea", linkUrl: "" }
    ];
    const padded = [...base];
    while (padded.length < 4) {
      padded.push({
        title: `Accessoire ${padded.length + 1}`,
        imageUrl: "",
        altText: `Accessoire ${padded.length + 1}`,
        color: "#e5e7eb",
        linkUrl: ""
      });
    }
    return padded;
  }, [items]);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const applyVisibleCount = (isMobile: boolean) => setVisibleCount(isMobile ? 2 : 4);
    applyVisibleCount(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => applyVisibleCount(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const maxIndex = Math.max(0, slides.length - visibleCount);
  const canSwipe = maxIndex > 0;
  const loopSlides = useMemo(
    () => (canSwipe ? [...slides, ...slides.slice(0, visibleCount)] : slides),
    [canSwipe, slides, visibleCount]
  );
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    if (!canSwipe) return;

    const timer = setInterval(() => {
      setIndex((current) => current + 1);
    }, 3000);

    return () => clearInterval(timer);
  }, [canSwipe, maxIndex]);

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
      requestAnimationFrame(() => setAnimated(true));
    });
  }

  return (
    <section id="accessories" className="accessories-section">
      <div className="accessories-head">
        <h2><SlashHeading value={heading || "accessoires/requisiten"} /></h2>
      </div>

      <div className="accessories-carousel-shell">
        <button type="button" className="accessories-arrow" onClick={prevPage} aria-label="Vorherige Accessoires" disabled={!canSwipe}>
          ‹
        </button>
        <div className="accessories-viewport">
          <div
            className="accessories-track"
            style={{
              transform: `translateX(-${index * (100 / visibleCount)}%)`,
              transition: animated ? undefined : "none"
            }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {loopSlides.map((item, slideIndex) => (
              <figure
                className="accessories-slide"
                key={`${item.title}-${slideIndex}`}
                style={{ ["--accessories-visible" as string]: visibleCount }}
              >
                {item.linkUrl ? (
                  item.linkUrl.startsWith("/") ? (
                    <Link href={item.linkUrl} className="accessories-link">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={(item.altText || item.title || `Accessoire ${slideIndex + 1}`).trim()} />
                      ) : (
                        <div className="accessories-fallback" style={{ background: item.color || "#e5e7eb" }} />
                      )}
                    </Link>
                  ) : (
                    <a href={item.linkUrl} className="accessories-link" target="_blank" rel="noopener noreferrer">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={(item.altText || item.title || `Accessoire ${slideIndex + 1}`).trim()} />
                      ) : (
                        <div className="accessories-fallback" style={{ background: item.color || "#e5e7eb" }} />
                      )}
                    </a>
                  )
                ) : item.imageUrl ? (
                  <img src={item.imageUrl} alt={(item.altText || item.title || `Accessoire ${slideIndex + 1}`).trim()} />
                ) : (
                  <div className="accessories-fallback" style={{ background: item.color || "#e5e7eb" }} />
                )}
              </figure>
            ))}
          </div>
        </div>
        <button type="button" className="accessories-arrow" onClick={nextPage} aria-label="Naechste Accessoires" disabled={!canSwipe}>
          ›
        </button>
      </div>
    </section>
  );
}
