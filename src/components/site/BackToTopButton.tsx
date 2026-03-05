"use client";

import { useEffect, useState } from "react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 220);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Zurueck zum Menue"
    >
      <span className="back-to-top-arrow">↑</span>
      <span className="back-to-top-label">nach oben</span>
    </button>
  );
}
