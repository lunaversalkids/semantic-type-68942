import { useState, useRef, useEffect } from 'react';

interface HorizontalRulerProps {
  pageWidth: number; // in inches
  zoom: number;
  activePageNum: number;
  onDragStateChange?: (isDragging: boolean, position: number, type: 'left' | 'right') => void;
}

export const HorizontalRuler = ({ pageWidth, zoom, activePageNum, onDragStateChange }: HorizontalRulerProps) => {
  const [leftMargin, setLeftMargin] = useState(1); // inches
  const [rightMargin, setRightMargin] = useState(1); // inches
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);

  const pxPerInch = 96; // Standard screen DPI
  const rulerWidthPx = pageWidth * pxPerInch * zoom;

  const handleLeftMarkerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingLeft(true);
  };

  const handleRightMarkerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingRight(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!rulerRef.current) return;
      const rect = rulerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const inches = relativeX / (pxPerInch * zoom);

      if (isDraggingLeft) {
        const newMargin = Math.max(0, Math.min(pageWidth / 2, inches));
        setLeftMargin(newMargin);
        onDragStateChange?.(true, newMargin, 'left');
      }
      if (isDraggingRight) {
        const newMargin = Math.max(0, Math.min(pageWidth / 2, pageWidth - inches));
        setRightMargin(newMargin);
        onDragStateChange?.(true, pageWidth - newMargin, 'right');
      }
    };

    const handleMouseUp = () => {
      if (isDraggingLeft) {
        onDragStateChange?.(false, leftMargin, 'left');
      }
      if (isDraggingRight) {
        onDragStateChange?.(false, pageWidth - rightMargin, 'right');
      }
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
    };

    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight, zoom, pageWidth, pxPerInch, leftMargin, rightMargin, onDragStateChange]);

  const renderTicks = () => {
    const ticks = [];
    const totalInches = Math.ceil(pageWidth);
    
    for (let i = 0; i <= totalInches * 4; i++) {
      const inches = i / 4;
      const position = (inches / pageWidth) * 100;
      const isMajor = i % 4 === 0;
      const isHalf = i % 2 === 0;

      ticks.push(
        <div
          key={i}
          className="absolute"
          style={{
            left: `${position}%`,
            height: isMajor ? '10px' : isHalf ? '6px' : '4px',
            width: '1px',
            backgroundColor: 'hsl(var(--accent) / 0.5)',
            bottom: 0,
          }}
        />
      );

      if (isMajor && inches <= pageWidth) {
        ticks.push(
          <div
            key={`label-${i}`}
            className="absolute text-[7px] font-medium"
            style={{
              left: `${position}%`,
              transform: 'translateX(-50%)',
              bottom: '11px',
              color: 'hsl(var(--accent) / 0.7)',
            }}
          >
            {Math.floor(inches)}
          </div>
        );
      }
    }

    return ticks;
  };

  return (
    <div
      ref={rulerRef}
      className="absolute top-0 left-0 right-0 h-5 bg-accent/5 backdrop-blur-sm border-b border-accent/20 z-10 flex items-end"
      style={{
        pointerEvents: 'auto',
      }}
    >
      <div
        className="relative mx-auto"
        style={{
          width: `${rulerWidthPx}px`,
          height: '100%',
        }}
      >
        {renderTicks()}

        {/* Left margin marker */}
        <div
          className={`absolute bottom-0 w-2.5 h-2.5 rounded-full cursor-ew-resize ${
            isDraggingLeft 
              ? 'bg-accent shadow-[0_0_12px_hsl(var(--accent))]' 
              : 'bg-accent/70 hover:bg-accent transition-all duration-200 ease-out'
          }`}
          style={{
            left: `${(leftMargin / pageWidth) * 100}%`,
            transform: `translate(-50%, 1px) ${isDraggingLeft ? 'scale(1.1)' : 'scale(1)'}`,
            transition: isDraggingLeft ? 'none' : 'transform 0.2s ease-out, background-color 0.2s ease-out',
          }}
          onMouseDown={handleLeftMarkerMouseDown}
          title="Left Margin"
        />

        {/* Right margin marker */}
        <div
          className={`absolute bottom-0 w-2.5 h-2.5 rounded-full cursor-ew-resize ${
            isDraggingRight 
              ? 'bg-accent shadow-[0_0_12px_hsl(var(--accent))]' 
              : 'bg-accent/70 hover:bg-accent transition-all duration-200 ease-out'
          }`}
          style={{
            left: `${((pageWidth - rightMargin) / pageWidth) * 100}%`,
            transform: `translate(-50%, 1px) ${isDraggingRight ? 'scale(1.1)' : 'scale(1)'}`,
            transition: isDraggingRight ? 'none' : 'transform 0.2s ease-out, background-color 0.2s ease-out',
          }}
          onMouseDown={handleRightMarkerMouseDown}
          title="Right Margin"
        />
      </div>
    </div>
  );
};
