import React from 'react';
import {
  FolderKanban,
  CheckSquare,
  FileText,
  MessageSquare,
  CreditCard,
  LifeBuoy,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface ClientDashboardPreviewProps {
  onOpenPortal: () => void;
}

export const ClientDashboardPreview: React.FC<ClientDashboardPreviewProps> = ({ onOpenPortal }) => {
  return (
    <section className="py-20 bg-[#071126] relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 mb-4 shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>CLIENT COLLABORATION PORTAL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Total Transparency With <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              &ldquo;My Digital X&rdquo; Dashboard
            </span>
          </h2>

          <p className="mt-4 text-base text-slate-300 leading-relaxed font-normal">
            No guessing games or endless email chains. Every Digital X client gets a dedicated portal to track real-time project milestones, inspect deliverables, review invoices, and communicate directly with their assigned team.
          </p>
        </div>

        {/* Dashboard Preview Mockup Graphic */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#0B1938] border border-blue-500/30 p-6 sm:p-8 shadow-2xl shadow-blue-900/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-blue-500/20 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Live Client Project Feed
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Website Development &amp; AI Automation (Demo View)
              </h3>
              <p className="text-xs text-slate-400">
                Status: In Active Engineering • Expected Delivery: Within 2 Weeks
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenPortal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <span>Launch &ldquo;My Digital X&rdquo; Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Feature Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1">
                <FolderKanban className="w-4 h-4" />
                <span>Live Milestones</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">75% Complete</div>
              <span className="text-[10px] text-slate-400">Planning → Design → Dev → Launch</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                <CheckSquare className="w-4 h-4" />
                <span>Tasks Checklist</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">4 / 7 Completed</div>
              <span className="text-[10px] text-slate-400">Real-time status updates</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-1">
                <FileText className="w-4 h-4" />
                <span>Files &amp; Assets</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">3 Shared</div>
              <span className="text-[10px] text-slate-400">Secure upload/download</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-300 mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Payment Tracking</span>
              </div>
              <div className="text-lg font-bold font-mono text-white">50% Paid</div>
              <span className="text-[10px] text-slate-400">Transparent invoice records</span>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Includes 24/7 technical ticketing, chat history, and official downloadable PDF quotations.</span>
            </span>
            <button
              type="button"
              onClick={onOpenPortal}
              className="text-xs text-cyan-300 hover:underline font-semibold cursor-pointer whitespace-nowrap ml-2"
            >
              Test Portal Demo →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
