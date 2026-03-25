"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

type OccasionNavItem = {
  id: string;
  label: string;
};

type OccasionSectionNavProps = {
  items: OccasionNavItem[];
};

export default function OccasionSectionNav({ items }: OccasionSectionNavProps) {
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);
  const [activeId, setActiveId] = useState(itemIds[0] || "");

  useEffect(() => {
    if (!itemIds.length) {
      return;
    }

    const sections = itemIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.35, 0.5, 0.7]
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [itemIds]);

  return (
    <div className={styles.heroOccasionButtons}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        const [left, right] = item.label.split("/");

        return (
          <Link
            key={`hero-${item.id}`}
            href={`#${item.id}`}
            className={`${styles.heroOccasionButton} ${isActive ? styles.heroOccasionButtonActive : ""}`}
            aria-current={isActive ? "true" : undefined}
          >
            {right ? (
              <>
                <span>{left}</span>
                <span className="accent-slash">/</span>
                <span>{right}</span>
              </>
            ) : (
              item.label
            )}
          </Link>
        );
      })}
    </div>
  );
}
