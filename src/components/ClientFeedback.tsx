import React, { useState, useEffect } from 'react';
import { ClientReview } from '../types';
import { getPublicApprovedReviews } from '../services/reviewService';
import { GOOGLE_REVIEW_URL } from '../data/siteData';
import { ReviewModal } from './ReviewModal';
import { AdminReviewsModal } from './AdminReviewsModal';
import { 
  Star, 
  MessageSquarePlus, 
  ExternalLink, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  QrCode
} from 'lucide-react';

export const ClientFeedback: React.FC = () => {
  const [approvedReviews, setApprovedReviews] = useState<ClientReview[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [showGoogleNotice, setShowGoogleNotice] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);

  const loadReviews = () => {
    const list = getPublicApprovedReviews();
    setApprovedReviews(list);
  };

  useEffect(() => {
    loadReviews();

    const handleSync = () => {
      loadReviews();
    };

    window.addEventListener('digitalx_review_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('digitalx_review_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleGoogleReviewClick = (e: React.MouseEvent) => {
    if (!GOOGLE_REVIEW_URL || GOOGLE_REVIEW_URL.trim() === '' || GOOGLE_REVIEW_URL === '#') {
      e.preventDefault();
      setShowGoogleNotice(true);
    } else {
      window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
    }
  };

  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '5.0';

  return (
    <section id="feedback" className="relative py-20 lg:py-28 bg-[#071126] overflow-hidden scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">
              CLIENT FEEDBACK
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5">
            Your Feedback Matters
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            Have you worked with Digital X? We'd love to hear about your experience. Share your honest feedback and help us improve our services.
          </p>

          {/* Action Buttons: Primary 'Leave a Review →' & Secondary 'Review us on Google' */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all duration-200 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave a Review →</span>
            </button>

            <button
              type="button"
              onClick={handleGoogleReviewClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-slate-200 bg-[#0B1938]/80 hover:bg-[#0F224A] border border-blue-500/20 hover:border-blue-400/40 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Review us on Google</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid OR Empty State */}
        {approvedReviews.length === 0 ? (
          /* Empty state when no real reviews are approved yet */
          <div className="max-w-xl mx-auto p-8 sm:p-10 rounded-2xl bg-[#0B1938]/70 border border-blue-500/20 text-center shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/25 flex items-center justify-center text-[#38BDF8] mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              No client reviews yet.
            </h3>

            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
              Be the first to share your experience with Digital X. Your feedback will appear on screen immediately.
            </p>

            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
            >
              <span>Leave a Review</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Review count & rating summary bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white">
                  Client Reviews on Screen ({approvedReviews.length})
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span>{averageRating} / 5.0</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#38BDF8] hover:text-white transition-colors cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>+ Submit Another Review</span>
              </button>
            </div>

            {/* Real Reviews Grid (Desktop: 3 col, Tablet: 2 col, Mobile: 1 col) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {approvedReviews.map((item) => {
                const isJustAdded = item.id === newlyAddedId;

                return (
                  <div
                    key={item.id}
                    id={`review-${item.id}`}
                    className={`relative flex flex-col justify-between rounded-2xl p-7 bg-[#0B1938]/85 border transition-all duration-300 hover:-translate-y-1 ${
                      isJustAdded
                        ? 'border-emerald-400 ring-2 ring-emerald-500/40 shadow-2xl shadow-emerald-500/20'
                        : 'border-blue-500/20 hover:border-blue-400/40 shadow-xl shadow-black/20 hover:shadow-blue-500/10'
                    }`}
                  >
                    {isJustAdded && (
                      <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[11px] tracking-wide uppercase shadow-lg shadow-emerald-500/30 animate-pulse">
                        ✦ Just Added
                      </div>
                    )}

                    <div>
                      {/* Rating Stars & Service Tag */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < item.rating ? 'fill-current' : 'text-slate-700'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20">
                          {item.service}
                        </span>
                      </div>

                      {/* Review Body */}
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal italic mb-6">
                        "{item.review}"
                      </p>
                    </div>

                    {/* Author profile & Date */}
                    <div className="flex items-center gap-3.5 pt-5 border-t border-slate-700/50">
                      {item.photoUrl ? (
                        <img
                          src={item.photoUrl}
                          alt={item.name}
                          className="w-11 h-11 rounded-full object-cover border border-blue-400/30 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1769FF] to-[#38BDF8] flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-md shadow-blue-500/20 shrink-0">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-white truncate leading-tight">
                          {item.name}
                        </h4>
                        {item.company && (
                          <div className="text-xs text-blue-300 font-medium truncate mt-0.5">
                            {item.company}
                          </div>
                        )}
                        <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <span title="Verified Client Feedback">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Admin Access trigger link (Discreet & secured) */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            <span>All reviews are submitted by genuine clients and displayed transparently on screen.</span>
          </div>

          <button
            type="button"
            onClick={() => setIsAdminModalOpen(true)}
            className="text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Administrator moderation login"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Review Moderation</span>
          </button>
        </div>

      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={(newId) => {
          loadReviews();
          if (newId) {
            setNewlyAddedId(newId);
            setTimeout(() => {
              const target = document.getElementById(`review-${newId}`);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 300);
          }
        }}
      />

      {/* Admin Moderation Console */}
      <AdminReviewsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onReviewsUpdated={loadReviews}
      />

      {/* Google Review Config Notice Modal if URL not yet configured */}
      {showGoogleNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
        >
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0B1938] border border-blue-500/30 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-[#38BDF8] flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Google Business Profile Review</h4>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              Digital X is currently linking its direct Google Business Profile URL (<code className="text-[#38BDF8]">GOOGLE_REVIEW_URL</code>). In the meantime, you can submit your review directly using our verified on-site review form!
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowGoogleNotice(false);
                  setIsReviewModalOpen(true);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
              >
                Submit On-Site Review
              </button>
              <button
                type="button"
                onClick={() => setShowGoogleNotice(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
