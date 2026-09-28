import React, { useState } from 'react';
import {
  Package,
  Check,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sliders,
  Bot
} from 'lucide-react';
import {
  DEFAULT_PILLAR_SERVICES,
  DEFAULT_PACKAGES,
  platformStore
} from '../services/platformStore';
import { PackagePillarService } from '../types';
import { trackEvent } from '../services/analyticsService';

interface BuildPackageToolProps {
  onRequestPackage: (selectedServices: string[], customNotes?: string) => void;
  onOpenQuoteModal?: (services?: string[]) => void;
}

export const BuildPackageTool: React.FC<BuildPackageToolProps> = ({
  onRequestPackage,
  onOpenQuoteModal,
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Website Development',
    'AI Website Chatbot',
    'WhatsApp Automation & API Flows',
  ]);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'BUILD' | 'MARKET' | 'AUTOMATE' | 'BRAND'>('ALL');
  const [customRequirement, setCustomRequirement] = useState('');

  // AI package suggestion prompt
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestedServices, setAiSuggestedServices] = useState<string[] | null>(null);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const allServices = DEFAULT_PILLAR_SERVICES;

  const filteredServices = activeCategory === 'ALL'
    ? allServices
    : allServices.filter((s) => s.category === activeCategory);

  const toggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  const applyPackageTemplate = (serviceList: string[]) => {
    // Map template names to exact service names
    const matched: string[] = [];
    serviceList.forEach((item) => {
      const match = allServices.find((s) =>
        s.name.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(s.name.toLowerCase())
      );
      if (match && !matched.includes(match.name)) {
        matched.push(match.name);
      } else if (!matched.includes(item)) {
        matched.push(item);
      }
    });
    setSelectedServices(matched);
    trackEvent('apply_package_template', 'sales', serviceList[0]);
  };

  // AI Recommendation within Package Builder (Section 27)
  const handleAiSuggest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsSuggesting(true);
    trackEvent('package_ai_suggestion', 'ai', aiPrompt);

    setTimeout(() => {
      const p = aiPrompt.toLowerCase();
      let recs: string[] = [];
      let reason = '';

      if (p.includes('restaurant') || p.includes('cafe') || p.includes('food')) {
        recs = [
          'High-Converting Landing Pages',
          'Meta Ads (Facebook & Instagram)',
          'WhatsApp Automation & API Flows',
          'Video Editing & Social Reels',
        ];
        reason = 'For restaurants & cafes, visual social media reels attract food lovers, while automated WhatsApp handles table reservations and catering queries effortlessly.';
      } else if (p.includes('shop') || p.includes('cloth') || p.includes('ecommerce') || p.includes('store')) {
        recs = [
          'Ecommerce Website Development',
          'Meta Ads (Facebook & Instagram)',
          'Google Ads & Search Marketing',
          'AI Website Chatbot',
          'AI Video Ad Creation',
        ];
        reason = 'An online retail brand requires an intuitive shopping catalog, conversion retargeting on Meta, and 24/7 AI chat assistance to prevent cart abandonment.';
      } else {
        recs = [
          'Website Development',
          'Meta Ads (Facebook & Instagram)',
          'AI Website Chatbot',
          'Logo Design & Brand Identity',
        ];
        reason = 'A professional custom website establishes credibility, while Meta ads and automated chatbot lead capture bring a steady stream of customer inquiries.';
      }

      setAiSuggestedServices(recs);
      setAiReasoning(reason);
      setIsSuggesting(false);
    }, 500);
  };

  const handleApplyAiSuggestion = () => {
    if (aiSuggestedServices) {
      setSelectedServices(aiSuggestedServices);
      setAiSuggestedServices(null);
      setAiReasoning(null);
    }
  };

  const handleRequest = () => {
    trackEvent('request_package_custom', 'sales', `${selectedServices.length}_services`);
    if (onOpenQuoteModal) {
      onOpenQuoteModal(selectedServices);
    } else {
      onRequestPackage(selectedServices, customRequirement);
    }
  };

  // Estimate total from catalog
  const estimatedSubtotal = selectedServices.reduce((sum, sName) => {
    const s = allServices.find((item) => item.name === sName);
    return sum + (s?.basePrice || 15000);
  }, 0);

  return (
    <section id="package-builder" className="py-20 bg-[#071126] relative overflow-hidden border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-500/10 text-cyan-300 border border-blue-400/25 mb-4 shadow-sm">
            <Sliders className="w-3.5 h-3.5" />
            <span>INTERACTIVE TOOL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Build Your <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Digital Package</span>
          </h2>

          <p className="mt-4 text-base text-slate-300 font-normal leading-relaxed">
            Choose exactly what your business needs from our four pillars. Customize scope, review live estimates, or let our AI suggest the ideal stack.
          </p>
        </div>

        {/* 1. PRESET PACKAGES (Section 25: Example package structures) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Popular Package Structures (Click to Load):
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">*Configurable base starting scopes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DEFAULT_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => applyPackageTemplate(pkg.services)}
                className="group relative rounded-2xl bg-[#0B1938]/90 border border-blue-500/20 p-5 hover:border-cyan-400/50 hover:bg-[#0E2047] transition-all cursor-pointer shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                      {pkg.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      From ₹{pkg.baseStartingPrice.toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {pkg.name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
                    {pkg.tagline}
                  </p>

                  <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                    {pkg.services.map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 text-xs font-bold text-cyan-400 group-hover:underline flex items-center justify-between">
                  <span>Load this package</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. AI PACKAGE RECOMMENDATION STRIP (Section 27) */}
        <div className="mb-12 p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-[#0B1938] to-blue-950/70 border border-blue-500/30 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Ask AI to Recommend a Package</h4>
                <p className="text-xs text-slate-400">e.g., &ldquo;I have a new restaurant and want more customers&rdquo;</p>
              </div>
            </div>

            <form onSubmit={handleAiSuggest} className="w-full md:w-auto flex-1 max-w-md flex items-center gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your business scenario..."
                className="flex-1 bg-slate-900 text-white placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!aiPrompt.trim() || isSuggesting}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-bold text-white whitespace-nowrap cursor-pointer transition-colors"
              >
                {isSuggesting ? 'Thinking...' : 'Get Suggestion'}
              </button>
            </form>
          </div>

          {/* AI Suggestion Display */}
          {aiSuggestedServices && (
            <div className="mt-4 pt-4 border-t border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
              <div>
                <div className="text-xs font-bold text-cyan-300 mb-1">Recommended Stack:</div>
                <div className="flex flex-wrap gap-1.5">
                  {aiSuggestedServices.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-200 text-xs font-medium border border-blue-400/30">
                      ✓ {s}
                    </span>
                  ))}
                </div>
                {aiReasoning && (
                  <p className="text-xs text-slate-300 mt-2 italic">&ldquo;{aiReasoning}&rdquo;</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleApplyAiSuggestion}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shrink-0 cursor-pointer shadow-md"
              >
                Apply to Selection
              </button>
            </div>
          )}
        </div>

        {/* 3. MAIN BUILDER: SERVICES SELECTOR + LIVE SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Category tabs + Services list (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#0B1938] border border-blue-500/20">
              {(['ALL', 'BUILD', 'MARKET', 'AUTOMATE', 'BRAND'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'All Services' : cat}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredServices.map((service) => {
                const isSelected = selectedServices.includes(service.name);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.name)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-950/60 border-cyan-400/60 shadow-md shadow-blue-900/30'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {service.category}
                        </span>
                        {service.popular && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                            Popular
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                        {service.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {service.description}
                      </p>

                      <div className="text-xs font-mono font-semibold text-slate-300 mt-2">
                        Est. ₹{service.basePrice.toLocaleString()}
                      </div>
                    </div>

                    {/* Checkbox toggle */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950'
                          : 'border border-slate-700 text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Live Summary Box (4 cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="rounded-2xl bg-[#0B1938] border border-blue-500/30 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-400" />
                  <span>Your Package Summary</span>
                </h3>
                <span className="text-xs font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-blue-500/20">
                  {selectedServices.length} Selected
                </span>
              </div>

              {/* Selected List */}
              {selectedServices.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No services selected yet. Click any service card on the left to add it to your custom bundle.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                  {selectedServices.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200"
                    >
                      <span className="truncate pr-2 font-medium">{item}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleService(item);
                        }}
                        className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Scope Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Optional Custom Requirements:
                </label>
                <textarea
                  rows={2}
                  value={customRequirement}
                  onChange={(e) => setCustomRequirement(e.target.value)}
                  placeholder="Any specific features, deadlines, or integrations..."
                  className="w-full bg-slate-900/90 text-white placeholder-slate-400 text-xs p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Estimated Pricing Note */}
              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Estimated Baseline:</span>
                  <span className="font-mono text-sm font-bold text-white">
                    ₹{estimatedSubtotal.toLocaleString()}*
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  *Exact quotation is tailored to your specific scope and volume. No hidden fees.
                </p>
              </div>

              {/* CTA: "Request This Package" */}
              <button
                type="button"
                disabled={selectedServices.length === 0}
                onClick={handleRequest}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] disabled:opacity-40 shadow-lg shadow-blue-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Request This Package →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
