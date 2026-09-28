import React from 'react';
import { Search, FileSpreadsheet, Code, CheckCircle, Rocket, ArrowRight } from 'lucide-react';

interface HowWeWorkProps {
  onStartProject: () => void;
}

export const HowWeWork: React.FC<HowWeWorkProps> = ({ onStartProject }) => {
  const steps = [
    {
      num: '01',
      title: 'Discovery & Consultation',
      desc: 'We analyze your target market, competitors, current bottlenecks, and revenue goals.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Custom Scope & Quotation',
      desc: 'Receive a transparent itemized quotation and milestone roadmap with no hidden costs.',
      icon: FileSpreadsheet,
    },
    {
      num: '03',
      title: 'Design & Engineering',
      desc: 'Our developers and media designers craft high-speed responsive code and persuasive ad creatives.',
      icon: Code,
    },
    {
      num: '04',
      title: 'Client Review & Testing',
      desc: 'Collaborate live through your "My Digital X" portal to inspect deliverables and request revisions.',
      icon: CheckCircle,
    },
    {
      num: '05',
      title: 'Launch & Growth Scale',
      desc: 'Domain deployment, ad campaign activation, and ongoing performance optimization.',
      icon: Rocket,
    },
  ];

  return (
    <section id="how-we-work" className="py-20 bg-gradient-to-b from-[#071126] via-[#091738] to-[#071126] relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-500/10 text-cyan-300 border border-blue-400/25 mb-4 shadow-sm">
            <span>THE DIGITAL X PROCESS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            How We <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Deliver Real Growth</span>
          </h2>

          <p className="mt-4 text-base text-slate-300 leading-relaxed font-normal">
            A disciplined, milestone-driven execution model with complete transparency from kickoff to final launch.
          </p>
        </div>

        {/* 5-Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="p-5 rounded-2xl bg-[#0B1938]/90 border border-blue-500/20 flex flex-col justify-between hover:border-cyan-400/50 hover:bg-[#0E2047] transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xl font-black text-cyan-400/80 group-hover:text-cyan-300">
                      {st.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-cyan-300 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {st.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick CTA */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onStartProject}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] shadow-lg shadow-blue-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>Start Your Project With Us →</span>
          </button>
        </div>
      </div>
    </section>
  );
};
