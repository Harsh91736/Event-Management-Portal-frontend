import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitEventReview } from '../../services/api';
import { toast } from 'sonner';
import { FaImage, FaTrash } from 'react-icons/fa';

function EventFeedback({ eventId, onFeedbackSubmit }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState('general');
  const [attachments, setAttachments] = useState([]);
  const { user } = useAuth();

  const feedbackCategories = [
    { id: 'general', label: 'General' },
    { id: 'content', label: 'Content Quality' },
    { id: 'organization', label: 'Organization' },
    { id: 'venue', label: 'Venue & Facilities' },
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('content', feedback);
    formData.append('category', category);
    attachments.forEach((file) => formData.append('attachments', file));

    try {
      await submitEventReview(eventId, formData);
      toast.success('Thank you for your feedback!');
      onFeedbackSubmit?.();
      setRating(0);
      setFeedback('');
      setCategory('general');
      setAttachments([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Event Feedback</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`p-2 ${rating >= value ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            {feedbackCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attachments (Optional)
          </label>
          <div className="space-y-2">
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
              id="feedback-attachments"
            />
            <label
              htmlFor="feedback-attachments"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <FaImage className="mr-2" />
              Add Images
            </label>
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Attachment ${index + 1}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !rating}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}

export default EventFeedback;
