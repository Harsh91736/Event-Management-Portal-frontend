import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyReviews, deleteReview } from '../services/api';
import { toast } from 'sonner';

function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      const response = await getMyReviews();
      setReviews(response.data.reviews);
    } catch (error) {
      toast.error("Error fetching reviews: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview(reviewId);
      toast.success("Review deleted successfully");
      fetchMyReviews();
    } catch (error) {
      toast.error("Error deleting review: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">Loading reviews...</div>;

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Reviews</h1>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">You haven't written any reviews yet.</p>
            <Link to="/events" className="text-blue-600 hover:underline mt-2 inline-block">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <Link
                    to={`/events/${review.event._id}`}
                    className="text-xl font-semibold text-blue-600 hover:underline"
                  >
                    {review.event.title}
                  </Link>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
                <p className="mt-4">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReviewsPage;
