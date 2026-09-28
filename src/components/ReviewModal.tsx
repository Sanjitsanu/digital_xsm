import React, { useState } from 'react';
import { submitNewReview } from '../services/reviewService';
import { SERVICE_OPTIONS } from '../data/siteData';
import { X, Star, Upload, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (newReviewId?: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onReviewSubmitted }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceUsed, setServiceUsed] = useState('Choose a service');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [company, setCompany] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [confirmedGenuine, setConfirmedGenuine] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedReviewId, setSubmittedReviewId] = useState<string>('');

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, photo: 'Photo size must be less than 2MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setErrors((prev) => {
          const rest = { ...prev };
          delete rest.photo;
          return rest;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your name.';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email format.';
    }

    if (!serviceUsed || serviceUsed === 'Choose a service') {
      newErrors.serviceUsed = 'Please select a service.';
    }

    if (!rating || rating === 0) {
      newErrors.rating = 'Please select a rating.';
    }

    if (!reviewText.trim()) {
      newErrors.reviewText = 'Please write your feedback.';
    } else if (reviewText.trim().length < 10) {
      newErrors.reviewText = 'Feedback must be at least 10 characters.';
    }

    if (!confirmedGenuine) {
      newErrors.confirmed = 'Please confirm that this is your genuine experience.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const created = submitNewReview({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        service: serviceUsed,
        rating,
        review: reviewText.trim(),
        photoUrl: photoUrl || undefined,
      });

      setSubmittedReviewId(created.id);
      setIsSubmitting(false);
      setIsSuccess(true);
      onReviewSubmitted(created.id);
    } catch (err) {
      setIsSubmitting(false);
      setErrors({ form: 'An error occurred while submitting. Please try again.' });
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setServiceUsed('Choose a service');
    setRating(0);
    setReviewText('');
    setCompany('');
    setPhotoUrl('');
    setConfirmedGenuine(false);
    setErrors({});
    onClose();
  };

  const handleViewOnScreen = () => {
    handleClose();
    setTimeout(() => {
      const feedbackSection = document.getElementById('feedback');
      if (feedbackSection) {
        feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={handleClose} 
        aria-hidden="true" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0B1938] border border-blue-500/25 shadow-2xl shadow-black/80 overflow-hidden z-10 my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="p-8 sm:p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-5 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Feedback Published Successfully!
            </h3>

            <p className="text-sm sm:text-base text-slate-300 max-w-md leading-relaxed mb-6">
              Thank you, <span className="font-semibold text-white">{fullName}</span>! Your review has been added directly to the website and is now live on screen in the Client Feedback section.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-8">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Status: PUBLISHED &amp; LIVE ON SCREEN</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={handleViewOnScreen}
                className="flex-1 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                View on Screen →
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="border-b border-slate-700/60 pb-4 mb-6">
              <span className="text-xs font-bold tracking-widest text-[#38BDF8] uppercase mb-1 block">
                CLIENT FEEDBACK
              </span>
              <h3 id="review-modal-title" className="text-2xl font-extrabold text-white">
                Share Your Experience
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Your honest feedback helps us improve and helps future clients understand our services.
              </p>
            </div>

            {errors.form && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rev-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="rev-name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="e.g. Shamas"
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm border focus:outline-none transition-colors ${
                      errors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700 focus:border-[#38BDF8]'
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-rose-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="rev-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="rev-email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="shamas@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm border focus:outline-none transition-colors ${
                      errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700 focus:border-[#38BDF8]'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Phone & Service Used */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rev-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone <span className="text-slate-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="rev-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm border border-slate-700 focus:border-[#38BDF8] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="rev-service" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Service Used <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="rev-service"
                    value={serviceUsed}
                    onChange={(e) => {
                      setServiceUsed(e.target.value);
                      if (errors.serviceUsed) setErrors((prev) => ({ ...prev, serviceUsed: '' }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/90 text-white text-sm border focus:outline-none transition-colors ${
                      errors.serviceUsed ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700 focus:border-[#38BDF8]'
                    }`}
                  >
                    {SERVICE_OPTIONS.map((opt, idx) => (
                      <option key={idx} value={opt} disabled={idx === 0}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.serviceUsed && <p className="text-xs text-rose-400 mt-1">{errors.serviceUsed}</p>}
                </div>
              </div>

              {/* Company / Business Name (Optional) */}
              <div>
                <label htmlFor="rev-company" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company / Business Name <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="rev-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Shamas Enterprises or Startup Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm border border-slate-700 focus:border-[#38BDF8] focus:outline-none transition-colors"
                />
              </div>

              {/* Rating 1-5 Star Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Rating <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setRating(star);
                          if (errors.rating) setErrors((prev) => ({ ...prev, rating: '' }));
                        }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <span className={isFilled ? 'text-amber-400' : 'text-slate-600'}>
                          {isFilled ? '★' : '☆'}
                        </span>
                      </button>
                    );
                  })}
                  {rating > 0 && (
                    <span className="text-xs font-medium text-amber-300 ml-2">
                      {rating} of 5 Stars
                    </span>
                  )}
                </div>
                {errors.rating && <p className="text-xs text-rose-400 mt-1">{errors.rating}</p>}
              </div>

              {/* Review Text */}
              <div>
                <label htmlFor="rev-text" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Review <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="rev-text"
                  rows={4}
                  value={reviewText}
                  onChange={(e) => {
                    setReviewText(e.target.value);
                    if (errors.reviewText) setErrors((prev) => ({ ...prev, reviewText: '' }));
                  }}
                  placeholder="Tell us about your experience with Digital X..."
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-sm border focus:outline-none transition-colors resize-none ${
                    errors.reviewText ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700 focus:border-[#38BDF8]'
                  }`}
                />
                {errors.reviewText && <p className="text-xs text-rose-400 mt-1">{errors.reviewText}</p>}
              </div>

              {/* Upload Profile Photo (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Profile Photo <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  {photoUrl ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-blue-400/40 shrink-0">
                      <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-[10px] opacity-0 hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    id="rev-photo"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600/30 file:text-blue-300 hover:file:bg-blue-600/40 cursor-pointer"
                  />
                </div>
                {errors.photo && <p className="text-xs text-rose-400 mt-1">{errors.photo}</p>}
              </div>

              {/* Genuine Experience Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmedGenuine}
                    onChange={(e) => {
                      setConfirmedGenuine(e.target.checked);
                      if (errors.confirmed) setErrors((prev) => ({ ...prev, confirmed: '' }));
                    }}
                    className="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-300 leading-snug">
                    I confirm that this is my genuine experience with Digital X.
                  </span>
                </label>
                {errors.confirmed && <p className="text-xs text-rose-400 mt-1">{errors.confirmed}</p>}
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
