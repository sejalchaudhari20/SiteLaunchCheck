"use client";

import { useState } from 'react';
import { Star, X, MessageSquare, Send } from 'lucide-react';

export function LandingFeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedbackType, setFeedbackType] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (message.trim() === '') {
      setError('Please tell us what you think');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'landing_page',
          rating,
          feedbackType,
          message,
          email: email.trim() !== '' ? email : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit');
      }

      setSubmitted(true);
      // Auto-close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setRating(0);
    setMessage('');
    setEmail('');
    setFeedbackType('General Feedback');
    setIsSubmitting(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thanks for your feedback!</h3>
            <p className="text-gray-600">We really appreciate it. Your insights help us make SiteLaunchCheck better.</p>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Help us improve SiteLaunchCheck</h2>
              <p className="text-sm text-gray-500">Your feedback helps us make website QA faster and more useful.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Rating Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                  How would you rate SiteLaunchCheck?
                </label>
                <div className="flex justify-center gap-2 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => {
                        setRating(star);
                        if (error) setError(null);
                      }}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`${
                          (hoveredRating || rating) >= star
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-center text-xs text-gray-500 min-h-[16px]">
                  {rating === 5 && 'Excellent'}
                  {rating === 4 && 'Good'}
                  {rating === 3 && 'Okay'}
                  {rating === 2 && 'Needs improvement'}
                  {rating === 1 && 'Poor'}
                  {rating === 0 && 'Select a rating'}
                </div>
              </div>

              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Feedback type</label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm bg-white"
                >
                  <option value="General Feedback">General Feedback</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Report an Issue">Report an Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Tell us what you think..."
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 text-sm h-28 resize-none ${
                    error && message.trim() === '' ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary focus:ring-primary/20'
                  }`}
                  required
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>

              {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors text-sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 text-sm"
                >
                  <Send size={16} />
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
