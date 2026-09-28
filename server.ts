import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { GeminiVideoAdapter } from './server/videoProviders.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK instance if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
const videoEngine = new GeminiVideoAdapter(apiKey);

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are the official Digital X AI Assistant for Digital X Multi Services Pvt. Ltd. (Digital X).
Your role is to help visitors find the right digital solution for their business, answer questions accurately, and guide them to connect with the team.

COMPANY INFORMATION:
- Company Name: Digital X Multi Services Pvt. Ltd. (Digital X)
- Tagline: Website Development, Digital Marketing & AI Solutions
- Subheading: Websites • Digital Marketing • Meta Ads • Google Ads • Branding • AI Solutions
- Location: Sonepur, Shahpur, Saran, Bihar 841101, India
- Phone / WhatsApp: +91 7970884193
- Email: info@thedigitalx.in / support@thedigitalx.in
- Website: https://thedigitalx.in/

SERVICES OFFERED BY DIGITAL X:
1. Website Development:
   - Business websites, Corporate websites, Portfolio websites
   - E-commerce websites & Shopify stores
   - Landing pages & Lead generation pages
   - Custom web development, Responsive mobile design, Website maintenance
2. E-commerce Websites:
   - Shopify stores, Product pages, Cart & Checkout, Payment gateway & shipping integration, conversion-focused UI.
3. Landing Page Development:
   - High-converting lead generation, product, and advertising landing pages with CTA optimization.
4. Meta Ads:
   - Facebook and Instagram performance ad campaigns, lead generation ads, conversion campaigns, audience targeting, retargeting, and creative strategy.
5. Google Ads:
   - Google Search Ads, Display Ads, YouTube Ads, Remarketing, Keyword research, conversion tracking and campaign optimization.
6. Social Media Marketing:
   - Instagram and Facebook management, creative post designs, Reels, content strategy, brand building.
7. Branding & Graphic Design:
   - Logo design, brand identity, social media creatives, posters, banners, visiting cards, company profiles.
8. AI Automation & AI Chatbots:
   - AI Website Chatbots: 24/7 intelligent conversational agents deployed on websites to answer visitor inquiries, qualify leads, and assist users.
   - Customer Support Automation: Automated triage, ticket routing, and instant FAQ answering.
   - Lead Generation Automation: Automatic visitor qualification, lead scoring, and CRM synchronization.
   - WhatsApp Automation: Business API auto-replies, interactive button menus, catalog sharing, and appointment booking.
   - AI Voice Agent: Natural voice synthesis for handling customer calls and follow-ups.
   - Business Workflow Automation: Connecting apps, forms, invoices, and databases via Zapier, Make, and custom AI tools.
9. Video Editing:
   - Reels, Short videos, Advertisement videos, Product videos, Promotional videos, Motion graphics.
10. Logo Design:
    - Business logos, startup branding, minimal logos, premium brand marks, logo variations.
11. Project Inquiry Process:
    - Step 1: Initial Consultation & Discussion (understand requirements)
    - Step 2: Custom Proposal & Scope (clear deliverables)
    - Step 3: Design, Development & Campaign Setup
    - Step 4: Review, Revisions & Launch
    - Step 5: Ongoing Support & Optimization

CRITICAL INSTRUCTIONS & RESTRICTIONS:
- DO NOT claim that you are human. Always be transparent that you are the Digital X AI Assistant.
- IF YOU DO NOT KNOW AN ANSWER, YOU MUST SAY: "I'm not sure about that. I can connect you with the Digital X team."
- DO NOT invent pricing, guarantees, client results or company information. When asked for exact prices, explain that pricing depends on project scope and custom requirements, and offer to collect their project details or connect on WhatsApp.
- Keep responses professional, short, and helpful. Use clear bullet points when summarizing options.
- If the visitor shows buying or project intent (e.g., wanting to build a website, run ads, hire us, get a quote, or automate workflows), encourage them to share their details:
  * Name
  * Business type
  * Service interested in
  * Phone/WhatsApp number
  * Project requirements
  And let them know they can also click the "💰 Get a Quote" quick action or "Continue on WhatsApp →" to connect immediately with a specialist.`;

// Deterministic fallback knowledge responder for when AI key is missing or offline
function getFallbackKnowledge(message: string): string {
  const query = message.toLowerCase();

  if (query.includes('price') || query.includes('pricing') || query.includes('cost') || query.includes('rate') || query.includes('fee')) {
    return "Our pricing is tailored to each project's scope, requirements, and deliverables. To get an accurate quote for your business, click the '💰 Get a Quote' button or contact our team directly on WhatsApp at +91 7970884193.";
  }

  if (query.includes('website') || query.includes('web development') || query.includes('ecommerce') || query.includes('e-commerce') || query.includes('shopify') || query.includes('landing page')) {
    return "Digital X builds high-performance, responsive websites including Business Websites, E-commerce (Shopify), Portfolio Sites, and High-converting Landing Pages with mobile optimization and maintenance. Would you like to get a quote or discuss your project?";
  }

  if (query.includes('meta') || query.includes('facebook') || query.includes('instagram') || query.includes('social media')) {
    return "We create performance-focused Meta Ads (Facebook & Instagram) and complete Social Media Marketing campaigns designed to reach targeted customers, build brand awareness, and generate qualified leads. Would you like us to run ads for your business?";
  }

  if (query.includes('google ad') || query.includes('search ad') || query.includes('youtube ad')) {
    return "Our Google Ads services include Search Ads, Display Ads, YouTube Ads, and Remarketing with keyword research and conversion tracking to reach high-intent customers. Would you like a campaign strategy for your brand?";
  }

  if (query.includes('automation') || query.includes('chatbot') || query.includes('voice agent') || query.includes('workflow') || query.includes('whatsapp')) {
    return "Digital X AI Automation covers 6 key capabilities:\n• AI Website Chatbots\n• Customer Support Automation\n• Lead Generation Automation\n• WhatsApp Automation\n• AI Voice Agents\n• Business Workflow Automation\n\nWould you like to automate repetitive workflows in your business?";
  }

  if (query.includes('brand') || query.includes('logo') || query.includes('graphic design') || query.includes('creative')) {
    return "We craft complete brand identities including custom logo design, social media creatives, business profiles, and marketing collateral. What kind of design does your business need?";
  }

  if (query.includes('video') || query.includes('reel') || query.includes('edit')) {
    return "Our video editing services include Instagram Reels, YouTube Shorts, product ads, and promotional videos with motion graphics. Would you like us to edit videos for your brand?";
  }

  if (query.includes('process') || query.includes('how it works') || query.includes('steps') || query.includes('timeline')) {
    return "Our project inquiry process is straightforward:\n1. Consultation & Discussion\n2. Scope & Custom Proposal\n3. Design & Development / Setup\n4. Review & Launch\n5. Ongoing Support\n\nWe can get started right away!";
  }

  if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('address') || query.includes('location')) {
    return "You can reach Digital X directly at:\n• WhatsApp / Phone: +91 7970884193\n• Email: info@thedigitalx.in\n• Location: Sonepur, Shahpur, Saran, Bihar 841101";
  }

  if (query.includes('human') || query.includes('who are you') || query.includes('are you a bot') || query.includes('are you real')) {
    return "I am the Digital X AI Assistant, an AI created to help you explore our digital solutions. If you prefer to speak with our human team, you can reach them directly on WhatsApp at +91 7970884193!";
  }

  return "I'm not sure about that. I can connect you with the Digital X team. You can reach out at +91 7970884193 or click 'Talk to Digital X' to discuss your requirements.";
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Digital X Multi Services',
    aiEnabled: Boolean(ai),
  });
});

// SEO robots.txt
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://thedigitalx.in/sitemap.xml
`);
});

// SEO sitemap.xml
app.get('/sitemap.xml', (_req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://thedigitalx.in/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://thedigitalx.in/#services</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://thedigitalx.in/#solutions</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://thedigitalx.in/#ai-consultant</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://thedigitalx.in/#package-builder</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://thedigitalx.in/#portfolio</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://thedigitalx.in/#ai-video-ads</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://thedigitalx.in/#contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`);
});

// AI Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    // If Gemini client is not configured, use fallback knowledge base
    if (!ai) {
      const fallbackReply = getFallbackKnowledge(message);
      return res.json({
        reply: fallbackReply,
        source: 'knowledge_base',
      });
    }

    // Format chat history for Gemini API
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item && item.content && (item.role === 'user' || item.role === 'model')) {
          contents.push({
            role: item.role,
            parts: [{ text: String(item.content) }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.25,
      },
    });

    const reply = response.text || getFallbackKnowledge(message);

    return res.json({
      reply,
      source: 'gemini',
    });
  } catch (err: any) {
    console.error('Error generating AI response:', err);
    // Graceful fallback on API error
    const fallbackReply = getFallbackKnowledge(req.body.message || '');
    return res.json({
      reply: fallbackReply,
      source: 'fallback_on_error',
    });
  }
});

// Lead capture endpoint to record leads
app.post('/api/leads', (req, res) => {
  try {
    const lead = req.body;
    console.log('[Digital X AI Lead Captured]', lead);
    return res.json({ success: true, leadId: 'lead_' + Date.now() });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to record lead' });
  }
});

// Voice Assistant System Instruction
const VOICE_SYSTEM_INSTRUCTION = `You are the official Digital X AI Voice Assistant for Digital X Multi Services Pvt. Ltd. (Digital X).
The visitor is speaking to you using their microphone, and your reply will be read out aloud using voice synthesis.

CRITICAL VOICE CONVERSATION GUIDELINES:
1. Spoken, Concise & Natural: Keep responses brief, friendly, natural, and conversational (typically 1 to 3 short sentences). Avoid bullet points, symbols, markdown asterisks, or long text that sounds awkward when spoken out loud.
2. Company Identity:
   - Company: Digital X Multi Services Pvt. Ltd. (Digital X)
   - Services: Website Development, E-commerce Websites, Landing Pages, Digital Marketing, Meta Ads (Facebook & Instagram), Google Ads, Social Media Marketing, Branding & Logo Design, Video Editing, AI Solutions, AI Chatbots, AI Voice Assistants, Business Automation, Lead Generation Automation, WhatsApp Automation.
   - Contact: WhatsApp / Phone +91 7970884193, Email: info@thedigitalx.in.
   - Location: Sonepur, Saran, Bihar, India.
3. No Invented Information:
   - Do NOT invent pricing, results, guarantees, awards, or statistics.
   - If asked about pricing: "Our pricing depends on your requirements. I can collect your project details and our team can provide a suitable quote."
4. If Unsure:
   - Always say: "I'm not sure about that. I can connect you with the Digital X team."
5. Never claim you are human: Always be transparent that you are the Digital X AI voice assistant.
6. Conversational Lead Collection:
   When the visitor shows interest in starting a project, hiring Digital X, getting a website, running ads, or automating work:
   Naturally collect their details one step at a time:
   - Name
   - Business / Company name
   - Phone / WhatsApp number
   - Email
   - Required service
   - Project requirements
   - Budget (optional)
   - Preferred contact method
   Never ask for everything at once. Ask for one item conversationally.
   When the conversation concludes or the details are gathered, say:
   "Thank you, [Name]. I have received your request for [service]. Our team will contact you shortly."`;

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

function getFallbackVoiceReply(message: string, currentLead?: VoiceLeadState): { reply: string; updatedLead: VoiceLeadState; isComplete: boolean } {
  const text = message.trim();
  const lower = text.toLowerCase();
  const lead: VoiceLeadState = currentLead ? { ...currentLead } : { step: 'idle' };

  // If in active lead collection step
  if (lead.step === 'name') {
    lead.name = text.replace(/my name is|i am|this is/gi, '').trim();
    lead.step = 'business';
    return {
      reply: `Nice to meet you, ${lead.name}. What type of business or company do you have?`,
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lead.step === 'business') {
    lead.business = text;
    lead.step = 'service';
    return {
      reply: `Got it. Which service are you most interested in, such as a website, digital marketing, or AI automation?`,
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lead.step === 'service') {
    lead.service = text;
    lead.step = 'phone';
    return {
      reply: `Understood. What is the best phone or WhatsApp number for our team to reach you?`,
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lead.step === 'phone') {
    lead.phone = text;
    lead.step = 'email';
    return {
      reply: `Thanks! Could you also share your email address so we can send the project proposal?`,
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lead.step === 'email') {
    lead.email = text;
    lead.step = 'requirements';
    return {
      reply: `Great. Briefly, what are your main goals or requirements for this project?`,
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lead.step === 'requirements') {
    lead.requirements = text;
    lead.step = 'completed';
    return {
      reply: `Thank you, ${lead.name || 'there'}! I have received your request for ${lead.service || 'your project'}. Our team will contact you shortly.`,
      updatedLead: lead,
      isComplete: true,
    };
  }

  // Check intent triggers
  if (lower.includes('hello') || lower.includes('hi ') || lower === 'hi' || lower.includes('hey')) {
    return {
      reply: "Hi! I'm Digital X AI. How can I help your business today?",
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost') || lower.includes('rate') || lower.includes('how much')) {
    lead.step = 'name';
    return {
      reply: "Our pricing depends on your requirements. I can collect your project details and our team can provide a suitable quote. May I know your name?",
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('shopify') || lower.includes('online store')) {
    lead.step = 'name';
    lead.service = 'Ecommerce Website Development';
    return {
      reply: "Absolutely. Digital X builds fast, high-converting ecommerce websites with payment gateways and mobile shopping. What is your name so we can get started?",
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lower.includes('website') || lower.includes('landing page') || lower.includes('web development')) {
    lead.step = 'name';
    lead.service = 'Website Development';
    return {
      reply: "Digital X builds custom, responsive websites tailored for business growth. What is your name so I can help you get started?",
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lower.includes('meta ad') || lower.includes('facebook ad') || lower.includes('instagram ad')) {
    lead.step = 'name';
    lead.service = 'Meta Ads';
    return {
      reply: "We run high-performance Meta Ads campaigns on Facebook and Instagram to generate qualified leads and sales. May I know your name?",
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lower.includes('google ad') || lower.includes('search ad')) {
    lead.step = 'name';
    lead.service = 'Google Ads';
    return {
      reply: "We create targeted Google Ads campaigns across Search, Display, and YouTube to reach customers when they are ready to buy. May I have your name?",
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lower.includes('chatbot') || lower.includes('chat bot')) {
    lead.step = 'name';
    lead.service = 'AI Website Chatbot';
    return {
      reply: "Digital X deploys intelligent 24/7 AI chatbots on websites and WhatsApp to answer queries and qualify leads automatically. May I have your name?",
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lower.includes('automation') || lower.includes('ai automation') || lower.includes('workflow')) {
    lead.step = 'name';
    lead.service = 'AI Automation';
    return {
      reply: "We automate customer support, lead capture, communication, and business workflows using AI. What is your name?",
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lower.includes('voice assistant') || lower.includes('voice agent')) {
    lead.step = 'name';
    lead.service = 'AI Voice Assistant';
    return {
      reply: "We develop conversational voice assistants just like this one to handle customer calls and web inquiries. May I know your name?",
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lower.includes('branding') || lower.includes('logo') || lower.includes('graphic')) {
    lead.step = 'name';
    lead.service = 'Branding & Graphic Design';
    return {
      reply: "We craft distinctive logos, brand guidelines, and marketing graphics for growing companies. What is your name?",
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lower.includes('video') || lower.includes('reel') || lower.includes('edit')) {
    lead.step = 'name';
    lead.service = 'Video Editing';
    return {
      reply: "We produce professional Instagram Reels, YouTube Shorts, and promotional advertisement videos. May I have your name?",
      updatedLead: lead,
      isComplete: false,
    };
  }

  if (lower.includes('human') || lower.includes('someone') || lower.includes('talk to') || lower.includes('call') || lower.includes('contact')) {
    return {
      reply: "You can talk directly with the Digital X team at +91 7970884193 or on WhatsApp. Would you like me to take your number for a quick callback?",
      updatedLead: lead,
      isComplete: false,
    };
  }

  return {
    reply: "I'm not sure about that. I can connect you with the Digital X team on WhatsApp or phone at +91 7970884193.",
    updatedLead: lead,
    isComplete: false,
  };
}

// AI Voice Assistant Conversational Endpoint
app.post('/api/voice/chat', async (req, res) => {
  try {
    const { message, history, leadState } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Voice message is required' });
    }

    // If Gemini client is not configured, use voice fallback state machine
    if (!ai) {
      const result = getFallbackVoiceReply(message, leadState);
      return res.json({
        reply: result.reply,
        leadState: result.updatedLead,
        isLeadComplete: result.isComplete,
        source: 'voice_knowledge_base',
      });
    }

    // Build context including lead collection instructions
    const leadContext = leadState && leadState.step !== 'idle'
      ? `Current lead state: step=${leadState.step}, collected=${JSON.stringify(leadState)}. Continue collecting missing information conversationally.`
      : '';

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item && item.text && (item.role === 'user' || item.role === 'model')) {
          contents.push({
            role: item.role,
            parts: [{ text: String(item.text) }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: `${message} ${leadContext}` }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: VOICE_SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    const reply = response.text?.trim() || getFallbackVoiceReply(message, leadState).reply;
    
    // Check if reply indicates lead completion
    const lowerReply = reply.toLowerCase();
    const isComplete = lowerReply.includes('thank you') && (lowerReply.includes('received your request') || lowerReply.includes('contact you shortly'));

    const updatedLead: VoiceLeadState = leadState ? { ...leadState } : { step: 'idle' };
    if (isComplete) {
      updatedLead.step = 'completed';
    }

    return res.json({
      reply,
      leadState: updatedLead,
      isLeadComplete: isComplete,
      source: 'gemini_voice',
    });
  } catch (err: any) {
    console.error('Error generating voice AI response:', err);
    const fallbackResult = getFallbackVoiceReply(req.body.message || '', req.body.leadState);
    return res.json({
      reply: fallbackResult.reply,
      leadState: fallbackResult.updatedLead,
      isLeadComplete: fallbackResult.isComplete,
      source: 'voice_fallback',
    });
  }
});

// Cooldown timestamp for Gemini TTS if quota is reached
let geminiTtsCooldownUntil = 0;

// Video Projects in-memory cache with fallback
const videoProjectsCache: any[] = [];

// AI Video Creator: Image Analysis Endpoint
app.post('/api/video-creator/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', productName = '', brandName = '' } = req.body;
    const analysis = await videoEngine.analyzeProduct(imageBase64, {
      productName,
      brandName,
      mimeType,
    });
    return res.json({ success: true, analysis });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to analyze product image', message: err?.message });
  }
});

// AI Video Creator: Script, Storyboard & Variations Generation Endpoint
app.post('/api/video-creator/generate-ad', async (req, res) => {
  try {
    const {
      productName = 'Product',
      productDescription = '',
      brandName = 'Digital X',
      price = '',
      offer = '',
      websiteUrl = '',
      language = 'English',
      style = 'Premium',
      duration = '30',
      voicePersona = 'Professional Male',
      presenterId = '',
      analysis = {},
    } = req.body;

    const adPackage = await videoEngine.generateAdPackage({
      productName,
      productDescription,
      brandName,
      price,
      offer,
      websiteUrl,
      language,
      style,
      duration,
      voicePersona,
      presenterId,
      analysis,
    });

    return res.json({
      success: true,
      adPackage,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate ad package', message: err?.message });
  }
});

// AI Video Creator: Provider Status & Capabilities
app.get('/api/video-creator/providers', (_req, res) => {
  res.json({
    success: true,
    activeProvider: videoEngine.name,
    providers: [
      {
        id: 'gemini',
        name: 'Google Gemini 2.5 Multimodal Engine',
        status: Boolean(process.env.GEMINI_API_KEY) ? 'active' : 'standby',
        capabilities: ['Vision Analysis', 'Storyboard Breakdown', 'Scriptwriting', 'Hook Synthesis', 'B-Roll Planning'],
      },
      {
        id: 'runway',
        name: 'Runway Gen-3 Alpha Video Engine',
        status: Boolean(process.env.RUNWAY_API_KEY) ? 'active' : 'ready_for_key',
        capabilities: ['Photorealistic Diffusion Video', 'Motion Control'],
      },
      {
        id: 'luma',
        name: 'Luma Dream Machine Engine',
        status: Boolean(process.env.LUMA_API_KEY) ? 'active' : 'ready_for_key',
        capabilities: ['Cinematic Camera Motions', 'Lighting Realism'],
      },
      {
        id: 'elevenlabs',
        name: 'ElevenLabs AI Neural Voice Engine',
        status: Boolean(process.env.ELEVENLABS_API_KEY) ? 'active' : 'ready_for_key',
        capabilities: ['Ultra-Realistic Voice Cloning', 'Neural Lip-Sync Timing'],
      },
    ],
  });
});

// AI Video Creator: Save & List Projects
app.get('/api/video-creator/projects', (_req, res) => {
  res.json({
    success: true,
    projects: videoProjectsCache.slice(0, 30),
  });
});

app.post('/api/video-creator/projects', (req, res) => {
  try {
    const project = req.body;
    if (!project || !project.id) {
      return res.status(400).json({ error: 'Invalid project payload' });
    }
    const idx = videoProjectsCache.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      videoProjectsCache[idx] = { ...videoProjectsCache[idx], ...project, updated_at: new Date().toISOString() };
    } else {
      videoProjectsCache.unshift({ ...project, created_at: project.created_at || new Date().toISOString() });
    }
    if (videoProjectsCache.length > 50) {
      videoProjectsCache.pop();
    }
    return res.json({ success: true, project });
  } catch {
    return res.status(500).json({ error: 'Failed to save project' });
  }
});

// Voice TTS endpoint with ElevenLabs & Gemini TTS + silent Browser Speech Synthesis fallback
app.post('/api/voice/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const cleanText = text.slice(0, 350).trim();

    // 1. Check for ElevenLabs integration if API key is configured
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    if (elevenLabsApiKey) {
      try {
        const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
        const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': elevenLabsApiKey,
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        });

        if (elevenRes.ok) {
          const arrayBuffer = await elevenRes.arrayBuffer();
          const audioBase64 = Buffer.from(arrayBuffer).toString('base64');
          return res.json({
            audioBase64,
            mimeType: 'audio/mp3',
            provider: 'elevenlabs',
            success: true,
          });
        }
      } catch {
        // Fall through to next provider
      }
    }

    // 2. Try Gemini TTS if initialized and not in quota cooldown
    if (ai && Date.now() > geminiTtsCooldownUntil) {
      try {
        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: cleanText,
                  speechMetadata: {
                    style: 'Clear, warm, professional executive AI assistant for Digital X',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });

        const audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        const mimeType = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/pcm;rate=24000';

        if (audioBase64) {
          return res.json({
            audioBase64,
            mimeType,
            provider: 'gemini',
            success: true,
          });
        }
      } catch (err: any) {
        // If 429 Quota exhausted, set 2-minute cooldown so we don't spam the API
        const msg = String(err?.message || '');
        if (err?.status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
          geminiTtsCooldownUntil = Date.now() + 120 * 1000;
        }
        // Smoothly fall back to browser Web Speech Synthesis without noisy logs
        return res.json({ fallback: true, provider: 'browser' });
      }
    }

    // 3. Graceful fallback to client-side Web Speech Synthesis
    return res.json({ fallback: true, provider: 'browser' });
  } catch {
    return res.json({ fallback: true, provider: 'browser' });
  }
});

async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital X Server active on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
});
