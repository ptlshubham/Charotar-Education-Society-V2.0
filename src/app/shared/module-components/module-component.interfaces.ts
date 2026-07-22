/**
 * Shared interfaces for all module section components.
 * Each module component (hero, about, app-download) accepts data
 * through @Input() properties matching these interfaces.
 */

/* ─── Hero ─── */
export interface ModuleHeroData {
  title: string;
  subtitle: string;
  backgroundImage: string;
  badgeText?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
}

/* ─── About ─── */
export interface ModuleAboutFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ModuleAboutStat {
  value: string;
  label: string;
}

export interface ModuleAboutData {
  title: string;
  description: string;
  image: string;
  features?: ModuleAboutFeature[];
  stats?: ModuleAboutStat[];
}

/* ─── App Download ─── */
export interface ModuleAppDownloadData {
  title: string;
  description: string;
  phoneImage: string;
  appStoreLink?: string;
  playStoreLink?: string;
  qrCodeImage?: string;
}
