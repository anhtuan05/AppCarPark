import React from 'react';
import { MapPin, Phone, Mail, Car, Shield, Sparkles, Heart } from 'lucide-react';
import './style.css';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">Green Car Park</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart parking infrastructure with AI facial recognition biometrics, automated license plate recognition, and real-time spot reservations.
            </p>
          </div>

          {/* Location & Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Facility Address
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>123 Nguyen Hue Boulevard, Ben Nghe Ward, District 1, Ho Chi Minh City, Vietnam</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Direct Contact
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  href="mailto:mycarpark020924@gmail.com"
                  className="hover:text-emerald-400 transition-colors"
                >
                  mycarpark020924@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Security & System Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              System Guarantee
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>24/7 Monitored Gate</span>
              </div>
              <p className="text-[11px] text-slate-400">
                100% encrypted neural descriptors and real-time ANPR camera capture.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Green Car Parking Service. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#security" className="hover:text-slate-400 transition-colors">Biometric Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
