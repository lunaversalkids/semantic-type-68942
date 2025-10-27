import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpBox {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'right' | 'bottom' | 'left';
}

const helpBoxes: HelpBox[] = [
  {
    id: 'style-panel',
    title: 'Styles Panel',
    description: 'View and manage all your semantic styles. Select a style to customize its appearance.',
    target: '.style-panel',
    position: 'right',
  },
  {
    id: 'toolbar',
    title: 'Formatting Toolbar',
    description: 'Apply basic formatting and access find/replace and export options.',
    target: '.toolbar',
    position: 'bottom',
  },
  {
    id: 'editor',
    title: 'Document Editor',
    description: 'Write and edit your content. Right-click on text to apply semantic styles.',
    target: '.editor-pages',
    position: 'top',
  },
  {
    id: 'find-replace',
    title: 'Find & Replace',
    description: 'Search and replace text while preserving or reapplying styles.',
    target: '.find-replace-btn',
    position: 'bottom',
  },
  {
    id: 'export',
    title: 'Export Document',
    description: 'Export your document to PDF, HTML, or plain text format.',
    target: '.export-btn',
    position: 'bottom',
  },
];

interface HelpModeProps {
  isActive: boolean;
  onClose: () => void;
}

export const HelpMode = ({ isActive, onClose }: HelpModeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [boxPosition, setBoxPosition] = useState<{ top: number; left: number; targetRect: DOMRect } | null>(null);

  const currentBox = helpBoxes[currentStep];

  useEffect(() => {
    if (!isActive) return;

    const calculatePosition = () => {
      const element = document.querySelector(currentBox.target);
      if (!element) {
        setBoxPosition(null);
        return;
      }

      const rect = element.getBoundingClientRect();
      const boxWidth = 320;
      const boxHeight = 150;
      const arrowSize = 20;
      const gap = 15;

      let top = 0;
      let left = 0;

      switch (currentBox.position) {
        case 'right':
          top = rect.top + rect.height / 2 - boxHeight / 2;
          left = rect.right + gap + arrowSize;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - boxHeight / 2;
          left = rect.left - boxWidth - gap - arrowSize;
          break;
        case 'bottom':
          top = rect.bottom + gap + arrowSize;
          left = rect.left + rect.width / 2 - boxWidth / 2;
          break;
        case 'top':
          top = rect.top - boxHeight - gap - arrowSize;
          left = rect.left + rect.width / 2 - boxWidth / 2;
          break;
      }

      setBoxPosition({ top, left, targetRect: rect });
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [isActive, currentStep, currentBox]);

  const handleNext = () => {
    if (currentStep < helpBoxes.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isActive || !boxPosition) return null;

  const getArrowStyles = (position: string, targetRect: DOMRect, boxTop: number, boxLeft: number) => {
    const baseArrow = "absolute w-0 h-0 border-solid z-50";
    const arrowSize = 12;

    switch (position) {
      case 'right':
        return {
          className: `${baseArrow} border-r-[${arrowSize}px] border-r-card border-t-[${arrowSize}px] border-t-transparent border-b-[${arrowSize}px] border-b-transparent`,
          style: {
            left: `${boxLeft - arrowSize}px`,
            top: `${boxTop + 75 - arrowSize}px`,
          },
        };
      case 'left':
        return {
          className: `${baseArrow} border-l-[${arrowSize}px] border-l-card border-t-[${arrowSize}px] border-t-transparent border-b-[${arrowSize}px] border-b-transparent`,
          style: {
            left: `${boxLeft + 320}px`,
            top: `${boxTop + 75 - arrowSize}px`,
          },
        };
      case 'bottom':
        return {
          className: `${baseArrow} border-b-[${arrowSize}px] border-b-card border-l-[${arrowSize}px] border-l-transparent border-r-[${arrowSize}px] border-r-transparent`,
          style: {
            left: `${boxLeft + 160 - arrowSize}px`,
            top: `${boxTop - arrowSize}px`,
          },
        };
      case 'top':
        return {
          className: `${baseArrow} border-t-[${arrowSize}px] border-t-card border-l-[${arrowSize}px] border-l-transparent border-r-[${arrowSize}px] border-r-transparent`,
          style: {
            left: `${boxLeft + 160 - arrowSize}px`,
            top: `${boxTop + 150}px`,
          },
        };
      default:
        return { className: '', style: {} };
    }
  };

  const arrow = getArrowStyles(currentBox.position, boxPosition.targetRect, boxPosition.top, boxPosition.left);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Highlight Box */}
      <div
        className="fixed z-40 border-2 border-primary rounded-lg pointer-events-none animate-pulse"
        style={{
          top: `${boxPosition.targetRect.top - 4}px`,
          left: `${boxPosition.targetRect.left - 4}px`,
          width: `${boxPosition.targetRect.width + 8}px`,
          height: `${boxPosition.targetRect.height + 8}px`,
        }}
      />

      {/* Arrow */}
      <div
        className={arrow.className}
        style={arrow.style}
      />

      {/* Instruction Box */}
      <Card
        className="fixed z-50 w-[320px] p-5 shadow-lg animate-fade-in"
        style={{
          top: `${boxPosition.top}px`,
          left: `${boxPosition.left}px`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-base">{currentBox.title}</h3>
          <span className="text-xs text-muted-foreground">
            {currentStep + 1}/{helpBoxes.length}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{currentBox.description}</p>
        
        <div className="flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          
          <div className="flex gap-1">
            {helpBoxes.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <Button size="sm" onClick={handleNext}>
            {currentStep === helpBoxes.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </Card>

      {/* Skip Button */}
      <Button
        size="sm"
        variant="secondary"
        className="fixed bottom-8 right-8 z-50 shadow-lg"
        onClick={onClose}
      >
        <X className="w-4 h-4 mr-2" />
        Skip Tour
      </Button>
    </>
  );
};
