import {
  Lead,
  LeadStatus,
  LeadSource,
  Quotation,
  QuotationItem,
  QuotationStatus,
  Project,
  ProjectStage,
  ProjectTask,
  ProjectFile,
  ProjectMessage,
  ProjectPayment,
  SupportTicket,
  SupportCategory,
  SupportPriority,
  VideoAdProject,
  PackagePillarService,
  PredefinedPackage,
  PlatformUser,
  UserRole
} from '../types';
import { COMPANY_INFO } from '../data/siteData';

// Storage keys
const LEADS_KEY = 'digitalx_platform_leads_v2';
const QUOTATIONS_KEY = 'digitalx_platform_quotations_v2';
const PROJECTS_KEY = 'digitalx_platform_projects_v2';
const TICKETS_KEY = 'digitalx_platform_tickets_v2';
const VIDEO_ADS_KEY = 'digitalx_platform_video_ads_v2';
const USER_KEY = 'digitalx_platform_user_v2';
const SHARED_AI_CONTEXT_KEY = 'digitalx_shared_ai_context_v2';

// ---------------------------------------------------------------------
// CONFIGURABLE SERVICES CATALOG (Admin managed, never hardcoded in UI)
// ---------------------------------------------------------------------
export const DEFAULT_PILLAR_SERVICES: PackagePillarService[] = [
  // BUILD
  {
    id: 'srv-web',
    name: 'Website Development',
    category: 'BUILD',
    description: 'Custom, fast, responsive corporate and business websites designed for high conversions.',
    basePrice: 24999,
    popular: true,
  },
  {
    id: 'srv-ecom',
    name: 'Ecommerce Website Development',
    category: 'BUILD',
    description: 'Complete online stores, product catalogs, shopping cart, and payment gateway integration.',
    basePrice: 39999,
    popular: true,
  },
  {
    id: 'srv-landing',
    name: 'High-Converting Landing Pages',
    category: 'BUILD',
    description: 'Conversion-focused single page sites designed for ad campaigns and lead capture.',
    basePrice: 14999,
  },
  {
    id: 'srv-biz-web',
    name: 'Corporate Business Portal',
    category: 'BUILD',
    description: 'Enterprise portals with client dashboards, inquiry management, and integrations.',
    basePrice: 49999,
  },

  // MARKET
  {
    id: 'srv-meta-ads',
    name: 'Meta Ads (Facebook & Instagram)',
    category: 'MARKET',
    description: 'Targeted lead generation & sales campaigns with custom ad creatives and audience optimization.',
    basePrice: 19999,
    popular: true,
  },
  {
    id: 'srv-google-ads',
    name: 'Google Ads & Search Marketing',
    category: 'MARKET',
    description: 'Search, Display, and YouTube campaigns targeting high-intent customers ready to buy.',
    basePrice: 19999,
    popular: true,
  },
  {
    id: 'srv-seo',
    name: 'Search Engine Optimization (SEO)',
    category: 'MARKET',
    description: 'On-page, technical, and local SEO to rank higher on Google search results.',
    basePrice: 14999,
  },
  {
    id: 'srv-smm',
    name: 'Social Media Marketing & Management',
    category: 'MARKET',
    description: 'Monthly content calendar, creatives, Reels, captions, and brand community growth.',
    basePrice: 14999,
  },
  {
    id: 'srv-lead-gen',
    name: 'Lead Generation Campaigns',
    category: 'MARKET',
    description: 'End-to-end buyer pipeline generation with instant CRM and WhatsApp notifications.',
    basePrice: 24999,
  },

  // AUTOMATE
  {
    id: 'srv-ai-chatbot',
    name: 'AI Website Chatbot',
    category: 'AUTOMATE',
    description: '24/7 intelligent conversational bot to greet visitors, answer queries, and qualify leads.',
    basePrice: 14999,
    popular: true,
  },
  {
    id: 'srv-voice-assistant',
    name: 'AI Voice Sales Assistant',
    category: 'AUTOMATE',
    description: 'Natural spoken voice assistant for website sales triage and inbound call handling.',
    basePrice: 24999,
    popular: true,
  },
  {
    id: 'srv-whatsapp-auto',
    name: 'WhatsApp Automation & API Flows',
    category: 'AUTOMATE',
    description: 'Automated welcome replies, interactive button menus, catalog sharing, and alerts.',
    basePrice: 12999,
  },
  {
    id: 'srv-workflow-auto',
    name: 'Business Workflow Automation',
    category: 'AUTOMATE',
    description: 'Connect forms, Google Sheets, CRM, billing, and automated email follow-ups.',
    basePrice: 17999,
  },

  // BRAND
  {
    id: 'srv-logo-branding',
    name: 'Logo Design & Brand Identity',
    category: 'BRAND',
    description: 'Distinctive brand mark, typography rules, color schemes, and social media kits.',
    basePrice: 9999,
    popular: true,
  },
  {
    id: 'srv-graphic-design',
    name: 'Graphic Design & Marketing Collateral',
    category: 'BRAND',
    description: 'Banners, flyers, brochures, presentation decks, and brand marketing creatives.',
    basePrice: 8999,
  },
  {
    id: 'srv-video-editing',
    name: 'Video Editing & Social Reels',
    category: 'BRAND',
    description: 'High-retention Reels, Shorts, promotional ads with motion graphics & captions.',
    basePrice: 12999,
  },
  {
    id: 'srv-ai-video-ads',
    name: 'AI Video Ad Creation',
    category: 'BRAND',
    description: 'Automated product-to-video ad generator with AI script, voiceover, and 9:16 layout.',
    basePrice: 14999,
    popular: true,
  },
];

// Predefined package templates (illustrative base structures, configurable in admin)
export const DEFAULT_PACKAGES: PredefinedPackage[] = [
  {
    id: 'pkg-starter',
    name: 'STARTER DIGITAL SETUP',
    badge: 'Launch Fast',
    tagline: 'Ideal for local businesses taking their first solid step online.',
    services: [
      'Website Development (5 Pages)',
      'Logo Design & Favicon',
      'Google Business Profile Setup',
      'Mobile Responsive Layout',
      'Contact Form & WhatsApp Button',
    ],
    baseStartingPrice: 29999,
    description: 'A complete foundational digital presence built professionally with no shortcuts.',
  },
  {
    id: 'pkg-growth',
    name: 'BUSINESS GROWTH ENGINE',
    badge: 'Most Popular',
    tagline: 'Engineered for businesses ready to acquire customers aggressively.',
    services: [
      'Custom Business Website / Landing Page',
      'Meta Ads Campaign Setup & Management',
      'Google Ads High-Intent Search Campaign',
      'Social Media Creatives & Content',
      'Conversion Tracking & Weekly Reports',
    ],
    baseStartingPrice: 49999,
    description: 'Combine a high-converting website with multi-channel advertising to scale sales.',
  },
  {
    id: 'pkg-ai-business',
    name: 'AI AUTOMATION SUITE',
    badge: 'Maximum Efficiency',
    tagline: 'Modernize everyday workflows and support with 24/7 AI agents.',
    services: [
      'High-Speed Website Development',
      'AI Website Chatbot with Custom Knowledge',
      'AI Voice Sales Assistant',
      'WhatsApp Automation & Lead Alerts',
      'Automated CRM Lead Routing',
    ],
    baseStartingPrice: 64999,
    description: 'Never miss an inquiry again. Turn website visitors into qualified deals automatically.',
  },
];

// Default demo leads to demonstrate full CRM capability
const INITIAL_DEMO_LEADS: Lead[] = [
  {
    id: 'lead-001',
    name: 'Shamas',
    business_name: 'Shamas Luxury Furnishings',
    email: 'shamas@sharmafurnishings.com',
    phone: '+91 9876543210',
    service: 'Ecommerce Website & Meta Ads',
    business_type: 'Home Decor & Furniture Retail',
    requirement: 'Need a modern ecommerce store with payment gateway and Instagram ad campaigns to drive sales across India.',
    budget: '₹50,000 - ₹1,00,000',
    timeline: 'Within 2-3 weeks',
    source: 'AI Voice',
    status: 'Qualified',
    notes: ['Spoke via AI Voice Assistant. High intent. Follow up on WhatsApp.'],
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'lead-002',
    name: 'Pooja Verma',
    business_name: 'Verma Dental & Smile Clinic',
    email: 'contact@vermadental.in',
    phone: '+91 9822334455',
    service: 'Google Ads & AI Chatbot',
    business_type: 'Healthcare & Dental Clinic',
    requirement: 'Want more patient appointments in local area and automated WhatsApp booking assistance.',
    budget: '₹30,000 - ₹50,000',
    timeline: 'Immediate',
    source: 'Website Form',
    status: 'Proposal Sent',
    notes: ['Sent initial quotation DX-QT-2026-0001.'],
    created_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'lead-003',
    name: 'Amit Patel',
    business_name: 'Patel Agro Machinery',
    email: 'patel.agro@gmail.com',
    phone: '+91 9711223344',
    service: 'Website Development & Branding',
    business_type: 'Manufacturing & Distribution',
    requirement: 'Complete company profile website and professional product catalog with inquiry buttons.',
    budget: '₹40,000 - ₹60,000',
    timeline: '1 Month',
    source: 'Quotation Tool',
    status: 'New',
    notes: ['Generated quote via Online Quotation Tool.'],
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

// Initial demo project for the Client Portal ("My Digital X")
const INITIAL_DEMO_PROJECT: Project = {
  id: 'proj-dx-101',
  name: 'Ecommerce Website & AI Automation',
  client_id: 'client-101',
  client_name: 'Shamas',
  client_email: 'shamas@example.com',
  client_phone: '+91 7970884193',
  services: ['Ecommerce Website Development', 'AI Website Chatbot', 'WhatsApp Automation'],
  current_stage: 'Development',
  progress_percentage: 75,
  start_date: '2026-09-10',
  expected_completion: '2026-10-05',
  assigned_manager: 'Digital X Project Team',
  total_amount: 50000,
  amount_paid: 25000,
  amount_remaining: 25000,
  payment_status: 'Partial',
  tasks: [
    { id: 't-1', project_id: 'proj-dx-101', title: 'Requirement Collection & Strategy', status: 'Completed', due_date: '2026-09-12' },
    { id: 't-2', project_id: 'proj-dx-101', title: 'UI/UX Wireframes & Design System', status: 'Completed', due_date: '2026-09-16' },
    { id: 't-3', project_id: 'proj-dx-101', title: 'Homepage & Core Page Development', status: 'Completed', due_date: '2026-09-21' },
    { id: 't-4', project_id: 'proj-dx-101', title: 'Product Catalog & Shopping Cart', status: 'Completed', due_date: '2026-09-24' },
    { id: 't-5', project_id: 'proj-dx-101', title: 'Payment Gateway & Shipping Integration', status: 'In Progress', due_date: '2026-09-29' },
    { id: 't-6', project_id: 'proj-dx-101', title: 'AI Chatbot & WhatsApp Integration', status: 'In Progress', due_date: '2026-10-02' },
    { id: 't-7', project_id: 'proj-dx-101', title: 'Final Testing & Domain DNS Launch', status: 'Pending', due_date: '2026-10-05' },
  ],
  files: [
    {
      id: 'f-1',
      project_id: 'proj-dx-101',
      file_name: 'Brand_Assets_Logo_Vector.svg',
      file_type: 'SVG',
      file_size: '1.2 MB',
      uploaded_by: 'client',
      upload_date: '2026-09-11',
    },
    {
      id: 'f-2',
      project_id: 'proj-dx-101',
      file_name: 'Homepage_UI_Design_Preview_v2.pdf',
      file_type: 'PDF',
      file_size: '4.8 MB',
      uploaded_by: 'admin',
      upload_date: '2026-09-18',
    },
    {
      id: 'f-3',
      project_id: 'proj-dx-101',
      file_name: 'Invoice_DX-INV-2026-001.pdf',
      file_type: 'PDF',
      file_size: '220 KB',
      uploaded_by: 'admin',
      upload_date: '2026-09-12',
    },
  ],
  messages: [
    {
      id: 'm-1',
      project_id: 'proj-dx-101',
      sender_role: 'admin',
      sender_name: 'Digital X Lead Dev',
      message: 'Welcome to your Digital X project portal! We have completed the UI wireframes and product pages.',
      timestamp: '2026-09-22 11:30 AM',
      is_read: true,
    },
    {
      id: 'm-2',
      project_id: 'proj-dx-101',
      sender_role: 'client',
      sender_name: 'Shamas',
      message: 'Looks great! Can you please check the checkout button color on mobile?',
      timestamp: '2026-09-23 02:15 PM',
      is_read: true,
    },
    {
      id: 'm-3',
      project_id: 'proj-dx-101',
      sender_role: 'admin',
      sender_name: 'Digital X Lead Dev',
      message: 'Sure, we have updated the mobile button contrast. Let us know what you think!',
      timestamp: '2026-09-23 04:00 PM',
      is_read: false,
    },
  ],
  payments: [
    {
      id: 'p-1',
      project_id: 'proj-dx-101',
      amount: 25000,
      date: '2026-09-12',
      method: 'Bank Transfer / UPI',
      transaction_id: 'UPI-DX-982341201',
      status: 'Completed',
      invoice_number: 'DX-INV-2026-001',
    },
  ],
  quotation_id: 'DX-QT-2026-0001',
};

// Initial demo quotation
const INITIAL_DEMO_QUOTATION: Quotation = {
  id: 'qt-001',
  quotation_number: 'DX-QT-2026-0001',
  client_name: 'Shamas',
  business_name: 'Shamas Fashion & Trends',
  email: 'shamas@example.com',
  phone: '+91 7970884193',
  items: [
    {
      id: 'qi-1',
      service: 'Ecommerce Website Development',
      description: 'Custom Shopify/WooCommerce store with product catalog, cart, checkout, payment gateway & shipping integration.',
      quantity: 1,
      unit_price: 39999,
      total_price: 39999,
    },
    {
      id: 'qi-2',
      service: 'AI Website Chatbot & WhatsApp Integration',
      description: 'Intelligent 24/7 conversational assistant deployed on store with automated WhatsApp lead notifications.',
      quantity: 1,
      unit_price: 14999,
      total_price: 14999,
    },
  ],
  subtotal: 54998,
  discount: 4998,
  tax: 9000,
  grand_total: 59000,
  status: 'Accepted',
  valid_until: '2026-10-15',
  created_at: '2026-09-10',
  terms: [
    '50% advance upon project sign-off, remaining 50% upon final testing & domain deployment.',
    'Includes 30 days of post-launch technical support and maintenance.',
    'Client delivers product photos, brand logo, and content copy.',
    'Payment via Official Digital X Multi Services Pvt. Ltd. Bank/UPI account.',
  ],
  notes: 'Tailored for online retail scaling.',
};

// In-memory cache fallback to prevent quota or private-browsing errors
const memoryStore = new Map<string, any>();

// Helper: safe local storage retrieval with memory fallback
function getLocalItem<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') {
      return memoryStore.has(key) ? memoryStore.get(key) : fallback;
    }
    const raw = localStorage.getItem(key);
    if (!raw) {
      return memoryStore.has(key) ? memoryStore.get(key) : fallback;
    }
    // Auto-migrate legacy cached placeholder names to Shamas
    if (typeof raw === 'string' && (raw.includes('Sanjit Kumar') || raw.includes('Rahul Sharma'))) {
      const sanitized = raw
        .replaceAll('Sanjit Kumar', 'Shamas')
        .replaceAll('sanjit@example.com', 'shamas@example.com')
        .replaceAll('Rahul Sharma', 'Shamas')
        .replaceAll('rahul@sharmafurnishings.com', 'shamas@sharmafurnishings.com');
      try {
        localStorage.setItem(key, sanitized);
      } catch {}
      const parsed = JSON.parse(sanitized);
      memoryStore.set(key, parsed);
      return parsed;
    }
    const parsed = JSON.parse(raw);
    memoryStore.set(key, parsed);
    return parsed;
  } catch {
    return memoryStore.has(key) ? memoryStore.get(key) : fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  // Always update memory store first
  memoryStore.set(key, value);

  try {
    if (typeof window === 'undefined') return;

    // Sanitize heavy video ads or image payloads before storing
    let payloadToStore: any = value;
    if (key === VIDEO_ADS_KEY && Array.isArray(value)) {
      payloadToStore = value.slice(0, 8).map((ad: any) => ({
        ...ad,
        // Strip out multi-megabyte base64 images that exceed browser storage quotas
        product_image_url: ad.product_image_url && ad.product_image_url.length > 35000
          ? undefined
          : ad.product_image_url,
      }));
    }

    try {
      localStorage.setItem(key, JSON.stringify(payloadToStore));
    } catch {
      // Quota exceeded: clean up old cached video ads or heavy keys
      try {
        localStorage.removeItem(VIDEO_ADS_KEY);
        if (key === VIDEO_ADS_KEY && Array.isArray(payloadToStore)) {
          const minimal = payloadToStore.slice(0, 3).map((ad: any) => ({
            ...ad,
            product_image_url: undefined,
          }));
          localStorage.setItem(key, JSON.stringify(minimal));
        } else {
          localStorage.setItem(key, JSON.stringify(payloadToStore));
        }
      } catch {
        // Retained safely in memoryStore without throwing unhandled exceptions
      }
    }
  } catch {
    // Retained safely in memoryStore
  }
}

// ---------------------------------------------------------------------
// PLATFORM STORE CLASS
// ---------------------------------------------------------------------
class PlatformStore {
  // Shared context between Text AI and Voice AI
  getSharedAIContext(): {
    visitorName?: string;
    businessName?: string;
    interestedService?: string;
    lastQuery?: string;
    summary?: string;
  } {
    return getLocalItem(SHARED_AI_CONTEXT_KEY, {});
  }

  setSharedAIContext(contextUpdate: Partial<{
    visitorName: string;
    businessName: string;
    interestedService: string;
    lastQuery: string;
    summary: string;
  }>): void {
    const current = this.getSharedAIContext();
    const updated = { ...current, ...contextUpdate };
    setLocalItem(SHARED_AI_CONTEXT_KEY, updated);
  }

  // --- LEADS MANAGEMENT ---
  getLeads(): Lead[] {
    const leads = getLocalItem<Lead[]>(LEADS_KEY, INITIAL_DEMO_LEADS);
    return leads;
  }

  createLead(data: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Lead {
    const current = this.getLeads();
    const newLead: Lead = {
      ...data,
      id: 'lead-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newLead, ...current];
    setLocalItem(LEADS_KEY, updated);

    // Update shared AI context
    this.setSharedAIContext({
      visitorName: newLead.name,
      businessName: newLead.business_name,
      interestedService: newLead.service,
    });

    // Notify backend
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      }).catch(() => {});
    } catch {}

    return newLead;
  }

  updateLeadStatus(leadId: string, status: LeadStatus): boolean {
    const leads = this.getLeads();
    const idx = leads.findIndex((l) => l.id === leadId);
    if (idx === -1) return false;
    leads[idx].status = status;
    leads[idx].updated_at = new Date().toISOString();
    setLocalItem(LEADS_KEY, leads);
    return true;
  }

  addLeadNote(leadId: string, note: string): boolean {
    const leads = this.getLeads();
    const idx = leads.findIndex((l) => l.id === leadId);
    if (idx === -1) return false;
    leads[idx].notes = [...(leads[idx].notes || []), note];
    leads[idx].updated_at = new Date().toISOString();
    setLocalItem(LEADS_KEY, leads);
    return true;
  }

  deleteLead(leadId: string): boolean {
    const leads = this.getLeads().filter((l) => l.id !== leadId);
    setLocalItem(LEADS_KEY, leads);
    return true;
  }

  // --- QUOTATION GENERATOR ---
  getQuotations(): Quotation[] {
    return getLocalItem<Quotation[]>(QUOTATIONS_KEY, [INITIAL_DEMO_QUOTATION]);
  }

  generateQuotationNumber(): string {
    const quotations = this.getQuotations();
    const count = quotations.length + 1;
    const year = new Date().getFullYear();
    const padded = String(count).padStart(4, '0');
    return `DX-QT-${year}-${padded}`;
  }

  createQuotation(data: Omit<Quotation, 'id' | 'quotation_number' | 'created_at'>): Quotation {
    const quotations = this.getQuotations();
    const newQuote: Quotation = {
      ...data,
      id: 'qt-' + Date.now().toString(36),
      quotation_number: this.generateQuotationNumber(),
      created_at: new Date().toISOString().split('T')[0],
    };
    const updated = [newQuote, ...quotations];
    setLocalItem(QUOTATIONS_KEY, updated);

    // Also auto-create or update lead from quote
    this.createLead({
      name: data.client_name,
      business_name: data.business_name,
      email: data.email,
      phone: data.phone,
      service: data.items.map((i) => i.service).join(', '),
      requirement: `Quotation requested: ${newQuote.quotation_number} (₹${data.grand_total.toLocaleString()})`,
      source: 'Quotation Tool',
      status: 'Proposal Sent',
      budget: `₹${data.grand_total.toLocaleString()}`,
    });

    return newQuote;
  }

  updateQuotationStatus(id: string, status: QuotationStatus): boolean {
    const quotes = this.getQuotations();
    const idx = quotes.findIndex((q) => q.id === id || q.quotation_number === id);
    if (idx === -1) return false;
    quotes[idx].status = status;
    setLocalItem(QUOTATIONS_KEY, quotes);

    // If quotation is accepted, automatically create project or advance
    if (status === 'Accepted') {
      const q = quotes[idx];
      this.convertQuotationToProject(q);
    }

    return true;
  }

  convertQuotationToProject(quote: Quotation): Project {
    const projects = this.getProjects();
    const existing = projects.find((p) => p.quotation_id === quote.quotation_number);
    if (existing) return existing;

    const newProject: Project = {
      id: 'proj-' + Date.now().toString(36),
      name: `${quote.business_name || quote.client_name} Growth Project`,
      client_id: 'client-' + Date.now().toString(36),
      client_name: quote.client_name,
      client_email: quote.email,
      client_phone: quote.phone,
      services: quote.items.map((i) => i.service),
      current_stage: 'Planning',
      progress_percentage: 15,
      start_date: new Date().toISOString().split('T')[0],
      expected_completion: new Date(Date.now() + 3600000 * 24 * 30).toISOString().split('T')[0],
      assigned_manager: 'Digital X Project Team',
      total_amount: quote.grand_total,
      amount_paid: 0,
      amount_remaining: quote.grand_total,
      payment_status: 'Unpaid',
      tasks: [
        { id: 't-req', project_id: 'new', title: 'Kickoff & Brand Assets Collection', status: 'In Progress' },
        { id: 't-ui', project_id: 'new', title: 'UI/UX Wireframes & Prototype', status: 'Pending' },
        { id: 't-dev', project_id: 'new', title: 'Core Development & Integration', status: 'Pending' },
        { id: 't-test', project_id: 'new', title: 'Quality Testing & Revisions', status: 'Pending' },
        { id: 't-launch', project_id: 'new', title: 'Production Launch & Handover', status: 'Pending' },
      ],
      files: [],
      messages: [
        {
          id: 'msg-welcome',
          project_id: 'new',
          sender_role: 'admin',
          sender_name: 'Digital X Team',
          message: `Quotation ${quote.quotation_number} accepted! Welcome to Digital X. We are excited to build your project.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          is_read: true,
        },
      ],
      payments: [],
      quotation_id: quote.quotation_number,
    };

    const updated = [newProject, ...projects];
    setLocalItem(PROJECTS_KEY, updated);
    return newProject;
  }

  // --- PROJECTS MANAGEMENT ---
  getProjects(): Project[] {
    return getLocalItem<Project[]>(PROJECTS_KEY, [INITIAL_DEMO_PROJECT]);
  }

  getProjectById(projectId: string): Project | undefined {
    return this.getProjects().find((p) => p.id === projectId);
  }

  updateProjectStage(projectId: string, stage: ProjectStage, progress: number): boolean {
    const projects = this.getProjects();
    const idx = projects.findIndex((p) => p.id === projectId);
    if (idx === -1) return false;
    projects[idx].current_stage = stage;
    projects[idx].progress_percentage = Math.max(0, Math.min(100, progress));
    setLocalItem(PROJECTS_KEY, projects);
    return true;
  }

  toggleProjectTask(projectId: string, taskId: string): boolean {
    const projects = this.getProjects();
    const pIdx = projects.findIndex((p) => p.id === projectId);
    if (pIdx === -1) return false;
    const tIdx = projects[pIdx].tasks.findIndex((t) => t.id === taskId);
    if (tIdx === -1) return false;

    const currentStatus = projects[pIdx].tasks[tIdx].status;
    projects[pIdx].tasks[tIdx].status = currentStatus === 'Completed' ? 'In Progress' : 'Completed';

    // Recalculate progress
    const total = projects[pIdx].tasks.length;
    const completed = projects[pIdx].tasks.filter((t) => t.status === 'Completed').length;
    projects[pIdx].progress_percentage = Math.round((completed / total) * 100);

    setLocalItem(PROJECTS_KEY, projects);
    return true;
  }

  addProjectMessage(projectId: string, senderRole: 'client' | 'admin', senderName: string, text: string): ProjectMessage {
    const projects = this.getProjects();
    const pIdx = projects.findIndex((p) => p.id === projectId);
    const newMsg: ProjectMessage = {
      id: 'm-' + Date.now(),
      project_id: projectId,
      sender_role: senderRole,
      sender_name: senderName,
      message: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      is_read: false,
    };

    if (pIdx !== -1) {
      projects[pIdx].messages = [...projects[pIdx].messages, newMsg];
      setLocalItem(PROJECTS_KEY, projects);
    }
    return newMsg;
  }

  addProjectFile(projectId: string, file: Omit<ProjectFile, 'id' | 'project_id' | 'upload_date'>): ProjectFile {
    const projects = this.getProjects();
    const pIdx = projects.findIndex((p) => p.id === projectId);
    const newFile: ProjectFile = {
      ...file,
      id: 'f-' + Date.now(),
      project_id: projectId,
      upload_date: new Date().toISOString().split('T')[0],
    };

    if (pIdx !== -1) {
      projects[pIdx].files = [newFile, ...projects[pIdx].files];
      setLocalItem(PROJECTS_KEY, projects);
    }
    return newFile;
  }

  // --- SUPPORT TICKETS ---
  getSupportTickets(): SupportTicket[] {
    return getLocalItem<SupportTicket[]>(TICKETS_KEY, [
      {
        id: 'tick-1',
        client_name: 'Shamas',
        client_email: 'shamas@example.com',
        subject: 'Mobile responsive checkout review',
        category: 'Website',
        priority: 'Medium',
        status: 'In Progress',
        description: 'Need to make sure Google Pay and PhonePe UPI buttons display prominently on Android Chrome checkout.',
        created_at: '2026-09-24',
        updated_at: '2026-09-24',
      },
    ]);
  }

  createSupportTicket(data: Omit<SupportTicket, 'id' | 'status' | 'created_at' | 'updated_at'>): SupportTicket {
    const tickets = this.getSupportTickets();
    const newTicket: SupportTicket = {
      ...data,
      id: 'tick-' + Date.now().toString(36),
      status: 'Open',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
    };
    const updated = [newTicket, ...tickets];
    setLocalItem(TICKETS_KEY, updated);
    return newTicket;
  }

  // --- AI VIDEO AD CREATOR ---
  getVideoCredits(): number {
    const credits = getLocalItem<number>('digitalx_video_credits_v1', 5);
    return typeof credits === 'number' && !isNaN(credits) ? credits : 5;
  }

  consumeVideoCredit(): boolean {
    const current = this.getVideoCredits();
    if (current > 0) {
      setLocalItem('digitalx_video_credits_v1', current - 1);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('digitalx_credits_changed', { detail: current - 1 }));
      }
      return true;
    }
    return false;
  }

  refundVideoCredit(): void {
    const current = this.getVideoCredits();
    setLocalItem('digitalx_video_credits_v1', current + 1);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('digitalx_credits_changed', { detail: current + 1 }));
    }
  }

  addVideoCredits(amount: number): number {
    const current = this.getVideoCredits();
    const updated = current + amount;
    setLocalItem('digitalx_video_credits_v1', updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('digitalx_credits_changed', { detail: updated }));
    }
    return updated;
  }

  getVideoAdProjects(): VideoAdProject[] {
    const list = getLocalItem<VideoAdProject[]>(VIDEO_ADS_KEY, []);
    return Array.isArray(list) ? list : [];
  }

  saveVideoAdProject(project: VideoAdProject): void {
    const existing = this.getVideoAdProjects();
    const sanitizedProject: VideoAdProject = {
      ...project,
      // If photo is over 35KB, prune it from persistent storage to preserve quota
      product_image_url: project.product_image_url && project.product_image_url.length > 35000
        ? undefined
        : project.product_image_url,
    };

    const idx = existing.findIndex((v) => v.id === sanitizedProject.id);
    let updated: VideoAdProject[];
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = sanitizedProject;
    } else {
      updated = [sanitizedProject, ...existing].slice(0, 10);
    }
    setLocalItem(VIDEO_ADS_KEY, updated);

    // Auto-create a lead for video creation interest
    this.createLead({
      name: project.customer_name || project.brand_name || 'Video Ad Creator User',
      business_name: project.brand_name || project.product_name,
      email: project.customer_email || 'video@digitalx.in',
      phone: COMPANY_INFO.phone,
      service: 'AI Video Ad Service',
      requirement: `Created AI Video Ad for "${project.product_name}" (${project.language}, ${project.video_duration})`,
      source: 'AI Video Ad Tool',
      status: 'Qualified',
    });
  }

  deleteVideoAdProject(id: string): void {
    const existing = this.getVideoAdProjects();
    const updated = existing.filter((p) => p.id !== id);
    setLocalItem(VIDEO_ADS_KEY, updated);
  }

  // --- AUTH & ROLES ---
  getCurrentUser(): PlatformUser {
    return getLocalItem<PlatformUser>(USER_KEY, {
      id: 'guest',
      name: 'Visitor',
      email: 'visitor@thedigitalx.in',
      role: 'visitor',
    });
  }

  setCurrentUser(user: PlatformUser): void {
    setLocalItem(USER_KEY, user);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('digitalx_auth_changed', { detail: user }));
    }
  }

  logout(): void {
    this.setCurrentUser({
      id: 'guest',
      name: 'Visitor',
      email: 'visitor@thedigitalx.in',
      role: 'visitor',
    });
  }
}

export const platformStore = new PlatformStore();
