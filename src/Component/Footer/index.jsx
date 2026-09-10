import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Car, Clock3, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import footerBg from '../../Img/footer-bg.webp';

const footerLinkClass =
  'group inline-flex min-h-10 items-center text-sm text-slate-400 transition-all duration-200 hover:translate-x-1.5 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-emerald-900/40 bg-[#060e10] text-slate-300">
      {/* Background image & rich ambient gradient layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={footerBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-bottom opacity-20 mix-blend-screen scale-105"
        />
        {/* Layered gradients for deep depth and optimal legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04080a] via-[#060e10]/92 to-[#071317]/95" />
        <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-72 w-96 rounded-full bg-teal-500/10 blur-3xl" />
        {/* Glowing top border neon line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_1.1fr]">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-emerald-950 shadow-md shadow-emerald-950/40 transition-transform duration-300 group-hover:scale-105">
                <Car className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-black text-white tracking-tight" translate="no">Green Car Park</span>
            </Link>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-6 text-slate-400">
              {t('footer.description')}
            </p>
          </div>

          <nav aria-label={t('footer.serviceLinks')}>
            <h2 className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400/90">{t('footer.services')}</h2>
            <ul className="mt-3 space-y-1">
              <li><Link to="/parking" className={footerLinkClass}>{t('footer.findParking')}</Link></li>
              <li><Link to="/reviews" className={footerLinkClass}>{t('footer.reviews')}</Link></li>
              <li><Link to="/feedback" className={footerLinkClass}>{t('footer.support')}</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400/90">{t('footer.contact')}</h2>
            <address className="mt-3 space-y-1 not-italic">
              <a href="tel:+84123456789" className={`${footerLinkClass} gap-2.5`}>
                <Phone className="h-4 w-4 shrink-0 text-emerald-400 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                +84 123 456 789
              </a>
              <a href="mailto:mycarpark020924@gmail.com" className={`${footerLinkClass} gap-2.5 break-all`}>
                <Mail className="h-4 w-4 shrink-0 text-emerald-400 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                mycarpark020924@gmail.com
              </a>
              <a
                href="https://maps.app.goo.gl/AJ3rocpaq7b8s5oy6"
                target="_blank"
                rel="noopener noreferrer"
                className={`${footerLinkClass} items-start gap-2.5 py-2`}
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                <span>{t('footer.address')}</span>
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </a>
            </address>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400/90">{t('footer.systemStatus')}</h2>
            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-4 backdrop-blur-md shadow-lg shadow-black/20 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-emerald-950/40 hover:-translate-y-0.5">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                </span>
                {t('footer.operational')}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5 text-emerald-400/80" aria-hidden="true" />
                  {t('footer.support247')}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/80" aria-hidden="true" />
                  {t('footer.secureData')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <p>{t('footer.closing')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
