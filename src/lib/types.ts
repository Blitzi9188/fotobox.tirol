export type Feature = {
  title: string;
  description: string;
};

export type GalleryItem = {
  title: string;
  color: string;
  imageUrl?: string;
  altText?: string;
  linkUrl?: string;
  height?: number;
};

export type AccessoryItem = {
  title: string;
  imageUrl?: string;
  altText?: string;
  color?: string;
  linkUrl?: string;
};

export type PricePlan = {
  name: string;
  price: number;
  featured: boolean;
  items: string[];
  cta: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ReviewItem = {
  name: string;
  date: string;
  text: string;
  initials: string;
  avatarColor?: string;
  rating: number;
};

export type FooterLink = {
  label: string;
  href: string;
  newTab?: boolean;
};

export type CMSContent = {
  layout?: {
    sectionOrder?: Array<"overview" | "hero" | "features" | "space" | "pricing" | "media" | "reviews" | "faq" | "inquiry" | "thanks" | "contact" | "footer" | "legal" | "seo">;
    homepageOrder?: Array<"hero" | "features" | "space" | "media" | "pricing" | "reviews" | "faq">;
  };
  seo: {
    title: string;
    description: string;
  };
  navigation: {
    brandLeft: string;
    brandRight: string;
    logoUrl?: string;
  };
  hero: {
    title: string;
    subtitleHtml: string;
    subtitleText?: string;
    subtitleColor?: string;
    ctaText: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    imageUrl?: string;
  };
  features: {
    heading: string;
    items: Feature[];
  };
  ai: {
    badge: string;
    heading: string;
    descriptionHtml: string;
    descriptionText?: string;
    bullets: string[];
    buttonText: string;
    previewImageUrl?: string;
    compareLeftBeforeUrl?: string;
    compareLeftAfterUrl?: string;
    compareRightBeforeUrl?: string;
    compareRightAfterUrl?: string;
  };
  gallery: {
    heading: string;
    items: GalleryItem[];
  };
  accessories: {
    overtitle: string;
    heading: string;
    items: AccessoryItem[];
  };
  pricing: {
    heading: string;
    plans: PricePlan[];
  };
  space: {
    heading: string;
    description: string;
    imageUrl?: string;
    layoutOneHeading?: string;
    layoutOneDescription?: string;
    layoutOneImageUrl?: string;
    layoutOneImageAlt?: string;
    layoutTwoHeading?: string;
    layoutTwoDescription?: string;
    layoutTwoImageUrl?: string;
    layoutTwoImageAlt?: string;
  };
  faq: {
    heading: string;
    items: FaqItem[];
  };
  reviews: {
    heading: string;
    sourceLabel: string;
    score: string;
    reviewCountLabel: string;
    ctaLabel: string;
    ctaHref: string;
    items: ReviewItem[];
  };
  inquiry: {
    heading: string;
    introText: string;
    stepEvent: string;
    stepPrint: string;
    stepContact: string;
    eventSectionTitle: string;
    dateSectionTitle: string;
    printSectionTitle: string;
    contactSectionTitle: string;
    submitText: string;
    eventOptions?: Array<{ label: string; desc: string }>;
    printOptions?: Array<{ label: string; desc: string }>;
    printFormatLabel?: string;
    printFormatOptions?: Array<{ label: string; desc: string }>;
    boxTypeLabel?: string;
    boxTypeOptions?: Array<{ label: string; desc: string }>;
    supportLabel?: string;
    supportOptions?: Array<{ label: string; desc: string }>;
    dateLabel?: string;
    locationLabel?: string;
    locationPlaceholder?: string;
    printTextLabel?: string;
    printTextPlaceholder?: string;
    nameLabel?: string;
    namePlaceholder?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    phoneLabel?: string;
    phonePlaceholder?: string;
    messageLabel?: string;
    messagePlaceholder?: string;
    successText?: string;
    errorText?: string;
  };
  thanks: {
    heading: string;
    message: string;
    primaryButtonText: string;
    primaryButtonHref: string;
    secondaryButtonText: string;
    secondaryButtonHref: string;
  };
  contact: {
    heading: string;
    introHtml: string;
    phone: string;
    email: string;
    address: string;
    references?: FooterLink[];
  };
  footer: {
    questionsTitle: string;
    questionsText: string;
    phoneLabel: string;
    emailLabel: string;
    socialTitle: string;
    socialIntro: string;
    socialLinks: FooterLink[];
    infoTitle: string;
    infoLinks: FooterLink[];
    legalTitle: string;
    legalLinks: FooterLink[];
    copyrightLine: string;
    taglineLine: string;
  };
  legal: {
    impressumText: string;
    datenschutzerklaerungText: string;
    agbText: string;
    agbB2bText: string;
  };
};

export type ContactLead = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  packageName: string;
  message: string;
  createdAt: string;
};
