"use client";

import { KeyboardEvent, PointerEvent, useRef, useState } from "react";

export default function BeforeAfterSlider({
  beforeImageUrl,
  afterImageUrl,
  title
}: {
  beforeImageUrl?: string;
  afterImageUrl?: string;
  title: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const positionRef = useRef(50);
  const [ariaValue, setAriaValue] = useState(50);
  const [dragging, setDragging] = useState(false);

  const before = beforeImageUrl || afterImageUrl;
  const after = afterImageUrl || beforeImageUrl;

  function setPosition(next: number) {
    const clamped = Math.max(0, Math.min(100, next));
    positionRef.current = clamped;

    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      if (rootRef.current) {
        rootRef.current.style.setProperty("--pos", `${positionRef.current}%`);
      }
      rafRef.current = null;
    });
  }

  function setPositionFromPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const raw = ((event.clientX - rect.left) / rect.width) * 100;
    setPosition(raw);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowLeft" ? -2 : 2;
    const next = Math.max(0, Math.min(100, positionRef.current + step));
    setPosition(next);
    setAriaValue(Math.round(next));
  }

  if (!before && !after) {
    return (
      <div className="compare-card compare-empty">
        <p>{title}</p>
        <span>Bitte Vorher/Nachher Bilder im Admin hochladen</span>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`compare-card ${dragging ? "is-dragging" : ""}`}
      style={{ "--pos": "50%" } as Record<string, string>}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        setPositionFromPointer(event);
      }}
      onPointerMove={(event) => {
        if (!dragging) return;
        setPositionFromPointer(event);
      }}
      onPointerUp={(event) => {
        setDragging(false);
        setAriaValue(Math.round(positionRef.current));
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        setDragging(false);
        setAriaValue(Math.round(positionRef.current));
      }}
      role="slider"
      aria-label={`${title} Vorher/Nachher Regler`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={ariaValue}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {before ? <img src={before} alt={`${title} Vorher`} className="compare-image" /> : null}
      {after ? (
        <img
          src={after}
          alt={`${title} Nachher`}
          className="compare-image compare-image-after"
        />
      ) : null}

      <div className="compare-gradient-overlay" />
      <div className="compare-center-line" aria-hidden />
      <div className="compare-handle" aria-hidden>
        <span className="compare-handle-arrow compare-handle-arrow-left">‹</span>
        <span className="compare-handle-grip" />
        <span className="compare-handle-arrow compare-handle-arrow-right">›</span>
      </div>
      <div className="compare-labels">
        <span>Vorher</span>
        <span>Nachher</span>
      </div>
    </div>
  );
}
