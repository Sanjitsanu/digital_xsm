import React, { useState } from 'react';
import { X, SearchCheck, CheckCircle2, Globe, Instagram, Mail, Phone, Building, ArrowRight } from 'lucide-react';
import { platformStore } from '../services/platformStore';
import { trackEvent } from '../services/analyticsService';

interface FreeAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeAuditModal: React.FC<FreeAuditModalProps> = ({ isOpen, onClose }) => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !email.trim() || !phone.trim()) return;

    platformStore.createLead({
      name: businessName + ' Owner',
      business_name: businessName,
      email,
      phone,
      service: 'Free Digital Audit',
      requirement: `[Free Digital Audit Request]\nWebsite: ${websiteUrl || 'N/A'}\nInstagram: ${instagramUrl || 'N/A'}`,
      source: 'Digital Audit',
      status: 'New',
    });

    trackEvent('submit_digital_audit', 'lead', businessName);
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-label="Free Digital Audit"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-[#071126] border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0B1938] border-b border-blue-500/20 select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <SearchCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">Get Your Free Digital Audit</h3>
              <p className="text-xs text-slate-400">Digital X Website &amp; Social Diagnostic</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center text-2xl font-bold">
                ✓
              </div>
              <h4 className="text-xl font-bold text-white">Audit Request Received!</h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Our digital marketing and web performance team will analyze your digital footprint and send a detailed, human-reviewed diagnostic report to <strong className="text-white">{email}</strong>.
              </p>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer"
                >
                  Close &amp; Back to Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Discover bottlenecks in your website speed, mobile responsiveness, local Google ranking, and social conversion funnels.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Shamas Associates"
                  className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL (if applicable)</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram or Facebook Page URL</label>
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="instagram.com/yourbusiness"
                  className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email for Report *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shamas@example.com"
                    className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 7970884193"
                    className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
                >
                  <SearchCheck className="w-4 h-4" />
                  <span>Request Free Digital Audit Report →</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
