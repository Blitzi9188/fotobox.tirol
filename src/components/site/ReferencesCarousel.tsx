"use client";

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
  if (!items.length) return null;

  const loopItems = [...items, ...items];
  const durationSeconds = Math.max(28, items.length * 2.8);

  return (
    <div className="references-marquee-shell">
      <div
        className="references-marquee-track"
        style={{ ["--references-duration" as string]: `${durationSeconds}s` }}
      >
        {loopItems.map((reference, index) => (
          <a
            key={`${reference.name}-${index}`}
            href={reference.href}
            target="_blank"
            rel="noopener noreferrer"
            className="references-marquee-slide"
            aria-label={reference.name}
            title={reference.name}
          >
            <div className="references-marquee-icon">
              {reference.initials ? (
                <span className="references-slide-monogram">{reference.initials}</span>
              ) : (
                <img
                  src={
                    reference.logoSrc ??
                    `https://www.google.com/s2/favicons?sz=128&domain=${reference.logoDomain}`
                  }
                  alt={`Logo von ${reference.name}`}
                />
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
