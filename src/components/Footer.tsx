import React, { useState } from 'react';
import { Logo } from './Logo';
import { COMPANY_INFO } from '../data/siteData';
import { Phone, Mail, MapPin, Instagram, ArrowUp, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onSelectServiceInquiry: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection, onSelectServiceInquiry }) => {
  const [modalPolicy, setModalPolicy] = useState<{ title: string; content: string } | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const services = [
    'Website Development',
    'Digital Marketing',
    'AI Solutions',
    'Automation',
    'Branding',
  ];

  const company = [
    { label: 'About', id: 'about' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'How We Work', id: 'how-we-work' },
    { label: 'Contact', id: 'contact' },
  ];

  const policies = [
    {
      label: 'Privacy Policy',
      title: 'Privacy Policy',
      content:
        'Digital X Multi Services Pvt. Ltd. values client confidentiality. Inquiries, project requirements, brand assets, and customer contact data collected through our website, AI assistant, or WhatsApp automation are strictly utilized for service execution and are never sold or distributed to third parties.',
    },
    {
      label: 'Terms of Service',
      title: 'Terms of Service',
      content:
        'All client projects undertaken by Digital X Multi Services Pvt. Ltd. are governed by signed quotations and milestone roadmaps. Deliverables are transferred upon project completion and account settlement. Post-launch support is provided as defined in each service scope.',
    },
    {
      label: 'Refund & Revision Policy',
      title: 'Refund & Revision Policy',
      content:
        'We work on milestone approvals. Revisions are conducted in accordance with project scopes before launch. If a project cannot proceed prior to engineering kickoff, advances are processed according to the written quotation terms.',
    },
  ];

  return (
    <>
      <footer className="relative bg-[#040A18] text-slate-400 pt-16 pb-12 border-t border-blue-500/15 overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-blue-600/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
            {/* Col 1: Brand & Entity Details (4 cols) */}
            <div className="lg:col-span-4">
              <div className="mb-4">
                <Logo size="md" showSubtitle={true} />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4 max-w-sm">
                Digital X Multi Services Pvt. Ltd. is a full-cycle business growth platform providing website engineering, performance digital marketing, and AI workflow automation.
              </p>
              <div className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                Registered entity: <span className="text-slate-200 font-semibold">{COMPANY_INFO.name}</span>. Sonepur, Shahpur, Saran, Bihar 841101, India.
              </div>

              {/* Verified Social Link (No fake links) */}
              <div className="flex items-center gap-3">
                <a
                  href={COMPANY_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-pink-500/40 hover:bg-pink-500/10 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all"
                  aria-label="Digital X on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>WhatsApp: +91 7970884193</span>
                </a>
              </div>
            </div>

            {/* Col 2: Services (3 cols) */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                Services
              </h3>
              <ul className="space-y-2.5 text-sm">
                {services.map((srv) => (
                  <li key={srv}>
                    <button
                      type="button"
                      onClick={() => onSelectServiceInquiry(srv)}
                      className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                    >
                      {srv}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Company (2 cols) */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                Company
              </h3>
              <ul className="space-y-2.5 text-sm">
                {company.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onScrollToSection(c.id)}
                      className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Support & Policies (3 cols) */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                Support &amp; Trust
              </h3>
              <ul className="space-y-2.5 text-sm mb-4">
                <li>
                  <button
                    type="button"
                    onClick={() => onScrollToSection('faq')}
                    className="hover:text-cyan-300 transition-colors text-left cursor-pointer"
                  >
                    Frequently Asked Questions
                  </button>
                </li>
                {policies.map((p) => (
                  <li key={p.label}>
                    <button
                      type="button"
                      onClick={() => setModalPolicy({ title: p.title, content: p.content })}
                      className="hover:text-cyan-300 transition-colors text-left cursor-pointer text-xs"
                    >
                      {p.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="text-xs text-slate-500">
                Official Support: <span className="text-slate-300">{COMPANY_INFO.infoEmail}</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Back to Top */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Policy Modal */}
      {modalPolicy && (
        <div
          role="dialog"
          aria-label={modalPolicy.title}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="max-w-lg w-full bg-[#071126] border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
              <h4 className="text-base font-bold text-white">{modalPolicy.title}</h4>
              <button
                type="button"
                onClick={() => setModalPolicy(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {modalPolicy.content}
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Digital X Multi Services Pvt. Ltd. Compliance
            </div>
          </div>
        </div>
      )}
    </>
  );
};
