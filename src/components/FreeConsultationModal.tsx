import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquare, Phone, Mail, Building, Target, Send, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/siteData';
import { platformStore } from '../services/platformStore';
import { trackEvent } from '../services/analyticsService';

interface FreeConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeConsultationModal: React.FC<FreeConsultationModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('Retail / E-commerce');
  const [goal, setGoal] = useState('Get More Customers & Leads');
  const [service, setService] = useState('Website & Digital Marketing');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) return;

    platformStore.createLead({
      name,
      business_name: business || name + ' Business',
      phone,
      email,
      service: service || 'Digital Services Consultation',
      business_type: businessType,
      requirement: `[Free Consultation Request]\nGoal: ${goal}\nService: ${service}\nMessage: ${message}`,
      source: 'Free Consultation',
      status: 'New',
    });

    trackEvent('submit_free_consultation', 'lead', businessType);
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-label="Free Business Consultation"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div className="relative w-full max-w-xl bg-[#071126] border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0B1938] border-b border-blue-500/20 select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-cyan-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">Get Your Free Digital Consultation</h3>
              <p className="text-xs text-slate-400">Digital X Multi Services Pvt. Ltd.</p>
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
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-2xl font-bold">
                ✓
              </div>
              <h4 className="text-xl font-bold text-white">Consultation Request Received!</h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{name}</strong>. A Digital X growth strategist will review your business details and contact you shortly via phone/WhatsApp.
              </p>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer"
                >
                  Back to Website
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shamas"
                    className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                    placeholder="e.g. Shamas Textiles"
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
                    placeholder="e.g. +91 7970884193"
                    className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. shamas@example.com"
                    className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full bg-slate-900 text-white text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Retail / E-commerce">Retail / E-commerce</option>
                    <option value="Local Store / Services">Local Store / Services</option>
                    <option value="Clinic / Healthcare">Clinic / Healthcare</option>
                    <option value="B2B / Manufacturing">B2B / Manufacturing</option>
                    <option value="Real Estate / Interior">Real Estate / Interior</option>
                    <option value="Education / Coaching">Education / Coaching</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Growth Goal</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-slate-900 text-white text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Get More Customers & Leads">Get More Customers &amp; Leads</option>
                    <option value="Build High-Converting Website">Build High-Converting Website</option>
                    <option value="Scale E-commerce Product Sales">Scale E-commerce Product Sales</option>
                    <option value="Automate Support & WhatsApp">Automate Support &amp; WhatsApp</option>
                    <option value="Brand Identity & Marketing">Brand Identity &amp; Marketing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">What would you like to discuss?</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a brief overview of your current challenges or questions..."
                  className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Free Consultation →</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
