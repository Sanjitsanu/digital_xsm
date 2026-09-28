import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  FolderKanban,
  FileText,
  DollarSign,
  TrendingUp,
  X,
  Lock,
  CheckCircle2,
  Trash2,
  Phone,
  MessageCircle,
  Plus,
  Edit2,
  Search,
  Check,
  Star,
  Film,
  Activity
} from 'lucide-react';
import { COMPANY_INFO } from '../../data/siteData';
import { platformStore } from '../../services/platformStore';
import {
  getStoredReviews,
  updateReviewStatus,
  deleteStoredReview
} from '../../services/reviewService';
import { Lead, LeadStatus, Quotation, Project } from '../../types';
import { trackEvent, getAnalyticsStats } from '../../services/analyticsService';
import { Logo } from '../Logo';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal?: (services?: string[]) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  onOpenQuoteModal,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'quotes' | 'projects' | 'reviews' | 'videos' | 'analytics'>('leads');

  // Leads state
  const [leads, setLeads] = useState<Lead[]>(platformStore.getLeads());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchLead, setSearchLead] = useState('');

  // Quotations state
  const [quotations, setQuotations] = useState<Quotation[]>(platformStore.getQuotations());

  // Projects state
  const [projects, setProjects] = useState<Project[]>(platformStore.getProjects());

  // Reviews state
  const [reviews, setReviews] = useState(getStoredReviews());

  // Video Ads
  const [videoAds, setVideoAds] = useState(platformStore.getVideoAdProjects());

  // Analytics
  const stats = getAnalyticsStats();

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default Digital X Administrator passcode
    if (pinInput === '7970' || pinInput === 'admin' || pinInput === '1234') {
      setIsAuthenticated(true);
      setLeads(platformStore.getLeads());
      setQuotations(platformStore.getQuotations());
      setProjects(platformStore.getProjects());
      setReviews(getStoredReviews());
      setVideoAds(platformStore.getVideoAdProjects());
      trackEvent('admin_login_success', 'navigation');
    } else {
      alert('Incorrect administrator passcode. Please try again.');
    }
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    platformStore.updateLeadStatus(leadId, newStatus);
    setLeads(platformStore.getLeads());
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      platformStore.deleteLead(leadId);
      setLeads(platformStore.getLeads());
      setSelectedLead(null);
    }
  };

  const handleReviewAction = (revId: string, action: 'approved' | 'rejected' | 'delete') => {
    if (action === 'delete') {
      deleteStoredReview(revId);
    } else {
      updateReviewStatus(revId, action);
    }
    setReviews(getStoredReviews());
  };

  // Filtered leads
  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchLead.toLowerCase()) ||
      l.business_name.toLowerCase().includes(searchLead.toLowerCase()) ||
      l.service.toLowerCase().includes(searchLead.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-label="Digital X Admin Management Platform"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 animate-fade-in"
    >
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#071126] border border-blue-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0B1938] border-b border-blue-500/20 select-none">
          <div className="flex items-center gap-3">
            <Logo size="sm" showSubtitle={false} />
            <div className="h-6 w-[1px] bg-slate-700 mx-1 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400">Digital X Operations Hub</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AUTH CHECK SCREEN (Section 12: Secure authentication required) */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-[#071126] to-[#0A1838]">
            <form onSubmit={handleLogin} className="max-w-md w-full p-8 rounded-3xl bg-[#0B1938] border border-blue-500/30 shadow-2xl text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-cyan-300 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Admin Authentication</h3>
                <p className="text-xs text-slate-400 mt-1">Enter your operations PIN or passcode</p>
              </div>

              <input
                type="password"
                required
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (e.g. 7970)"
                className="w-full text-center text-lg font-mono tracking-widest bg-slate-900 text-white placeholder-slate-500 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                Access Admin Platform
              </button>

              <div className="text-[11px] text-slate-500">
                Authorized Personnel Only • Digital X Security Protocol
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <aside className="w-full md:w-56 bg-[#08142E] border-r border-blue-500/20 p-3 sm:p-4 flex md:flex-col justify-between overflow-x-auto md:overflow-y-auto scrollbar-none">
              <nav className="flex md:flex-col gap-1 w-full">
                {[
                  { id: 'leads', label: `Leads (${leads.length})`, icon: Users },
                  { id: 'quotes', label: `Quotations (${quotations.length})`, icon: FileText },
                  { id: 'projects', label: `Projects (${projects.length})`, icon: FolderKanban },
                  { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
                  { id: 'videos', label: `Video Ads (${videoAds.length})`, icon: Film },
                  { id: 'analytics', label: 'Analytics', icon: Activity },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 md:shrink text-left ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main Admin Workspace */}
            <main className="flex-1 p-5 sm:p-7 overflow-y-auto bg-gradient-to-b from-[#071126] to-[#0A1838]">
              {/* TOP KPI STRIP (Section 12) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Total Leads</span>
                  <div className="text-xl font-bold text-white mt-0.5">{leads.length}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">New Leads</span>
                  <div className="text-xl font-bold text-cyan-300 mt-0.5">
                    {leads.filter((l) => l.status === 'New').length}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Active Projects</span>
                  <div className="text-xl font-bold text-emerald-400 mt-0.5">{projects.length}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Quotations</span>
                  <div className="text-xl font-bold text-indigo-300 mt-0.5">{quotations.length}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">AI Voice Leads</span>
                  <div className="text-xl font-bold text-pink-300 mt-0.5">
                    {leads.filter((l) => l.source === 'AI Voice').length}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Events Logged</span>
                  <div className="text-xl font-bold text-amber-300 mt-0.5">{stats.total}</div>
                </div>
              </div>

              {/* 1. LEADS MANAGEMENT (Section 13) */}
              {activeTab === 'leads' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-blue-500/20">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={searchLead}
                        onChange={(e) => setSearchLead(e.target.value)}
                        placeholder="Search leads by name, service..."
                        className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-700"
                      />
                    </div>
                  </div>

                  {/* Leads Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                          <th className="p-3">Customer</th>
                          <th className="p-3">Service &amp; Requirement</th>
                          <th className="p-3">Source</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-white">{lead.name}</div>
                              <div className="text-[11px] text-slate-400">{lead.business_name} • {lead.phone}</div>
                            </td>
                            <td className="p-3 max-w-xs">
                              <div className="font-semibold text-cyan-300 truncate">{lead.service}</div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">{lead.requirement}</div>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 font-mono">
                                {lead.source}
                              </span>
                            </td>
                            <td className="p-3">
                              <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                                className="bg-slate-950 text-white text-[11px] p-1.5 rounded-lg border border-slate-700"
                              >
                                {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Closed'].map(
                                  (st) => (
                                    <option key={st} value={st}>{st}</option>
                                  )
                                )}
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <a
                                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${lead.name}, this is the Digital X team regarding your ${lead.service} project.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 hover:text-white"
                                  title="WhatsApp Client"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>

                                <a
                                  href={`tel:${lead.phone}`}
                                  className="p-1.5 rounded-lg bg-blue-600/30 text-blue-300 hover:text-white"
                                  title="Call"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:text-rose-100"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2. QUOTATIONS (Section 44) */}
              {activeTab === 'quotes' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                    <h3 className="text-base font-bold text-white">Quotation Registry</h3>
                    {onOpenQuoteModal && (
                      <button
                        type="button"
                        onClick={() => onOpenQuoteModal()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create New Quote</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {quotations.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <strong className="text-white font-mono text-sm">{q.quotation_number}</strong>
                          <span className="text-slate-400 ml-2 font-semibold">{q.client_name} ({q.business_name})</span>
                          <div className="text-[11px] text-slate-500 mt-1">
                            {q.items.map((i) => i.service).join(' • ')}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-cyan-300 font-mono font-bold text-sm">
                            ₹{q.grand_total.toLocaleString()}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-cyan-300">
                            {q.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-base font-bold text-white pb-3 border-b border-blue-500/20">
                    Active Projects
                  </h3>

                  <div className="space-y-3">
                    {projects.map((p) => (
                      <div
                        key={p.id}
                        className="p-5 rounded-2xl bg-[#0B1938] border border-blue-500/20 space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-white">{p.name}</h4>
                            <span className="text-slate-400">{p.client_name} ({p.client_phone})</span>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold font-mono">
                            {p.progress_percentage}% Done ({p.current_stage})
                          </span>
                        </div>

                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                          <div className="bg-cyan-400 h-full" style={{ width: `${p.progress_percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. REVIEWS APPROVAL QUEUE (Section 48) */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                    <h3 className="text-base font-bold text-white">Genuine Review Approvals</h3>
                    <span className="text-xs text-slate-400">{reviews.length} Total Submissions</span>
                  </div>

                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <strong className="text-white">{rev.name}</strong>
                            <span className="text-slate-400">({rev.service})</span>
                            <div className="flex text-amber-400 text-xs">
                              {'★'.repeat(rev.rating)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                rev.status === 'approved'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : rev.status === 'rejected'
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {rev.status}
                            </span>

                            {rev.status !== 'approved' && (
                              <button
                                type="button"
                                onClick={() => handleReviewAction(rev.id, 'approved')}
                                className="px-2 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold"
                              >
                                Approve
                              </button>
                            )}

                            {rev.status !== 'rejected' && (
                              <button
                                type="button"
                                onClick={() => handleReviewAction(rev.id, 'rejected')}
                                className="px-2 py-1 rounded bg-rose-600 text-white text-[11px] font-bold"
                              >
                                Reject
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleReviewAction(rev.id, 'delete')}
                              className="p-1 text-slate-500 hover:text-rose-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-slate-300 italic">&ldquo;{rev.review}&rdquo;</p>
                        <span className="text-[10px] text-slate-500">{rev.createdAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. VIDEO AD PROJECTS (Section 34) */}
              {activeTab === 'videos' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-base font-bold text-white pb-3 border-b border-blue-500/20">
                    AI Video Ad Customer Projects
                  </h3>

                  {videoAds.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No video ad requests yet. Customer requests generated via the AI Video Ad Creator will appear here.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {videoAds.map((v) => (
                        <div key={v.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <strong className="text-white text-sm">{v.product_name}</strong>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                              {v.status}
                            </span>
                          </div>
                          <p className="text-slate-300">{v.product_description}</p>
                          <div className="text-[11px] text-slate-400">
                            Language: {v.language} • Voice: {v.voice_persona} • Format: {v.aspect_ratio}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 6. ANALYTICS (Section 53) */}
              {activeTab === 'analytics' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-base font-bold text-white pb-3 border-b border-blue-500/20">
                    Platform Analytics &amp; Conversion Telemetry
                  </h3>

                  <div className="p-5 rounded-2xl bg-[#0B1938] border border-blue-500/20 space-y-3 text-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">Events by Frequency:</h4>
                    <div className="space-y-2">
                      {Object.entries(stats.byEvent).map(([evt, count]) => (
                        <div key={evt} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-slate-200">
                          <span className="font-mono">{evt}</span>
                          <span className="font-bold text-cyan-300">{count} occurrences</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
