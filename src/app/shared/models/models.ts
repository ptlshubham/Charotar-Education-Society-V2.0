export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/** One searchable destination - a static page or a backend entity - for the universal search. */
export interface SearchItem {
  title: string;
  category: string;
  link: string;
  /** Optional query params for the destination, e.g. selecting a campus tab. */
  queryParams?: Record<string, string>;
  /** Icon key from the header ICONS map (defaults to a generic file icon). */
  icon?: string;
  /** Lowercased extra terms (synonyms, ids, body snippets) the query is matched against. */
  keywords: string;
}

/** A Rahatokarsh Fund donor row, as returned by GET /admin/GetAllDonnerList. */
export interface Donor {
  donationDate: string;
  donnerName: string;
  donnerCity: string;
  amount: number;
}

/** A micro-donor row, as returned by GET /admin/GetRahatokarshDonationList. */
export interface MicroDonor {
  createddate: string;
  name: string;
  city: string;
  amount: number;
  /** Razorpay payment reference - present on every micro donation (all are online). */
  paymentId?: string;
}

/** A beneficiary student row, as returned by GET /admin/GetAllBeneficiaryList. */
export interface BeneficiaryStudent {
  studentName: string;
  instituteName: string;
  course: string;
  /** Fee-refund percentage as the backend sends it - already formatted, e.g. "50%". */
  refundAmount: string | number;
  /** Academic/financial year the support was granted, e.g. "2025-26". */
  year: string;
}

/** An institute, as returned by GET /admin/GetAllInstituteDetails. */
export interface Institute {
  id?: number;
  name: string;
  logo?: string;
  link?: string;
  website?: string;
  url?: string;
}

/** A yearly Navratri celebration, as returned by GET /admin/GetAllNavratriDetails. */
export interface NavratriEntry {
  id: number | string;
  title: string;
  year: number | string;
  /** Rich theme description (HTML). */
  themedetails: string;
  /** Relative cover image path - resolve with the `mediaUrl` pipe. */
  coverimage: string;
  // The year's page details (migration 0058) - absent or empty until entered in the dashboard.
  /** YYYY-MM-DD */
  startDate?: string | null;
  endDate?: string | null;
  /** null = "CES Campus, Anand" */
  venue?: string | null;
  /** A PDF path behind "Download Brochure". */
  brochure?: string | null;
  highlights?: { label: string | null; value: string | null }[];
  events?: { date: string | null; title: string | null; details: string | null }[];
  press?: { title: string | null; source: string | null; date: string | null; link: string | null; image: string | null }[];
  sponsors?: { name: string | null; logo: string | null; link: string | null }[];
}

/** The /navratri page's own content, from GET /admin/GetNavratriPage (Website Management → Navratri). */
export interface NavratriPage {
  banner: string | null;
  introHeading: string | null;
  /** HTML from the dashboard's editor. */
  introHtml: string | null;
  /** A YouTube link, played in place. */
  introVideo: string | null;
  introImage: string | null;
  /** "Navratri at a Glance" - icon is a Material Symbols name. */
  stats: { value: string | null; label: string | null; icon: string | null }[];
}

/** A gallery image for a Navratri year, from GET /admin/GetNavratriImagesById/:id. */
export interface NavratriImage {
  thumb?: string;
  image?: string;
  original?: string;
  path?: string;
}

/**
 * A Navratri live-stream link (one per day) from GET /admin/GetAllNavYTLinksDetails.
 * Super admin activates at most one at a time; `isactive` arrives as 0/1.
 */
export interface NavratriLiveLink {
  id: number;
  year: number;
  day: number;
  /** YouTube watch / live / youtu.be / embed URL. */
  link: string;
  /** Facebook Live event URL. */
  fblink: string;
  isactive: number | boolean;
}

/** A CES podcast episode from GET /admin/GetAllPodcastDetails. */
export interface PodcastEntry {
  link: string;
  title: string;
  isactive: boolean;
  /** Episode details from the dashboard (migration 0050); NULL on episodes saved before it. */
  episodeNo?: number | null;
  category?: string | null;
  description?: string | null;
}

/**
 * A live news item, announcement or circular from GET /admin/GetPublicNews/:instituteId (Website
 * Management → News & Notices). Items from before titles existed have `title` null and their
 * headline as the first line of `message` - see shared/news-item.ts.
 */
export interface NewsEntry {
  id: number;
  /** null = news (items from before types existed). */
  type: 'news' | 'announcement' | 'circular' | null;
  title: string | null;
  /** HTML from the dashboard's editor. */
  message: string | null;
  /** The attached PDF's path (/pdf/...). */
  files: string | null;
  /** The cover picture's path (/images/news/...). */
  image: string | null;
  /** The item's date, YYYY-MM-DD. */
  day: string;
}

/**
 * A blog post from GET /admin/GetBlogsDetailsById/:instituteId (published posts only).
 * `blogDetails` is HTML. The optional fields come from the dashboard's blog editor and are
 * null on posts written before it - see shared/blog-post.ts for the fallbacks.
 */
export interface BlogPost {
  id: number | string;
  blogTitle: string;
  blogImage: string;
  blogDate: string;
  authorName: string;
  blogDetails: string;
  slug?: string | null;
  category?: string | null;
  /** Comma-separated. */
  tags?: string | null;
  excerpt?: string | null;
  imageAlt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  attachments?: BlogAttachment[];
  /** Day of the last dashboard edit. */
  updateddate?: string | null;
}

/** A downloadable file attached to a blog post; `url` is a media path. */
export interface BlogAttachment {
  name: string;
  url: string;
  size: number;
}

/** An answer-key notice from GET /admin/GetAllAnswerkey/:instituteId. `message` is HTML;
 *  `files` is a media path or the literal string "null" when there's no download. */
export interface AnswerKeyEntry {
  date: string;
  message: string;
  files: string;
}

/** A magazine issue from GET /admin/GetMagazineList. `files` is the media path to the PDF. */
export interface MagazineIssue {
  title: string;
  files: string;
}

/** Counselling appointment request - POST /admin/SaveCounselingDetails. */
export interface CounsellingPayload {
  name: string;
  division: string;
  email: string;
  phone: string;
  instituteName: string;
  message: string;
}

/** Alumni registration - POST /admin/SaveAlumniDetails (the old site's payload, key for key). */
export interface AlumniPayload {
  instituteName: string;
  alumniName: string;
  alumniCourse: string;
  alumniYear: string;
  contactNumber: string;
  email: string;
  country: string;
  state: string;
  city: string;
  /** Current status: Student / Business / Job / Retired / Other. */
  type: string;
  description: string;
  /** Will attend the Alumni Meet - a 0/1 column. */
  status: 0 | 1;
}

/** A patent record from GET /admin/GetPatentData (purpose splits Utility vs Design). */
export interface Patent {
  applicationname: string;
  title: string;
  applicationnumber: string;
  applicationdate: string;
  patentnumber: string;
  grantdate: string;
  validdate: string;
  purpose: string;
}

/** A copyright record from GET /admin/GetCopyrightData. */
export interface Copyright {
  applicationname: string;
  category: string;
  applicationnumber: string;
  applicationdate: string;
  copyrightnumber: string;
  copyrightdate: string;
  validdate: string;
}

/** A trademark record from GET /admin/GetTrademarkData. */
export interface Trademark {
  applicationname: string;
  class: string;
  applicationnumber: string;
  applicationdate: string;
  trademarkdate: string;
  trademarknumber: string;
  validdate: string;
}

/**
 * Body for POST /admin/SaveGatePassUserList - field names match the legacy
 * backend contract. `role` is 'Visitor' or 'Office'; `institute` is sent only
 * for staff passes.
 */
export interface GatePassPayload {
  name: string;
  purpose: string;
  contact: string;
  meetingWith: string;
  role: 'Visitor' | 'Office';
  institute?: string;
}

/**
 * Body for POST /admin/SaveRahatokarshDonation - field names match the legacy
 * backend contract exactly. Sent after Razorpay confirms the payment.
 */
export interface DonationPayload {
  donnerName: string;
  contact: string;
  email: string;
  city: string;
  donationAmount: number;
  /** Amount in paise (donationAmount × 100), as charged by Razorpay. */
  updatedAmount: number;
  /** Whether the donor requested an 80G tax benefit. */
  benefit: boolean;
  paymentId: string;
  /** 80G tax document; the public site has no upload field, so always null. */
  taxImage: string | null;
}

/**
 * A gallery/banner image from POST /admin/GetImagesByIdDetails ({ institute_id }).
 * The response mixes hero banners and gallery photos; the gallery page keeps only
 * `purpose === 'image'`. `image` is a relative media path - resolve with MediaUrlPipe.
 */
export interface GalleryImage {
  id?: number;
  image: string;
  /** 'image' (gallery photo), 'video', 'slider', 'banner', 'headerbanner' (header promo)… */
  purpose: string;
  title?: string;
  /** Video entries may carry the URL in a dedicated field instead of `image`. */
  video?: string;
  link?: string;
  /**
   * Hero-slider banners only. `image` is the desktop crop (≈1920×520); when the
   * backend also stores a portrait crop (≈1080×1350) it comes back here, else the
   * hero falls back to `image` on mobile. `keywords` is the alt text (legacy field).
   */
  mobileImage?: string;
  keywords?: string;
}

/**
 * A site notice from GET /admin/GetNotificationByIdDetails/:instituteId - the
 * "Notification Or Important Links" list in Website Management. `message` is rich-text
 * HTML (usually one or more links). The dates are DATE columns sent as UTC instants of
 * IST midnight (2026-10-03 → "2026-10-02T18:30:00.000Z"); either may be null.
 */
export interface SiteNotification {
  id: number;
  institute_id: number;
  message: string | null;
  isactive: number | boolean;
  startDate: string | null;
  endDate: string | null;
  createddate: string;
}

/** Application window of a vacancy, worked out by the API (IST): before the start date, open, or past the last date / closed by hand. */
export type CareerStatus = 'upcoming' | 'open' | 'closed';

/** A file in one of a vacancy's document columns. `file` is null for an application form while its vacancy is not open. */
export interface CareerDocument {
  label: string;
  file: string | null;
  isForm: boolean;
}

export interface CareerInstitute {
  name: string;
  url: string;
}

/** A row of the Careers page's Advertisement table (Website Management → Careers). */
export interface CareerVacancy {
  id: number;
  title: string | null;
  institutes: CareerInstitute[];
  /** Advertisement images: /assets/… are the website's own files, anything else is an upload on the API host. */
  images: string[];
  /** YYYY-MM-DD, or null when the vacancy has none. */
  startDate: string | null;
  lastDate: string | null;
  isNew: boolean;
  status: CareerStatus;
  advertisement: CareerDocument[];
  instructions: CareerDocument[];
  requirement: CareerDocument[];
  result: CareerDocument[];
}

/** A row of the Recruitment Notice table; `institutes` and `status` are those of the recruitment it belongs to. */
export interface CareerNotice {
  id: number;
  title: string;
  date: string;
  file: string | null;
  isForm: boolean;
  institutes: CareerInstitute[];
  status: CareerStatus;
}

/** GET /careers/public. `updatedOn` (YYYY-MM-DD) is when the page last changed. */
export interface CareersPage {
  updatedOn: string | null;
  vacancies: CareerVacancy[];
  notices: CareerNotice[];
}

/** A tender on the Tenders page (Website Management → Tenders), from GET /tenders/public, newest first. */
export interface TenderItem {
  id: number;
  title: string;
  tenderNo: string | null;
  department: string | null;
  category: 'Goods' | 'Services' | 'Works' | null;
  /** YYYY-MM-DD, or null. */
  startDate: string | null;
  endDate: string | null;
  /** HH:mm closing time on the end date (IST); null = end of that day. */
  endTime: string | null;
  /** Worked out by the API (IST): before the start date, between the dates, or past the closing time / closed by hand. */
  status: 'upcoming' | 'open' | 'closed';
  documents: { label: string; file: string }[];
}

/**
 * The footer's visitor counter (Website Management → Visitor Counter), from POST
 * /visitors/public/check-in. `show: false` = the institute has it switched off (no numbers then);
 * a null number is one it chose not to show.
 */
export interface VisitorCounter {
  show: boolean;
  /** Starting count + every visitor counted (one browser per day). */
  total?: number;
  today?: number | null;
  /** On the website in the last 2 minutes. */
  online?: number | null;
}
