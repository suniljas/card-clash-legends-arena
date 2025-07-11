import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Hand, Check, X } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'tap' | 'view';
  completion?: () => boolean;
}

interface InteractiveTutorialProps {
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip: () => void;
  isActive: boolean;
}

export function InteractiveTutorial({ 
  steps, 
  onComplete, 
  onSkip, 
  isActive 
}: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentTutorialStep = steps[currentStep];

  useEffect(() => {
    if (!isActive || !currentTutorialStep?.target) return;

    const targetElement = document.querySelector(currentTutorialStep.target);
    if (!targetElement) return;

    setIsHighlighting(true);
    
    // Scroll element into view
    targetElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });

    // Add highlight class
    targetElement.classList.add('tutorial-highlight');
    
    return () => {
      targetElement.classList.remove('tutorial-highlight');
      setIsHighlighting(false);
    };
  }, [currentStep, isActive, currentTutorialStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTooltipPosition = (): React.CSSProperties => {
    if (!currentTutorialStep?.target) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1001
      };
    }

    const targetElement = document.querySelector(currentTutorialStep.target);
    if (!targetElement) return {};

    const rect = targetElement.getBoundingClientRect();
    const position = currentTutorialStep.position;

    switch (position) {
      case 'top':
        return {
          position: 'fixed',
          bottom: `${window.innerHeight - rect.top + 10}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)',
          zIndex: 1001
        };
      case 'bottom':
        return {
          position: 'fixed',
          top: `${rect.bottom + 10}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)',
          zIndex: 1001
        };
      case 'left':
        return {
          position: 'fixed',
          top: `${rect.top + rect.height / 2}px`,
          right: `${window.innerWidth - rect.left + 10}px`,
          transform: 'translateY(-50%)',
          zIndex: 1001
        };
      case 'right':
        return {
          position: 'fixed',
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 10}px`,
          transform: 'translateY(-50%)',
          zIndex: 1001
        };
      default:
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1001
        };
    }
  };

  if (!isActive) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 z-1000 transition-opacity duration-300"
        style={{ zIndex: 1000 }}
      />

      {/* Tutorial Tooltip */}
      <Card
        ref={tooltipRef}
        className="max-w-sm w-full p-4 shadow-2xl border-2 border-primary"
        style={getTooltipPosition()}
      >
        {/* Progress */}
        <div className="flex justify-between items-center mb-3">
          <Badge variant="outline" className="text-xs">
            Step {currentStep + 1} of {steps.length}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">
            {currentTutorialStep.title}
          </h3>
          
          <p className="text-xs text-muted-foreground">
            {currentTutorialStep.description}
          </p>

          {/* Action Indicator */}
          {currentTutorialStep.action && (
            <div className="flex items-center gap-2 text-xs text-primary">
              <Hand className="h-3 w-3" />
              <span>
                {currentTutorialStep.action === 'click' && 'Click to continue'}
                {currentTutorialStep.action === 'tap' && 'Tap to continue'}
                {currentTutorialStep.action === 'view' && 'Review this section'}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="h-7 text-xs"
          >
            Previous
          </Button>

          <Button
            size="sm"
            onClick={handleNext}
            className="h-7 text-xs"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Complete
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-3 h-3 ml-1" />
              </>
            )}
          </Button>
        </div>
      </Card>

      <style dangerouslySetInnerHTML={{
        __html: `
          .tutorial-highlight {
            position: relative;
            z-index: 1001;
            box-shadow: 0 0 0 4px hsl(var(--primary)), 
                        0 0 0 8px hsl(var(--primary) / 0.3);
            border-radius: 8px;
            animation: tutorial-pulse 2s infinite;
          }

          @keyframes tutorial-pulse {
            0%, 100% {
              box-shadow: 0 0 0 4px hsl(var(--primary)), 
                          0 0 0 8px hsl(var(--primary) / 0.3);
            }
            50% {
              box-shadow: 0 0 0 4px hsl(var(--primary)), 
                          0 0 0 12px hsl(var(--primary) / 0.1);
            }
          }
        `
      }} />
    </>
  );
}