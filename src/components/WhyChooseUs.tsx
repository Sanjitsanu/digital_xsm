import React from 'react';
import { WHY_CHOOSE_US } from '../data/siteData';
import { Sparkles, Zap, Tag, Smartphone, Headphones, Users, Layers } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'sparkle':
        return <Sparkles className="w-6 h-6 text-[#38BDF8]" />;
      case 'lightning':
        return <Zap className="w-6 h-6 text-[#60A5FA]" />;
      case 'pricetag':
        return <Tag className="w-6 h-6 text-[#38BDF8]" />;
      case 'mobile':
        return <Smartphone className="w-6 h-6 text-[#818CF8]" />;
      case 'headset':
        return <Headphones className="w-6 h-6 text-[#38BDF8]" />;
      case 'layers':
        return <Layers className="w-6 h-6 text-[#38BDF8]" />;
      case 'users':
      default:
        return <Users className="w-6 h-6 text-[#60A5FA]" />;
    }
  };

  return (
    <section id="why-us" className="relative py-20 lg:py-28 bg-[#071126] overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">
              WHY CHOOSE US
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#1769FF]">
              Digital X?
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            We bridge the gap between creative excellence, cutting-edge AI technologies, and high-impact digital delivery.
          </p>
        </div>

        {/* 7 Feature Cards Grid (including Complete Digital Solutions) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {WHY_CHOOSE_US.map((item, index) => {
            const isLast = index === WHY_CHOOSE_US.length - 1;
            return (
              <div
                key={item.id}
                className={`group relative rounded-2xl p-7 bg-[#0B1938]/70 hover:bg-[#0E214A] border transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20 ${
                  isLast 
                    ? 'md:col-span-2 lg:col-span-3 border-blue-400/40 bg-gradient-to-r from-[#0B1938]/90 via-[#0E2554]/80 to-[#0B1938]/90' 
                    : 'border-blue-500/15 hover:border-blue-400/40 hover:shadow-blue-500/15'
                }`}
              >
                {/* Top Row: Icon & Editorial Number */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-110">
                    {getIcon(item.iconName)}
                  </div>
                  <span className="text-xs font-bold tracking-widest text-slate-500 group-hover:text-blue-400 transition-colors font-mono">
                    {item.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-[#38BDF8] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
