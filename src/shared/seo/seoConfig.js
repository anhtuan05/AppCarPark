/**
 * Centralized SEO & Metadata Configuration for Green Car Park
 */
export const SITE_URL = 'https://greencar-park.vn';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const routeSeoConfigs = [
  {
    path: '/',
    exact: true,
    titleKey: 'seo.homeTitle',
    descriptionKey: 'seo.homeDescription',
    keywordsKey: 'seo.homeKeywords',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    canonical: '/',
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
    ],
  },
  {
    path: '/parking',
    titleKey: 'seo.parkingTitle',
    descriptionKey: 'seo.parkingDescription',
    keywordsKey: 'seo.parkingKeywords',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    canonical: '/parking',
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
      { nameKey: 'nav.parking', path: '/parking' },
    ],
  },
  {
    path: '/reviews',
    titleKey: 'seo.reviewsTitle',
    descriptionKey: 'seo.reviewsDescription',
    keywordsKey: 'seo.reviewsKeywords',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    canonical: '/reviews',
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
      { nameKey: 'nav.reviews', path: '/reviews' },
    ],
  },
  {
    path: '/feedback',
    titleKey: 'seo.feedbackTitle',
    descriptionKey: 'seo.feedbackDescription',
    keywordsKey: 'seo.feedbackKeywords',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    canonical: '/feedback',
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
      { nameKey: 'nav.feedback', path: '/feedback' },
    ],
  },
  {
    path: '/login',
    titleKey: 'seo.loginTitle',
    descriptionKey: 'seo.loginDescription',
    keywordsKey: 'seo.loginKeywords',
    robots: 'index, follow',
    canonical: '/login',
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
      { nameKey: 'nav.login', path: '/login' },
    ],
  },
  {
    path: '/register',
    titleKey: 'seo.registerTitle',
    descriptionKey: 'seo.registerDescription',
    keywordsKey: 'seo.registerKeywords',
    robots: 'index, follow',
    canonical: '/register',
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
      { nameKey: 'nav.register', path: '/register' },
    ],
  },
  // Authenticated Customer Workflows
  {
    pattern: /^\/booking\/([^/]+)$/,
    titleKey: 'seo.bookingTitle',
    descriptionKey: 'seo.bookingDescription',
    keywordsKey: 'seo.bookingKeywords',
    robots: 'noindex, nofollow',
    getCanonical: (match) => `/booking/${match[1]}`,
    getParams: (match) => ({ id: match[1] }),
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
      { nameKey: 'nav.parking', path: '/parking' },
      { nameKey: 'booking.eyebrow', path: '/booking' },
    ],
  },
  {
    pattern: /^\/subscription\/([^/]+)$/,
    titleKey: 'seo.subscriptionTitle',
    descriptionKey: 'seo.subscriptionDescription',
    keywordsKey: 'seo.subscriptionKeywords',
    robots: 'noindex, nofollow',
    getCanonical: (match) => `/subscription/${match[1]}`,
    getParams: (match) => ({ id: match[1] }),
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
      { nameKey: 'nav.parking', path: '/parking' },
      { nameKey: 'subscription.title', path: '/subscription' },
    ],
  },
  {
    path: '/renew-subscription',
    titleKey: 'seo.renewalTitle',
    descriptionKey: 'seo.renewalDescription',
    keywordsKey: 'seo.renewalKeywords',
    robots: 'noindex, nofollow',
    canonical: '/renew-subscription',
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
      { nameKey: 'nav.renew', path: '/renew-subscription' },
    ],
  },
  {
    path: '/vehicle-management',
    titleKey: 'seo.vehiclesTitle',
    descriptionKey: 'seo.vehiclesDescription',
    keywordsKey: 'seo.vehiclesKeywords',
    robots: 'noindex, nofollow',
    canonical: '/vehicle-management',
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
      { nameKey: 'nav.vehicles', path: '/vehicle-management' },
    ],
  },
  {
    path: '/personal-info',
    titleKey: 'seo.profileTitle',
    descriptionKey: 'seo.profileDescription',
    keywordsKey: 'seo.profileKeywords',
    robots: 'noindex, nofollow',
    canonical: '/personal-info',
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
      { nameKey: 'common.account', path: '/personal-info' },
    ],
  },
  {
    path: '/staff',
    titleKey: 'seo.staffTitle',
    descriptionKey: 'seo.staffDescription',
    keywordsKey: 'seo.staffKeywords',
    robots: 'noindex, nofollow',
    canonical: '/staff',
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
      { nameKey: 'nav.staffConsole', path: '/staff' },
    ],
  },
  {
    path: '/report',
    titleKey: 'seo.reportTitle',
    descriptionKey: 'seo.reportDescription',
    keywordsKey: 'seo.reportKeywords',
    robots: 'noindex, nofollow',
    canonical: '/report',
    breadcrumbs: [
      { nameKey: 'nav.homeLabel', path: '/' },
      { nameKey: 'nav.report', path: '/report' },
    ],
  },
  {
    path: '/access-denied',
    titleKey: 'seo.accessDeniedTitle',
    descriptionKey: 'seo.accessDeniedDescription',
    robots: 'noindex, nofollow',
    canonical: '/access-denied',
  },
];

export const getSeoConfigForPath = (pathname) => {
  for (const item of routeSeoConfigs) {
    if (item.pattern) {
      const match = pathname.match(item.pattern);
      if (match) {
        return {
          ...item,
          canonical: item.getCanonical ? item.getCanonical(match) : pathname,
          params: item.getParams ? item.getParams(match) : {},
        };
      }
    } else if (item.exact) {
      if (pathname === item.path) return item;
    } else if (pathname === item.path) {
      return item;
    }
  }

  // 404 Fallback
  return {
    titleKey: 'seo.notFoundTitle',
    descriptionKey: 'seo.notFoundDescription',
    robots: 'noindex, nofollow',
    canonical: pathname,
  };
};
