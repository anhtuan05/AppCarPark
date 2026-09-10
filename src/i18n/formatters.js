const localeByLanguage = {
  en: 'en-US',
  vi: 'vi-VN',
};

const formatterCache = new Map();

export function getLocale(language) {
  return localeByLanguage[language] || localeByLanguage.vi;
}

function getFormatter(type, language, options) {
  const locale = getLocale(language);
  const key = `${type}:${locale}:${JSON.stringify(options)}`;

  if (!formatterCache.has(key)) {
    const Formatter = type === 'date' ? Intl.DateTimeFormat : Intl.NumberFormat;
    formatterCache.set(key, new Formatter(locale, options));
  }

  return formatterCache.get(key);
}

export function formatCurrency(value, language) {
  return getFormatter('number', language, {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatNumber(value, language, options = {}) {
  return getFormatter('number', language, options).format(Number(value || 0));
}

export function formatDate(value, language, fallback = '—') {
  if (!value) return fallback;
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = new Date(isDateOnly ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return fallback;
  return getFormatter('date', language, {
    dateStyle: 'medium',
    ...(isDateOnly ? { timeZone: 'UTC' } : {}),
  }).format(date);
}

export function formatDateTime(value, language, fallback = '—') {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return getFormatter('date', language, { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function formatMonthKey(value, language) {
  if (!/^\d{4}-\d{2}$/.test(value)) return value;
  const [year, month] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  return getFormatter('date', language, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function translateStatus(t, status) {
  if (!status) return t('status.unknown');
  const normalizedStatus = String(status).trim().toLowerCase().replaceAll(' ', '_');
  return t(`status.${normalizedStatus}`, { defaultValue: status });
}
