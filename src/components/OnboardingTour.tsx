import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '.style-panel',
    title: 'Style Panel',
    description: 'Click any style to apply it to selected text. Choose from semantic styles like Definition, Term, Verse, and more. Edit fonts, sizes, weights, and colors.',
    position: 'right',
  },
  {
    target: '.toolbar',
    title: 'Formatting Toolbar',
    description: 'Use these buttons for quick formatting: bold, italic, underline, alignment, lists, and quotes. Active buttons are highlighted.',
    position: 'bottom',
  },
  {
    target: '.editor-pages',
    title: 'Double-Page View',
    description: 'Your document displays in a booklet layout, just like Apple Pages. Right-click anywhere to access semantic tagging and AI tools.',
    position: 'left',
  },
  {
    target: '.find-replace-btn',
    title: 'Find & Replace',
    description: 'Search and replace text with options to keep existing styles or re-apply semantic rules automatically.',
    position: 'bottom',
  },
  {
    target: '.export-btn',
    title: 'Export',
    description: 'Export your document as PDF, HTML, or plain text. Your formatting and styles are preserved.',
    position: 'bottom',
  },
];

export const OnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const step = tourSteps[currentStep];
      const element = document.querySelector(step.target);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        let top = 0;
        let left = 0;

        switch (step.position) {
          case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + 20;
            break;
          case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - 320;
            break;
          case 'bottom':
            top = rect.bottom + 20;
            left = rect.left + rect.width / 2 - 150;
            break;
          case 'top':
            top = rect.top - 180;
            left = rect.left + rect.width / 2 - 150;
            break;
        }

        setPosition({ top, left });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentStep, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];

  const getArrowStyles = () => {
    const baseArrow = "absolute w-0 h-0 border-solid";
    
    switch (step.position) {
      case 'right':
        return {
          arrow: `${baseArrow} border-r-[15px] border-r-card border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent left-[-15px] top-1/2 -translate-y-1/2`,
        };
      case 'left':
        return {
          arrow: `${baseArrow} border-l-[15px] border-l-card border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent right-[-15px] top-1/2 -translate-y-1/2`,
        };
      case 'bottom':
        return {
          arrow: `${baseArrow} border-b-[15px] border-b-card border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent top-[-15px] left-1/2 -translate-x-1/2`,
        };
      case 'top':
        return {
          arrow: `${baseArrow} border-t-[15px] border-t-card border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent bottom-[-15px] left-1/2 -translate-x-1/2`,
        };
      default:
        return { arrow: '' };
    }
  };

  const highlightElement = () => {
    const element = document.querySelector(step.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      return (
        <div
          className="fixed z-40 border-4 border-primary rounded-lg pointer-events-none animate-pulse"
          style={{
            top: `${rect.top - 4}px`,
            left: `${rect.left - 4}px`,
            width: `${rect.width + 8}px`,
            height: `${rect.height + 8}px`,
          }}
        />
      );
    }
    return null;
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />
      
      {/* Highlight Box */}
      {highlightElement()}
      
      {/* Tour Card */}
      <Card
        className="fixed z-50 w-[300px] p-4 shadow-2xl"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: step.position === 'bottom' || step.position === 'top' 
            ? 'translateX(-50%)' 
            : step.position === 'right' 
              ? 'translateY(-50%)' 
              : 'translate(-100%, -50%)',
        }}
      >
        {/* Arrow Pointer */}
        <div className={getArrowStyles().arrow} />
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{step.title}</h3>
            <p className="text-xs text-muted-foreground">
              {currentStep + 1} of {tourSteps.length}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {step.description}
        </p>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <div className="flex gap-1">
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  idx === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={handleNext}
          >
            {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </Card>
    </>
  );
};
