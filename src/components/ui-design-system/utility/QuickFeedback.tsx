// Quick Feedback System
// Thumbs up/down feedback component for screens

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '../utility/AudioProvider';

interface QuickFeedbackProps {
  screenName: string;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'bottom-center';
  onFeedback?: (rating: 'positive' | 'negative', comment?: string) => void;
  className?: string;
}

export function QuickFeedback({ 
  screenName, 
  position = 'bottom-right',
  onFeedback,
  className 
}: QuickFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { playSound, hapticFeedback } = useAudio();

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const handleRatingSelect = (rating: 'positive' | 'negative') => {
    setSelectedRating(rating);
    playSound(rating === 'positive' ? 'success' : 'button-click');
    hapticFeedback(rating === 'positive' ? [50, 50, 100] : 50);
  };

  const handleSubmit = () => {
    if (!selectedRating) return;

    onFeedback?.(selectedRating, comment);
    playSound('success');
    hapticFeedback([100, 50, 100]);
    setIsSubmitted(true);

    // Auto-close after showing success
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setSelectedRating(null);
      setComment('');
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedRating(null);
    setComment('');
    setIsSubmitted(false);
    playSound('modal-close');
  };

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      <AnimatePresence>
        {!isOpen ? (
          // Collapsed state - floating action button
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsOpen(true);
              playSound('modal-open');
            }}
            className="group relative h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          >
            <ThumbsUp className="h-5 w-5 transition-transform group-hover:scale-110" />
            
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-75 group-hover:opacity-0" />
          </motion.button>
        ) : (
          // Expanded feedback form
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-xl p-4 min-w-[280px] max-w-[320px]"
          >
            {!isSubmitted ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-card-foreground">
                    How is {screenName}?
                  </h3>
                  <button
                    onClick={handleClose}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Rating buttons */}
                <div className="flex gap-2 mb-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRatingSelect('positive')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md border transition-all duration-200',
                      selectedRating === 'positive'
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'border-border hover:border-border/80 hover:bg-accent/50'
                    )}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">Good</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRatingSelect('negative')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md border transition-all duration-200',
                      selectedRating === 'negative'
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'border-border hover:border-border/80 hover:bg-accent/50'
                    )}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="text-sm">Poor</span>
                  </motion.button>
                </div>

                {/* Optional comment */}
                {selectedRating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-3"
                  >
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us more (optional)"
                      className="w-full h-16 px-3 py-2 text-sm bg-background/50 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      maxLength={200}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {comment.length}/200
                    </div>
                  </motion.div>
                )}

                {/* Submit button */}
                {selectedRating && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="w-full py-2 px-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-medium rounded-md hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Send Feedback
                  </motion.button>
                )}
              </>
            ) : (
              // Success state
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2"
                >
                  <Check className="h-6 w-6 text-green-400" />
                </motion.div>
                <h3 className="text-sm font-medium text-card-foreground mb-1">
                  Thank you!
                </h3>
                <p className="text-xs text-muted-foreground">
                  Your feedback helps us improve
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for easy feedback integration
export function useFeedback() {
  const handleFeedback = (screenName: string, rating: 'positive' | 'negative', comment?: string) => {
    // In a real app, this would send to analytics/feedback service
    console.log('Feedback received:', {
      screen: screenName,
      rating,
      comment,
      timestamp: new Date().toISOString(),
    });

    // You could also store in localStorage for offline handling
    const feedbackData = {
      screen: screenName,
      rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    const existingFeedback = JSON.parse(localStorage.getItem('feedback-queue') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('feedback-queue', JSON.stringify(existingFeedback));
  };

  return { handleFeedback };
}