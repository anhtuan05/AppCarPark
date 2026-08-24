import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Trash2,
  Pencil,
  UserRoundPen,
  LogIn,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
} from 'lucide-react';
import CarParkContext from '../../CarParkContext';
import { useParkingLotsQuery } from '../../features/parking/queries/useParkingQueries';
import {
  useReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from '../../features/reviews/queries/useReviewQueries';
import './style.css';

export const Reviews = () => {
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
      setFeedback({ type: 'error', message: 'Please select a parking lot and enter a comment.' });
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
        setFeedback({ type: 'success', message: 'Review updated successfully!' });
      } else {
        await createReviewMutation.mutateAsync(data);
        setFeedback({ type: 'success', message: 'Thank you for your review!' });
      }
      resetForm();
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Error submitting review: ' + (error.response?.data?.detail || error.message),
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
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReviewMutation.mutateAsync(id);
        setFeedback({ type: 'success', message: 'Review deleted.' });
      } catch (error) {
        setFeedback({ type: 'error', message: 'Failed to delete review.' });
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

  if (!user || user.is_staff === true || user.is_superuser === true) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Customer Login Required for Reviews
        </h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Please log in to share feedback and read community reviews for our parking facilities.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all"
        >
          <LogIn className="w-5 h-5" />
          <span>Login to Account</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Customer Reviews & Ratings
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Share your parking experience and help fellow drivers find the best facilities.
        </p>
      </div>

      {/* Review Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <UserRoundPen className="w-6 h-6 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {editMode ? 'Edit Your Review' : 'Write a Review'}
          </h2>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Parking Facility *
            </label>
            <select
              value={selectedParkingLot}
              onChange={(e) => setSelectedParkingLot(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">-- Choose Parking Facility --</option>
              {parkingLots.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Rating Score *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 rounded-lg hover:scale-110 transition-transform focus:outline-none"
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
              <span className="ml-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Your Review Comments *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Tell us about the space, cleanliness, camera check-in, or overall experience..."
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              <span>{editMode ? 'Update Review' : 'Submit Review'}</span>
            </button>

            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Community Feedback ({reviews.length})
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
                  (typeof review.parkinglot === 'object' ? review.parkinglot?.name : 'Parking Facility');

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
                            title="Edit Review"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(review.id)}
                            className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Delete Review"
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
            No reviews yet. Be the first to leave feedback!
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
