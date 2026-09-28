/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PillarsSection } from './components/PillarsSection';
import { Services } from './components/Services';
import { AIBusinessConsultant } from './components/AIBusinessConsultant';
import { WhoWeHelp } from './components/WhoWeHelp';
import { HowWeWork } from './components/HowWeWork';
import { BuildPackageTool } from './components/BuildPackageTool';
import { Portfolio } from './components/Portfolio';
import { AIVideoAdCreator } from './components/AIVideoAdCreator';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ClientDashboardPreview } from './components/ClientDashboardPreview';
import { ClientFeedback } from './components/ClientFeedback';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

// Modals and Floating Tools
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AIChatbot } from './components/AIChatbot';
import { AIVoiceAssistant } from './components/AIVoiceAssistant';
import { QuotationGeneratorModal } from './components/QuotationGeneratorModal';
import { FreeConsultationModal } from './components/FreeConsultationModal';
import { FreeAuditModal } from './components/FreeAuditModal';
import { ClientPortal } from './components/client/ClientPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { BackToTop } from './components/BackToTop';
import { NotFound } from './components/NotFound';
import { ThemeProvider } from './context/ThemeContext';

import { Sparkles, SearchCheck, MessageSquare, ArrowRight } from 'lucide-react';
import { trackEvent } from './services/analyticsService';

export default function App() {
  const [preselectedService, setPreselectedService] = useState<string>('Choose a service');

  // Interactive AI & Modals States
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);
  const [chatbotInitialQuery, setChatbotInitialQuery] = useState<string | undefined>(undefined);

  // Platform Modals
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [quotePreselectedServices, setQuotePreselectedServices] = useState<string[]>([]);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState<boolean>(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectServiceInquiry = (serviceCategory: string) => {
    setPreselectedService(serviceCategory);
    scrollToSection('contact');
  };

  const handleOpenQuoteModal = (services?: string[]) => {
    setQuotePreselectedServices(services || []);
    setIsQuoteModalOpen(true);
  };

  // 404 routing check for non-existent pathnames
  const is404 = typeof window !== 'undefined' && 
    window.location.pathname !== '/' && 
    window.location.pathname !== '' && 
    !window.location.pathname.startsWith('/#') &&
    window.location.pathname !== '/ai-video-ad-creator';

  if (is404) {
    return (
      <ThemeProvider>
        <NotFound onBackToHome={() => { window.location.href = '/'; }} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#071126] text-slate-100 flex flex-col selection:bg-[#1769FF] selection:text-white theme-transition">
        {/* 1. Navbar matching Section 2 (NO Our Team) */}
        <Navbar
          onNavigate={scrollToSection}
          onTalkToAI={() => setIsVoiceAssistantOpen(true)}
          onOpenClientPortal={() => setIsClientPortalOpen(true)}
          onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
          onStartProject={() => scrollToSection('contact')}
        />

      {/* Main Content Sections (Section 66 Homepage Structure) */}
      <main className="flex-1">
        {/* 2. Hero Section (Section 3 & 4) */}
        <Hero
          onScrollToSection={scrollToSection}
          onTalkToVoiceAI={() => setIsVoiceAssistantOpen(true)}
          onOpenTextAI={() => setIsChatbotOpen(true)}
          onStartProject={() => scrollToSection('contact')}
        />

        {/* 3. Build / Market / Automate / Brand Pillars Section */}
        <PillarsSection
          onSelectService={handleSelectServiceInquiry}
          onExplorePillar={(key) => scrollToSection('services')}
        />

        {/* 4. Core Services Section */}
        <Services onSelectServiceInquiry={handleSelectServiceInquiry} />

        {/* 5. AI Business Consultant (Section 5 & 6) */}
        <AIBusinessConsultant
          onOpenQuoteModal={handleOpenQuoteModal}
          onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
          onOpenChatbot={(query) => {
            setChatbotInitialQuery(query);
            setIsChatbotOpen(true);
          }}
          onSelectServiceInquiry={handleSelectServiceInquiry}
        />

        {/* 6. Who We Help Section */}
        <WhoWeHelp onSelectService={handleSelectServiceInquiry} />

        {/* 7. How We Work Section */}
        <HowWeWork onStartProject={() => scrollToSection('contact')} />

        {/* 8. Build Your Package Tool (Section 24-27) */}
        <BuildPackageTool
          onRequestPackage={(services, notes) => {
            handleOpenQuoteModal(services);
          }}
          onOpenQuoteModal={handleOpenQuoteModal}
        />

        {/* 9. Genuine Portfolio Section */}
        <Portfolio onSelectServiceInquiry={handleSelectServiceInquiry} />

        {/* 10. AI Video Ad Creator (Section 28-34) */}
        <AIVideoAdCreator
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
        />

        {/* 11. Why Digital X Section */}
        <WhyChooseUs />

        {/* 12. Client Dashboard Preview ("My Digital X") (Section 14-19 & 66) */}
        <ClientDashboardPreview
          onOpenPortal={() => setIsClientPortalOpen(true)}
        />

        {/* 13. Genuine Client Feedback & Submission System (Section 48) */}
        <ClientFeedback />

        {/* 14. Dual Promotional Banners: Free Digital Audit & Free Consultation (Section 37 & 38) */}
        <section className="py-16 bg-[#071126] border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Card: Free Digital Audit */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0B1938] to-[#071126] border border-cyan-500/30 flex flex-col justify-between hover:border-cyan-400/60 shadow-xl transition-all group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-300 flex items-center justify-center mb-4">
                    <SearchCheck className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">100% Free Diagnostics</span>
                  <h3 className="text-2xl font-bold text-white mt-1 mb-2">Get Your Free Digital Audit</h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                    Submit your website and Instagram link. Our technical team will diagnostic check speed, mobile UX, SEO ranking, and lead leaks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg cursor-pointer transition-all"
                >
                  <span>Request Free Digital Audit →</span>
                </button>
              </div>

              {/* Right Card: Free Consultation */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0B1938] to-[#071126] border border-blue-500/30 flex flex-col justify-between hover:border-blue-400/60 shadow-xl transition-all group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-300 flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Strategic Roadmap</span>
                  <h3 className="text-2xl font-bold text-white mt-1 mb-2">Get Free Business Consultation</h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal mb-6">
                    Speak directly with a Digital X growth consultant to design a tailored timeline, ad budget, and tech stack for your brand.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:brightness-110 text-xs font-bold text-white shadow-lg cursor-pointer transition-all"
                >
                  <span>Request Free Consultation →</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 15. FAQ Section */}
        <FAQ />

        {/* 16. Contact Section */}
        <Contact 
          preselectedService={preselectedService} 
          onClearPreselectedService={() => setPreselectedService('Choose a service')}
        />
      </main>

      {/* 17. Footer */}
      <Footer 
        onScrollToSection={scrollToSection} 
        onSelectServiceInquiry={handleSelectServiceInquiry} 
      />

      {/* 18. Floating WhatsApp Chat Button (Bottom-left) */}
      <FloatingWhatsApp />

      {/* 19. Digital X AI Assistant Chatbot (Text Mode) */}
      <AIChatbot 
        externalOpen={isChatbotOpen}
        onCloseExternal={() => {
          setIsChatbotOpen(false);
          setChatbotInitialQuery(undefined);
        }}
        initialQuery={chatbotInitialQuery}
        onSwitchToVoice={() => {
          setIsChatbotOpen(false);
          setIsVoiceAssistantOpen(true);
        }}
      />

      {/* 20. Digital X AI Voice Assistant (Bottom-right with real voice) */}
      <AIVoiceAssistant
        externalOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        onOpenChatbot={() => {
          setIsVoiceAssistantOpen(false);
          setIsChatbotOpen(true);
        }}
      />

      {/* 21. Online Quotation Generator Modal & PDF Exporter (Section 20-23) */}
      <QuotationGeneratorModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        preselectedServices={quotePreselectedServices}
      />

      {/* 22. Free Business Consultation Modal (Section 37) */}
      <FreeConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

      {/* 23. Free Digital Audit Modal (Section 38) */}
      <FreeAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* 24. "My Digital X" Client Portal (Section 14-19) */}
      <ClientPortal
        isOpen={isClientPortalOpen}
        onClose={() => setIsClientPortalOpen(false)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* 25. Digital X Operations Admin Portal (Section 12-13, 44, 48) */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* 26. Floating Back to Top Button */}
      <BackToTop />
    </div>
  </ThemeProvider>
  );
}
