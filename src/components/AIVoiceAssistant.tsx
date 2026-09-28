import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  MessageCircle,
  Phone,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Send,
  CornerDownRight,
  Headphones,
  Bot,
  Check
} from 'lucide-react';
import { COMPANY_INFO } from '../data/siteData';
import { platformStore } from '../services/platformStore';
import { trackEvent } from '../services/analyticsService';

export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR';

export interface VoiceLeadState {
  step: 'idle' | 'name' | 'business' | 'phone' | 'email' | 'service' | 'requirements' | 'budget' | 'contactMethod' | 'completed';
  name?: string;
  business?: string;
  phone?: string;
  email?: string;
  service?: string;
  requirements?: string;
  budget?: string;
  contactMethod?: string;
}

interface AIVoiceAssistantProps {
  externalOpen?: boolean;
  onClose?: () => void;
  onOpenChatbot?: () => void;
}

const SAMPLE_PROMPTS = [
  'I need a website for my business',
  'How much does a website cost?',
  'I want Meta Ads',
  'Can you build an ecommerce website?',
  'I need an AI chatbot',
  'I want an AI automation system',
  'I want to talk to someone from Digital X',
];

export const AIVoiceAssistant: React.FC<AIVoiceAssistantProps> = ({
  externalOpen = false,
  onClose,
  onOpenChatbot,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>(
    "Hi! I'm Digital X AI. How can I help your business today?"
  );
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [leadState, setLeadState] = useState<VoiceLeadState>({ step: 'idle' });
  const [isLeadComplete, setIsLeadComplete] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: 'user' | 'model'; text: string }>
  >([]);
  const [audioLevel, setAudioLevel] = useState(0);

  // References
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const speechSynthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Sync external open prop
  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
    }
  }, [externalOpen]);

  // Clean up audio & recognition on unmount
  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Initialize Speech Recognition on demand
  const initSpeechRecognition = () => {
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported on this browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setVoiceState('LISTENING');
      setInterimTranscript('');
      simulateAudioWaves();
    };

    recognition.onresult = (event: any) => {
      let finalStr = '';
      let interimStr = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalStr += event.results[i][0].transcript;
        } else {
          interimStr += event.results[i][0].transcript;
        }
      }

      if (interimStr) {
        setInterimTranscript(interimStr);
      }

      if (finalStr) {
        setTranscript(finalStr);
        setInterimTranscript('');
        stopAudioWaves();
        handleSendVoiceMessage(finalStr);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      stopAudioWaves();
      if (event.error !== 'no-speech') {
        setVoiceState('ERROR');
      } else {
        setVoiceState('IDLE');
      }
    };

    recognition.onend = () => {
      stopAudioWaves();
      // If ended without final string and state was listening
      setVoiceState((prev) => (prev === 'LISTENING' ? 'IDLE' : prev));
    };

    recognitionRef.current = recognition;
    return recognition;
  };

  // Simulate audio level ripples for visualization
  const simulateAudioWaves = () => {
    let t = 0;
    const updateWaves = () => {
      t += 0.12;
      const level = Math.sin(t) * 0.4 + Math.sin(t * 2.3) * 0.3 + 0.3;
      setAudioLevel(Math.max(0.1, Math.min(1, level)));
      animFrameRef.current = requestAnimationFrame(updateWaves);
    };
    animFrameRef.current = requestAnimationFrame(updateWaves);
  };

  const stopAudioWaves = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setAudioLevel(0);
  };

  // Start listening (requests mic permission on user click)
  const startListening = () => {
    stopSpeaking();
    const recognition = initSpeechRecognition();

    if (!recognition) {
      setVoiceState('ERROR');
      setAiResponse(
        "Speech recognition is not available in this browser. You can type your question below or click WhatsApp!"
      );
      return;
    }

    try {
      setTranscript('');
      setInterimTranscript('');
      recognition.start();
    } catch (e) {
      console.warn('Recognition restart', e);
      try {
        recognition.stop();
        setTimeout(() => recognition.start(), 150);
      } catch (err) {
        setVoiceState('ERROR');
      }
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    stopAudioWaves();
    if (voiceState === 'LISTENING') {
      setVoiceState('IDLE');
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
      } catch (e) {}
      currentAudioSourceRef.current = null;
    }
    stopAudioWaves();
    if (voiceState === 'SPEAKING') {
      setVoiceState('IDLE');
    }
  };

  // Speak AI response using server TTS or Web Speech Synthesis
  const speakResponse = async (text: string) => {
    if (isMuted) {
      setVoiceState('IDLE');
      return;
    }

    stopSpeaking();
    setVoiceState('SPEAKING');
    simulateAudioWaves();

    // Clean text for speech
    const cleanSpeechText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\+91\s?7970884193/g, 'plus nine one, seven nine seven zero, eight eight four, one nine three')
      .trim();

    try {
      // 1. Try server-side TTS (ElevenLabs or Gemini TTS)
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanSpeechText }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          playServerAudio(data.audioBase64, data.mimeType);
          return;
        }
      }
    } catch {
      // Smoothly fall through to browser speech synthesis
    }

    // 2. High-quality browser speech synthesis fallback
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.name.includes('Google') && v.lang.startsWith('en')) ||
        voices.find((v) => v.name.includes('Natural') && v.lang.startsWith('en')) ||
        voices.find((v) => v.lang === 'en-IN' || v.lang === 'en-US') ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        stopAudioWaves();
        setVoiceState('IDLE');
      };

      utterance.onerror = () => {
        stopAudioWaves();
        setVoiceState('IDLE');
      };

      speechSynthUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        stopAudioWaves();
        setVoiceState('IDLE');
      }, 3000);
    }
  };

  // Play audio from server (PCM or MP3)
  const playServerAudio = (base64Audio: string, mimeType?: string) => {
    try {
      // Handle standard audio formats like MP3 from ElevenLabs
      if (mimeType && (mimeType.includes('mp3') || mimeType.includes('mpeg') || mimeType.includes('wav'))) {
        const audio = new Audio(`data:${mimeType};base64,${base64Audio}`);
        audio.onended = () => {
          stopAudioWaves();
          setVoiceState('IDLE');
        };
        audio.onerror = () => {
          stopAudioWaves();
          setVoiceState('IDLE');
        };
        audio.play().catch(() => {
          stopAudioWaves();
          setVoiceState('IDLE');
        });
        return;
      }

      // Handle raw PCM
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx({ sampleRate: 24000 });
      }

      const audioCtx = audioContextRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const binaryStr = atob(base64Audio);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      // 16-bit PCM to Float32
      const int16View = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16View.length);
      for (let i = 0; i < int16View.length; i++) {
        float32Array[i] = int16View[i] / 32768.0;
      }

      const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.copyToChannel(float32Array, 0);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);

      source.onended = () => {
        stopAudioWaves();
        setVoiceState('IDLE');
      };

      currentAudioSourceRef.current = source;
      source.start(0);
    } catch {
      stopAudioWaves();
      setVoiceState('IDLE');
    }
  };

  // Send message to voice AI backend
  const handleSendVoiceMessage = async (userMsg: string) => {
    if (!userMsg.trim()) return;

    setTranscript(userMsg);
    setVoiceState('PROCESSING');

    // Update conversation history
    const newHistory = [...conversationHistory, { role: 'user' as const, text: userMsg }];
    setConversationHistory(newHistory);

    try {
      const response = await fetch('/api/voice/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: newHistory,
          leadState: leadState,
        }),
      });

      if (!response.ok) {
        throw new Error('Server voice request failed');
      }

      const data = await response.json();
      const replyText = data.reply || "I'm not sure about that. I can connect you with the Digital X team.";

      setAiResponse(replyText);

      if (data.leadState) {
        setLeadState(data.leadState);
      }

      if (data.isLeadComplete) {
        setIsConfirmingDetails(true);
        const confirmSpeech = "Let me confirm your details before creating your inquiry. Please review them on screen, or say confirm.";
        setAiResponse(confirmSpeech);
        speakResponse(confirmSpeech);
      } else {
        // Speak response out loud
        speakResponse(replyText);
      }

      setConversationHistory((prev) => [...prev, { role: 'model', text: replyText }]);
    } catch (err) {
      console.error('Error in voice chat:', err);
      setVoiceState('ERROR');
      const errReply = "Sorry, I couldn't hear that properly. Please try speaking again.";
      setAiResponse(errReply);
      speakResponse(errReply);
    }
  };

  const handlePromptClick = (promptText: string) => {
    handleSendVoiceMessage(promptText);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const msg = textInput.trim();
    setTextInput('');
    handleSendVoiceMessage(msg);
  };

  const handleClose = () => {
    stopListening();
    stopSpeaking();
    setIsOpen(false);
    if (onClose) onClose();
  };

  // Pre-confirmation check before creating lead (Section 9 of Master Prompt)
  const [isConfirmingDetails, setIsConfirmingDetails] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleConfirmLead = () => {
    setIsConfirmingDetails(false);
    setIsLeadComplete(true);
    trackEvent('voice_lead_confirmed', 'lead', leadState.service);

    // Create lead in central platform store
    platformStore.createLead({
      name: leadState.name || 'Verified Visitor',
      business_name: leadState.business || 'N/A',
      phone: leadState.phone || COMPANY_INFO.phone,
      email: leadState.email || 'lead@digitalx.in',
      service: leadState.service || 'Website / Marketing',
      requirement: leadState.requirements || 'Inquired through Digital X AI Voice Assistant',
      budget: leadState.budget || 'Custom',
      timeline: 'Standard',
      source: 'AI Voice',
      status: 'Qualified',
    });

    const finishSpeech = `Thank you, ${leadState.name || ''}! Your requirement has been received. Our team will contact you shortly.`;
    setAiResponse(finishSpeech);
    speakResponse(finishSpeech);
  };

  const getWhatsAppDataUrl = () => {
    const text =
      `Hi Digital X, I would like to discuss a project.\n\n` +
      `Name: ${leadState.name || 'Client'}\n` +
      `Business: ${leadState.business || 'N/A'}\n` +
      `Service: ${leadState.service || 'Digital Services'}\n` +
      `Requirement: ${leadState.requirements || 'Discuss project scope'}`;
    return `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      {/* 1. FLOATING VOICE ASSISTANT LAUNCHER BUTTON */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-1.5 select-none animate-fade-in">
          {/* Small label above or beside */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-blue-200 bg-[#071126]/90 border border-blue-500/30 shadow-lg backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Talk to our AI Assistant
          </span>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Talk to Digital X AI Voice Assistant"
            className="group relative inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#0B1938] via-[#102454] to-[#0B1938] text-white border border-blue-400/50 shadow-2xl shadow-blue-600/40 hover:border-cyan-300 hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/50"
          >
            {/* Glowing outer pulse animation ring */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-[#1769FF] opacity-30 group-hover:opacity-60 blur-md transition-opacity duration-300 pointer-events-none animate-pulse" />

            {/* Glowing Mic Icon with subtle breathing pulse */}
            <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/40 text-cyan-300 group-hover:scale-110 transition-transform">
              <Mic className="w-4 h-4 animate-pulse" />
            </span>

            <span className="relative text-xs sm:text-sm font-bold tracking-wide text-white drop-shadow-sm">
              🎙️ Talk to Digital X AI
            </span>
          </button>
        </div>
      )}

      {/* 2. MODERN FLOATING VOICE ASSISTANT PANEL */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Digital X AI Voice Assistant"
          className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 z-50 w-auto sm:w-[460px] max-h-[92vh] flex flex-col rounded-3xl bg-[#071126] border border-blue-500/30 shadow-2xl shadow-black/80 overflow-hidden backdrop-blur-xl animate-fade-in"
          style={{
            boxShadow:
              '0 25px 70px -15px rgba(0, 0, 0, 0.9), 0 0 50px -10px rgba(56, 189, 248, 0.3)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-[#0B1938] border-b border-blue-500/20 select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1769FF] via-[#38BDF8] to-cyan-300 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-blue-500/30">
                  <Headphones className="w-5 h-5 text-slate-950" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0B1938]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Digital X AI Assistant
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-blue-500/20 text-[#38BDF8] border border-blue-400/30">
                    VOICE AI
                  </span>
                </div>
                <p className="text-xs text-blue-200/70 font-medium">
                  &ldquo;How can we help your business?&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound Mute/Unmute */}
              <button
                type="button"
                onClick={() => {
                  if (!isMuted) stopSpeaking();
                  setIsMuted(!isMuted);
                }}
                aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
                title={isMuted ? 'Unmute voice' : 'Mute voice'}
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close Voice Assistant"
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Panel Body */}
          <div className="p-5 flex-1 overflow-y-auto flex flex-col items-center justify-between gap-5 bg-gradient-to-b from-[#071126] via-[#091636] to-[#071126]">
            {/* AI ANIMATED ORB / AVATAR */}
            <div className="relative flex flex-col items-center justify-center mt-2 py-2">
              {/* Multi-layered dynamic orb aura */}
              <div
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                  voiceState === 'LISTENING'
                    ? 'ring-4 ring-cyan-400/50 shadow-[0_0_50px_rgba(56,189,248,0.7)] scale-105'
                    : voiceState === 'SPEAKING'
                    ? 'ring-4 ring-blue-500/60 shadow-[0_0_60px_rgba(23,105,255,0.8)] scale-110'
                    : voiceState === 'PROCESSING'
                    ? 'ring-4 ring-indigo-400/40 shadow-[0_0_40px_rgba(99,102,241,0.5)]'
                    : voiceState === 'ERROR'
                    ? 'ring-4 ring-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.5)]'
                    : 'ring-2 ring-blue-500/20 shadow-[0_0_30px_rgba(23,105,255,0.3)]'
                }`}
              >
                {/* Background Rotating Gradient Mesh */}
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#1769FF] via-[#38BDF8] to-[#6366F1] blur-md opacity-80 ${
                    voiceState === 'SPEAKING' || voiceState === 'LISTENING'
                      ? 'animate-spin [animation-duration:6s]'
                      : 'animate-pulse'
                  }`}
                  style={{
                    transform: `scale(${1 + audioLevel * 0.25})`,
                  }}
                />

                {/* Core Sphere */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#0F224D] via-[#071126] to-[#0A1A3A] border border-cyan-300/40 flex items-center justify-center shadow-inner overflow-hidden">
                  {/* Equalizer Waveform in Orb */}
                  <div className="flex items-center justify-center gap-1">
                    {[0.6, 1.2, 0.9, 1.5, 0.8, 1.3, 0.7].map((factor, idx) => (
                      <span
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          voiceState === 'SPEAKING'
                            ? 'bg-cyan-300'
                            : voiceState === 'LISTENING'
                            ? 'bg-emerald-400'
                            : voiceState === 'PROCESSING'
                            ? 'bg-indigo-300'
                            : 'bg-blue-400/50'
                        }`}
                        style={{
                          height:
                            voiceState === 'SPEAKING' || voiceState === 'LISTENING'
                              ? `${Math.max(8, Math.min(36, 10 + audioLevel * 28 * factor))}px`
                              : voiceState === 'PROCESSING'
                              ? `${12 + Math.sin(Date.now() / 200 + idx) * 8}px`
                              : '10px',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* LISTENING STATUS PILL */}
              <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1938] border border-blue-500/30 shadow-md">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    voiceState === 'LISTENING'
                      ? 'bg-emerald-400 animate-ping'
                      : voiceState === 'SPEAKING'
                      ? 'bg-cyan-400 animate-pulse'
                      : voiceState === 'PROCESSING'
                      ? 'bg-indigo-400 animate-bounce'
                      : voiceState === 'ERROR'
                      ? 'bg-rose-400'
                      : 'bg-blue-400'
                  }`}
                />
                <span className="text-xs font-bold tracking-wide uppercase text-slate-200">
                  {voiceState === 'LISTENING' && 'Listening...'}
                  {voiceState === 'PROCESSING' && 'Thinking...'}
                  {voiceState === 'SPEAKING' && 'Digital X AI is speaking...'}
                  {voiceState === 'ERROR' && "Sorry, I couldn't hear that. Please try again."}
                  {voiceState === 'IDLE' && 'Ready • Tap Mic to Speak'}
                </span>
              </div>
            </div>

            {/* AI RESPONSE TEXT CONTAINER */}
            <div className="w-full bg-[#0B1938]/90 border border-blue-500/25 rounded-2xl p-4 shadow-lg flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  Digital X AI
                </span>
                {aiResponse && (
                  <button
                    type="button"
                    onClick={() => speakResponse(aiResponse)}
                    title="Listen again"
                    aria-label="Replay audio"
                    className="text-[11px] text-blue-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Replay</span>
                  </button>
                )}
              </div>

              <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed min-h-[48px]">
                {aiResponse}
              </p>

              {/* USER SPEECH TRANSCRIPT */}
              {(transcript || interimTranscript) && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                    You:
                  </span>
                  <p className="text-xs text-blue-200 italic">
                    &ldquo;{transcript || interimTranscript}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* PRE-CONFIRMATION CARD (Section 9: "Let me confirm your details.") */}
            {isConfirmingDetails && !isLeadComplete && (
              <div className="w-full rounded-2xl bg-[#0B1938] border border-cyan-400/40 p-4 shadow-xl space-y-3 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-cyan-300">Let me confirm your details:</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Step 1 of 2</span>
                </div>

                <div className="space-y-1 text-xs text-slate-200">
                  <div><strong className="text-slate-400">Name:</strong> {leadState.name || 'Not provided'}</div>
                  <div><strong className="text-slate-400">Business:</strong> {leadState.business || 'N/A'}</div>
                  <div><strong className="text-slate-400">Service:</strong> {leadState.service || 'Digital Solutions'}</div>
                  <div><strong className="text-slate-400">Requirement:</strong> {leadState.requirements || 'Discuss project'}</div>
                  <div><strong className="text-slate-400">Budget:</strong> {leadState.budget || 'Custom quote'}</div>
                  <div><strong className="text-slate-400">Phone:</strong> {leadState.phone || COMPANY_INFO.phone}</div>
                  <div><strong className="text-slate-400">Email:</strong> {leadState.email || 'lead@digitalx.in'}</div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleConfirmLead}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-md cursor-pointer hover:brightness-110 flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>✓ Confirm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsConfirmingDetails(false);
                      const editPrompt = "What detail would you like to edit? You can say your name, business, or service.";
                      setAiResponse(editPrompt);
                      speakResponse(editPrompt);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 10: "Your requirement has been received." */}
            {isLeadComplete && (
              <div className="w-full rounded-2xl bg-gradient-to-r from-emerald-950/70 to-blue-950/70 border border-emerald-500/40 p-4 shadow-xl flex flex-col gap-3 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Your requirement has been received.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* 1. Continue on WhatsApp */}
                  <a
                    href={getWhatsAppDataUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-110 shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>💬 Continue on WhatsApp</span>
                  </a>

                  {/* 2. Talk to Human */}
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>📞 Talk to Human</span>
                  </a>

                  {/* 3. Back to Website */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    <span>🏠 Back to Website</span>
                  </button>
                </div>
              </div>
            )}

            {/* SUGGESTED CONVERSATION PROMPTS */}
            {!isLeadComplete && (
              <div className="w-full">
                <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
                  <span>💡 Try saying or tapping:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 scrollbar-none">
                  {SAMPLE_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handlePromptClick(prompt)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0B1938] text-blue-200 hover:text-white border border-blue-500/20 hover:border-cyan-400/50 hover:bg-blue-600/20 transition-all cursor-pointer text-left shrink-0"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MAIN VOICE CONTROLS */}
            <div className="w-full flex flex-col items-center gap-3 pt-2">
              <div className="flex items-center gap-4">
                {/* Secondary Stop Speaking button when AI is talking */}
                {voiceState === 'SPEAKING' && (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Stop Speaking</span>
                  </button>
                )}

                {/* PRIMARY MICROPHONE BUTTON */}
                <button
                  type="button"
                  onClick={voiceState === 'LISTENING' ? stopListening : startListening}
                  aria-label={voiceState === 'LISTENING' ? 'Stop listening' : 'Start speaking'}
                  className={`relative group w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-90 cursor-pointer ${
                    voiceState === 'LISTENING'
                      ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/50 scale-105'
                      : 'bg-gradient-to-tr from-[#1769FF] via-[#0052CC] to-[#38BDF8] hover:scale-105 shadow-blue-500/50'
                  }`}
                >
                  {/* Subtle radiating ping ring when listening */}
                  {voiceState === 'LISTENING' && (
                    <span className="absolute -inset-2 rounded-full border-2 border-rose-400 animate-ping opacity-80" />
                  )}

                  {voiceState === 'LISTENING' ? (
                    <MicOff className="w-7 h-7 text-white" />
                  ) : (
                    <Mic className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>

              {/* Text Fallback Input Bar */}
              <form onSubmit={handleManualSubmit} className="w-full flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Or type here if you prefer..."
                  className="flex-1 bg-slate-900/90 text-white placeholder-slate-400 text-xs px-3.5 py-2 rounded-xl border border-slate-700/60 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
                <button
                  type="submit"
                  disabled={!textInput.trim() || voiceState === 'PROCESSING'}
                  aria-label="Send text input to AI"
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Switch to Chatbot link */}
              {onOpenChatbot && (
                <div className="w-full flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Prefer text chat?</span>
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      onOpenChatbot();
                    }}
                    className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <span>Open Text Chat</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
