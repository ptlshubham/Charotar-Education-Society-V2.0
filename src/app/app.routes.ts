import { Routes } from '@angular/router';
import { seoResolver } from './core/resolvers/seo.resolver';

/** Every static page declares a `seoKey`; it maps to a page entry in super admin. */
const seo = (seoKey: string) => ({
  data: { seoKey },
  resolve: { seo: seoResolver },
});

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
      {
        path: '',
        ...seo('home'),
        loadComponent: () => import('./pages/home/index/index').then(m => m.Index)
      },
      {
        // The header, footer and every breadcrumb link to /home (the legacy site's
        // canonical home path). Redirect rather than duplicate the route so there
        // is only one indexable home page.
        path: 'home',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'about',
        ...seo('about'),
        loadComponent: () => import('./pages/about-us/index/index').then(m => m.Index)
      },
      {
        path: 'team',
        ...seo('team'),
        loadComponent: () => import('./pages/team/index/index').then(m => m.Index)
      },
      {
        path: 'management',
        ...seo('management'),
        loadComponent: () => import('./pages/management/index/index').then(m => m.Index)
      },
      {
        path: 'celebration',
        ...seo('celebration'),
        loadComponent: () => import('./pages/celebration/index/index').then(m => m.Index)
      },
      {
        path: 'social-activity',
        ...seo('social-activity'),
        loadComponent: () => import('./pages/social-activity/index/index').then(m => m.Index)
      },
      {
        path: 'project',
        ...seo('project'),
        loadComponent: () => import('./pages/project/index/index').then(m => m.Index)
      },
      {
        path: 'alumni',
        ...seo('alumni'),
        loadComponent: () => import('./pages/alumni/index/index').then(m => m.Index)
      },
      {
        path: 'more/news',
        ...seo('more/news'),
        loadComponent: () => import('./pages/news/news').then(m => m.News)
      },
      {
        path: 'more/campus',
        ...seo('more/campus'),
        loadComponent: () => import('./pages/campuses/campuses').then(m => m.Campuses)
      },
      {
        path: 'more/faqs',
        ...seo('more/faqs'),
        loadComponent: () => import('./pages/faqs/faqs').then(m => m.Faqs)
      },
      {
        path: 'counselling',
        ...seo('counselling'),
        loadComponent: () => import('./pages/counselling/counselling').then(m => m.Counselling)
      },
      {
        path: 'more/gate-pass',
        ...seo('more/gate-pass'),
        loadComponent: () => import('./pages/gate-pass/gate-pass').then(m => m.GatePass)
      },
      {
        path: 'more/tenders',
        ...seo('more/tenders'),
        loadComponent: () => import('./pages/tenders/tenders').then(m => m.Tenders)
      },
      {
        path: 'more/career',
        ...seo('more/career'),
        loadComponent: () => import('./pages/careers/careers').then(m => m.Careers)
      },
      // ─── Policies (one component, five content sets) ───
      {
        path: 'more/policy',
        resolve: { seo: seoResolver },
        data: { seoKey: 'more/policy', policy: 'privacy' },
        loadComponent: () => import('./pages/policies/policy-page/policy-page').then(m => m.PolicyPage)
      },
      {
        path: 'more/terms',
        resolve: { seo: seoResolver },
        data: { seoKey: 'more/terms', policy: 'terms' },
        loadComponent: () => import('./pages/policies/policy-page/policy-page').then(m => m.PolicyPage)
      },
      {
        path: 'more/refund-cancellation-policy',
        resolve: { seo: seoResolver },
        data: { seoKey: 'more/refund-cancellation-policy', policy: 'refund' },
        loadComponent: () => import('./pages/policies/policy-page/policy-page').then(m => m.PolicyPage)
      },
      {
        path: 'more/website-terms',
        resolve: { seo: seoResolver },
        data: { seoKey: 'more/website-terms', policy: 'website-terms' },
        loadComponent: () => import('./pages/policies/policy-page/policy-page').then(m => m.PolicyPage)
      },
      {
        path: 'more/disclosure-policy',
        resolve: { seo: seoResolver },
        data: { seoKey: 'more/disclosure-policy', policy: 'disclosure' },
        loadComponent: () => import('./pages/policies/policy-page/policy-page').then(m => m.PolicyPage)
      },
      {
        path: 'ipcell',
        ...seo('ipcell'),
        loadComponent: () => import('./pages/ipcell/ipcell').then(m => m.Ipcell)
      },
      // ─── Student Corner ───
      {
        path: 'more/answer-key',
        ...seo('more/answer-key'),
        loadComponent: () => import('./pages/student-corner/answer-key/answer-key').then(m => m.AnswerKey)
      },
      {
        path: 'more/magazine',
        ...seo('more/magazine'),
        loadComponent: () => import('./pages/student-corner/magazine/magazine').then(m => m.Magazine)
      },
      // ─── Blog ───
      {
        path: 'home/blog',
        ...seo('home/blog'),
        loadComponent: () => import('./pages/blog/list/list').then(m => m.BlogList)
      },
      {
        path: 'home/blog/:slug',
        loadComponent: () => import('./pages/blog/detail/detail').then(m => m.BlogDetail)
      },
      // ─── Media ───
      {
        path: 'glory/gallery',
        ...seo('glory/gallery'),
        loadComponent: () => import('./pages/media/gallery/gallery').then(m => m.Gallery)
      },
      {
        path: 'navratri',
        ...seo('navratri'),
        loadComponent: () => import('./pages/media/navratri/navratri').then(m => m.Navratri)
      },
      {
        path: 'navratri/:year',
        loadComponent: () => import('./pages/media/navratri-detail/navratri-detail').then(m => m.NavratriDetail)
      },
      {
        path: 'podcast',
        ...seo('podcast'),
        loadComponent: () => import('./pages/media/podcast/podcast').then(m => m.Podcast)
      },
      // ─── Academic ───
      {
        path: 'academic/school',
        ...seo('academic/school'),
        loadComponent: () => import('./pages/academic/school/school').then(m => m.School)
      },
      {
        path: 'academic/colleges',
        ...seo('academic/colleges'),
        loadComponent: () => import('./pages/academic/colleges/colleges').then(m => m.Colleges)
      },
      {
        path: 'academic/hostels',
        ...seo('academic/hostels'),
        loadComponent: () => import('./pages/academic/hostels/hostels').then(m => m.Hostels)
      },
      {
        path: 'academic/others',
        ...seo('academic/others'),
        loadComponent: () => import('./pages/academic/others/others').then(m => m.Others)
      },
      // ─── Rahatokarsh Fund ───
      {
        path: 'fund',
        ...seo('fund'),
        loadComponent: () => import('./pages/rahatokarsh/fund/fund').then(m => m.Fund)
      },
      {
        path: 'donation',
        ...seo('donation'),
        loadComponent: () => import('./pages/rahatokarsh/donation/donation').then(m => m.Donation)
      },
      {
        path: 'beneficiary-students',
        ...seo('beneficiary-students'),
        loadComponent: () => import('./pages/rahatokarsh/beneficiary-students/beneficiary-students').then(m => m.BeneficiaryStudents)
      },
      {
        path: 'donner-list',
        ...seo('donner-list'),
        loadComponent: () => import('./pages/rahatokarsh/donor-list/donor-list').then(m => m.DonorList)
      },
      {
        path: 'micro-donner',
        ...seo('micro-donner'),
        loadComponent: () => import('./pages/rahatokarsh/micro-donor-list/micro-donor-list').then(m => m.MicroDonorList)
      },
      {
        // The HTML sitemap for humans. The machine-readable one is the static
        // public/sitemap.xml, generated by scripts/generate-site-files.mjs.
        path: 'sitemap',
        ...seo('sitemap'),
        loadComponent: () => import('./pages/sitemap/sitemap').then(m => m.Sitemap)
      },
      {
        path: 'support',
        loadComponent: () => import('./pages/support/support.component').then(m => m.SupportComponent),
        children: [
          { path: '', ...seo('support'), loadComponent: () => import('./pages/support/support-center/support-center').then(m => m.SupportCenter) },
          { path: 'privacy-policy', ...seo('support/privacy-policy'), loadComponent: () => import('./pages/support/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy) },
          { path: 'terms-of-service', ...seo('support/terms-of-service'), loadComponent: () => import('./pages/support/terms-of-service/terms-of-service').then(m => m.TermsOfService) },
          { path: 'cookie-policy', ...seo('support/cookie-policy'), loadComponent: () => import('./pages/support/cookie-policy/cookie-policy').then(m => m.CookiePolicy) },
          { path: 'website-terms', ...seo('support/website-terms'), loadComponent: () => import('./pages/support/website-terms/website-terms').then(m => m.WebsiteTerms) },
          { path: 'faq', ...seo('support/faq'), loadComponent: () => import('./pages/support/faq/faq').then(m => m.Faq) }
        ]
      },
      {
        path: 'company',
        loadComponent: () => import('./pages/company/company.component').then(m => m.CompanyComponent),
        children: [
          { path: '', redirectTo: 'careers', pathMatch: 'full' },
          { path: 'careers', ...seo('company/careers'), loadComponent: () => import('./pages/company/careers/careers').then(m => m.Careers) }
        ]
      },
      {
        path: 'contact',
        ...seo('contact'),
        loadComponent: () => import('./pages/contact-us/index/index').then(m => m.Index)
      },
      {
        path: 'error',
        loadComponent: () => import('./pages/error/error.component').then(m => m.ErrorComponent),
        children: [
          { path: 'error404', ...seo('error/error404'), loadComponent: () => import('./pages/error/error404/error404').then(m => m.Error404) },
          { path: 'error500', ...seo('error/error500'), loadComponent: () => import('./pages/error/error500/error500').then(m => m.Error500) },
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'error/error404',
    pathMatch: 'full'
  },
] as const;
