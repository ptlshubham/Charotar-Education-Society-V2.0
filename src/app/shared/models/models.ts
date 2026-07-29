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
}

/** A beneficiary student row, as returned by GET /admin/GetAllBeneficiaryList. */
export interface BeneficiaryStudent {
  studentName: string;
  instituteName: string;
  course: string;
  /** Fee-refund percentage as the backend sends it — already formatted, e.g. "50%". */
  refundAmount: string | number;
  /** Academic/financial year the support was granted, e.g. "2025-26". */
  year: string;
}

/** An institute, as returned by GET /admin/GetAllInstituteDetails. */
export interface Institute {
  name: string;
}

/** A yearly Navratri celebration, as returned by GET /admin/GetAllNavratriDetails. */
export interface NavratriEntry {
  id: number | string;
  title: string;
  year: number | string;
  /** Rich theme description (HTML). */
  themedetails: string;
  /** Relative cover image path — resolve with the `mediaUrl` pipe. */
  coverimage: string;
}

/** A gallery image for a Navratri year, from GET /admin/GetNavratriImagesById/:id. */
export interface NavratriImage {
  thumb?: string;
  image?: string;
  original?: string;
  path?: string;
}

/** A CES podcast episode from GET /admin/GetAllPodcastDetails. */
export interface PodcastEntry {
  link: string;
  title: string;
  isactive: boolean;
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
 * Body for POST /admin/SaveGatePassUserList — field names match the legacy
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
 * Body for POST /admin/SaveRahatokarshDonation — field names match the legacy
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
