import React, { useState } from 'react';
import { ClientReview, ReviewStatus } from '../types';
import { 
  getStoredReviews, 
  updateReviewStatus, 
  deleteStoredReview 
} from '../services/reviewService';
import { 
  X, 
  Check, 
  Trash2, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Lock, 
  LogOut, 
  KeyRound, 
  AlertTriangle 
} from 'lucide-react';

interface AdminReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewsUpdated: () => void;
}

export const AdminReviewsModal: React.FC<AdminReviewsModalProps> = ({ 
  isOpen, 
  onClose, 
  onReviewsUpdated 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminKey, setAdminKey] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('approved');
  const [reviews, setReviews] = useState<ClientReview[]>([]);

  if (!isOpen) return null;

  const refreshList = () => {
    setReviews(getStoredReviews());
    onReviewsUpdated();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple administrative password challenge
    // In production, tied to server-side session/token. Default pass: 'digitalx2026' or 'admin'
    if (adminKey === 'digitalx2026' || adminKey === 'admin123' || adminKey === 'DigitalX@Admin') {
      setIsAuthenticated(true);
      setAuthError('');
      setReviews(getStoredReviews());
    } else {
      setAuthError('Invalid administrative passphrase.');
    }
  };

  const handleStatusChange = (id: string, newStatus: ReviewStatus) => {
    updateReviewStatus(id, newStatus);
    refreshList();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this review?')) {
      deleteStoredReview(id);
      refreshList();
    }
  };

  const filteredReviews = reviews.filter((r) => r.status === activeTab);

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-title"
    >
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-4xl rounded-2xl bg-[#09142A] border border-blue-500/30 shadow-2xl shadow-black/90 overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-[#060D1E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-[#38BDF8]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 id="admin-title" className="text-lg sm:text-xl font-bold text-white">
                Review Moderation Console
              </h3>
              <p className="text-xs text-slate-400">
                Digital X Multi Services Pvt. Ltd. &middot; Private Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto">
          {!isAuthenticated ? (
            /* Admin Auth Screen */
            <div className="max-w-md mx-auto py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-[#38BDF8] mx-auto mb-4">
                <KeyRound className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Administrator Access Required</h4>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Enter your administrative key to manage pending client submissions and approve public feedback.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter admin password (e.g. digitalx2026)"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white placeholder-slate-500 text-sm border border-slate-700 focus:border-[#38BDF8] focus:outline-none"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-xs text-rose-400 mt-2 flex items-center justify-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{authError}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Authenticate &amp; Enter
                </button>
              </form>
            </div>
          ) : (
            /* Authenticated Review Management Console */
            <div>
              {/* Tab Navigation */}
              <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Pending</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/30 text-amber-200">
                    {pendingCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('approved')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approved (Public)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/30 text-emerald-200">
                    {approvedCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('rejected')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'rejected'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>Rejected</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/30 text-rose-200">
                    {rejectedCount}
                  </span>
                </button>
              </div>

              {/* Reviews List */}
              {filteredReviews.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <p className="text-base font-medium">No reviews in "{activeTab}" category.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    New genuine client feedback submitted via the public form will appear under "Pending".
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-[#071126] border border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          {rev.photoUrl ? (
                            <img
                              src={rev.photoUrl}
                              alt={rev.name}
                              className="w-10 h-10 rounded-full object-cover border border-blue-400/30"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600/30 text-blue-200 font-bold flex items-center justify-center text-sm border border-blue-400/20">
                              {rev.name.charAt(0)}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-white text-base leading-tight">
                                {rev.name}
                              </h5>
                              {rev.company && (
                                <span className="text-xs text-slate-400">
                                  ({rev.company})
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {rev.email} {rev.phone ? `&middot; ${rev.phone}` : ''}
                            </div>
                          </div>

                          <div className="ml-auto flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-slate-700'}`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-300 text-xs font-medium border border-blue-400/20">
                          {rev.service}
                        </div>

                        <p className="text-sm text-slate-200 leading-relaxed pt-1">
                          "{rev.review}"
                        </p>

                        <div className="text-[11px] text-slate-500 font-mono">
                          Submitted: {new Date(rev.createdAt).toLocaleDateString()} {new Date(rev.createdAt).toLocaleTimeString()}
                        </div>
                      </div>

                      {/* Admin Actions */}
                      <div className="flex items-center md:flex-col gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                        {rev.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(rev.id, 'approved')}
                            className="flex-1 md:w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {rev.status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(rev.id, 'rejected')}
                            className="flex-1 md:w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 hover:bg-amber-900/60 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(rev.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-600/30 border border-slate-700 transition-colors cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
