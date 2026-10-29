"use client";

import { useState } from 'react';
import { LandingFeedbackModal } from './LandingFeedbackModal';

export function LandingFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpen = () => {
    setIsOpen(true);
    import('@/lib/analytics').then(m => m.trackEvent('feedback_modal_opened', { source: 'landing_page' })).catch(() => {});
  };

  return (
    <>
      <button 
        onClick={handleOpen}
        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        Give Feedback
      </button>
      <LandingFeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
