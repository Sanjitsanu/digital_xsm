import React, { useEffect } from 'react';
import { PortfolioProject } from '../types';
import { PortfolioMockup } from './PortfolioMockup';
import { X, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';

interface PortfolioModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onInquire: (category: string) => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ project, onClose, onInquire }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const handleInquireClick = () => {
    // Map project category to service option
    let targetService = 'Website Development';
    if (project.category === 'Websites') targetService = 'Website Development';
    else if (project.category === 'E-commerce') targetService = 'E-commerce Website';
    else if (project.category === 'Ads') targetService = 'Meta Ads';
    else if (project.category === 'Branding') targetService = 'Branding & Graphic Design';
    else if (project.category === 'Video') targetService = 'Video Editing';
    else if (project.category === 'Social Media') targetService = 'Social Media Marketing';

    onInquire(targetService);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0B1938] border border-blue-500/25 shadow-2xl shadow-black/80 overflow-hidden z-10 my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Visual Showcase */}
        <div className="p-4 sm:p-6 bg-[#071126] border-b border-blue-500/15">
          <PortfolioMockup project={project} size="modal" />
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {/* Category & Status */}
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400">
            <span className="text-[#38BDF8]">{project.category}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{project.details}</span>
          </div>

          {/* Title */}
          <h3 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {project.title}
          </h3>

          {/* Client context */}
          {project.clientContext && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-300/80 mb-4 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
              <span>{project.clientContext}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Tags */}
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-400" />
              <span>Deliverables &amp; Technologies</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-200 border border-blue-400/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t border-slate-700/60">
            <button
              type="button"
              onClick={handleInquireClick}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Inquire About Similar Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            >
              Close Preview
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
