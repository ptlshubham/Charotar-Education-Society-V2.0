import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public static HOST_URL: string = environment.apiUrl;
  public static FRONTEND_URL: string = environment.frontendUrl;
  constructor() {
  }
  httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  // Public Website SEO URL (per-page meta tags + sitewide defaults)
  public static GetPublicSeoURL: string = ApiService.HOST_URL + '/superAdmin/website-control/seo/public/all';

  // Public Website Blog URLs
  public static GetPublicBlogsURL: string = ApiService.HOST_URL + '/superAdmin/website-control/blog-management/public/blogs';
  public static GetPublicBlogBySlugURL: string = ApiService.HOST_URL + '/superAdmin/website-control/blog-management/public/blogs/';

  // Public Website Video Guide (Tutorials) URLs
  public static GetPublicVideosURL: string = ApiService.HOST_URL + '/superAdmin/help-center/video-guide/public/videos';
  public static GetPublicVideoByIdURL: string = ApiService.HOST_URL + '/superAdmin/help-center/video-guide/public/videos/';

  // Public Website Newsroom URLs
  public static GetPublicNewsURL: string = ApiService.HOST_URL + '/superAdmin/website-control/newsroom/public/news';
  public static GetPublicNewsFeaturedURL: string = ApiService.HOST_URL + '/superAdmin/website-control/newsroom/public/news/featured';
  public static GetPublicNewsCategoriesURL: string = ApiService.HOST_URL + '/superAdmin/website-control/newsroom/public/news-categories';
  public static GetPublicNewsBySlugURL: string = ApiService.HOST_URL + '/superAdmin/website-control/newsroom/public/news/';

  // Public Website Community URLs
  public static GetCommunityDiscussionsURL: string = ApiService.HOST_URL + '/superAdmin/help-center/community/public/discussions';
  public static GetCommunityCategoriesURL: string = ApiService.HOST_URL + '/superAdmin/help-center/community/public/categories';
  public static GetCommunityStatsURL: string = ApiService.HOST_URL + '/superAdmin/help-center/community/public/stats';

  // Public Website Feature Request URLs
  public static GetPublicFeatureRequestsURL: string = ApiService.HOST_URL + '/superAdmin/help-center/feature-request/public/list';
  public static GetFeatureRequestStatsURL: string = ApiService.HOST_URL + '/superAdmin/help-center/feature-request/public/stats';
  public static GetFeatureRequestRoadmapURL: string = ApiService.HOST_URL + '/superAdmin/help-center/feature-request/public/roadmap';
  public static SubmitFeatureRequestURL: string = ApiService.HOST_URL + '/superAdmin/help-center/feature-request/public/submit';
  public static VoteFeatureRequestURL: string = ApiService.HOST_URL + '/superAdmin/help-center/feature-request/public/'; // + :id/vote

  // Public Website Pricing URL — the same active, non-private plan list the portal's
  // purchase flow reads. Unauthenticated by design.
  public static GetPublicPlansURL: string = ApiService.HOST_URL + '/superAdmin/subscription-plan/getSubscriptionPlans';

  // Public Website Newsletter URL
  public static SubscribeNewsletterURL: string = ApiService.HOST_URL + '/superAdmin/website-control/newsletter/public/subscribe';

  // Public Website Contact URL
  public static SubmitContactURL: string = ApiService.HOST_URL + '/superAdmin/website-control/contact/public/submit';

  // Public Website Schedule Demo URL
  public static SubmitScheduleDemoURL: string = ApiService.HOST_URL + '/superAdmin/website-control/schedule-demo/public/submit';

  // Ceadx AI assistant — answers only from indexed website content.
  public static AssistantChatURL: string = ApiService.HOST_URL + '/api/public/v1/assistant/chat';
}

