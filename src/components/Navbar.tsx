import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowRight, Mic, Building, ShieldCheck, Lock } from 'lucide-react';
import { trackEvent } from '../services/analyticsService';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
  onTalkToAI?: () => void;
  onOpenClientPortal?: () => void;
  onOpenAdminPortal?: () => void;
  onStartProject?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onTalkToAI,
  onOpenClientPortal,
  onOpenAdminPortal,
  onStartProject,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['home', 'services', 'solutions', 'ai-consultant', 'portfolio', 'how-we-work', 'about', 'faq', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exact navigation specified in Section 2 (NO "Our Team")
  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Services', id: 'services' },
    { label: 'AI Video Creator', id: 'ai-video-ads' },
    { label: 'Solutions', id: 'solutions' },
    { label: 'AI Consultant', id: 'ai-consultant' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'How We Work', id: 'how-we-work' },
    { label: 'About', id: 'about' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3 shadow-lg shadow-black/30 bg-[#071126]/90 backdrop-blur-md border-b border-blue-500/20'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Zone 1: Brand Logo */}
            <a 
              href="#home" 
              onClick={(e) => handleLinkClick(e, 'home')}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
              aria-label="Digital X Home"
            >
              <Logo size="md" />
            </a>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0B1938]/80 border border-blue-500/20 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'text-white bg-[#1769FF] shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Zone 3: CTA & Portal Action Buttons */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Secondary CTA: "Talk to Digital X AI" (Section 2) */}
              <button
                type="button"
                onClick={() => {
                  trackEvent('nav_talk_to_ai', 'ai');
                  if (onTalkToAI) onTalkToAI();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-400/30 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span>Talk to Digital X AI</span>
              </button>

              {/* Portal Links (Client & Admin) */}
              {onOpenClientPortal && (
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('nav_client_portal', 'navigation');
                    onOpenClientPortal();
                  }}
                  title="My Digital X Client Dashboard"
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden xl:inline">My Digital X</span>
                </button>
              )}

              {onOpenAdminPortal && (
                <button
                  type="button"
                  onClick={onOpenAdminPortal}
                  title="Admin Platform"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}

              {/* Theme Toggle (Desktop) */}
              <ThemeToggle size="md" />

              {/* Primary CTA: "Start Your Project" (Section 2) */}
              <button
                type="button"
                onClick={() => {
                  trackEvent('nav_start_project', 'sales');
                  if (onStartProject) onStartProject();
                  else if (onNavigate) onNavigate('contact');
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] shadow-md shadow-blue-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Actions: Theme Toggle + AI Button + Menu Trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle size="sm" />

              <button
                type="button"
                onClick={() => {
                  if (onTalkToAI) onTalkToAI();
                }}
                className="p-2 rounded-xl bg-blue-600/20 text-cyan-300 border border-blue-400/30 text-xs font-bold flex items-center gap-1"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>AI</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#071126] border-b border-blue-500/20 px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-2xl">
            <div className="grid grid-cols-2 gap-1.5 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-blue-600/20 rounded-lg"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onStartProject) onStartProject();
                  else if (onNavigate) onNavigate('contact');
                }}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                <span className="font-semibold">Display Theme</span>
                <ThemeToggle showLabel size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {onOpenClientPortal && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenClientPortal();
                    }}
                    className="py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
                  >
                    My Digital X Portal
                  </button>
                )}

                {onOpenAdminPortal && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdminPortal();
                    }}
                    className="py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
                  >
                    Admin Hub
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
