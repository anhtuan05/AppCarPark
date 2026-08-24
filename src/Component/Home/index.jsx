import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPinHouse,
  ShieldCheck,
  ScanFace,
  Clock,
  Sparkles,
  ArrowRight,
  Car,
  CheckCircle2,
  Zap,
  Smartphone,
  Eye,
  Camera,
} from 'lucide-react';
import bgImg from '../../Img/bgImg.webp';
import img4 from '../../Img/img4.jpg';
import img5 from '../../Img/img5.jpg';
import img6 from '../../Img/img6.jpg';
import img7 from '../../Img/img7.jpg';
import './style.css';

function Home() {
  const showcaseFeatures = [
    {
      image: img5,
      tag: 'Biometric AI Entry',
      title: 'Neural Face Recognition',
      description:
        '68-point landmark vector analysis verifies authorized drivers in under 500ms for seamless hands-free barrier access.',
      icon: ScanFace,
      color: 'emerald',
    },
    {
      image: img4,
      tag: 'ANPR Smart Vision',
      title: 'Automated License Plate Reader',
      description:
        'High-speed optical camera detection logs vehicle entry and exit timestamps with 99.8% precision.',
      icon: Camera,
      color: 'teal',
    },
    {
      image: img6,
      tag: 'Eco-Friendly Infrastructure',
      title: 'Green EV Fast-Charging Bays',
      description:
        'Solar-powered charging stations integrated into dedicated parking spots for electric and hybrid vehicles.',
      icon: Zap,
      color: 'blue',
    },
    {
      image: img7,
      tag: 'Smart Customer Portal',
      title: 'Instant Spot Reservations',
      description:
        'Real-time interactive spot mapping, long-term pass subscriptions, and automated payment gateway.',
      icon: Smartphone,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-emerald-950/75 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-4xl px-6 sm:px-12 py-20 sm:py-28 text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Next-Generation Smart Parking Infrastructure</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Seamless Parking with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              AI Face Recognition
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Reserve premium parking bays in seconds, manage monthly subscription passes, and experience
            frictionless entry and exit powered by automated neural face biometrics and license plate scanning.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/parking"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Parking Spots</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl backdrop-blur-md border border-white/20 transition-all"
            >
              <ScanFace className="w-5 h-5 text-emerald-400" />
              <span>Enroll Face ID</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Technology Showcase */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Intelligent Infrastructure
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            Built with Cutting-Edge AI Technology
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Discover how Green Car Park combines computer vision, biometric security, and clean energy to redefine parking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showcaseFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold">
                      <Icon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{feat.tag}</span>
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Access CTA Section */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            Ready for Effortless Ticketless Parking?
          </h2>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Create an account in under 60 seconds with your facial profile or reserve parking passes
            instantly on any device.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link
            to="/login"
            className="px-8 py-4 bg-white text-emerald-950 font-bold rounded-2xl shadow-lg hover:bg-emerald-50 transition-colors text-sm"
          >
            Sign In Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;