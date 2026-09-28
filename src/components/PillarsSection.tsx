import React from 'react';
import { CORE_PILLARS } from '../data/siteData';
import { Code2, TrendingUp, Cpu, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '../services/analyticsService';

interface PillarsSectionProps {
  onSelectService: (serviceName: string) => void;
  onExplorePillar?: (pillarKey: string) => void;
}

export const PillarsSection: React.FC<PillarsSectionProps> = ({
  onSelectService,
  onExplorePillar,
}) => {
  const getPillarIcon = (key: string) => {
    switch (key) {
      case 'BUILD':
        return Code2;
      case 'MARKET':
        return TrendingUp;
      case 'AUTOMATE':
        return Cpu;
      case 'BRAND':
        return Sparkles;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="solutions" className="py-20 bg-[#071126] relative overflow-hidden border-t border-slate-800/60">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-500/10 text-cyan-300 border border-blue-400/25 mb-4 shadow-sm">
            <span>THE 4 GROWTH PILLARS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            One Partner. <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Everything Digital.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            From foundational platforms to automated customer acquisition, Digital X integrates all aspects of your digital presence under one unified ecosystem.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_PILLARS.map((pillar) => {
            const Icon = getPillarIcon(pillar.key);
            return (
              <div
                key={pillar.id}
                className={`group relative rounded-2xl bg-gradient-to-b from-[#0B1938] to-[#071126] border border-blue-500/20 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-600/15 ${pillar.borderGlow}`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-black tracking-widest text-slate-400 group-hover:text-cyan-300 transition-colors">
                      {pillar.title}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div className="text-xs font-bold text-blue-300/90 tracking-wide mb-2 uppercase">
                    {pillar.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {pillar.description}
                  </p>

                  {/* Sub-services pills */}
                  <div className="space-y-2 border-t border-slate-800/80 pt-4 mb-6">
                    {pillar.services.map((srv, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          trackEvent('pillar_service_click', 'navigation', srv);
                          onSelectService(srv);
                        }}
                        className="w-full text-left flex items-center justify-between text-xs text-slate-300 hover:text-white hover:bg-blue-600/15 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{srv}</span>
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('explore_pillar', 'navigation', pillar.key);
                    if (onExplorePillar) onExplorePillar(pillar.key);
                    else onSelectService(pillar.services[0]);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-gradient-to-r hover:from-[#1769FF] hover:to-[#0052CC] text-xs font-bold text-slate-200 hover:text-white border border-slate-700/60 hover:border-transparent transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <span>Explore {pillar.title} Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
