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
  // Rahatokarsh Fund — public lists. Endpoints carried over from the legacy CES
  // backend; adjust the paths if the new backend exposes them differently.
  public static GetDonorListURL: string = ApiService.HOST_URL + '/admin/GetAllDonnerList';
  public static GetMicroDonorListURL: string = ApiService.HOST_URL + '/admin/GetRahatokarshDonationList';
  public static GetBeneficiaryListURL: string = ApiService.HOST_URL + '/admin/GetAllBeneficiaryList';
  // Save a completed Rahatokarsh Fund donation (after Razorpay payment succeeds).
  public static SaveRahatokarshDonationURL: string = ApiService.HOST_URL + '/admin/SaveRahatokarshDonation';
  // Upload a donor's PAN card image for an 80G tax-benefit claim.
  public static Upload80GTaxImageURL: string = ApiService.HOST_URL + '/admin/Upload80GTaxImage';
  // e-Gate Pass — institute dropdown + request submission.
  public static GetInstitutesURL: string = ApiService.HOST_URL + '/admin/GetAllInstituteDetails';
  public static SaveGatePassURL: string = ApiService.HOST_URL + '/admin/SaveGatePassUserList';
  // Navratri — yearly celebrations + per-year gallery images.
  public static GetNavratriListURL: string = ApiService.HOST_URL + '/admin/GetAllNavratriDetails';
  public static GetNavratriImagesURL: string = ApiService.HOST_URL + '/admin/GetNavratriImagesById/';
  // Podcast — CES "NextUp" episodes (YouTube links); page renders only active ones.
  public static GetPodcastListURL: string = ApiService.HOST_URL + '/admin/GetAllPodcastDetails';
  // IP Cell — patent (Utility/Design), copyright and trademark registers.
  public static GetPatentDataURL: string = ApiService.HOST_URL + '/admin/GetPatentData';
  public static GetCopyrightDataURL: string = ApiService.HOST_URL + '/admin/GetCopyrightData';
  public static GetTrademarkDataURL: string = ApiService.HOST_URL + '/admin/GetTrademarkData';

  // Public Website SEO URL (per-page meta tags + sitewide defaults)
  public static GetPublicSeoURL: string = ApiService.HOST_URL + '/superAdmin/website-control/seo/public/all';

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

