import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SOCIAL_LINKS } from '../../shared/social-links';

interface FooterLink {
  label: string;
  /** Internal route, or an absolute URL for the staff dashboard. */
  route?: string;
  href?: string;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Footer {
  readonly currentYear = new Date().getFullYear();
  readonly socials = SOCIAL_LINKS;

  readonly email = 'cesociety@cesociety.in';
  readonly phone = '(02692) - 243083';
  readonly phoneHref = 'tel:02692243083';
  readonly address = 'D. N. High School Campus, Station Road, Anand - 388001, Gujarat, India';

  /** Same host in every environment on the legacy site, so it lives here rather than environment.ts. */
  private static readonly DASHBOARD_URL = 'https://dashboard.cesociety.in';

  /**
   * Every `route` here must resolve — a footer link to a dead route sends the
   * visitor to the 404 page on every single page of the site. The legacy site's
   * Delivery Shipping, Pricing Structure, Self Assessment and Non-Teaching
   * Assessment links were dropped for exactly that reason: those pages do not
   * exist in this build yet. Re-add them here when they are built.
   */
  readonly columns: ReadonlyArray<{ title: string; links: FooterLink[] }> = [
    {
      title: 'Explore',
      links: [
        { label: 'Privacy Policy', route: '/support/privacy-policy' },
        { label: 'Terms & Conditions', route: '/support/terms' },
        { label: 'Refund Cancellation', route: '/support/refund-cancellation-policy' },
        { label: 'Website Terms', route: '/support/website-terms' },
        { label: 'Disclosure Policy', route: '/support/disclosure-policy' },
        { label: 'Sitemap', route: '/sitemap' },
      ],
    },
    {
      title: 'Academics',
      links: [
        { label: 'Schools', route: '/academic/school' },
        { label: 'Colleges', route: '/academic/colleges' },
        { label: 'Hostels', route: '/academic/hostels' },
        { label: 'Other Institutes', route: '/academic/others' },
        { label: 'Our Campuses', route: '/more/campus' },
        { label: 'IP Cell', route: '/ipcell' },
      ],
    },
    {
      title: 'Media',
      links: [
        { label: 'Gallery', route: '/glory/gallery' },
        { label: 'Navratri', route: '/navratri' },
        { label: 'Next UP Podcast', route: '/podcast' },
        { label: 'Blog', route: '/home/blog' },
        { label: 'Magazine', route: '/student-corner/magazine' },
        { label: 'Answer Key', route: '/student-corner/answer-key' },
      ],
    },
    {
      title: 'Quick Links',
      links: [
        { label: 'News & Updates', route: '/more/news' },
        { label: "FAQ's", route: '/support/faqs' },
        { label: 'Careers', route: '/more/career' },
        { label: 'Tenders', route: '/more/tenders' },
        { label: 'e-Gate Pass', route: '/more/gate-pass' },
        { label: 'Counselling', route: '/counselling' },
        { label: 'Rahatokarsh Fund', route: '/fund' },
      ],
    },
    {
      title: 'Useful Links',
      links: [
        { label: 'About Us', route: '/about' },
        { label: 'Management', route: '/management' },
        { label: 'Alumni', route: '/alumni' },
        { label: 'Centenary Celebration', route: '/celebration' },
        { label: 'Social Activity', route: '/social-activity' },
        { label: 'Projects', route: '/project' },
        { label: 'Contact Us', route: '/contact' },
        { label: 'Staff Login', href: `${Footer.DASHBOARD_URL}/account/employee` },
      ],
    },
  ];
}
