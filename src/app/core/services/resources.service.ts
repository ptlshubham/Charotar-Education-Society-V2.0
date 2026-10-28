import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, shareReplay, tap } from 'rxjs';
import { ApiService } from './api.service';
import { SKIP_ERROR_REDIRECT } from '../interceptors/error.interceptor';
import { AlumniPayload, AnswerKeyEntry, BeneficiaryStudent, BlogPost, CareersPage, TenderItem, Copyright, CounsellingPayload, DonationPayload, Donor, GalleryImage, GatePassPayload, Institute, MagazineIssue, MicroDonor, NavratriEntry, NewsEntry, NavratriImage, NavratriPage, NavratriLiveLink, Patent, PodcastEntry, SiteNotification, SitePopup, Trademark, VisitorCounter } from '../../shared/models/models';


@Injectable({
    providedIn: 'root'
})
export class ResourcesService {
    constructor(
        private router: Router,
        public http: HttpClient,
        public apiService: ApiService
    ) { }



    // Rahatokarsh Fund lists - the legacy endpoints return bare arrays.
    // SKIP_ERROR_REDIRECT so a failure shows an inline message instead of
    // bouncing the whole page to the error screen.
    getDonorList() {
        return this.http.get<Donor[]>(ApiService.GetDonorListURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    getMicroDonorList() {
        return this.http.get<MicroDonor[]>(ApiService.GetMicroDonorListURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    getBeneficiaryList() {
        return this.http.get<BeneficiaryStudent[]>(ApiService.GetBeneficiaryListURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Persist a donation once Razorpay confirms payment. SKIP_ERROR_REDIRECT so a
    // save failure surfaces inline - the money is already taken, we must never
    // silently bounce the donor to the error page and lose the payment id.
    saveDonation(payload: DonationPayload) {
        return this.http.post(ApiService.SaveRahatokarshDonationURL, payload, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Upload a PAN card image (multipart) for an 80G claim; returns the stored
    // reference to send back in the donation payload's `taxImage`. Let HttpClient
    // set the multipart Content-Type/boundary - do not set it manually.
    uploadTaxImage(form: FormData) {
        return this.http.post<string>(ApiService.Upload80GTaxImageURL, form, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // e-Gate Pass - institute dropdown (staff tab) and request submission.
    getInstitutes() {
        return this.http.get<Institute[]>(ApiService.GetInstitutesURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    /**
     * Institute names for a form's dropdown (e-Gate Pass, alumni). The backend list carries
     * duplicate and test rows (e.g. two "E2E Sync Inst"), so names are trimmed, blanks dropped,
     * de-duplicated case-insensitively and sorted. Genuine test entries still need removing at the source.
     */
    getInstituteNames(): Observable<string[]> {
        return this.getInstitutes().pipe(
            map((list) => {
                const seen = new Set<string>();
                return (Array.isArray(list) ? list : [])
                    .map((i) => (i?.name ?? '').trim())
                    .filter((name) => {
                        const key = name.toLowerCase();
                        if (!name || seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    })
                    .sort((a, b) => a.localeCompare(b));
            }),
        );
    }

    // Careers page (Website Management → Careers). Kept out of the transfer cache (app.config)
    // so the browser always shows the live list, not the one baked in at build time.
    getCareers() {
        return this.http.get<{ data: CareersPage }>(ApiService.GetPublicCareersURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        }).pipe(map((res) => res.data));
    }

    // Tenders page (Website Management → Tenders), also kept out of the transfer cache.
    getTenders() {
        return this.http.get<{ data: TenderItem[] }>(ApiService.GetPublicTendersURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        }).pipe(map((res) => res.data));
    }

    // Footer visitor counter (Website Management → Visitor Counter): counts this browser's visit
    // (once a day), keeps it in "online now" and returns what the footer shows.
    // SKIP_ERROR_REDIRECT so a failure only leaves the counter out.
    visitorCheckIn(instituteId: number, visitorId: string) {
        return this.http.post<{ data: VisitorCounter }>(ApiService.VisitorCheckInURL, { instituteId, visitorId }, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        }).pipe(map((res) => res.data));
    }

    // Announcement popup (Website Management → Website Popup): null when there is none to show.
    // SKIP_ERROR_REDIRECT so a failure only leaves the popup out.
    getSitePopup(instituteId: number) {
        return this.http.get<{ data: SitePopup | null }>(ApiService.SitePopupURL, {
            params: new HttpParams().set('instituteId', instituteId),
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        }).pipe(map((res) => res.data));
    }

    saveGatePass(payload: GatePassPayload) {
        return this.http.post(ApiService.SaveGatePassURL, payload, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Alumni registration. Answers "success", or "error" (still HTTP 200) when the insert fails.
    saveAlumni(payload: AlumniPayload) {
        return this.http.post<string>(ApiService.SaveAlumniDetailsURL, payload, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Counselling - book an appointment. Institute list reuses getInstitutes().
    saveCounseling(payload: CounsellingPayload) {
        return this.http.post(ApiService.SaveCounselingURL, payload, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Navratri - the yearly celebration list and a year's gallery images.
    getNavratriList() {
        return this.http.get<NavratriEntry[]>(ApiService.GetNavratriListURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    getNavratriPage() {
        return this.http.get<NavratriPage | null>(ApiService.GetNavratriPageURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    getNavratriImages(id: number | string) {
        return this.http.get<NavratriImage[]>(ApiService.GetNavratriImagesURL + id, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    getNavratriLiveLinks() {
        return this.http.get<NavratriLiveLink[]>(ApiService.GetNavratriLiveLinksURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Podcast - CES "NextUp" episodes; the page keeps only the active ones.
    getPodcastList() {
        return this.http.get<PodcastEntry[]>(ApiService.GetPodcastListURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Blog - posts for an institute (defaults to the society itself).
    getBlogs(instituteId: number | string) {
        return this.http.get<BlogPost[]>(ApiService.GetBlogsURL + instituteId, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Notices for an institute - every row, active or not; the ticker picks the live ones.
    getNotifications(instituteId: number | string) {
        return this.http.get<SiteNotification[]>(ApiService.GetNotificationsURL + instituteId, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Answer keys - exam-cell notices for an institute (defaults to the society).
    getAnswerKeys(instituteId: number | string) {
        return this.http.get<AnswerKeyEntry[]>(ApiService.GetAnswerkeyURL + instituteId, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Magazine - the society-wide Balmitra magazine archive.
    getMagazines() {
        return this.http.get<MagazineIssue[]>(ApiService.GetMagazineURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Gallery - banner/image list for an institute (defaults to the society). The
    // legacy backend takes { institute_id } and returns a mixed list; the gallery
    // page keeps only purpose === 'image'.
    getGalleryImages(instituteId: number | string) {
        return this.http.post<GalleryImage[]>(
            ApiService.GetGalleryImagesURL,
            { institute_id: instituteId },
            { context: new HttpContext().set(SKIP_ERROR_REDIRECT, true) },
        );
    }

    /**
     * An institute's active images (all purposes), fetched once per visit and shared by the home
     * hero and the header banner, which both read from it. A failed request isn't kept, so the next
     * caller tries again. SKIP_ERROR_REDIRECT so a failure only leaves those banners out.
     */
    private readonly bannerImages = new Map<string, Observable<GalleryImage[]>>();

    private activeImages(instituteId: number | string): Observable<GalleryImage[]> {
        const key = String(instituteId);
        let list$ = this.bannerImages.get(key);
        if (!list$) {
            list$ = this.http.post<GalleryImage[]>(
                ApiService.GetGalleryImagesURL,
                { institute_id: instituteId },
                { context: new HttpContext().set(SKIP_ERROR_REDIRECT, true) },
            ).pipe(
                tap({ error: () => this.bannerImages.delete(key) }),
                shareReplay({ bufferSize: 1, refCount: false }),
            );
            this.bannerImages.set(key, list$);
        }
        return list$;
    }

    /** Active images of one purpose that have a file, newest first (highest id). */
    private bannersOf(instituteId: number | string, purposes: readonly string[]) {
        return this.activeImages(instituteId).pipe(
            map((list) =>
                (list ?? [])
                    .filter((b) => purposes.includes(b.purpose) && !!b.image)
                    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
            ),
        );
    }

    // Home hero banners - purpose 'slider' (legacy 'banner'), as the legacy admin site loaded them.
    getSliderBanners(instituteId: number | string) {
        return this.bannersOf(instituteId, ['slider', 'banner']);
    }

    // Header banners - the small rotating banners beside the logo, purpose 'headerbanner'
    // (Website Management → Image Uploader → Header Banner, 440×128, optional link).
    getHeaderBanners(instituteId: number | string) {
        return this.bannersOf(instituteId, ['headerbanner']);
    }

    // IP Cell registers. Patents come back mixed; the page splits them by `purpose`.
    getPatentData() {
        return this.http.get<Patent[]>(ApiService.GetPatentDataURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    getCopyrightData() {
        return this.http.get<Copyright[]>(ApiService.GetCopyrightDataURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    getTrademarkData() {
        return this.http.get<Trademark[]>(ApiService.GetTrademarkDataURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Public Website Video Guides (Tutorials)
    getPublicVideos(params?: { page?: number; limit?: number; category?: string; module?: string; search?: string }) {
        let httpParams = new HttpParams();
        if (params?.page) httpParams = httpParams.set('page', params.page.toString());
        if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
        if (params?.category) httpParams = httpParams.set('category', params.category);
        if (params?.module) httpParams = httpParams.set('module', params.module);
        if (params?.search) httpParams = httpParams.set('search', params.search);
        return this.http.get(ApiService.GetPublicVideosURL, { params: httpParams });
    }

    getPublicVideoById(id: string) {
        return this.http.get(ApiService.GetPublicVideoByIdURL + id);
    }

    // News & Notices - an institute's live news, announcements and circulars, newest first.
    getNews(instituteId: number | string) {
        return this.http.get<NewsEntry[]>(ApiService.GetNewsURL + instituteId, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Public Website Community
    getCommunityDiscussions(params?: { page?: number; limit?: number; tab?: string; category?: string; search?: string }) {
        let httpParams = new HttpParams();
        if (params?.page) httpParams = httpParams.set('page', params.page.toString());
        if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
        if (params?.tab) httpParams = httpParams.set('tab', params.tab);
        if (params?.category) httpParams = httpParams.set('category', params.category);
        if (params?.search) httpParams = httpParams.set('search', params.search);
        return this.http.get(ApiService.GetCommunityDiscussionsURL, { params: httpParams });
    }

    getCommunityCategories() {
        return this.http.get(ApiService.GetCommunityCategoriesURL);
    }

    getCommunityStats() {
        return this.http.get(ApiService.GetCommunityStatsURL);
    }

    // Public Website Feature Requests
    getPublicFeatureRequests(params?: { page?: number; limit?: number; category?: string; status?: string; search?: string; sort?: string }) {
        let httpParams = new HttpParams();
        if (params?.page) httpParams = httpParams.set('page', params.page.toString());
        if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
        if (params?.category) httpParams = httpParams.set('category', params.category);
        if (params?.status) httpParams = httpParams.set('status', params.status);
        if (params?.search) httpParams = httpParams.set('search', params.search);
        if (params?.sort) httpParams = httpParams.set('sort', params.sort);
        return this.http.get(ApiService.GetPublicFeatureRequestsURL, { params: httpParams });
    }

    getFeatureRequestStats() {
        return this.http.get(ApiService.GetFeatureRequestStatsURL);
    }

    getFeatureRequestRoadmap(limit = 5) {
        const httpParams = new HttpParams().set('limit', limit.toString());
        return this.http.get(ApiService.GetFeatureRequestRoadmapURL, { params: httpParams });
    }

    submitFeatureRequest(payload: { title: string; description: string; category?: string; submittedName?: string; submittedEmail?: string }) {
        return this.http.post(ApiService.SubmitFeatureRequestURL, payload);
    }

    voteFeatureRequest(id: string) {
        return this.http.post(ApiService.VoteFeatureRequestURL + id + '/vote', {});
    }

    // Public Website Pricing - active, non-private subscription plans.
    getPublicPlans() {
        return this.http.get(ApiService.GetPublicPlansURL);
    }

    // Newsletter sign-up for an institute's list. `source` says which box: news, blog, coming-soon:<section> ...
    subscribeNewsletter(email: string, source: string, instituteId: number) {
        return this.http.post(ApiService.SubscribeNewsletterURL, { email, source, instituteId }, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Dyuno study assistant. `history` is prior turns for context; the backend only
    // reads the most recent few. Off-topic questions come back as a normal reply with
    // the redirect already in `text`. SKIP_ERROR_REDIRECT so a failure shows in the
    // chat instead of replacing the page with the error screen.
    // visitorId: Dyuno's anonymous per-browser id - the backend's fair-use limit is per browser,
    // because a whole college lab or mobile network can share one IP.
    askAssistant(message: string, history: { role: 'user' | 'assistant'; text: string }[] = [], visitorId?: string) {
        return this.http.post(ApiService.AssistantChatURL, { message, history, visitorId }, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Dyuno shared-chat links. Each turn carries the signature the chat endpoint gave its answer;
    // the backend keeps only the turns that verify. Errors stay with the caller (dialog / page).
    shareAssistantChat(turns: { question: string; answer: string; sig: string }[]) {
        return this.http.post(ApiService.AssistantShareURL, { turns }, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    getSharedAssistantChat(id: string) {
        return this.http.get(`${ApiService.AssistantShareURL}/${encodeURIComponent(id)}`, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Public Website Contact form
    submitContactForm(payload: { fullName: string; email: string; phone?: string; subject?: string; message: string }, source: string = 'contact') {
        return this.http.post(ApiService.SubmitContactURL, { ...payload, source });
    }

    // Public Website Schedule Demo form
    submitScheduleDemo(payload: {
        workEmail: string; firstName: string; lastName: string; company?: string; phone?: string;
        jobFunction?: string; jobLevel?: string; country?: string; consent?: boolean;
    }, source: string = 'schedule-demo') {
        return this.http.post(ApiService.SubmitScheduleDemoURL, { ...payload, source });
    }
}
