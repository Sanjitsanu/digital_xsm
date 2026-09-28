import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  MessageCircle,
  Phone,
  FileText,
  Send,
  Zap
} from 'lucide-react';
import { COMPANY_INFO } from '../data/siteData';
import { platformStore } from '../services/platformStore';
import { trackEvent } from '../services/analyticsService';

interface AIBusinessConsultantProps {
  onOpenQuoteModal?: (preselectedServices?: string[]) => void;
  onOpenVoiceAssistant?: () => void;
  onOpenChatbot?: (query?: string) => void;
  onSelectServiceInquiry?: (serviceName: string) => void;
}

interface RecommendationResult {
  businessType: string;
  goal: string;
  recommendedServices: string[];
  rationale: string;
  suggestedPackage: string;
}

export const AIBusinessConsultant: React.FC<AIBusinessConsultantProps> = ({
  onOpenQuoteModal,
  onOpenVoiceAssistant,
  onOpenChatbot,
  onSelectServiceInquiry,
}) => {
  const [mode, setMode] = useState<'freeform' | 'guided'>('freeform');
  const [freeformInput, setFreeformInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  // Guided questions state
  const [guidedStep, setGuidedStep] = useState(0);
  const [guidedAnswers, setGuidedAnswers] = useState<Record<string, string>>({
    businessType: '',
    goal: '',
    hasWebsite: '',
    runsAds: '',
    contactChannel: '',
    budget: '',
    timeline: '',
  });

  const GUIDED_QUESTIONS = [
    {
      key: 'businessType',
      question: '1. What type of business do you have?',
      placeholder: 'e.g., Salon, Clothing Store, Clinic, Construction, Coaching...',
      presets: ['Retail / Ecommerce', 'Salon / Spa / Beauty', 'Doctor / Clinic', 'Real Estate / Interior', 'Restaurant / Cafe', 'B2B / Professional Service'],
    },
    {
      key: 'goal',
      question: '2. What are you trying to achieve right now?',
      placeholder: 'e.g., Get more local clients, boost online sales, build credibility...',
      presets: ['Get more local walk-in customers', 'Generate qualified leads for sales', 'Sell products online via e-commerce', 'Build brand authority & reach'],
    },
    {
      key: 'hasWebsite',
      question: '3. Do you currently have a live website?',
      presets: ['No, need a brand new website', 'Yes, but it is outdated / slow', 'Yes, looking for marketing & ads only'],
    },
    {
      key: 'runsAds',
      question: '4. Do you currently run Meta or Google Ads?',
      presets: ['Never run ads before', 'Tried boosting posts with little return', 'Yes, looking for expert management'],
    },
    {
      key: 'budget',
      question: '5. What is your approximate investment budget?',
      presets: ['₹20,000 - ₹40,000', '₹40,000 - ₹80,000', '₹80,000+', 'Flexible based on ROI'],
    },
  ];

  // Intelligent recommendation engine grounded in Digital X services
  const analyzeRequirement = (inputQuery: string): RecommendationResult => {
    const q = inputQuery.toLowerCase();

    // 1. Salon / Spa / Beauty
    if (q.includes('salon') || q.includes('beauty') || q.includes('parlor') || q.includes('spa')) {
      return {
        businessType: 'Salon / Beauty & Wellness',
        goal: 'Attract local walk-in appointments & repeat clients',
        recommendedServices: [
          'Professional Business Website',
          'Google Business Profile Optimization',
          'Meta Ads (Instagram & Facebook Local Ads)',
          'WhatsApp Automation (Appointment Auto-Replies)',
          'Instagram Reels & Visual Creatives',
          'Online Appointment Booking System',
        ],
        rationale: 'For local salons, visual Instagram marketing combined with Google Search ranking and instant WhatsApp booking is the fastest way to keep chairs filled.',
        suggestedPackage: 'BUSINESS GROWTH ENGINE',
      };
    }

    // 2. Clothing / Fashion / Retail Ecommerce
    if (q.includes('cloth') || q.includes('fashion') || q.includes('ecommerce') || q.includes('e-commerce') || q.includes('shop') || q.includes('store') || q.includes('product')) {
      return {
        businessType: 'Clothing & Retail E-commerce',
        goal: 'Drive scalable nationwide online product sales',
        recommendedServices: [
          'E-commerce Website (Shopify / Custom)',
          'Meta Ads (Catalog & Conversion Campaigns)',
          'Google Shopping & Search Ads',
          'AI Website Chatbot for Product FAQs',
          'WhatsApp Order Tracking & Cart Recovery',
          'AI Video Ads (9:16 Social Product Reels)',
        ],
        rationale: 'E-commerce success requires a frictionless mobile shopping experience paired with high-converting Meta retargeting and AI customer support.',
        suggestedPackage: 'AI AUTOMATION SUITE',
      };
    }

    // 3. Healthcare / Clinic / Doctor / Dental
    if (q.includes('clinic') || q.includes('doctor') || q.includes('dental') || q.includes('hospital') || q.includes('patient') || q.includes('health')) {
      return {
        businessType: 'Healthcare & Specialized Clinic',
        goal: 'Build patient trust and increase verified consultations',
        recommendedServices: [
          'High-Trust Medical Website',
          'Google Search Ads (High Intent Local Queries)',
          'Google Business Profile & Reviews Engine',
          'WhatsApp Patient Scheduling Flow',
          'Branding & Patient Education Collateral',
        ],
        rationale: 'Patients look for credibility and easy contact. High-intent Google Search ads capture urgent inquiries, while WhatsApp automation confirms appointments.',
        suggestedPackage: 'STARTER DIGITAL SETUP',
      };
    }

    // 4. Restaurant / Cafe / Food
    if (q.includes('restaurant') || q.includes('cafe') || q.includes('food') || q.includes('dining')) {
      return {
        businessType: 'Restaurant & Dining',
        goal: 'Drive footfall, table reservations, and direct delivery orders',
        recommendedServices: [
          'Mobile Menu Landing Page',
          'Google Business Profile & Local SEO',
          'Instagram Video Editing & Reels',
          'Meta Ads (Radius Targeting)',
          'WhatsApp Menu & Reservation Automation',
        ],
        rationale: 'Appetizing visual content on Instagram backed by radius-based Meta ads and 1-tap WhatsApp reservations yields high weekend footfall.',
        suggestedPackage: 'BUSINESS GROWTH ENGINE',
      };
    }

    // 5. General B2B / Startup / Real Estate / Professional Services
    return {
      businessType: 'Business / Service Provider',
      goal: 'Generate qualified inbound leads and streamline operations',
      recommendedServices: [
        'High-Converting Corporate Website',
        'Meta & Google Ads Campaign Setup',
        'AI Website Chatbot & Lead Qualification',
        'WhatsApp Business API Automation',
        'Brand Identity & Sales Pitch Decks',
      ],
      rationale: 'A polished digital footprint coupled with targeted search ads and automated lead triage ensures every inbound query is captured and converted.',
      suggestedPackage: 'AI AUTOMATION SUITE',
    };
  };

  const handleFreeformSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeformInput.trim()) return;

    setIsAnalyzing(true);
    trackEvent('ai_consultant_query', 'ai', freeformInput.slice(0, 50));

    setTimeout(() => {
      const result = analyzeRequirement(freeformInput);
      setRecommendation(result);
      setIsAnalyzing(false);

      // Save to shared AI context
      platformStore.setSharedAIContext({
        businessName: result.businessType,
        interestedService: result.recommendedServices.slice(0, 2).join(', '),
        summary: `Consultant recommended: ${result.recommendedServices.join(', ')}`,
      });
    }, 600);
  };

  const handleGuidedSelect = (key: string, value: string) => {
    const updated = { ...guidedAnswers, [key]: value };
    setGuidedAnswers(updated);

    if (guidedStep < GUIDED_QUESTIONS.length - 1) {
      setGuidedStep(guidedStep + 1);
    } else {
      // Completed all questions
      setIsAnalyzing(true);
      setTimeout(() => {
        const combined = `${updated.businessType} ${updated.goal} ${updated.hasWebsite} ${updated.runsAds}`;
        const result = analyzeRequirement(combined);
        setRecommendation(result);
        setIsAnalyzing(false);
      }, 500);
    }
  };

  const handleReset = () => {
    setRecommendation(null);
    setGuidedStep(0);
    setFreeformInput('');
  };

  const getWhatsAppRecommendUrl = () => {
    if (!recommendation) return `https://wa.me/${COMPANY_INFO.whatsappNumber}`;
    const text =
      `Hello Digital X Team! I used your AI Business Consultant for my ${recommendation.businessType}.\n\n` +
      `🎯 Goal: ${recommendation.goal}\n` +
      `💡 Recommended Setup:\n${recommendation.recommendedServices.map((s) => `• ${s}`).join('\n')}\n\n` +
      `I would like to discuss next steps.`;
    return `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="ai-consultant" className="py-20 bg-gradient-to-b from-[#071126] via-[#09173A] to-[#071126] relative overflow-hidden border-t border-blue-500/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-500/10 text-[#38BDF8] border border-blue-400/25 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>AI BUSINESS CONSULTANT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Tell Us About Your Business. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              Discover Exactly What You Need.
            </span>
          </h2>

          <p className="mt-4 text-base text-slate-300 leading-relaxed font-normal">
            No generic packages or wasted ad spend. Our AI evaluates your specific industry, goals, and customer behavior to recommend only the digital solutions that will move the needle.
          </p>

          {/* Mode Switcher */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('freeform');
                handleReset();
              }}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'freeform'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💬 Describe in Your Words (English / Hindi)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('guided');
                handleReset();
              }}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'guided'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎯 5-Step Guided Diagnosis
            </button>
          </div>
        </div>

        {/* CONSULTANT INTERACTION CONTAINER */}
        <div className="rounded-3xl bg-[#0B1938]/90 border border-blue-500/30 p-6 sm:p-8 shadow-2xl shadow-black/60 backdrop-blur-xl">
          {!recommendation ? (
            <>
              {mode === 'freeform' ? (
                /* FREEFORM INPUT */
                <form onSubmit={handleFreeformSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span>Type your business details (e.g., &ldquo;Mera salon hai aur mujhe customers chahiye&rdquo; or &ldquo;I run an online clothing store&rdquo;):</span>
                  </div>

                  <textarea
                    rows={4}
                    value={freeformInput}
                    onChange={(e) => setFreeformInput(e.target.value)}
                    placeholder="Tell us what you sell, who your target buyers are, and what problems you're trying to solve..."
                    className="w-full bg-slate-900/95 text-white placeholder-slate-400 text-sm sm:text-base p-4 rounded-2xl border border-slate-700/70 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all leading-relaxed"
                  />

                  {/* Sample prompt pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-slate-400 font-medium">Quick examples:</span>
                    {[
                      'Mera salon hai aur mujhe local customers chahiye',
                      'I run a clothing business and want more online sales',
                      'Doctor clinic with urgent need for patient bookings',
                      'B2B manufacturing firm needing professional website & leads',
                    ].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => setFreeformInput(sample)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-blue-200 hover:text-white border border-slate-700 hover:border-cyan-400 transition-colors cursor-pointer"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Instant AI tailored recommendation • 100% Free</span>
                    </div>

                    <button
                      type="submit"
                      disabled={!freeformInput.trim() || isAnalyzing}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] disabled:opacity-50 shadow-lg shadow-blue-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                      {isAnalyzing ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Analyzing Your Business...</span>
                        </>
                      ) : (
                        <>
                          <span>Analyze &amp; Recommend Solutions</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* GUIDED STEP-BY-STEP DIAGNOSIS */
                <div className="space-y-6">
                  {/* Progress dots */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <span className="font-semibold text-cyan-400">Step {guidedStep + 1} of {GUIDED_QUESTIONS.length}</span>
                    <span>Guided AI Diagnosis</span>
                  </div>

                  {/* Current Question */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                      {GUIDED_QUESTIONS[guidedStep].question}
                    </h3>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {GUIDED_QUESTIONS[guidedStep].presets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleGuidedSelect(GUIDED_QUESTIONS[guidedStep].key, preset)}
                          className="text-left px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-blue-600/20 text-slate-200 hover:text-white border border-slate-700/60 hover:border-cyan-400/50 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-between group"
                        >
                          <span>{preset}</span>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* RESULTS DISPLAY */
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-blue-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-cyan-400 uppercase tracking-wide">Analysis Complete</div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Recommended Strategy for {recommendation.businessType}</h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Over</span>
                </button>
              </div>

              {/* Rationale Callout */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed">
                <strong className="text-cyan-300 font-semibold block mb-1">Why we recommend this setup:</strong>
                {recommendation.rationale}
              </div>

              {/* Recommended Services Grid */}
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Tailored Digital Setup:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recommendation.recommendedServices.map((srv, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-100 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons as specified in Master Prompt: "Get a Quote", "Talk to Human", "Start Project" */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                {/* 1. Get a Quote */}
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('consultant_get_quote', 'sales', recommendation.businessType);
                    if (onOpenQuoteModal) {
                      onOpenQuoteModal(recommendation.recommendedServices);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Get a Quote →</span>
                </button>

                {/* 2. Talk to Human */}
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  onClick={() => trackEvent('consultant_call_human', 'engagement')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>Talk to Human</span>
                </a>

                {/* 3. Continue on WhatsApp */}
                <a
                  href={getWhatsAppRecommendUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('consultant_whatsapp', 'engagement')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-110 shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss on WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
