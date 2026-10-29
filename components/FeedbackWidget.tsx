"use client";

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send } from 'lucide-react';

export function FeedbackWidget({ reportId }: { reportId: string }) {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('Other');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (helpful === null) return;
    if (helpful === false && message.trim() === '') {
      setError('Please tell us how we can improve.');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    // Log started event
    import('@/lib/analytics').then(m => m.trackEvent('feedback_started', { source: 'audit_report' })).catch(() => {});
    
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'audit_report',
          auditId: reportId,
          helpful,
          message,
          feedbackType: helpful ? undefined : feedbackType,
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to submit');
      }
      
      setSubmitted(true);
    } catch (error) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200 text-center font-medium shadow-sm">
        Thanks! We'll use your feedback to improve SiteLaunchCheck.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-2 text-center text-lg">Was this audit helpful?</h3>
      <p className="text-center text-gray-500 mb-6 text-sm">Your feedback helps us improve SiteLaunchCheck.</p>
      
      {helpful === null ? (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setHelpful(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors font-medium text-gray-600"
          >
            <ThumbsUp size={20} /> Yes
          </button>
          <button
            onClick={() => setHelpful(false)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors font-medium text-gray-600"
          >
            <ThumbsDown size={20} /> Not really
          </button>
        </div>
      ) : (
        <div className="space-y-4 max-w-md mx-auto">
          <p className="text-sm font-medium text-gray-900 text-center">
            {helpful 
              ? 'Great! What did you find useful? (Optional)' 
              : 'What could we improve? (Required)'}
          </p>
          
          {!helpful && (
            <div>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm bg-white"
              >
                <option value="Missing checks">Missing checks</option>
                <option value="Incorrect result">Incorrect result</option>
                <option value="Report is confusing">Report is confusing</option>
                <option value="Website audit failed">Website audit failed</option>
                <option value="Performance issue">Performance issue</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}
          
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(null);
            }}
            placeholder={helpful ? "The audit helped me find broken links..." : "Tell us what went wrong..."}
            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 text-sm h-24 resize-none ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary focus:ring-primary/20'
            }`}
          />
          
          {error && <p className="text-red-500 text-xs font-medium text-center">{error}</p>}
          
          <div className="flex gap-3">
            <button
              onClick={() => setHelpful(null)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors text-sm"
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-[2] flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 text-sm"
            >
              <Send size={16} />
              {isSubmitting ? 'Sending...' : 'Submit Feedback'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
