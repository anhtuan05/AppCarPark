import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Star,
  Trash2,
  Pencil,
  UserRoundPen,
  CheckCircle2,
  Loader2,
  Building,
} from 'lucide-react';
import Alert from '../../shared/ui/Alert';
import CarParkContext from '../../CarParkContext';
import { useParkingLotsQuery } from '../../features/parking/queries/useParkingQueries';
import {
  useReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from '../../features/reviews/queries/useReviewQueries';
import communityBg from '../../Img/community-bg.webp';

export const Reviews = () => {
  const { t } = useTranslation();
  const [user] = useContext(CarParkContext);
  const { data: parkingLots = [] } = useParkingLotsQuery();
  const { data: reviews = [], isLoading } = useReviewsQuery();

  const createReviewMutation = useCreateReviewMutation();
  const updateReviewMutation = useUpdateReviewMutation();
  const deleteReviewMutation = useDeleteReviewMutation();

  const [selectedParkingLot, setSelectedParkingLot] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedParkingLot || !comment) {
      setFeedback({ type: 'error', key: 'reviews.validation' });
      return;
    }

    const data = {
      parkinglot: selectedParkingLot,
      rate: rating,
      comment: comment,
    };

    try {
      if (editMode && reviewId) {
        await updateReviewMutation.mutateAsync({ id: reviewId, data });
        setFeedback({ type: 'success', key: 'reviews.updated' });
      } else {
        await createReviewMutation.mutateAsync(data);
        setFeedback({ type: 'success', key: 'reviews.created' });
      }
      resetForm();
    } catch (error) {
      setFeedback({
        type: 'error',
        key: 'reviews.submitError',
        values: { detail: error.response?.data?.detail || error.message },
      });
    }
  };

  const handleEdit = (review) => {
    setSelectedParkingLot(typeof review.parkinglot === 'object' ? review.parkinglot.id : review.parkinglot);
    setRating(review.rate || 5);
    setComment(review.comment || '');
    setReviewId(review.id);
    setEditMode(true);
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('reviews.deleteConfirm'))) {
      try {
        await deleteReviewMutation.mutateAsync(id);
        setFeedback({ type: 'success', key: 'reviews.deleted' });
      } catch {
        setFeedback({ type: 'error', key: 'reviews.deleteError' });
      }
    }
  };

  const resetForm = () => {
    setSelectedParkingLot('');
    setRating(5);
    setComment('');
    setReviewId(null);
    setEditMode(false);
  };

  const isSubmitting = createReviewMutation.isPending || updateReviewMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Community Experience Hub Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-950 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={communityBg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center opacity-30 mix-blend-screen scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/98 via-emerald-950/85 to-teal-950/70" />
          <div className="absolute -bottom-10 right-1/4 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-300 text-xs font-bold mb-2 backdrop-blur-md">
              <Star className="w-3.5 h-3.5 fill-emerald-300" />
              <span>Verified Customer Voice</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('reviews.title')}
            </h1>
            <p className="text-sm text-emerald-100/75 mt-1 max-w-xl">
              {t('reviews.description')}
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-emerald-200">
            <Building className="w-4 h-4 text-emerald-300" />
            <span>{parkingLots.length} Điểm đỗ</span>
          </div>
        </div>
      </div>

      {/* Review Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <UserRoundPen className="w-6 h-6 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {editMode ? t('reviews.editTitle') : t('reviews.writeTitle')}
          </h2>
        </div>

        {feedback ? <Alert type={feedback.type}>{t(feedback.key, feedback.values)}</Alert> : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="review-parking-lot" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t('reviews.facility')} *
            </label>
            <select
              id="review-parking-lot"
              name="parking_lot"
              value={selectedParkingLot}
              onChange={(e) => setSelectedParkingLot(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">{t('reviews.chooseFacility')}</option>
              {parkingLots.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span id="rating-label" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t('reviews.rating')} *
            </span>
            <div className="flex flex-wrap items-center gap-1" role="group" aria-labelledby="rating-label">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="grid h-11 w-11 place-items-center rounded-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  aria-label={t('reviews.starLabel', { count: star })}
                  aria-pressed={star === rating}
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                {t('reviews.stars', { count: rating })}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="review-comment" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t('reviews.comment')} *
            </label>
            <textarea
              id="review-comment"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder={t('reviews.commentPlaceholder')}
              autoComplete="off"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 min-[420px]:flex-row min-[420px]:items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 font-bold text-white shadow-md transition-[background-color,transform] hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              <span>{editMode ? t('reviews.update') : t('reviews.submit')}</span>
            </button>

            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
              >
                {t('common.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t('reviews.community', { count: reviews.length })}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {reviews
              .slice()
              .sort((a, b) => b.id - a.id)
              .map((review) => {
                const isAuthor = user && user.id === review.user;
                const lotName =
                  review.parkinglot_name ||
                  (typeof review.parkinglot === 'object' ? review.parkinglot?.name : t('reviews.defaultFacility'));

                return (
                  <div
                    key={review.id}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-emerald-600" />
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">
                            {lotName}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rate
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {isAuthor && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(review)}
                            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            aria-label={t('reviews.editLabel')}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(review.id)}
                            className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            aria-label={t('reviews.deleteLabel')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            {t('reviews.empty')}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
