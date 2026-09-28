import React, { useState } from 'react';
import { PORTFOLIO_PROJECTS } from '../data/siteData';
import { PortfolioCategory, PortfolioProject } from '../types';
import { PortfolioMockup } from './PortfolioMockup';
import { PortfolioModal } from './PortfolioModal';
import { ArrowUpRight } from 'lucide-react';

interface PortfolioProps {
  onSelectServiceInquiry: (category: string) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onSelectServiceInquiry }) => {
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory>('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // Updated categories as requested: All, Websites, E-commerce, Branding, Social Media, Ads, Video
  const filterCategories: PortfolioCategory[] = [
    'All',
    'Websites',
    'E-commerce',
    'Branding',
    'Social Media',
    'Ads',
    'Video',
  ];

  const filteredProjects = activeFilter === 'All'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="relative py-20 lg:py-28 bg-[#050B17] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">
              OUR PORTFOLIO
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Our Recent Projects
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Take a look at some of our recent web development, e-commerce, advertising, and branding works crafted for growing businesses.
          </p>
        </div>

        {/* Category Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterCategories.map((category) => {
            const isActive = activeFilter === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1769FF] to-[#0052CC] text-white shadow-md shadow-blue-600/30'
                    : 'bg-[#0B1938]/80 text-slate-300 hover:text-white hover:bg-[#0F224A] border border-blue-500/15'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group relative flex flex-col rounded-2xl p-4 sm:p-5 bg-[#0B1938]/70 hover:bg-[#0E2046] border border-blue-500/15 hover:border-blue-400/40 shadow-xl shadow-black/20 hover:shadow-blue-500/15 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Visual Showcase Card Frame */}
              <div className="mb-4 overflow-hidden rounded-xl">
                <PortfolioMockup project={project} size="card" />
              </div>

              {/* Category metadata */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="text-[#38BDF8] font-semibold">{project.category}</span>
                <span className="text-slate-500 font-medium">{project.details}</span>
              </div>

              {/* Title & Arrow */}
              <div className="flex items-start justify-between gap-3 mt-1">
                <h3 className="text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
                  {project.title}
                </h3>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-300 group-hover:bg-[#1769FF] group-hover:text-white transition-all shrink-0 mt-0.5">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-700/50">
                {project.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox / Modal */}
      <PortfolioModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={(category) => {
          onSelectServiceInquiry(category);
        }}
      />
    </section>
  );
};
