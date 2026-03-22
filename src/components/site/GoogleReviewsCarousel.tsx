"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReviewItem } from "@/lib/types";

function stars(count: number) {
  return Array.from({ length: Math.max(0, Math.min(5, Math.round(count))) }, (_, index) => (
    <span className="star" key={index}>★</span>
  ));
}

export default function GoogleReviewsCarousel({
  items
}: {
  items: ReviewItem[];
}) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 700px)");
    const tabletQuery = window.matchMedia("(max-width: 1100px)");

    const applyVisibleCount = () => {
      if (mobileQuery.matches) {
        setVisibleCount(1);
        return;
      }
      if (tabletQuery.matches) {
        setVisibleCount(2);
        return;
      }
      setVisibleCount(3);
    };

    applyVisibleCount();
    mobileQuery.addEventListener("change", applyVisibleCount);
    tabletQuery.addEventListener("change", applyVisibleCount);

    return () => {
      mobileQuery.removeEventListener("change", applyVisibleCount);
      tabletQuery.removeEventListener("change", applyVisibleCount);
    };
  }, []);

  const slides = useMemo(() => items.filter((item) => item.text || item.name), [items]);
  const maxIndex = Math.max(0, slides.length - visibleCount);
  const canSwipe = maxIndex > 0;
  const loopSlides = useMemo(
    () => (canSwipe ? [...slides, ...slides.slice(0, visibleCount)] : slides),
    [canSwipe, slides, visibleCount]
  );

  useEffect(() => {
    if (!canSwipe) return;
    const timer = setInterval(() => {
      setAnimated(true);
      setIndex((current) => current + 1);
    }, 4200);
    return () => clearInterval(timer);
  }, [canSwipe]);

  function handleTransitionEnd() {
    if (!canSwipe || index <= maxIndex) return;
    setAnimated(false);
    setIndex(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true));
    });
  }

  return (
    <div className="google-reviews-shell">
      <div className="google-reviews-viewport">
        <div
          className="google-reviews-track"
          style={{
            transform: `translateX(-${index * (100 / visibleCount)}%)`,
            transition: animated ? undefined : "none"
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {loopSlides.map((review, slideIndex) => (
            <article
              className="google-review-slide"
              key={`${review.name}-${review.date}-${slideIndex}`}
              style={{ ["--google-reviews-visible" as string]: visibleCount }}
            >
              <div className="google-review-top">
                <div className="reviewer-avatar" style={{ background: review.avatarColor || "#ea2c2c" }}>
                  {review.initials}
                </div>
                <div>
                  <div className="reviewer-name">{review.name}</div>
                  <div className="review-date">{review.date}</div>
                </div>
              </div>
              <div className="review-stars">{stars(review.rating)}</div>
              <p className="google-review-text">{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
