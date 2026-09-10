import { describe, expect, it } from 'vitest';
import { getSeoConfigForPath, SITE_URL } from './seoConfig';

describe('SEO Config & Path Mapping', () => {
  it('maps home route (/) correctly with full index directives', () => {
    const config = getSeoConfigForPath('/');
    expect(config.titleKey).toBe('seo.homeTitle');
    expect(config.canonical).toBe('/');
    expect(config.robots).toContain('index, follow');
  });

  it('maps parking route (/parking) with high priority discovery directives', () => {
    const config = getSeoConfigForPath('/parking');
    expect(config.titleKey).toBe('seo.parkingTitle');
    expect(config.canonical).toBe('/parking');
    expect(config.robots).toContain('index, follow');
  });

  it('extracts spotId param for dynamic booking route (/booking/:spotId)', () => {
    const config = getSeoConfigForPath('/booking/205');
    expect(config.titleKey).toBe('seo.bookingTitle');
    expect(config.params).toEqual({ id: '205' });
    expect(config.canonical).toBe('/booking/205');
    expect(config.robots).toBe('noindex, nofollow');
  });

  it('extracts spotId param for dynamic subscription route (/subscription/:spotId)', () => {
    const config = getSeoConfigForPath('/subscription/77');
    expect(config.titleKey).toBe('seo.subscriptionTitle');
    expect(config.params).toEqual({ id: '77' });
    expect(config.canonical).toBe('/subscription/77');
    expect(config.robots).toBe('noindex, nofollow');
  });

  it('protects private dashboard routes with noindex, nofollow', () => {
    const staffConfig = getSeoConfigForPath('/staff');
    expect(staffConfig.robots).toBe('noindex, nofollow');

    const reportConfig = getSeoConfigForPath('/report');
    expect(reportConfig.robots).toBe('noindex, nofollow');

    const vehiclesConfig = getSeoConfigForPath('/vehicle-management');
    expect(vehiclesConfig.robots).toBe('noindex, nofollow');
  });

  it('handles unknown paths with 404 fallback metadata', () => {
    const config = getSeoConfigForPath('/random-unknown-url');
    expect(config.titleKey).toBe('seo.notFoundTitle');
    expect(config.robots).toBe('noindex, nofollow');
  });

  it('ensures SITE_URL is canonical HTTPS domain', () => {
    expect(SITE_URL).toMatch(/^https:\/\/greencar-park\.vn$/);
  });
});
