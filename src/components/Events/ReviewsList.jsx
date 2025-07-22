import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getEventReviews, submitEventReview, toggleLikeEvent, deleteReview } from '../../services/api';
import { toast } from 'sonner';

function ReviewsList({ eventId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const fetchReviews = async () => {
    try {
      const response = await getEventReviews(eventId);
      setReviews(response.data.reviews);
    } catch (error) {
      toast.error("Error fetching reviews: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    setSubmitting(true);
    try {
      await submitEventReview(eventId, { content: newReview });
      toast.success("Review submitted successfully!");
      setNewReview('');
      fetchReviews();
    } catch (error) {
      toast.error("Error submitting review: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeToggle = async () => {
    try {
      await toggleLikeEvent(eventId);
      fetchReviews(); // Refresh to get updated like count
    } catch (error) {
      toast.error("Error toggling like: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview(reviewId);
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      toast.error("Error deleting review: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Reviews</h3>

      {/* Like Button */}
      <button
        onClick={handleLikeToggle}
        className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        <span>{reviews.filter(r => r.isLike).length} Likes</span>
      </button>

      {/* Review Form */}
      {user?.role === 'student' && (
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full px-3 py-2 border rounded-lg"
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-600">No reviews yet.</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{review.student.fullName}</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2">{review.content}</p>
                </div>
                {user?.id === review.student._id && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsList;
