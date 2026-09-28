import React from 'react';
import { ABOUT_DATA, COMPANY_INFO } from '../data/siteData';
import { CheckCircle2, ShieldCheck, Code2, TrendingUp, Cpu, Award } from 'lucide-react';

export const About: React.FC = () => {
  const getFocusIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Code2 className="w-5 h-5 text-[#38BDF8]" />;
      case 1:
        return <TrendingUp className="w-5 h-5 text-[#60A5FA]" />;
      case 2:
      default:
        return <Cpu className="w-5 h-5 text-[#818CF8]" />;
    }
  };

  return (
    <section id="about" className="relative py-20 lg:py-28 bg-[#071126] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Split Layout: Who We Are */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column: Who We Are */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
              <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">
                {ABOUT_DATA.sectionBadge}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
              {ABOUT_DATA.heading}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 font-normal">
              {ABOUT_DATA.description}
            </p>

            <div className="p-4 rounded-xl bg-blue-950/40 border-l-4 border-[#1769FF] mb-6">
              <p className="text-base font-semibold text-white">
                "{ABOUT_DATA.missionSummary}"
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-8">
              Headquartered in Saran, Bihar, <strong className="text-white">{COMPANY_INFO.name}</strong> was built on a commitment to deliver enterprise-grade digital development, high-ROI performance marketing, and creative design to startups, retail merchants, and expanding companies across India.
            </p>

            {/* Trust signal / Location marker */}
            <div className="inline-flex items-center gap-3 p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs sm:text-sm text-blue-200">
              <Award className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span>Registered Private Limited Digital Services Company &middot; Est. Bihar, India</span>
            </div>
          </div>

          {/* Right Column: Key Commitments */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl p-6 sm:p-7 bg-[#0B1938]/80 border border-blue-500/20 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Our Operating Standards</h3>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-white">Zero Fragmentation</div>
                  <div className="text-xs text-slate-400 mt-0.5">Website development, advertising, and branding all handled in sync under one roof.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-white">Speed &amp; Mobile Optimization</div>
                  <div className="text-xs text-slate-400 mt-0.5">Responsive architectures crafted for rapid mobile speeds and frictionless checkout.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-white">Real ROI Focus</div>
                  <div className="text-xs text-slate-400 mt-0.5">Campaigns and assets constructed with honest performance benchmarks and data tracking.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-white">Dedicated Client Support</div>
                  <div className="text-xs text-slate-400 mt-0.5">Direct accessibility via WhatsApp and phone with reliable turnaround times.</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Three Focus Areas: BUILD, GROW, SCALE */}
        <div className="pt-12 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold tracking-widest text-[#38BDF8] uppercase mb-2">
              OUR STRATEGIC PILLARS
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              How Digital X Powers Growth
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {ABOUT_DATA.focusAreas.map((focus, idx) => (
              <div
                key={idx}
                className="group relative p-7 rounded-2xl bg-[#0B1938]/60 hover:bg-[#0E2046] border border-blue-500/15 hover:border-blue-400/35 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center">
                    {getFocusIcon(idx)}
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-500/20 text-[#38BDF8] border border-blue-400/30">
                    {focus.badge}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#38BDF8] transition-colors">
                  {focus.title}
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {focus.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
