import React from 'react';
import { COMPANY_INFO } from '../data/siteData';
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Code2,
  Cpu,
  Mic,
  MessageSquare,
  Workflow,
  BarChart3,
  Bot
} from 'lucide-react';
import { trackEvent } from '../services/analyticsService';

interface HeroProps {
  onScrollToSection: (sectionId: string) => void;
  onTalkToVoiceAI?: () => void;
  onOpenTextAI?: () => void;
  onStartProject?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToSection,
  onTalkToVoiceAI,
  onOpenTextAI,
  onStartProject,
}) => {
  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden flex items-center bg-[#071126]">
      {/* Background ambient lighting and digital grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-[#1769FF]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#38BDF8]/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, #38BDF8 1px, transparent 1px), linear-gradient(to bottom, #38BDF8 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Headline & Main CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Positioning Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 w-fit mb-5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-xs font-bold tracking-wide uppercase text-blue-200">
                {COMPANY_INFO.positioning}
              </span>
            </div>

            {/* Headline (Section 3: "Build. Market. Automate. Grow.") */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
              Build. Market. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#1769FF]">
                Automate. Grow.
              </span>
            </h1>

            {/* Subheading (Section 3) */}
            <p className="text-sm sm:text-base lg:text-lg font-medium text-blue-200/90 mb-4 tracking-wide leading-relaxed">
              {COMPANY_INFO.subheading}
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed mb-8 font-normal">
              {COMPANY_INFO.heroDescription}
            </p>

            {/* Primary & Secondary CTAs (Section 3) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              {/* Primary CTA: "Start Your Project" */}
              <button
                type="button"
                onClick={() => {
                  trackEvent('hero_start_project', 'sales');
                  if (onStartProject) onStartProject();
                  else onScrollToSection('contact');
                }}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary CTA: "Talk to Digital X AI" */}
              <button
                type="button"
                onClick={() => {
                  trackEvent('hero_talk_to_ai_voice', 'ai');
                  if (onTalkToVoiceAI) onTalkToVoiceAI();
                }}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-cyan-300 bg-[#0B1938]/90 hover:bg-[#0F224D] border border-blue-400/40 hover:border-cyan-300 shadow-md shadow-blue-900/40 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
              >
                <Mic className="w-4 h-4 animate-pulse text-cyan-400" />
                <span>Talk to Digital X AI</span>
              </button>
            </div>

            {/* SECTION 4: DUAL AI OPTIONS (Ask Digital X AI & Talk to Digital X AI) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-[#0B1938]/80 border border-blue-500/25 mb-8">
              {/* Option A: Ask Digital X AI */}
              <div
                onClick={() => {
                  trackEvent('hero_click_ask_ai', 'ai');
                  if (onOpenTextAI) onOpenTextAI();
                  else onScrollToSection('ai-consultant');
                }}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-cyan-300 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Ask Digital X AI
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Tell us about your business and discover what digital solutions could help.
                </p>
              </div>

              {/* Option B: Talk to Digital X AI */}
              <div
                onClick={() => {
                  trackEvent('hero_click_talk_ai', 'ai');
                  if (onTalkToVoiceAI) onTalkToVoiceAI();
                }}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-cyan-600/20 text-cyan-300 flex items-center justify-center">
                    <Mic className="w-4 h-4 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    🎙️ Talk to Digital X AI
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Speak with our AI assistant about your business requirements in natural language.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: PREMIUM VISUAL CARDS (Section 3: Website, Marketing, AI, Automation, Growth) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md relative">
              {/* Decorative background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-3xl blur-2xl pointer-events-none" />

              <div className="relative rounded-3xl bg-[#0B1938]/95 border border-blue-500/30 p-6 shadow-2xl space-y-3.5 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Growth Ecosystem
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Integrated Platform
                  </span>
                </div>

                {/* 1. Website */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-cyan-300 flex items-center justify-center">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Website</div>
                      <div className="text-[11px] text-slate-400">High-speed e-commerce &amp; business portals</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-xs font-bold">Live</span>
                </div>

                {/* 2. Marketing */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-[#38BDF8] flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Marketing</div>
                      <div className="text-[11px] text-slate-400">Meta &amp; Google high-intent advertising</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-xs font-bold">Active</span>
                </div>

                {/* 3. AI */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-300 flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">AI</div>
                      <div className="text-[11px] text-slate-400">24/7 Voice &amp; Web Business Consultant</div>
                    </div>
                  </div>
                  <span className="text-cyan-300 text-xs font-bold">24/7</span>
                </div>

                {/* 4. Automation */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-300 flex items-center justify-center">
                      <Workflow className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Automation</div>
                      <div className="text-[11px] text-slate-400">WhatsApp API &amp; CRM pipeline sync</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-xs font-bold">Auto</span>
                </div>

                {/* 5. Growth */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-300 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Growth</div>
                      <div className="text-[11px] text-slate-400">Continuous measurement &amp; scale</div>
                    </div>
                  </div>
                  <span className="text-indigo-300 text-xs font-bold">Scalable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Contact Verification Strip */}
        <div className="mt-14 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <a 
            href={`tel:${COMPANY_INFO.phone}`}
            className="flex items-center gap-3 group p-2 rounded-xl hover:bg-slate-800/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#38BDF8] group-hover:scale-105 transition-all">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Direct Call Line</div>
              <div className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {COMPANY_INFO.phoneDisplay}
              </div>
            </div>
          </a>

          <a 
            href={`mailto:${COMPANY_INFO.infoEmail}`}
            className="flex items-center gap-3 group p-2 rounded-xl hover:bg-slate-800/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#38BDF8] group-hover:scale-105 transition-all">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Official Inquiries</div>
              <div className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {COMPANY_INFO.infoEmail}
              </div>
            </div>
          </a>

          <div className="flex items-center gap-3 p-2 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#38BDF8]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Registered Office</div>
              <div className="text-sm font-semibold text-slate-100">
                {COMPANY_INFO.address}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
