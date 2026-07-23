export interface SocialLink {
  label: string;
  href: string;
  /** Filled 24×24 brand glyph — drawn by a single <path> at each call site. */
  path: string;
}

/** The society's live accounts, shared by the header utility bar and the footer. */
export const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/cesociety',
    path: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z',
  },
  {
    label: 'X',
    href: 'https://twitter.com/ces100anand',
    path: 'M18.2 2.3h3.3l-7.2 8.3 8.5 11.1h-6.6l-5.2-6.8-6 6.8H1.7l7.7-8.8L1.3 2.3H8l4.7 6.2 5.5-6.2zm-1.2 17.8h1.8L7.1 4.1H5.2L17 20.1z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/cesociety_1916/',
    path: 'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zM12 7.1a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8zm0 8.1a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm6.2-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/82105326/',
    path: 'M20.4 3H3.6c-.9 0-1.6.7-1.6 1.6v16.8c0 .9.7 1.6 1.6 1.6h16.8c.9 0 1.6-.7 1.6-1.6V4.6c0-.9-.7-1.6-1.6-1.6zM8.1 19H5.2V9.7h2.9V19zM6.6 8.4a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM19 19h-2.9v-4.5c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19H9.9V9.7h2.8V11h.1c.4-.7 1.3-1.5 2.8-1.5 3 0 3.5 2 3.5 4.5V19z',
  },
];
