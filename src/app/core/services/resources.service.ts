import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SKIP_ERROR_REDIRECT } from '../interceptors/error.interceptor';
import { AnswerKeyEntry, BeneficiaryStudent, BlogPost, Copyright, CounsellingPayload, DonationPayload, Donor, GatePassPayload, Institute, MagazineIssue, MicroDonor, NavratriEntry, NavratriImage, Patent, PodcastEntry, Trademark } from '../../shared/models/models';


@Injectable({
    providedIn: 'root'
})
export class ResourcesService {
    constructor(
        private router: Router,
        public http: HttpClient,
        public apiService: ApiService
    ) { }



    // Rahatokarsh Fund lists — the legacy endpoints return bare arrays.
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
    // save failure surfaces inline — the money is already taken, we must never
    // silently bounce the donor to the error page and lose the payment id.
    saveDonation(payload: DonationPayload) {
        return this.http.post(ApiService.SaveRahatokarshDonationURL, payload, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Upload a PAN card image (multipart) for an 80G claim; returns the stored
    // reference to send back in the donation payload's `taxImage`. Let HttpClient
    // set the multipart Content-Type/boundary — do not set it manually.
    uploadTaxImage(form: FormData) {
        return this.http.post<string>(ApiService.Upload80GTaxImageURL, form, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // e-Gate Pass — institute dropdown (staff tab) and request submission.
    getInstitutes() {
        return this.http.get<Institute[]>(ApiService.GetInstitutesURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    saveGatePass(payload: GatePassPayload) {
        return this.http.post(ApiService.SaveGatePassURL, payload, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Counselling — book an appointment. Institute list reuses getInstitutes().
    saveCounseling(payload: CounsellingPayload) {
        return this.http.post(ApiService.SaveCounselingURL, payload, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Navratri — the yearly celebration list and a year's gallery images.
    getNavratriList() {
        return this.http.get<NavratriEntry[]>(ApiService.GetNavratriListURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    getNavratriImages(id: number | string) {
        return this.http.get<NavratriImage[]>(ApiService.GetNavratriImagesURL + id, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Podcast — CES "NextUp" episodes; the page keeps only the active ones.
    getPodcastList() {
        return this.http.get<PodcastEntry[]>(ApiService.GetPodcastListURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Blog — posts for an institute (defaults to the society itself).
    getBlogs(instituteId: number | string) {
        return this.http.get<BlogPost[]>(ApiService.GetBlogsURL + instituteId, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Answer keys — exam-cell notices for an institute (defaults to the society).
    getAnswerKeys(instituteId: number | string) {
        return this.http.get<AnswerKeyEntry[]>(ApiService.GetAnswerkeyURL + instituteId, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
    }

    // Magazine — the society-wide Balmitra magazine archive.
    getMagazines() {
        return this.http.get<MagazineIssue[]>(ApiService.GetMagazineURL, {
            context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
        });
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

    // Public Website Newsroom
    getPublicNews(params?: { page?: number; limit?: number; category?: string; search?: string }) {
        let httpParams = new HttpParams();
        if (params?.page) httpParams = httpParams.set('page', params.page.toString());
        if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
        if (params?.category) httpParams = httpParams.set('category', params.category);
        if (params?.search) httpParams = httpParams.set('search', params.search);
        return this.http.get(ApiService.GetPublicNewsURL, { params: httpParams });
    }

    getPublicFeaturedNews(limit = 3) {
        const httpParams = new HttpParams().set('limit', limit.toString());
        return this.http.get(ApiService.GetPublicNewsFeaturedURL, { params: httpParams });
    }

    getPublicNewsCategories() {
        return this.http.get(ApiService.GetPublicNewsCategoriesURL);
    }

    getPublicNewsBySlug(slug: string) {
        return this.http.get(ApiService.GetPublicNewsBySlugURL + slug);
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

    // Public Website Pricing — active, non-private subscription plans.
    getPublicPlans() {
        return this.http.get(ApiService.GetPublicPlansURL);
    }

    // Public Website Newsletter
    subscribeNewsletter(email: string, source: string = 'website') {
        return this.http.post(ApiService.SubscribeNewsletterURL, { email, source });
    }

    // Ceadx AI assistant. `history` is prior turns for context; the backend only
    // reads the most recent few. Off-topic questions come back with grounded:false
    // and the fallback message already in `text`.
    askAssistant(message: string, history: { role: 'user' | 'assistant'; text: string }[] = []) {
        return this.http.post(ApiService.AssistantChatURL, { message, history });
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
