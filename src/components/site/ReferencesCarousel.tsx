"use client";

import { useEffect, useMemo, useState } from "react";

type ReferenceItem = {
  name: string;
  href: string;
  logoDomain: string;
  logoSrc?: string;
  initials?: string;
};

export default function ReferencesCarousel({
  items
}: {
  items: ReferenceItem[];
}) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 700px)");
    const tabletQuery = window.matchMedia("(max-width: 1100px)");

    const applyVisibleCount = () => {
      if (mobileQuery.matches) {
        setVisibleCount(2);
        return;
      }
      if (tabletQuery.matches) {
        setVisibleCount(4);
        return;
      }
      setVisibleCount(6);
    };

    applyVisibleCount();
    mobileQuery.addEventListener("change", applyVisibleCount);
    tabletQuery.addEventListener("change", applyVisibleCount);

    return () => {
      mobileQuery.removeEventListener("change", applyVisibleCount);
      tabletQuery.removeEventListener("change", applyVisibleCount);
    };
  }, []);

  const maxIndex = Math.max(0, items.length - visibleCount);
  const canSwipe = maxIndex > 0;
  const loopItems = useMemo(
    () => (canSwipe ? [...items, ...items.slice(0, visibleCount)] : items),
    [canSwipe, items, visibleCount]
  );

  useEffect(() => {
    if (!canSwipe) return;

    const timer = setInterval(() => {
      setAnimated(true);
      setIndex((current) => current + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, [canSwipe]);

  function handleTransitionEnd() {
    if (!canSwipe) return;
    if (index <= maxIndex) return;

    setAnimated(false);
    setIndex(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true));
    });
  }

  return (
    <div className="references-carousel-shell">
      <div className="references-viewport">
        <div
          className="references-track"
          style={{
            transform: `translateX(-${index * (100 / visibleCount)}%)`,
            transition: animated ? undefined : "none"
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {loopItems.map((reference, slideIndex) => (
            <a
              key={`${reference.name}-${slideIndex}`}
              href={reference.href}
              target="_blank"
              rel="noopener noreferrer"
              className="references-slide"
              style={{ ["--references-visible" as string]: visibleCount }}
            >
              <div className="references-slide-icon">
                {reference.initials ? (
                  <span className="references-slide-monogram">{reference.initials}</span>
                ) : (
                  <img
                    src={
                      reference.logoSrc ??
                      `https://www.google.com/s2/favicons?sz=128&domain=${reference.logoDomain}`
                    }
                    alt=""
                  />
                )}
              </div>
              <span className="references-slide-name">{reference.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
