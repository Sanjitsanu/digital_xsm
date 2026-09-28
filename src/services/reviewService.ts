import { ClientReview, ReviewStatus } from '../types';

const STORAGE_KEY = 'digitalx_client_reviews_v1';

/**
 * Clean review storage manager
 * Enforces:
 * - Real client submission
 * - Instant live display on website screen
 * - No fake or pre-written reviews
 * - Automatic update synchronization across components
 */
let memoryReviews: ClientReview[] | null = null;

export const getStoredReviews = (): ClientReview[] => {
  try {
    if (typeof window === 'undefined') return memoryReviews || [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryReviews || [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      let hasChanges = false;
      const verified = parsed.map((rev) => {
        if (rev.status === 'pending') {
          hasChanges = true;
          return { ...rev, status: 'approved' as ReviewStatus, approvedAt: rev.approvedAt || new Date().toISOString() };
        }
        return rev;
      });
      if (hasChanges) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(verified.slice(0, 30)));
        } catch {}
      }
      memoryReviews = verified;
      return verified;
    }
    return memoryReviews || [];
  } catch {
    return memoryReviews || [];
  }
};

export const saveStoredReviews = (reviews: ClientReview[]): void => {
  const capped = reviews.slice(0, 30);
  memoryReviews = capped;
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
      window.dispatchEvent(new CustomEvent('digitalx_review_updated', { detail: capped }));
    }
  } catch {}
};

export const getPublicApprovedReviews = (): ClientReview[] => {
  // Public UI renders all active approved reviews
  return getStoredReviews().filter((r) => r.status === 'approved');
};

export const submitNewReview = (reviewData: Omit<ClientReview, 'id' | 'status' | 'createdAt'>): ClientReview => {
  const newReview: ClientReview = {
    ...reviewData,
    id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    status: 'approved', // Immediately publish and display on website screen
    createdAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
  };

  const existing = getStoredReviews();
  const updated = [newReview, ...existing];
  saveStoredReviews(updated);
  return newReview;
};

export const updateReviewStatus = (reviewId: string, newStatus: ReviewStatus): boolean => {
  const existing = getStoredReviews();
  const index = existing.findIndex((r) => r.id === reviewId);
  if (index === -1) return false;

  existing[index].status = newStatus;
  if (newStatus === 'approved') {
    existing[index].approvedAt = new Date().toISOString();
  }
  saveStoredReviews(existing);
  return true;
};

export const deleteStoredReview = (reviewId: string): boolean => {
  const existing = getStoredReviews();
  const updated = existing.filter((r) => r.id !== reviewId);
  saveStoredReviews(updated);
  return true;
};

