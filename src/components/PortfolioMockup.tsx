import React from 'react';
import { PortfolioProject } from '../types';
import { Globe, Play, Award, ShoppingBag, Layout, ExternalLink, BarChart3, FileText, CheckCircle2 } from 'lucide-react';

interface PortfolioMockupProps {
  project: PortfolioProject;
  size?: 'card' | 'modal';
}

export const PortfolioMockup: React.FC<PortfolioMockupProps> = ({ project, size = 'card' }) => {
  const isModal = size === 'modal';
  const heightClass = isModal ? 'h-64 sm:h-80 md:h-96' : 'h-48 sm:h-52';

  const renderVisualContent = () => {
    switch (project.mockupType) {
      case 'website':
        return (
          <div className="w-full h-full bg-[#050B17] flex flex-col p-3 rounded-lg overflow-hidden border border-blue-500/20">
            {/* Browser top bar */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono px-3 py-0.5 rounded bg-slate-900 border border-slate-800 truncate max-w-[180px]">
                https://thedigitalx.in
              </div>
              <Globe className="w-3.5 h-3.5 text-blue-400" />
            </div>
            {/* Screen UI representation */}
            <div className="flex-1 flex flex-col justify-center items-center text-center p-4 bg-gradient-to-b from-[#0A162D] to-[#060D1A]">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-[#38BDF8] mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-sm sm:text-base font-bold text-white tracking-tight">
                {project.title}
              </div>
              <div className="text-xs text-[#38BDF8] mt-1 font-medium">
                {project.details}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-400/20">React 19</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">Tailwind CSS</span>
              </div>
            </div>
          </div>
        );

      case 'ecommerce':
        return (
          <div className="w-full h-full bg-[#050D19] flex flex-col p-3 rounded-lg overflow-hidden border border-emerald-500/20">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">STOREFRONT ONLINE</span>
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center text-center p-4 bg-gradient-to-b from-[#081827] to-[#050D19]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-2">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-white tracking-tight">
                {project.title}
              </div>
              <div className="text-xs text-emerald-300 mt-0.5">
                Cart &middot; UPI &middot; Checkout &middot; Mobile Fast
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-400/20">Shopify Engine</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-400/20">99.8% Uptime</span>
              </div>
            </div>
          </div>
        );

      case 'ad':
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col p-3.5 justify-between border border-cyan-500/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">High ROAS Campaign</span>
              <BarChart3 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-center py-2">
              <div className="text-xs font-semibold text-slate-300">Audience Targeting &amp; Creatives</div>
              <div className="text-sm sm:text-base font-bold text-white mt-1">{project.title}</div>
              <div className="text-xs text-cyan-300 mt-1 font-mono">{project.details}</div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Conversion Tracking Active</span>
              <span className="text-emerald-400 font-semibold">Optimized</span>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white transition-transform duration-300 group-hover:scale-110">
              <Play className="w-6 h-6 fill-current ml-1" />
            </div>
            <div className="text-sm font-bold text-white mt-3 text-center">
              {project.title}
            </div>
            <div className="text-xs text-indigo-300 mt-1">{project.details}</div>
          </div>
        );

      case 'logo':
        return (
          <div className="w-full h-full bg-[#081226] flex flex-col items-center justify-center p-4 relative border border-blue-500/10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-500/40 shadow-xl flex items-center justify-center relative p-3">
              <div className="w-full h-full rounded-xl border border-amber-400/30 flex flex-col items-center justify-center bg-black/40">
                <Award className="w-8 h-8 text-amber-400" />
                <span className="text-[10px] font-serif font-bold text-amber-200 mt-1 uppercase tracking-widest">
                  MRIGNAYANI
                </span>
              </div>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white mt-3 text-center">
              {project.title}
            </div>
            <div className="text-[11px] text-amber-400/80 mt-0.5 font-medium">
              {project.details}
            </div>
          </div>
        );

      case 'guidelines':
        return (
          <div className="w-full h-full bg-[#060D1E] flex flex-col p-4 justify-between border border-blue-500/10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest">Brand Standards</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <div className="grid grid-cols-4 gap-2 my-2">
              <div className="h-9 rounded bg-[#1769FF] flex items-center justify-center text-[9px] text-white font-mono">#1769FF</div>
              <div className="h-9 rounded bg-[#38BDF8] flex items-center justify-center text-[9px] text-slate-900 font-mono font-bold">#38BDF8</div>
              <div className="h-9 rounded bg-[#071126] border border-slate-700 flex items-center justify-center text-[9px] text-slate-300 font-mono">#071126</div>
              <div className="h-9 rounded bg-[#0B1938] border border-slate-700 flex items-center justify-center text-[9px] text-slate-300 font-mono">#0B1938</div>
            </div>
            <div className="text-[11px] text-slate-300 font-mono text-center">
              Typography &middot; Monogram &middot; Token Palette
            </div>
          </div>
        );

      case 'poster':
      default:
        return (
          <div className="w-full h-full bg-gradient-to-tr from-blue-950 via-slate-900 to-cyan-950 flex flex-col items-center justify-center p-4 relative text-center">
            <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-[#38BDF8] mb-2">
              <Layout className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-white max-w-[200px]">
              {project.title}
            </div>
            <div className="text-[11px] text-cyan-300 mt-1">
              {project.details}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center`}>
      {renderVisualContent()}
      <div className="absolute inset-0 bg-gradient-to-t from-[#071126]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
