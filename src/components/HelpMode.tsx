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
  const [boxPositions, setBoxPositions] = useState<Record<string, { top: number; left: number; targetRect: DOMRect } | null>>({});

  useEffect(() => {
    if (!isActive) return;

    const calculatePositions = () => {
      const positions: Record<string, { top: number; left: number; targetRect: DOMRect } | null> = {};
      
      helpBoxes.forEach((box) => {
        const element = document.querySelector(box.target);
        if (element) {
          const rect = element.getBoundingClientRect();
          const boxWidth = 280;
          const boxHeight = 120;
          const arrowSize = 20;
          const gap = 15;

          let top = 0;
          let left = 0;

          switch (box.position) {
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

          positions[box.id] = { top, left, targetRect: rect };
        } else {
          positions[box.id] = null;
        }
      });

      setBoxPositions(positions);
    };

    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    return () => window.removeEventListener('resize', calculatePositions);
  }, [isActive]);

  if (!isActive) return null;

  const getArrowStyles = (position: string, targetRect: DOMRect, boxTop: number, boxLeft: number) => {
    const baseArrow = "absolute w-0 h-0 border-solid z-50";
    const arrowSize = 12;

    switch (position) {
      case 'right':
        return {
          className: `${baseArrow} border-r-[${arrowSize}px] border-r-card border-t-[${arrowSize}px] border-t-transparent border-b-[${arrowSize}px] border-b-transparent`,
          style: {
            left: `${boxLeft - arrowSize}px`,
            top: `${boxTop + 60 - arrowSize}px`,
          },
        };
      case 'left':
        return {
          className: `${baseArrow} border-l-[${arrowSize}px] border-l-card border-t-[${arrowSize}px] border-t-transparent border-b-[${arrowSize}px] border-b-transparent`,
          style: {
            left: `${boxLeft + 280}px`,
            top: `${boxTop + 60 - arrowSize}px`,
          },
        };
      case 'bottom':
        return {
          className: `${baseArrow} border-b-[${arrowSize}px] border-b-card border-l-[${arrowSize}px] border-l-transparent border-r-[${arrowSize}px] border-r-transparent`,
          style: {
            left: `${boxLeft + 140 - arrowSize}px`,
            top: `${boxTop - arrowSize}px`,
          },
        };
      case 'top':
        return {
          className: `${baseArrow} border-t-[${arrowSize}px] border-t-card border-l-[${arrowSize}px] border-l-transparent border-r-[${arrowSize}px] border-r-transparent`,
          style: {
            left: `${boxLeft + 140 - arrowSize}px`,
            top: `${boxTop + 120}px`,
          },
        };
      default:
        return { className: '', style: {} };
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Help Boxes */}
      {helpBoxes.map((box) => {
        const position = boxPositions[box.id];
        if (!position) return null;

        const arrow = getArrowStyles(box.position, position.targetRect, position.top, position.left);

        return (
          <div key={box.id}>
            {/* Highlight Box */}
            <div
              className="fixed z-40 border-2 border-primary rounded-lg pointer-events-none animate-pulse"
              style={{
                top: `${position.targetRect.top - 4}px`,
                left: `${position.targetRect.left - 4}px`,
                width: `${position.targetRect.width + 8}px`,
                height: `${position.targetRect.height + 8}px`,
              }}
            />

            {/* Arrow */}
            <div
              className={arrow.className}
              style={arrow.style}
            />

            {/* Instruction Box */}
            <Card
              className="fixed z-50 w-[280px] p-4 shadow-lg animate-fade-in"
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
              }}
            >
              <h3 className="font-semibold text-sm mb-2">{box.title}</h3>
              <p className="text-xs text-muted-foreground">{box.description}</p>
            </Card>
          </div>
        );
      })}

      {/* Close Button */}
      <Button
        size="sm"
        variant="secondary"
        className="fixed bottom-8 right-8 z-50 shadow-lg"
        onClick={onClose}
      >
        <X className="w-4 h-4 mr-2" />
        Close Help
      </Button>
    </>
  );
};
