import React from 'react';
import { 
  Bot, 
  Headphones, 
  Target, 
  MessageCircle, 
  Mic, 
  Workflow, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Zap
} from 'lucide-react';

interface AIAutomationProps {
  onAutomateClick?: () => void;
  onSelectFeature?: (featureName: string) => void;
}

export const AIAutomation: React.FC<AIAutomationProps> = ({ 
  onAutomateClick,
  onSelectFeature 
}) => {
  const features = [
    {
      id: 'ai-chatbot',
      number: '01',
      title: 'AI Website Chatbot',
      subtitle: '24/7 Conversational Engagement',
      description: 'Intelligent AI assistant deployed on your website to greet visitors, answer complex questions, and capture leads automatically round-the-clock.',
      icon: Bot,
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'group-hover:border-blue-400/50',
      iconColor: 'text-[#38BDF8]',
      capabilities: [
        'Instant answers to customer inquiries',
        'Multi-turn intelligent conversations',
        'Trained on your brand and services',
        'Automatic lead qualification & handoff',
      ],
    },
    {
      id: 'support-automation',
      number: '02',
      title: 'Customer Support Automation',
      subtitle: 'Zero Wait Time Support',
      description: 'Automate resolution of recurring client questions, ticket triage, and onboarding steps without overburdening your human support staff.',
      icon: Headphones,
      color: 'from-cyan-500/20 to-teal-500/20',
      borderColor: 'group-hover:border-cyan-400/50',
      iconColor: 'text-cyan-400',
      capabilities: [
        'Instant triage of common support tickets',
        'Automated FAQ & order status lookups',
        'Intelligent escalation to human team',
        'Consistent 24/7 service response',
      ],
    },
    {
      id: 'lead-generation',
      number: '03',
      title: 'Lead Generation Automation',
      subtitle: 'High-Intent Pipeline Builder',
      description: 'Turn passive web traffic into verified high-intent sales opportunities with automated qualification quizzes, chatbots, and CRM sync.',
      icon: Target,
      color: 'from-blue-600/20 to-indigo-600/20',
      borderColor: 'group-hover:border-indigo-400/50',
      iconColor: 'text-indigo-400',
      capabilities: [
        'Interactive lead capture & screening',
        'Real-time WhatsApp & email notifications',
        'Automated prospect intent scoring',
        'Instant Google Sheets & CRM synchronization',
      ],
    },
    {
      id: 'whatsapp-automation',
      number: '04',
      title: 'WhatsApp Automation',
      subtitle: 'Official Business API Flows',
      description: 'Meet your customers on the app they use daily. Automated instant replies, interactive button menus, catalog sharing, and reminder broadcasts.',
      icon: MessageCircle,
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'group-hover:border-emerald-400/50',
      iconColor: 'text-emerald-400',
      capabilities: [
        'Automated welcome and menu messages',
        'Quick replies & interactive action buttons',
        'Catalog delivery and quote inquiries',
        'Direct 1-click team escalation',
      ],
    },
    {
      id: 'ai-voice-agent',
      number: '05',
      title: 'AI Voice Agent',
      subtitle: 'Autonomous Voice Calling',
      description: 'Human-like conversational voice agents engineered for inbound customer handling, appointment confirmation calls, and instant follow-ups.',
      icon: Mic,
      color: 'from-violet-500/20 to-blue-500/20',
      borderColor: 'group-hover:border-violet-400/50',
      iconColor: 'text-violet-400',
      capabilities: [
        'Natural-sounding voice synthesis',
        'Inbound inquiry handling & call notes',
        'Automated appointment confirmations',
        'Audio transcription & sentiment logs',
      ],
    },
    {
      id: 'workflow-automation',
      number: '06',
      title: 'Business Workflow Automation',
      subtitle: 'Autonomous Systems & Operations',
      description: 'Eliminate repetitive manual tasks by linking your CRM, spreadsheets, payment alerts, and internal communication pipelines seamlessly.',
      icon: Workflow,
      color: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'group-hover:border-amber-400/50',
      iconColor: 'text-amber-400',
      capabilities: [
        'Zapier, Make & custom API integrations',
        'Automated quote generation & invoicing',
        'Cross-platform data synchronization',
        'Saves 15+ hours per week of manual labor',
      ],
    },
  ];

  return (
    <section 
      id="ai-automation" 
      className="relative py-20 lg:py-28 bg-[#060D1E] overflow-hidden scroll-mt-20 border-t border-blue-900/30"
    >
      {/* Background ambient glow highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/15 via-cyan-500/10 to-indigo-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative tech grid lines */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          {/* BADGE: AI AUTOMATION */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-[#38BDF8] text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
            <span>AI AUTOMATION</span>
          </div>

          {/* HEADING: "Let AI Handle the Repetitive Work" */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-5">
            Let AI Handle the <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-blue-400 to-[#1769FF]">
              Repetitive Work
            </span>
          </h2>

          {/* DESCRIPTION: "Digital X helps businesses automate customer support, lead capture, communication and everyday workflows using AI." */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Digital X helps businesses automate customer support, lead capture, communication and everyday workflows using AI.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;

            return (
              <div
                key={feature.id}
                className="group relative flex flex-col justify-between rounded-2xl p-7 bg-[#0B1938]/85 border border-blue-500/20 hover:border-blue-400/50 shadow-xl shadow-black/30 hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Subtle gradient corner illumination */}
                <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${feature.color} rounded-bl-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none`} />

                <div>
                  {/* Top Bar: Icon & Numbering */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:border-blue-400/40 transition-all duration-300">
                      <IconComponent className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>

                    <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-blue-300 transition-colors">
                      {feature.number}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-[#38BDF8] transition-colors">
                    {feature.title}
                  </h3>
                  <div className="text-xs font-semibold text-blue-300/80 mb-3.5 tracking-wide">
                    {feature.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {feature.description}
                  </p>

                  {/* Capabilities List */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80 mb-6">
                    {feature.capabilities.map((cap, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectFeature) {
                        onSelectFeature(feature.title);
                      } else if (onAutomateClick) {
                        onAutomateClick();
                      }
                    }}
                    className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/70 hover:bg-blue-600/20 border border-slate-700/60 hover:border-blue-400/40 text-xs font-semibold text-slate-200 hover:text-white transition-all duration-200 cursor-pointer group/btn"
                  >
                    <span>Explore {feature.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA: "Automate My Business →" */}
        <div className="mt-14 sm:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 p-2 rounded-2xl bg-gradient-to-r from-blue-950/70 via-[#0B1938] to-blue-950/70 border border-blue-500/30 max-w-xl mx-auto shadow-2xl shadow-blue-950/50">
            <div className="flex items-center gap-3 px-4 py-2 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[#38BDF8]" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Ready to save hours every day?</div>
                <div className="text-xs text-slate-400">Customized AI workflows built for your business</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onAutomateClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap"
            >
              <span>Automate My Business →</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
