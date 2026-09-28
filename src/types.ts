export type ServiceCategory = 
  | 'Website Development'
  | 'E-commerce Website'
  | 'Landing Page Development'
  | 'Digital Marketing'
  | 'Meta Ads'
  | 'Google Ads'
  | 'Social Media Marketing'
  | 'Branding & Graphic Design'
  | 'Logo Design'
  | 'Video Editing'
  | 'AI Solutions'
  | 'Business Automation'
  | 'Other';

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  iconName: 'code' | 'cart' | 'layout' | 'trending' | 'meta' | 'google' | 'share' | 'palette' | 'feather' | 'video' | 'bot' | 'workflow';
  services: string[];
  ctaText: string;
  badge?: string;
  popular?: boolean;
  basePrice?: number;
  pillar?: 'BUILD' | 'MARKET' | 'AUTOMATE' | 'BRAND';
}

export interface WhyChooseUsItem {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: 'sparkle' | 'lightning' | 'pricetag' | 'mobile' | 'headset' | 'users' | 'layers';
}

export type PortfolioCategory = 
  | 'All' 
  | 'Websites' 
  | 'E-commerce' 
  | 'Branding' 
  | 'Social Media' 
  | 'Ads' 
  | 'Video';

export interface PortfolioProject {
  id: string;
  title: string;
  category: Exclude<PortfolioCategory, 'All'>;
  details: string;
  description: string;
  clientContext?: string;
  tags: string[];
  featured?: boolean;
  colorGradient: string;
  mockupType: 'website' | 'ecommerce' | 'video' | 'logo' | 'card' | 'poster' | 'ad' | 'guidelines';
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ClientReview {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  rating: number; // 1 - 5
  review: string;
  photoUrl?: string;
  status: ReviewStatus;
  createdAt: string; // ISO date string
  approvedAt?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterested: string;
  budget: string;
  message: string;
}

// -------------------------------------------------------------
// CRM & LEAD MANAGEMENT TYPES
// -------------------------------------------------------------
export type LeadStatus = 
  | 'New' 
  | 'Contacted' 
  | 'Qualified' 
  | 'Proposal Sent' 
  | 'Negotiation' 
  | 'Won' 
  | 'Lost' 
  | 'Closed';

export type LeadSource = 
  | 'Website Form' 
  | 'AI Chat' 
  | 'AI Voice' 
  | 'WhatsApp' 
  | 'Quotation Tool' 
  | 'Package Builder' 
  | 'AI Video Ad Tool'
  | 'Free Consultation'
  | 'Digital Audit';

export interface Lead {
  id: string;
  name: string;
  business_name: string;
  email: string;
  phone: string;
  service: string;
  business_type?: string;
  requirement: string;
  budget?: string;
  timeline?: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string[];
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

// -------------------------------------------------------------
// QUOTATION SYSTEM TYPES
// -------------------------------------------------------------
export interface QuotationItem {
  id: string;
  service: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired';

export interface Quotation {
  id: string;
  quotation_number: string; // e.g. DX-QT-2026-0001
  client_name: string;
  business_name: string;
  email: string;
  phone: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  tax: number; // e.g. 18% GST
  grand_total: number;
  status: QuotationStatus;
  valid_until: string;
  created_at: string;
  terms: string[];
  notes?: string;
}

// -------------------------------------------------------------
// CLIENT DASHBOARD & PROJECT MANAGEMENT TYPES
// -------------------------------------------------------------
export type ProjectStage = 
  | 'Not Started' 
  | 'Planning' 
  | 'Design' 
  | 'Development' 
  | 'Testing' 
  | 'Review' 
  | 'Launch' 
  | 'Completed';

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  due_date?: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_type: string;
  file_size: string;
  uploaded_by: 'client' | 'admin';
  upload_date: string;
  download_url?: string;
}

export interface ProjectMessage {
  id: string;
  project_id: string;
  sender_role: 'client' | 'admin';
  sender_name: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  attachment?: string;
}

export interface ProjectPayment {
  id: string;
  project_id: string;
  amount: number;
  date: string;
  method: string;
  transaction_id: string;
  status: 'Completed' | 'Pending' | 'Failed';
  invoice_number: string;
}

export interface Project {
  id: string;
  name: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  services: string[];
  current_stage: ProjectStage;
  progress_percentage: number; // 0 - 100
  start_date: string;
  expected_completion: string;
  assigned_manager: string;
  total_amount: number;
  amount_paid: number;
  amount_remaining: number;
  payment_status: 'Unpaid' | 'Partial' | 'Paid';
  tasks: ProjectTask[];
  files: ProjectFile[];
  messages: ProjectMessage[];
  payments: ProjectPayment[];
  quotation_id?: string;
}

// -------------------------------------------------------------
// SUPPORT TICKETS
// -------------------------------------------------------------
export type SupportCategory = 'Website' | 'Payment' | 'Design' | 'Technical' | 'Marketing' | 'Other';
export type SupportPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type SupportStatus = 'Open' | 'In Progress' | 'Waiting for Client' | 'Resolved' | 'Closed';

export interface SupportTicket {
  id: string;
  client_name: string;
  client_email: string;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  status: SupportStatus;
  description: string;
  created_at: string;
  updated_at: string;
  replies?: Array<{
    sender: 'client' | 'admin';
    name: string;
    message: string;
    timestamp: string;
  }>;
}

// -------------------------------------------------------------
// PACKAGE BUILDER TYPES
// -------------------------------------------------------------
export interface PackagePillarService {
  id: string;
  name: string;
  category: 'BUILD' | 'MARKET' | 'BRAND' | 'AUTOMATE';
  description: string;
  basePrice: number;
  popular?: boolean;
}

export interface PredefinedPackage {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  services: string[];
  baseStartingPrice: number;
  description: string;
}

// -------------------------------------------------------------
// AI VIDEO AD CREATOR TYPES
// -------------------------------------------------------------
export interface ProductAnalysis {
  category: string;
  colors: string[];
  style: string;
  shape?: string;
  material?: string;
  visibleFeatures: string[];
  detectedBrand?: string;
  targetAudience: string;
  advertisingStyle: string;
  backgroundRecommendation: string;
  suggestedPresenterStyle?: string;
  likelyUseCase?: string;
}

export interface AIPresenter {
  id: string;
  name: string;
  gender: 'Female' | 'Male';
  demographic: 'Indian' | 'International';
  style: 'Influencer / UGC' | 'Professional' | 'Luxury' | 'Energetic' | 'Corporate' | 'Friendly';
  tagline: string;
  avatarColor: string;
  hairStyle: 'long_wavy' | 'sleek_bun' | 'short_fade' | 'modern_quiff' | 'chic_bob' | 'textured_crop';
  clothingStyle: 'casual_hoodie' | 'smart_blazer' | 'elegant_dress' | 'tech_tshirt' | 'linen_shirt';
  voiceId: string;
  voicePitch: number;
  voiceRate: number;
}

export interface VideoScene {
  id: string;
  scene_number: number;
  name: string;
  scene_type: 'presenter_hook' | 'product_b_roll' | 'presenter_demo' | 'product_close_up' | 'presenter_benefit' | 'cta_outro';
  scene_description: string;
  duration: number; // in seconds
  camera_motion: 'slow_zoom_in' | 'slow_zoom_out' | 'pan_right' | 'pan_left' | 'parallax_tilt' | 'dolly_reveal' | 'ambient_float' | 'macro_orbit';
  visual_theme: string;
  voice_text: string;
  caption_text: string;
  highlight_word?: string;
  badge_text?: string;
  presenter_active: boolean;
  presenter_shot: 'full_frame' | 'split_screen' | 'floating_pip' | 'off_camera_b_roll';
  b_roll_effect?: 'specular_sweep' | 'orbit_zoom' | 'macro_texture' | 'particle_burst' | 'feature_callouts';
  status?: 'Pending' | 'Rendering' | 'Completed';
}

export interface VideoVariation {
  id: string;
  version: 'A' | 'B' | 'C' | 'D' | 'E';
  style_name: string; // e.g. 'Problem → Solution', 'UGC Creator Review', 'Cinematic Product Demo', 'Luxury Commercial', 'Fast Viral Hook'
  hook: string;
  music_style: string;
  voice_persona: string;
  scenes: VideoScene[];
}

export interface VideoScript {
  hook: string;
  problem: string;
  solution: string;
  benefits: string[];
  cta: string;
}

export interface VideoAdProject {
  id: string;
  customer_name?: string;
  customer_email?: string;
  product_name: string;
  product_description: string;
  target_audience: string;
  offer: string;
  price?: string;
  website_cta: string;
  brand_name: string;
  language: 'English' | 'Hindi' | 'Hinglish' | 'Tamil' | 'Telugu' | 'Bengali';
  video_style: string;
  video_duration: string;
  aspect_ratio: '9:16' | '1:1' | '4:5' | '16:9';
  product_image_url?: string;
  secondary_images?: string[];
  logo_url?: string;
  analysis?: ProductAnalysis;
  script?: VideoScript;
  scenes?: VideoScene[];
  variations?: VideoVariation[];
  selected_variation?: 'A' | 'B' | 'C' | 'D' | 'E';
  presenter?: AIPresenter;
  caption_style?: 'Modern' | 'Bold' | 'Minimal' | 'Premium';
  music_track?: string;
  voice_persona: 'Professional Male' | 'Professional Female' | 'Energetic' | 'Friendly' | 'Corporate' | 'Luxury' | 'Influencer';
  credits_used?: number;
  status: 'Draft' | 'Uploading' | 'Analyzing' | 'Script Generated' | 'Generating Scenes' | 'Generating Voice' | 'Adding Music' | 'Adding Captions' | 'Rendering' | 'Completed' | 'Failed';
  video_preview_url?: string;
  created_at: string;
  updated_at?: string;
}

// -------------------------------------------------------------
// USER & AUTH ROLES
// -------------------------------------------------------------
export type UserRole = 'admin' | 'staff' | 'client' | 'visitor';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  company?: string;
  token?: string;
}
