import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEFAULT_OG_IMAGE, SITE_URL, getSeoConfigForPath } from './seoConfig';

function setMetaTag(attributeName, attributeValue, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonicalLink(href) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setBreadcrumbJsonLd(breadcrumbs, t) {
  const SCRIPT_ID = 'route-breadcrumb-schema';
  let script = document.getElementById(SCRIPT_ID);

  if (!breadcrumbs || breadcrumbs.length <= 1) {
    if (script) script.remove();
    return;
  }

  const itemListElement = breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.nameKey ? t(crumb.nameKey) : crumb.name,
    item: `${SITE_URL}${crumb.path}`,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };

  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonLd);
}

export function useSeo() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const config = getSeoConfigForPath(location.pathname);
    const resolvedLang = i18n.resolvedLanguage || 'vi';

    // 1. Synchronize HTML lang attribute
    document.documentElement.lang = resolvedLang;

    // 2. Resolve localized values with dynamic params
    const siteName = t('seo.siteName', 'Green Car Park');
    const params = config.params || {};
    const rawTitle = config.titleKey ? t(config.titleKey, params) : t('seo.defaultTitle');
    const finalTitle = location.pathname === '/' ? rawTitle : `${rawTitle} | ${siteName}`;
    const description = config.descriptionKey ? t(config.descriptionKey, params) : t('seo.defaultDescription');
    const keywords = config.keywordsKey ? t(config.keywordsKey, params) : t('seo.defaultKeywords');
    const robots = config.robots || 'index, follow';
    const canonicalUrl = `${SITE_URL}${config.canonical || location.pathname}`;

    // 3. Document Title
    document.title = finalTitle;

    // 4. Standard Search Engine Metas
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', robots);
    setMetaTag('name', 'googlebot', robots);

    // 5. Canonical Link
    setCanonicalLink(canonicalUrl);

    // 6. Open Graph Tags
    setMetaTag('property', 'og:site_name', siteName);
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', DEFAULT_OG_IMAGE);
    setMetaTag('property', 'og:locale', resolvedLang === 'en' ? 'en_US' : 'vi_VN');
    setMetaTag('property', 'og:locale:alternate', resolvedLang === 'en' ? 'vi_VN' : 'en_US');

    // 7. Twitter Card Tags
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', DEFAULT_OG_IMAGE);

    // 8. BreadcrumbList Schema.org
    setBreadcrumbJsonLd(config.breadcrumbs, t);
  }, [location.pathname, i18n.resolvedLanguage, t]);
}

export default useSeo;
