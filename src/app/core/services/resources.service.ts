import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';


@Injectable({
    providedIn: 'root'
})
export class ResourcesService {
    constructor(
        private router: Router,
        public http: HttpClient,
        public apiService: ApiService
    ) { }



    // Public Website Blogs
    getPublicBlogs(params?: { page?: number; limit?: number; category?: string; tag?: string; search?: string }) {
        let httpParams = new HttpParams();
        if (params?.page) httpParams = httpParams.set('page', params.page.toString());
        if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
        if (params?.category) httpParams = httpParams.set('category', params.category);
        if (params?.tag) httpParams = httpParams.set('tag', params.tag);
        if (params?.search) httpParams = httpParams.set('search', params.search);
        return this.http.get(ApiService.GetPublicBlogsURL, { params: httpParams });
    }

    getPublicBlogBySlug(slug: string) {
        return this.http.get(ApiService.GetPublicBlogBySlugURL + slug);
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
