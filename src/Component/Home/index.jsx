import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  CalendarCheck,
  Camera,
  Car,
  Check,
  Clock3,
  Leaf,
  MapPin,
  ScanFace,
  ShieldCheck,
  Smartphone,
  Zap,
} from 'lucide-react';
import bgImg from '../../Img/bgImg-hero.webp';
import faceImage from '../../Img/img5-card.webp';
import cameraImage from '../../Img/img4-card.webp';
import chargingImage from '../../Img/img6-card.webp';
import bookingImage from '../../Img/img7-card.webp';
import homeCtaBg from '../../Img/home-cta-bg.webp';

const features = [
  {
    image: faceImage,
    key: 'face',
    icon: ScanFace,
  },
  {
    image: cameraImage,
    key: 'camera',
    icon: Camera,
  },
  {
    image: chargingImage,
    key: 'charging',
    icon: Zap,
  },
  {
    image: bookingImage,
    key: 'booking',
    icon: Smartphone,
  },
];

const steps = [
  {
    number: '01',
    key: 'choose',
    icon: MapPin,
  },
  {
    number: '02',
    key: 'reserve',
    icon: CalendarCheck,
  },
  {
    number: '03',
    key: 'enter',
    icon: ScanFace,
  },
];

function Home() {
  const { t } = useTranslation();

  return (
    <div className="space-y-16 pb-8 sm:space-y-20 sm:pb-12">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-emerald-950 text-white shadow-[0_30px_80px_rgba(6,78,59,0.2)] sm:rounded-[2.25rem]">
        <div className="absolute -left-28 top-8 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 right-1/3 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" aria-hidden="true" />

        <div className="relative grid items-stretch lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-20">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-bold text-emerald-200 sm:text-sm backdrop-blur-md animate-float-slow">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <Leaf className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              <span>{t('home.badge')}</span>
            </div>

            <h1 className="max-w-3xl text-balance font-display text-4xl font-black leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              {t('home.title')}
              <span className="block text-emerald-300">{t('home.titleAccent')}</span>
            </h1>

            <p className="mt-5 max-w-2xl text-pretty text-sm leading-6 text-emerald-50/75 sm:text-base sm:leading-7">
              {t('home.description')}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/parking"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-emerald-950 shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-xl hover:shadow-emerald-500/25 active:scale-[0.98] active:translate-y-0"
              >
                {t('home.findParking')}
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/15 hover:border-white/40 active:scale-[0.98] active:translate-y-0"
              >
                <ScanFace className="h-5 w-5 text-emerald-300" aria-hidden="true" />
                {t('home.registerFace')}
              </Link>
            </div>

            <dl className="mt-9 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
              <div>
                <dt className="text-[11px] font-semibold text-emerald-100/60 sm:text-xs">{t('home.openingHours')}</dt>
                <dd className="mt-1 text-sm font-black text-white sm:text-base">24/7</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold text-emerald-100/60 sm:text-xs">{t('home.averageVerification')}</dt>
                <dd className="mt-1 text-sm font-black text-white sm:text-base">{t('home.lessThanSecond')}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold text-emerald-100/60 sm:text-xs">{t('home.liveAvailability')}</dt>
                <dd className="mt-1 text-sm font-black text-white sm:text-base">{t('home.live')}</dd>
              </div>
            </dl>
          </div>

          <div className="relative min-h-[19rem] overflow-hidden lg:min-h-full">
            <img
              src={bgImg}
              width="1200"
              height="670"
              alt={t('home.heroAlt')}
              fetchpriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/10 via-transparent to-emerald-950/70 lg:bg-gradient-to-r lg:from-emerald-950 lg:via-emerald-950/10 lg:to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-slate-950/70 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-emerald-400/40 hover:-translate-y-0.5 sm:bottom-6 sm:left-auto sm:right-6 sm:w-72">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  </span>
                  <span className="text-sm font-black">{t('home.systemOnline')}</span>
                </div>
                <ShieldCheck className="h-5 w-5 text-emerald-300" aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                {t('home.systemOnlineDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="benefit-heading">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">{t('home.benefitsEyebrow')}</p>
          <h2 id="benefit-heading" className="mt-3 text-balance font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {t('home.benefitsTitle')}
          </h2>
          <p className="mt-3 text-pretty text-sm leading-6 text-slate-600 sm:text-base">
            {t('home.benefitsDescription')}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map(({ image, key, icon: Icon }) => (
            <article
              key={key}
              className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300/80 hover:shadow-2xl hover:shadow-emerald-950/10 active:scale-[0.99]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                <img
                  src={image}
                  width="800"
                  height="600"
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-slate-950/65 text-emerald-300 backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{t(`home.features.${key}.eyebrow`)}</p>
                <h3 className="mt-2 text-balance font-display text-xl font-black text-slate-950 transition-colors duration-200 group-hover:text-emerald-900">{t(`home.features.${key}.title`)}</h3>
                <p className="mt-2 text-pretty text-sm leading-6 text-slate-600">{t(`home.features.${key}.description`)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:p-10" aria-labelledby="steps-heading">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-800">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            {t('home.stepsEyebrow')}
          </span>
          <h2 id="steps-heading" className="mt-4 text-balance font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {t('home.stepsTitle')}
          </h2>
          <p className="mt-3 max-w-md text-pretty text-sm leading-6 text-slate-600 sm:text-base">
            {t('home.stepsDescription')}
          </p>

          <ul className="mt-6 space-y-3 text-sm font-semibold text-slate-700">
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              {t('home.benefits.biometric')}
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              {t('home.benefits.transparent')}
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              {t('home.benefits.responsive')}
            </li>
          </ul>
        </div>

        <ol className="grid gap-3">
          {steps.map(({ number, key, icon: Icon }) => (
            <li key={number} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-900 text-emerald-200">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-base font-black text-slate-950 sm:text-lg">{t(`home.steps.${key}.title`)}</span>
                <span className="mt-1 block text-pretty text-xs leading-5 text-slate-600 sm:text-sm">{t(`home.steps.${key}.description`)}</span>
              </span>
              <span className="self-start font-display text-2xl font-black text-slate-200" aria-hidden="true">{number}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative overflow-hidden rounded-[1.75rem] border border-emerald-500/25 bg-emerald-950 px-5 py-9 text-white shadow-2xl sm:px-10 sm:py-12" aria-labelledby="cta-heading">
        {/* Background Image & Multi-stage Gradient Scrim */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={homeCtaBg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center opacity-30 mix-blend-screen scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/98 via-emerald-950/90 to-teal-950/80" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
        </div>

        <Leaf className="absolute -right-7 -top-8 h-44 w-44 rotate-12 text-white/5 pointer-events-none z-0" aria-hidden="true" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
              <Car className="h-4 w-4" aria-hidden="true" />
              <span>{t('home.ctaEyebrow')}</span>
            </div>
            <h2 id="cta-heading" className="text-balance font-display text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              {t('home.ctaTitle')}
            </h2>
            <p className="mt-2 text-sm text-emerald-100/70 max-w-xl">
              {t('home.description')}
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 px-6 py-3.5 text-sm font-black text-emerald-950 shadow-lg shadow-emerald-950/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] sm:w-auto"
          >
            {t('home.ctaButton')}
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
