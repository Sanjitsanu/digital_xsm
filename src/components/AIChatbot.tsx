import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageCircle, 
  ChevronDown, 
  RefreshCw,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Mic
} from 'lucide-react';
import { COMPANY_INFO } from '../data/siteData';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: string[];
  isLeadCaptureComplete?: boolean;
  leadDataSummary?: {
    name: string;
    business: string;
    service: string;
    phone: string;
    details: string;
  };
}

type LeadStep = 'idle' | 'name' | 'business' | 'service' | 'phone' | 'details' | 'completed';

interface LeadData {
  name: string;
  business: string;
  service: string;
  phone: string;
  details: string;
}

interface AIChatbotProps {
  externalOpen?: boolean;
  onCloseExternal?: () => void;
  initialQuery?: string;
  onSwitchToVoice?: () => void;
}

const QUICK_ACTIONS = [
  { label: '🌐 Website', query: 'Tell me about your Website Development services' },
  { label: '📢 Meta Ads', query: 'How do your Meta Ads (Facebook & Instagram) campaigns work?' },
  { label: '🔎 Google Ads', query: 'What Google Ads services do you provide?' },
  { label: '🤖 AI Automation', query: 'What AI Automation solutions does Digital X provide?' },
  { label: '🎨 Branding', query: 'What branding and graphic design services do you offer?' },
  { label: '💰 Get a Quote', isLeadTrigger: true },
  { label: '📞 Talk to Digital X', isContactTrigger: true },
];

const SERVICE_OPTIONS = [
  'Website Development',
  'E-commerce Website',
  'Landing Page',
  'Meta Ads',
  'Google Ads',
  'AI Automation & Chatbots',
  'Social Media Marketing',
  'Branding & Logo Design',
  'Video Editing',
];

export const AIChatbot: React.FC<AIChatbotProps> = ({ 
  externalOpen = false, 
  onCloseExternal,
  initialQuery,
  onSwitchToVoice
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Lead capture state machine
  const [leadStep, setLeadStep] = useState<LeadStep>('idle');
  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    business: '',
    service: '',
    phone: '',
    details: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize greeting message
  useEffect(() => {
    const greeting: ChatMessage = {
      id: 'greeting_msg',
      sender: 'bot',
      text: "👋 Hi! I'm the Digital X AI Assistant.\nI can help you find the right digital solution for your business.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([greeting]);
  }, []);

  // Sync external open request
  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    }
  }, [externalOpen]);

  // Handle external query
  useEffect(() => {
    if (initialQuery && isOpen) {
      handleUserSendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, isMinimized]);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      if (onCloseExternal) onCloseExternal();
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const startLeadCapture = (initialMessage?: string) => {
    setLeadStep('name');
    setLeadData({
      name: '',
      business: '',
      service: '',
      phone: '',
      details: '',
    });

    const botPrompt: ChatMessage = {
      id: 'lead_' + Date.now(),
      sender: 'bot',
      text: (initialMessage ? `${initialMessage}\n\n` : '') + "What is your name?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, botPrompt]);
  };

  const handleLeadStepInput = (userInput: string) => {
    const cleanInput = userInput.trim();

    if (leadStep === 'name') {
      setLeadData((prev) => ({ ...prev, name: cleanInput }));
      setLeadStep('business');
      addBotMessage("What type of business do you have?");
      return;
    }

    if (leadStep === 'business') {
      setLeadData((prev) => ({ ...prev, business: cleanInput }));
      setLeadStep('service');
      addBotMessage("Which service are you interested in?", SERVICE_OPTIONS);
      return;
    }

    if (leadStep === 'service') {
      setLeadData((prev) => ({ ...prev, service: cleanInput }));
      setLeadStep('phone');
      addBotMessage("What is your phone/WhatsApp number?");
      return;
    }

    if (leadStep === 'phone') {
      setLeadData((prev) => ({ ...prev, phone: cleanInput }));
      setLeadStep('details');
      addBotMessage("What would you like us to help you with?");
      return;
    }

    if (leadStep === 'details') {
      const finalData: LeadData = {
        ...leadData,
        details: cleanInput,
      };
      setLeadData(finalData);
      setLeadStep('completed');

      // Save to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('digitalx_captured_leads') || '[]');
        stored.push({
          ...finalData,
          capturedAt: new Date().toISOString(),
          source: 'AI Assistant',
        });
        localStorage.setItem('digitalx_captured_leads', JSON.stringify(stored));
      } catch (e) {
        // silent fallback
      }

      // Send to server
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      }).catch(() => {});

      // Success message as specified
      const successMsg: ChatMessage = {
        id: 'completed_' + Date.now(),
        sender: 'bot',
        text: "Thanks! I've received your project details.\nA Digital X team member will contact you shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLeadCaptureComplete: true,
        leadDataSummary: finalData,
      };

      setMessages((prev) => [...prev, successMsg]);
      return;
    }
  };

  const addBotMessage = (text: string, quickOptions?: string[]) => {
    const msg: ChatMessage = {
      id: 'bot_' + Date.now(),
      sender: 'bot',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: quickOptions,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const detectBuyingIntent = (text: string): boolean => {
    const lower = text.toLowerCase();
    const intentKeywords = [
      'quote',
      'price',
      'cost',
      'hire',
      'build my',
      'i want to create',
      'i need a website',
      'i want a website',
      'i need ads',
      'run ads for me',
      'start a project',
      'work together',
      'proposal',
      'estimate',
    ];
    return intentKeywords.some((kw) => lower.includes(kw));
  };

  const handleUserSendMessage = async (textToSend?: string) => {
    const raw = textToSend !== undefined ? textToSend : inputValue;
    const cleanText = raw.trim();
    if (!cleanText || isLoading) return;

    setInputValue('');

    // Add user message to UI
    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // If currently in lead capture flow, advance to next question
    if (leadStep !== 'idle' && leadStep !== 'completed') {
      handleLeadStepInput(cleanText);
      return;
    }

    // Check if user's input triggers lead capture intent
    if (detectBuyingIntent(cleanText)) {
      startLeadCapture("I would be happy to help you get a quote and start your project with Digital X!");
      return;
    }

    // Otherwise, call secure server AI endpoint
    setIsLoading(true);

    try {
      // Build history payload
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error('API response was not ok');
      }

      const data = await res.json();
      const botResponseText = data.reply || "I'm not sure about that. I can connect you with the Digital X team.";

      addBotMessage(botResponseText);
    } catch (err) {
      console.error('Chat error:', err);
      addBotMessage("I'm not sure about that. I can connect you with the Digital X team. You can reach out directly on WhatsApp at +91 7970884193.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    if (action.isLeadTrigger) {
      const userMsg: ChatMessage = {
        id: 'user_' + Date.now(),
        sender: 'user',
        text: '💰 Get a Quote',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);
      startLeadCapture("Let's get you a tailored proposal for your business.");
      return;
    }

    if (action.isContactTrigger) {
      const userMsg: ChatMessage = {
        id: 'user_' + Date.now(),
        sender: 'user',
        text: '📞 Talk to Digital X',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);
      addBotMessage(
        `You can connect with Digital X team directly:\n• WhatsApp / Phone: ${COMPANY_INFO.phone}\n• Email: ${COMPANY_INFO.infoEmail}\n• Office: ${COMPANY_INFO.address}`
      );
      return;
    }

    if (action.query) {
      handleUserSendMessage(action.query);
    }
  };

  const handleServiceSelect = (serviceName: string) => {
    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: serviceName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    handleLeadStepInput(serviceName);
  };

  const handleResetChat = () => {
    setLeadStep('idle');
    setLeadData({ name: '', business: '', service: '', phone: '', details: '' });
    setMessages([
      {
        id: 'greeting_msg_reset',
        sender: 'bot',
        text: "👋 Hi! I'm the Digital X AI Assistant.\nI can help you find the right digital solution for your business.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const getWhatsAppLeadUrl = (data: LeadData) => {
    const text = `Hello Digital X Team! I'm reaching out through your AI Assistant with project details:\n\n` +
      `👤 Name: ${data.name}\n` +
      `🏢 Business: ${data.business}\n` +
      `🎯 Service: ${data.service}\n` +
      `📞 Phone: ${data.phone}\n` +
      `📝 Requirements: ${data.details}`;
    return `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      {/* Companion Text Chat Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleToggle}
          aria-label="Chat with Digital X AI Assistant"
          className="fixed bottom-22 right-6 z-30 group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0B1938]/95 text-blue-200 hover:text-white border border-blue-500/30 hover:border-cyan-400 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold">Text Chat</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Digital X AI Chat"
          className={`fixed z-50 flex flex-col transition-all duration-300 ${
            isMinimized
              ? 'bottom-6 right-6 w-80 h-14 rounded-2xl overflow-hidden shadow-2xl border border-blue-500/30 bg-[#0B1938]'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[600px] max-h-[86vh] rounded-2xl shadow-2xl border border-blue-500/30 bg-[#071126] overflow-hidden'
          }`}
          style={{
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(23, 105, 255, 0.25)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#0B1938] border-b border-blue-500/20 select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1769FF] to-[#38BDF8] flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B1938]" />
              </div>

              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 leading-tight">
                  <span>Digital X AI</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-[#38BDF8] font-mono font-medium">
                    AI
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {leadStep !== 'idle' && leadStep !== 'completed' ? 'Project Inquiry Mode' : 'Online • 24/7 Digital Assistant'}
                </div>
              </div>
            </div>

            {/* Window control buttons */}
            <div className="flex items-center gap-1 text-slate-400">
              {onSwitchToVoice && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMinimized(false);
                    setIsOpen(false);
                    onSwitchToVoice();
                  }}
                  title="Switch to Voice Assistant"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-cyan-300 text-[11px] font-semibold border border-blue-400/30 transition-colors cursor-pointer mr-1"
                >
                  <Mic className="w-3.5 h-3.5 animate-pulse" />
                  <span className="hidden sm:inline">Voice Mode</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand chat' : 'Minimize chat'}
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleToggle}
                title="Close chat"
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body (when not minimized) */}
          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#071126]/90 scrollbar-thin">
                {messages.map((msg) => {
                  const isBot = msg.sender === 'bot';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-start gap-2 max-w-[88%]">
                        {isBot && (
                          <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}

                        <div
                          className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                            isBot
                              ? 'bg-[#0B1938] border border-blue-500/20 text-slate-200 rounded-tl-sm'
                              : 'bg-gradient-to-r from-[#1769FF] to-[#0052CC] text-white rounded-tr-sm shadow-md shadow-blue-900/30'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>

                      {/* Quick selectable options if provided (e.g. Services list) */}
                      {msg.quickActions && (
                        <div className="mt-2.5 ml-9 flex flex-wrap gap-1.5 max-w-[90%]">
                          {msg.quickActions.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleServiceSelect(opt)}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 hover:bg-blue-500/25 border border-blue-400/30 text-blue-200 hover:text-white transition-all cursor-pointer"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Completed Lead Card with "Continue on WhatsApp →" Button */}
                      {msg.isLeadCaptureComplete && msg.leadDataSummary && (
                        <div className="mt-3 ml-9 p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-left max-w-sm">
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Project Summary Received</span>
                          </div>

                          <div className="space-y-1 text-xs text-slate-300 font-mono mb-3">
                            <div><strong className="text-white">Client:</strong> {msg.leadDataSummary.name}</div>
                            <div><strong className="text-white">Business:</strong> {msg.leadDataSummary.business}</div>
                            <div><strong className="text-white">Service:</strong> {msg.leadDataSummary.service}</div>
                            <div><strong className="text-white">Phone:</strong> {msg.leadDataSummary.phone}</div>
                          </div>

                          <a
                            href={getWhatsAppLeadUrl(msg.leadDataSummary)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-110 shadow-md shadow-emerald-950/50 transition-all cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Continue on WhatsApp →</span>
                          </a>
                        </div>
                      )}

                      <span className="text-[10px] text-slate-500 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="rounded-2xl px-4 py-2.5 bg-[#0B1938] border border-blue-500/20 rounded-tl-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1769FF] animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions Tray */}
              <div className="px-3 py-2 bg-[#0B1938]/80 border-t border-slate-800/80 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => handleQuickAction(action)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/90 text-blue-200 hover:text-white border border-blue-500/20 hover:border-blue-400/50 hover:bg-blue-600/20 transition-all cursor-pointer shrink-0"
                  >
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserSendMessage();
                }}
                className="p-3 bg-[#0B1938] border-t border-blue-500/20 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    leadStep === 'name'
                      ? 'Type your name...'
                      : leadStep === 'business'
                      ? 'Type your business name / industry...'
                      : leadStep === 'service'
                      ? 'Type or pick a service...'
                      : leadStep === 'phone'
                      ? 'Type your WhatsApp or phone number...'
                      : leadStep === 'details'
                      ? 'Describe what you need help with...'
                      : 'Ask anything about Digital X services...'
                  }
                  className="flex-1 bg-slate-900/90 text-white placeholder-slate-400 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send message"
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] disabled:opacity-40 disabled:hover:from-[#1769FF] disabled:hover:to-[#0052CC] flex items-center justify-center text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Footer transparency note */}
              <div className="px-3 py-1 bg-slate-950 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
                <span>AI Assistant • For quotes &amp; team contact: +91 7970884193</span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
