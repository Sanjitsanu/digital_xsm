import React, { useState, useEffect } from 'react';
import { COMPANY_INFO, SERVICE_OPTIONS, BUDGET_OPTIONS } from '../data/siteData';
import { ContactFormData } from '../types';
import { MapPin, Phone, Mail, Instagram, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

interface ContactProps {
  preselectedService?: string;
  onClearPreselectedService?: () => void;
}

export const Contact: React.FC<ContactProps> = ({ preselectedService, onClearPreselectedService }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterested: 'Choose a service',
    budget: 'Estimated budget (optional)',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync preselectedService when triggered from Services or Portfolio CTAs
  useEffect(() => {
    if (preselectedService && SERVICE_OPTIONS.includes(preselectedService)) {
      setFormData((prev) => ({
        ...prev,
        serviceInterested: preselectedService,
      }));
    }
  }, [preselectedService]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter a valid name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneClean = formData.phone.replace(/[\s-]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneClean.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.serviceInterested || formData.serviceInterested === 'Choose a service') {
      newErrors.serviceInterested = 'Please select a service you are interested in';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details about your project or inquiry';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onClearPreselectedService) {
        onClearPreselectedService();
      }
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      serviceInterested: 'Choose a service',
      budget: 'Estimated budget (optional)',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section id="contact" className="relative py-20 lg:py-28 bg-[#071126] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">
              CONTACT US
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Let's Build Something Great Together
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Tell us about your project and our team will get back to you.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* LEFT: Contact Information Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Connect Directly with Digital X
              </h3>
              <p className="text-sm text-slate-300 mb-8 leading-relaxed">
                Whether you need a new high-speed website, an e-commerce platform, active Meta/Google advertising management, or custom AI automations — we are ready to help.
              </p>

              <div className="space-y-4">
                {/* PHONE */}
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#0B1938]/70 border border-blue-500/15 hover:border-blue-400/35 hover:bg-[#0E214A] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-[#38BDF8] shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Phone</div>
                    <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#38BDF8] transition-colors mt-0.5">
                      {COMPANY_INFO.phoneDisplay}
                    </div>
                  </div>
                </a>

                {/* EMAIL INFO */}
                <a
                  href={`mailto:${COMPANY_INFO.infoEmail}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#0B1938]/70 border border-blue-500/15 hover:border-blue-400/35 hover:bg-[#0E214A] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-[#38BDF8] shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">General Inquiries</div>
                    <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#38BDF8] transition-colors mt-0.5">
                      {COMPANY_INFO.infoEmail}
                    </div>
                  </div>
                </a>

                {/* EMAIL SUPPORT */}
                <a
                  href={`mailto:${COMPANY_INFO.supportEmail}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#0B1938]/70 border border-blue-500/15 hover:border-blue-400/35 hover:bg-[#0E214A] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-[#38BDF8] shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Client Support</div>
                    <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#38BDF8] transition-colors mt-0.5">
                      {COMPANY_INFO.supportEmail}
                    </div>
                  </div>
                </a>

                {/* ADDRESS */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0B1938]/70 border border-blue-500/15">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Office</div>
                    <div className="text-sm sm:text-base font-medium text-white mt-1 leading-snug">
                      {COMPANY_INFO.address}
                    </div>
                  </div>
                </div>

                {/* INSTAGRAM */}
                <a
                  href={COMPANY_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#0B1938]/70 border border-blue-500/15 hover:border-blue-400/35 hover:bg-[#0E214A] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-400/30 flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Instagram</div>
                    <div className="text-sm sm:text-base font-semibold text-white group-hover:text-pink-300 transition-colors mt-0.5">
                      {COMPANY_INFO.instagram}
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Instant WhatsApp Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-blue-950/60 border border-emerald-500/30 flex items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Prefer Instant WhatsApp?</div>
                  <div className="text-xs text-emerald-300">+91 7970884193 &middot; Quick Response</div>
                </div>
              </div>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(COMPANY_INFO.whatsappDefaultMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shrink-0 shadow-md shadow-emerald-900/40"
              >
                Chat Now
              </a>
            </div>

          </div>

          {/* RIGHT: Professional Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl p-6 sm:p-8 bg-[#0B1938]/80 border border-blue-500/20 shadow-2xl shadow-black/40 relative">
              
              {isSubmitted ? (
                <div className="py-12 px-4 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-5 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                  <p className="text-slate-300 text-sm max-w-md mb-6 leading-relaxed">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Your project inquiry regarding <span className="text-[#38BDF8] font-medium">{formData.serviceInterested}</span> has been received. Our team will contact you shortly at <span className="text-white">{formData.phone}</span>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      Send Another Inquiry
                    </button>
                    <a
                      href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(`Hello Digital X, I just submitted an inquiry for ${formData.serviceInterested} on your website.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 transition-colors"
                    >
                      Follow Up on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                  <div className="border-b border-slate-700/60 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-white">Start Your Project</h3>
                    <p className="text-xs text-slate-400">Fields marked with an asterisk (*) are required.</p>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="e.g. Shamas"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm border focus:outline-none transition-colors ${
                          errors.name
                            ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500'
                            : 'border-slate-700 focus:border-[#38BDF8]'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="shamas@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm border focus:outline-none transition-colors ${
                          errors.email
                            ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500'
                            : 'border-slate-700 focus:border-[#38BDF8]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Business/Company Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        placeholder="+91 9876543210"
                        className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm border focus:outline-none transition-colors ${
                          errors.phone
                            ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500'
                            : 'border-slate-700 focus:border-[#38BDF8]'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Business/Company */}
                    <div>
                      <label htmlFor="company" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Business / Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company or brand name..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm border border-slate-700 focus:border-[#38BDF8] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Service Interested & Budget Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Service Interested */}
                    <div>
                      <label htmlFor="serviceInterested" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Service Interested <span className="text-rose-400">*</span>
                      </label>
                      <select
                        id="serviceInterested"
                        value={formData.serviceInterested}
                        onChange={(e) => {
                          setFormData({ ...formData, serviceInterested: e.target.value });
                          if (errors.serviceInterested) setErrors({ ...errors, serviceInterested: undefined });
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 text-white text-sm border focus:outline-none transition-colors ${
                          errors.serviceInterested
                            ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500'
                            : 'border-slate-700 focus:border-[#38BDF8]'
                        }`}
                      >
                        {SERVICE_OPTIONS.map((opt, idx) => (
                          <option key={idx} value={opt} disabled={idx === 0}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.serviceInterested && (
                        <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.serviceInterested}</span>
                        </p>
                      )}
                    </div>

                    {/* Budget */}
                    <div>
                      <label htmlFor="budget" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Budget
                      </label>
                      <select
                        id="budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 text-white text-sm border border-slate-700 focus:border-[#38BDF8] focus:outline-none transition-colors"
                      >
                        {BUDGET_OPTIONS.map((b, idx) => (
                          <option key={idx} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Message <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Tell us about your project requirements, goals, or timeline..."
                      className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm border focus:outline-none transition-colors resize-none ${
                        errors.message
                          ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500'
                          : 'border-slate-700 focus:border-[#38BDF8]'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-block animate-spin mr-2">⏳</span>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? 'Sending Inquiry...' : 'Send Message'}</span>
                  </button>

                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    🔒 Direct connection with Digital X Multi Services. No spam guarantee.
                  </p>

                  {/* Review link prompt */}
                  <div className="pt-4 mt-4 border-t border-slate-700/60 text-center">
                    <span className="text-xs text-slate-400 mr-1.5">Already worked with us?</span>
                    <button
                      type="button"
                      onClick={() => {
                        const feedbackEl = document.getElementById('feedback');
                        if (feedbackEl) {
                          feedbackEl.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-xs font-semibold text-[#38BDF8] hover:text-blue-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Share your experience →</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
