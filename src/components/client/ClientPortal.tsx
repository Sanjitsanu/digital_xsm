import React, { useState } from 'react';
import {
  FolderKanban,
  CheckSquare,
  FileText,
  MessageSquare,
  CreditCard,
  LifeBuoy,
  User,
  LayoutDashboard,
  LogOut,
  X,
  Upload,
  Download,
  Send,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { COMPANY_INFO } from '../../data/siteData';
import { platformStore } from '../../services/platformStore';
import { Project, SupportTicket, Quotation } from '../../types';
import { trackEvent } from '../../services/analyticsService';
import { Logo } from '../Logo';

interface ClientPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal?: (services?: string[]) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  isOpen,
  onClose,
  onOpenQuoteModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'tasks' | 'files' | 'messages' | 'payments' | 'quotations' | 'support' | 'profile'
  >('overview');

  // Client project state
  const projects = platformStore.getProjects();
  const activeProject = projects[0]; // Active project
  const quotations = platformStore.getQuotations();
  const tickets = platformStore.getSupportTickets();

  // Message input
  const [msgText, setMsgText] = useState('');

  // Support ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'Website' | 'Payment' | 'Design' | 'Technical' | 'Marketing' | 'Other'>('Website');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [ticketDesc, setTicketDesc] = useState('');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  // File upload simulation
  const [uploadFileName, setUploadFileName] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || !activeProject) return;

    platformStore.addProjectMessage(
      activeProject.id,
      'client',
      activeProject.client_name,
      msgText.trim()
    );
    setMsgText('');
    trackEvent('client_send_message', 'engagement', activeProject.id);
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim() || !activeProject) return;

    platformStore.addProjectFile(activeProject.id, {
      file_name: uploadFileName.trim(),
      file_type: uploadFileName.includes('.') ? uploadFileName.split('.').pop()?.toUpperCase() || 'FILE' : 'DOC',
      file_size: '2.4 MB',
      uploaded_by: 'client',
    });

    setUploadFileName('');
    alert('File uploaded successfully to your project deliverables space.');
    trackEvent('client_upload_file', 'engagement', activeProject.id);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;

    platformStore.createSupportTicket({
      client_name: activeProject?.client_name || 'Client',
      client_email: activeProject?.client_email || 'client@example.com',
      subject: ticketSubject.trim(),
      category: ticketCategory,
      priority: ticketPriority,
      description: ticketDesc.trim(),
    });

    setTicketSubject('');
    setTicketDesc('');
    setShowNewTicketForm(false);
    alert('Support ticket created. Digital X technical team notified.');
    trackEvent('client_create_ticket', 'engagement', ticketCategory);
  };

  const handleAcceptQuote = (quoteId: string) => {
    platformStore.updateQuotationStatus(quoteId, 'Accepted');
    alert('Quotation accepted! Digital X team will initiate the next milestone.');
    trackEvent('client_accept_quote', 'sales', quoteId);
  };

  return (
    <div
      role="dialog"
      aria-label="My Digital X Client Dashboard"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 animate-fade-in"
    >
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#071126] border border-blue-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0B1938] border-b border-blue-500/20 select-none">
          <div className="flex items-center gap-3">
            <Logo size="sm" showSubtitle={false} />
            <div className="h-6 w-[1px] bg-slate-700 mx-1 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Client Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as: <strong className="text-slate-200">{activeProject?.client_name || 'Client'}</strong> ({activeProject?.name || 'Project'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold"
            >
              <span>WhatsApp Manager</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Shell: Left Sidebar (Navigation) + Right Main Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* SIDEBAR NAVIGATION (9 Sections required by Section 14) */}
          <aside className="w-full md:w-64 bg-[#08142E] border-r border-blue-500/20 p-3 sm:p-4 flex md:flex-col justify-between overflow-x-auto md:overflow-y-auto scrollbar-none">
            <nav className="flex md:flex-col gap-1 w-full">
              {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'projects', label: 'My Projects', icon: FolderKanban },
                { id: 'tasks', label: 'Tasks', icon: CheckSquare },
                { id: 'files', label: 'Files', icon: FileText },
                { id: 'messages', label: 'Messages', icon: MessageSquare },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'quotations', label: 'Quotations', icon: FileText },
                { id: 'support', label: 'Support', icon: LifeBuoy },
                { id: 'profile', label: 'Profile', icon: User },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 md:shrink text-left ${
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

            <div className="hidden md:block pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={onClose}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit Portal</span>
              </button>
            </div>
          </aside>

          {/* MAIN WORKSPACE CONTENT */}
          <main className="flex-1 p-5 sm:p-8 overflow-y-auto bg-gradient-to-b from-[#071126] to-[#0A1838]">
            {/* 1. OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Active Project Banner with Progress Bar */}
                <div className="p-6 rounded-2xl bg-[#0B1938] border border-blue-500/30 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        Active Client Project
                      </span>
                      <h3 className="text-xl font-bold text-white">{activeProject.name}</h3>
                      <p className="text-xs text-slate-400">
                        Assigned: {activeProject.assigned_manager} • Start: {activeProject.start_date} • Expected Completion: {activeProject.expected_completion}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-cyan-300 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
                        {activeProject.current_stage} Stage
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar (0% - 100%) */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1.5">
                      <span>Overall Milestone Completion</span>
                      <span className="font-mono text-cyan-300 font-bold">{activeProject.progress_percentage}% Complete</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-3.5 overflow-hidden border border-slate-700">
                      <div
                        className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full transition-all duration-500"
                        style={{ width: `${activeProject.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400">Tasks Completed</span>
                    <div className="text-xl font-bold text-white mt-1">
                      {activeProject.tasks.filter((t) => t.status === 'Completed').length} / {activeProject.tasks.length}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400">Project Budget</span>
                    <div className="text-xl font-bold text-white mt-1 font-mono">
                      ₹{activeProject.total_amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400">Payment Status</span>
                    <div className="text-xl font-bold text-emerald-400 mt-1">
                      {activeProject.payment_status} (₹{activeProject.amount_paid.toLocaleString()})
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-xs text-slate-400">Deliverable Files</span>
                    <div className="text-xl font-bold text-cyan-300 mt-1">
                      {activeProject.files.length} Shared
                    </div>
                  </div>
                </div>

                {/* Quick Next Milestones */}
                <div className="p-5 rounded-2xl bg-[#0B1938] border border-blue-500/20 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Next Milestones In Progress</span>
                  </h4>
                  <div className="space-y-2">
                    {activeProject.tasks
                      .filter((t) => t.status !== 'Completed')
                      .slice(0, 3)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-200"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                            <span>{task.title}</span>
                          </div>
                          <span className="text-slate-400 font-mono">Target: {task.due_date || 'Upcoming'}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. MY PROJECTS (Section 15) */}
            {activeTab === 'projects' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                  <h3 className="text-base font-bold text-white">Project Details &amp; Lifecycle Stages</h3>
                  <span className="text-xs text-slate-400 font-mono">ID: {activeProject.id}</span>
                </div>

                <div className="p-6 rounded-2xl bg-[#0B1938] border border-blue-500/30 space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-white">{activeProject.name}</h4>
                      <p className="text-xs text-slate-400">Client: {activeProject.client_name} ({activeProject.client_email})</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-cyan-300 font-mono bg-blue-900/40 px-3 py-1 rounded-lg border border-blue-400/30">
                        {activeProject.progress_percentage}% Complete
                      </span>
                    </div>
                  </div>

                  {/* 8 Stages Visual Bar (Section 15) */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Stage Flow:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-[10px] font-semibold">
                      {['Not Started', 'Planning', 'Design', 'Development', 'Testing', 'Review', 'Launch', 'Completed'].map(
                        (stage, idx) => {
                          const stages = ['Not Started', 'Planning', 'Design', 'Development', 'Testing', 'Review', 'Launch', 'Completed'];
                          const currentIdx = stages.indexOf(activeProject.current_stage);
                          const isDone = idx < currentIdx;
                          const isCurrent = idx === currentIdx;

                          return (
                            <div
                              key={stage}
                              className={`p-2 rounded-lg border ${
                                isDone
                                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                                  : isCurrent
                                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 font-bold shadow-md'
                                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
                              }`}
                            >
                              <span className="block mb-0.5">{isDone ? '✓' : isCurrent ? '◉' : '○'}</span>
                              <span>{stage}</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Included Services */}
                  <div className="border-t border-slate-800 pt-4">
                    <span className="text-xs font-bold text-slate-300 block mb-2">Scope of Services:</span>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.services.map((srv, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-blue-900/40 text-blue-200 text-xs border border-blue-400/20 font-medium">
                          ✓ {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TASKS (Section 16) */}
            {activeTab === 'tasks' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                  <div>
                    <h3 className="text-base font-bold text-white">Project Tasks &amp; Milestones</h3>
                    <p className="text-xs text-slate-400">Real-time status updates from Digital X production team</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {activeProject.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                            task.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : task.status === 'In Progress'
                              ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {task.status === 'Completed' ? '✓' : task.status === 'In Progress' ? '◉' : '○'}
                        </span>
                        <div>
                          <h4 className="font-semibold text-slate-200 text-sm">{task.title}</h4>
                          <span className="text-slate-400 text-[11px]">Due: {task.due_date || 'Milestone delivery'}</span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          task.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : task.status === 'In Progress'
                            ? 'bg-blue-500/20 text-cyan-300 border border-cyan-400/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. FILES (Section 17) */}
            {activeTab === 'files' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                  <h3 className="text-base font-bold text-white">Project Files &amp; Deliverables</h3>
                </div>

                {/* Upload Form */}
                <form onSubmit={handleFileUpload} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    required
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    placeholder="Enter file description or filename (e.g. Brand_Logo_White.png)..."
                    className="flex-1 bg-slate-950 text-white placeholder-slate-400 text-xs p-2.5 rounded-lg border border-slate-700"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload to Project</span>
                  </button>
                </form>

                {/* Files List */}
                <div className="space-y-2">
                  {activeProject.files.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-cyan-300 flex items-center justify-center font-bold font-mono text-[10px]">
                          {file.file_type}
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">{file.file_name}</div>
                          <span className="text-slate-400 text-[11px]">
                            {file.file_size} • Uploaded by {file.uploaded_by} on {file.upload_date}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert(`Downloading ${file.file_name}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. MESSAGES (Section 18) */}
            {activeTab === 'messages' && (
              <div className="h-full flex flex-col space-y-4 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                  <h3 className="text-base font-bold text-white">Project Messaging</h3>
                  <span className="text-xs text-slate-400 font-mono">Direct line to project lead</span>
                </div>

                {/* Messages feed */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  {activeProject.messages.map((m) => {
                    const isClient = m.sender_role === 'client';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isClient
                              ? 'bg-blue-600 text-white rounded-tr-none'
                              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                          }`}
                        >
                          <div className="font-bold text-[11px] mb-1 opacity-80">{m.sender_name}</div>
                          <div>{m.message}</div>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Message input bar */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    placeholder="Type your message to the Digital X project team..."
                    className="flex-1 bg-slate-900 text-white placeholder-slate-400 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={!msgText.trim()}
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            )}

            {/* 6. PAYMENTS (Section 19: Actual records only) */}
            {activeTab === 'payments' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                  <h3 className="text-base font-bold text-white">Payment Tracking</h3>
                  <span className="text-xs text-slate-400 font-mono">Invoice Records</span>
                </div>

                {/* Payment Overview Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400">Total Project Amount</span>
                    <div className="text-2xl font-bold font-mono text-white mt-1">
                      ₹{activeProject.total_amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400">Amount Paid (50% Milestone)</span>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                      ₹{activeProject.amount_paid.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400">Amount Remaining</span>
                    <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
                      ₹{activeProject.amount_remaining.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Payment History Table */}
                <div className="p-5 rounded-2xl bg-[#0B1938] border border-blue-500/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                    Payment Transactions:
                  </h4>
                  <div className="space-y-2">
                    {activeProject.payments.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-200"
                      >
                        <div>
                          <strong className="text-white font-mono">{p.invoice_number}</strong>
                          <span className="text-slate-400 ml-2">via {p.method} • {p.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-emerald-400">₹{p.amount.toLocaleString()}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. QUOTATIONS (Section 45) */}
            {activeTab === 'quotations' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                  <h3 className="text-base font-bold text-white">Project Quotations</h3>
                </div>

                <div className="space-y-3">
                  {quotations.map((q) => (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-[#0B1938] border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-white text-sm">{q.quotation_number}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              q.status === 'Accepted'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-blue-500/20 text-cyan-300'
                            }`}
                          >
                            {q.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          {q.items.map((i) => i.service).join(', ')}
                        </p>
                        <span className="text-[11px] text-slate-500">Valid until {q.valid_until}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Grand Total</span>
                          <span className="text-base font-bold font-mono text-cyan-300">
                            ₹{q.grand_total.toLocaleString()}
                          </span>
                        </div>

                        {q.status !== 'Accepted' && (
                          <button
                            type="button"
                            onClick={() => handleAcceptQuote(q.id)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer"
                          >
                            Accept Quotation
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. SUPPORT TICKETS (Section 39) */}
            {activeTab === 'support' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                  <div>
                    <h3 className="text-base font-bold text-white">Client Support Desk</h3>
                    <p className="text-xs text-slate-400">Raise requests directly with engineering and design</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowNewTicketForm(!showNewTicketForm)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showNewTicketForm ? 'Cancel' : 'Create Support Request'}</span>
                  </button>
                </div>

                {/* Ticket Creation Form */}
                {showNewTicketForm && (
                  <form onSubmit={handleCreateTicket} className="p-5 rounded-2xl bg-[#0B1938] border border-blue-500/30 space-y-4 animate-fade-in">
                    <h4 className="text-sm font-bold text-white">New Support Request</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Subject *</label>
                        <input
                          type="text"
                          required
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          placeholder="Brief description of the request or issue..."
                          className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs p-2.5 rounded-xl border border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                        <select
                          value={ticketCategory}
                          onChange={(e) => setTicketCategory(e.target.value as any)}
                          className="w-full bg-slate-900 text-white text-xs p-2.5 rounded-xl border border-slate-700"
                        >
                          <option value="Website">Website</option>
                          <option value="Payment">Payment</option>
                          <option value="Design">Design</option>
                          <option value="Technical">Technical</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={ticketDesc}
                        onChange={(e) => setTicketDesc(e.target.value)}
                        placeholder="Provide details or steps to reproduce..."
                        className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs p-2.5 rounded-xl border border-slate-700"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer"
                    >
                      Submit Ticket
                    </button>
                  </form>
                )}

                {/* Tickets Feed */}
                <div className="space-y-3">
                  {tickets.map((tick) => (
                    <div
                      key={tick.id}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{tick.subject}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-cyan-300">
                            {tick.category}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tick.status === 'Resolved'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {tick.status}
                        </span>
                      </div>
                      <p className="text-slate-300">{tick.description}</p>
                      <span className="text-[10px] text-slate-500">Created: {tick.created_at}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in max-w-xl">
                <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                  <h3 className="text-base font-bold text-white">Client Company Profile</h3>
                </div>

                <div className="p-6 rounded-2xl bg-[#0B1938] border border-blue-500/20 space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Company / Business:</span>
                    <strong className="text-white text-sm">{activeProject?.client_name} Ventures</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Primary Email:</span>
                    <strong className="text-white text-sm">{activeProject?.client_email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Primary Phone:</span>
                    <strong className="text-white text-sm">{activeProject?.client_phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Assigned Account Manager:</span>
                    <strong className="text-cyan-300 text-sm">Digital X Enterprise Team (+91 7970884193)</strong>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
