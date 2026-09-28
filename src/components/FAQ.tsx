import React, { useState } from 'react';
import { FAQ_DATA } from '../data/siteData';
import { Plus, Minus } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="relative py-20 lg:py-28 bg-[#050D1E] overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">
              FAQ
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Frequently Asked Questions
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Everything you need to know about our web development, advertising campaigns, and digital services.
          </p>
        </div>

        {/* Accordion Container (10 Questions) */}
        <div className="space-y-3.5">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl transition-all duration-200 border ${
                  isOpen
                    ? 'bg-[#0B1938] border-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'bg-[#0B1938]/60 hover:bg-[#0E2046] border-blue-500/15'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full py-4.5 px-6 sm:px-7 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-2xl"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-white leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#1769FF] text-white rotate-180'
                        : 'bg-blue-500/10 text-[#38BDF8] border border-blue-400/20'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-5 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-700/40 mt-1">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
