import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/siteData';
import { ServiceItem } from '../types';
import { 
  Code2, 
  ShoppingCart, 
  Layout, 
  TrendingUp, 
  Share2, 
  Palette, 
  Feather, 
  Video, 
  Bot, 
  Workflow, 
  Check, 
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';

interface ServicesProps {
  onSelectServiceInquiry: (serviceCategory: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectServiceInquiry }) => {
  const [filterType, setFilterType] = useState<'all' | 'web' | 'marketing' | 'creative' | 'ai'>('all');

  const getServiceIcon = (iconName: ServiceItem['iconName']) => {
    switch (iconName) {
      case 'code':
        return <Code2 className="w-6 h-6 text-[#38BDF8]" />;
      case 'cart':
        return <ShoppingCart className="w-6 h-6 text-[#38BDF8]" />;
      case 'layout':
        return <Layout className="w-6 h-6 text-[#60A5FA]" />;
      case 'trending':
        return <TrendingUp className="w-6 h-6 text-[#38BDF8]" />;
      case 'meta':
        return (
          <div className="w-6 h-6 flex items-center justify-center font-bold text-[#38BDF8] text-sm font-sans">
            M
          </div>
        );
      case 'google':
        return <Search className="w-6 h-6 text-[#60A5FA]" />;
      case 'share':
        return <Share2 className="w-6 h-6 text-[#38BDF8]" />;
      case 'palette':
        return <Palette className="w-6 h-6 text-[#818CF8]" />;
      case 'feather':
        return <Feather className="w-6 h-6 text-[#38BDF8]" />;
      case 'video':
        return <Video className="w-6 h-6 text-[#F43F5E]" />;
      case 'bot':
        return <Bot className="w-6 h-6 text-[#38BDF8]" />;
      case 'workflow':
      default:
        return <Workflow className="w-6 h-6 text-[#34D399]" />;
    }
  };

  const filteredServices = SERVICES_DATA.filter((s) => {
    if (filterType === 'all') return true;
    if (filterType === 'web') return ['Website Development', 'E-commerce Website', 'Landing Page'].includes(s.category);
    if (filterType === 'marketing') return ['Digital Marketing', 'Meta Ads', 'Google Ads', 'Social Media Marketing'].includes(s.category);
    if (filterType === 'creative') return ['Branding & Graphic Design', 'Logo Design', 'Video Editing'].includes(s.category);
    if (filterType === 'ai') return ['AI Solutions', 'Business Automation'].includes(s.category);
    return true;
  });

  return (
    <section id="services" className="relative py-20 lg:py-28 bg-[#050D1E] overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">
              OUR SERVICES
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#1769FF]">
              Go Digital
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            From custom high-performance websites and ROI-focused ad campaigns to AI automations and premium branding — we build, market, and scale your brand.
          </p>

          {/* Quick Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                filterType === 'all'
                  ? 'bg-gradient-to-r from-[#1769FF] to-[#0052CC] text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#0B1938]/80 text-slate-300 hover:text-white hover:bg-[#0F224A] border border-blue-500/15'
              }`}
            >
              All 12 Services
            </button>
            <button
              type="button"
              onClick={() => setFilterType('web')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                filterType === 'web'
                  ? 'bg-gradient-to-r from-[#1769FF] to-[#0052CC] text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#0B1938]/80 text-slate-300 hover:text-white hover:bg-[#0F224A] border border-blue-500/15'
              }`}
            >
              Websites &amp; E-commerce
            </button>
            <button
              type="button"
              onClick={() => setFilterType('marketing')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                filterType === 'marketing'
                  ? 'bg-gradient-to-r from-[#1769FF] to-[#0052CC] text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#0B1938]/80 text-slate-300 hover:text-white hover:bg-[#0F224A] border border-blue-500/15'
              }`}
            >
              Marketing &amp; Ads
            </button>
            <button
              type="button"
              onClick={() => setFilterType('creative')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                filterType === 'creative'
                  ? 'bg-gradient-to-r from-[#1769FF] to-[#0052CC] text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#0B1938]/80 text-slate-300 hover:text-white hover:bg-[#0F224A] border border-blue-500/15'
              }`}
            >
              Branding &amp; Creative
            </button>
            <button
              type="button"
              onClick={() => setFilterType('ai')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                filterType === 'ai'
                  ? 'bg-gradient-to-r from-[#1769FF] to-[#0052CC] text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#0B1938]/80 text-slate-300 hover:text-white hover:bg-[#0F224A] border border-blue-500/15'
              }`}
            >
              AI &amp; Automation
            </button>
          </div>
        </div>

        {/* 12 Professional Service Cards Grid (Desktop: 3 col, Tablet: 2 col, Mobile: 1 col) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`group relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 bg-[#0B1938]/80 hover:bg-[#0E2046] border transition-all duration-300 hover:-translate-y-1.5 shadow-xl shadow-black/25 ${
                service.popular 
                  ? 'border-blue-400/40 ring-1 ring-blue-500/20' 
                  : 'border-blue-500/15 hover:border-blue-400/40'
              }`}
            >
              <div>
                {/* Header: Icon container & Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-400/30 flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-105">
                    {getServiceIcon(service.iconName)}
                  </div>
                  {service.badge && (
                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-[#38BDF8] transition-colors leading-snug">
                  {service.title}
                </h3>

                {/* Short description */}
                <p className="text-sm text-slate-300 mb-6 font-normal leading-relaxed">
                  {service.description}
                </p>

                {/* Sub-services list */}
                <div className="pt-4 border-t border-slate-700/50 mb-7">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    What's Included
                  </div>
                  <ul className="space-y-2">
                    {service.services.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <span className="w-4 h-4 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5 text-[#38BDF8]">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dedicated CTA button */}
              <button
                type="button"
                onClick={() => onSelectServiceInquiry(service.category)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] shadow-md shadow-blue-600/20 transition-all duration-200 cursor-pointer active:scale-[0.99]"
              >
                <span>{service.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Custom Consultation Strip */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/60 to-blue-950/60 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-[#38BDF8]" />
              <span>Need a customized multi-service bundle?</span>
            </h3>
            <p className="text-sm text-slate-300 mt-1">Combine website development, advertising campaigns, and automation for maximum ROI.</p>
          </div>
          <button
            type="button"
            onClick={() => onSelectServiceInquiry('Other')}
            className="shrink-0 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600/30 hover:bg-blue-600/40 border border-blue-400/40 transition-colors cursor-pointer"
          >
            Talk to Digital X
          </button>
        </div>

      </div>
    </section>
  );
};
