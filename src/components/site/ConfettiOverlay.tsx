"use client";

import { useMemo } from "react";

type ConfettiPiece = {
  left: string;
  delay: string;
  duration: string;
  rotate: string;
  color: string;
};

const COLORS = ["#ea2c2c", "#fca5a5", "#111111", "#ffffff"];

export default function ConfettiOverlay({ count = 64 }: { count?: number }) {
  const pieces = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: count }, (_, index) => ({
        left: `${((index * 97) % 100) + Math.random() * 1.5}%`,
        delay: `${(index % 8) * 0.16}s`,
        duration: `${4.4 + (index % 7) * 0.42}s`,
        rotate: `${(index * 43) % 360}deg`,
        color: COLORS[index % COLORS.length]
      })),
    [count]
  );

  return (
    <div className="confetti-overlay" aria-hidden="true">
      {pieces.map((piece, index) => (
        <span
          className="confetti-piece"
          key={`${piece.left}-${index}`}
          style={
            {
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              rotate: piece.rotate,
              backgroundColor: piece.color
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
