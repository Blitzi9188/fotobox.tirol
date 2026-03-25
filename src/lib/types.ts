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

export type PricingPagePlan = {
  name: string;
  price: number;
  meta?: string;
  featured: boolean;
  cta: string;
  items: string[];
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

export type OccasionItem = {
  id: string;
  eyebrow: string;
  orderLabel?: string;
  title: string;
  titleBold: string;
  subtitle: string;
  description: string;
  benefits: string[];
  imageUrl?: string;
  imageAlt?: string;
  warm?: boolean;
};

export type ReferenceItem = {
  name: string;
  href: string;
  logoDomain: string;
  logoSrc?: string;
  initials?: string;
};

export type SetupSpecItem = {
  label: string;
  value: string;
  icon: string;
};

export type SetupStepItem = {
  title: string;
  description: string;
};

export type SetupInfoItem = {
  label: string;
  value: string;
};

export type LayoutBenefitItem = {
  title: string;
  text: string;
};

export type LayoutFormatItem = {
  eyebrow: string;
  heading: string;
  lead: string;
  imageUrl?: string;
  imageAlt?: string;
  items: LayoutBenefitItem[];
};

export type WizardStepContent = {
  title: string;
  subtitle: string;
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
    heroBadge?: string;
    heroTitleTop?: string;
    heroTitleAccent?: string;
    heroLead?: string;
    featureTitle?: string;
    featureLead?: string;
    featureCards?: Feature[];
    demoBadge?: string;
    demoTitle?: string;
    demoLead?: string;
    demoItems?: Feature[];
    useCasesTitle?: string;
    useCasesLead?: string;
    useCases?: string[];
    standardTitle?: string;
    standardLead?: string;
    finalTitle?: string;
    finalLead?: string;
    previewImageUrl?: string;
    compareLeftBeforeUrl?: string;
    compareLeftAfterUrl?: string;
    compareRightBeforeUrl?: string;
    compareRightAfterUrl?: string;
    pageCompareBeforeUrl?: string;
    pageCompareAfterUrl?: string;
    pageDemoImageUrl?: string;
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
  occasions?: {
    seoTitle?: string;
    seoDescription?: string;
    heroEyebrow: string;
    heroTitle: string;
    heroTitleAccent: string;
    heroLead: string;
    heroImageUrl?: string;
    sections: OccasionItem[];
    seoColumns: Feature[];
    searchTerms: string[];
    faqHeading: string;
    faqItems: FaqItem[];
    ctaMeta: string;
    ctaTitle: string;
    ctaButtonText: string;
    ctaButtonHref: string;
  };
  pricing: {
    heading: string;
    plans: PricePlan[];
    pageTitle?: string;
    pageIntro?: string;
    pageHeading?: string;
    pagePlans?: PricingPagePlan[];
    technologyHeading?: string;
    technologyItems?: Feature[];
    faqHeading?: string;
    referencesHeading?: string;
    references?: ReferenceItem[];
    contactTitle?: string;
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
  setup?: {
    seoTitle?: string;
    seoDescription?: string;
    badge: string;
    heading: string;
    lead: string;
    overviewImageUrl?: string;
    overviewImageAlt?: string;
    specs: SetupSpecItem[];
    stepsTitle: string;
    stepsLead: string;
    videoUrl?: string;
    steps: SetupStepItem[];
    spaceTitle: string;
    spaceLead: string;
    noteTitle: string;
    noteText: string;
    spaceImageUrl?: string;
    spaceImageAlt?: string;
    spaceItems: SetupInfoItem[];
    checklistTitle: string;
    checklistItems: string[];
    featureTitle: string;
    featureItems: Feature[];
    ctaTitle: string;
    ctaLead: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
  };
  layoutPage?: {
    seoTitle?: string;
    seoDescription?: string;
    badge: string;
    heading: string;
    lead: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
    formatSections: LayoutFormatItem[];
    advantagesTitle: string;
    advantagesLead: string;
    advantages: LayoutBenefitItem[];
    finalTitle: string;
    finalLead: string;
    finalPrimaryCtaText: string;
    finalPrimaryCtaHref: string;
    finalSecondaryCtaText: string;
    finalSecondaryCtaHref: string;
  };
  templateWizard?: {
    step1: WizardStepContent;
    step2: WizardStepContent;
    step3: WizardStepContent;
    step4: WizardStepContent;
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
    packageSectionTitle: string;
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
    badge?: string;
    heading: string;
    message: string;
    summaryTitle?: string;
    summaryPackageLabel?: string;
    summaryDateLabel?: string;
    summaryLocationLabel?: string;
    summaryReferenceLabel?: string;
    inspirationTitle?: string;
    inspirationText?: string;
    inspirationButtonText?: string;
    priceLabel?: string;
    priceNote?: string;
    stepsTitle?: string;
    step1Title?: string;
    step1Text?: string;
    step2Title?: string;
    step2Text?: string;
    step3Title?: string;
    step3Text?: string;
    footerText?: string;
    questionsTitle?: string;
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
