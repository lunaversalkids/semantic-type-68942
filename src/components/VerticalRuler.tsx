import { useState, useRef, useEffect } from 'react';

interface VerticalRulerProps {
  pageHeight: number; // in inches
  zoom: number;
  activePageNum: number;
}

export const VerticalRuler = ({ pageHeight, zoom, activePageNum }: VerticalRulerProps) => {
  const [topMargin, setTopMargin] = useState(1); // inches
  const [bottomMargin, setBottomMargin] = useState(1); // inches
  const [isDraggingTop, setIsDraggingTop] = useState(false);
  const [isDraggingBottom, setIsDraggingBottom] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);

  const pxPerInch = 96; // Standard screen DPI
  const rulerHeightPx = pageHeight * pxPerInch * zoom;

  const handleTopMarkerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingTop(true);
  };

  const handleBottomMarkerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingBottom(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!rulerRef.current) return;
      const rect = rulerRef.current.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const inches = relativeY / (pxPerInch * zoom);

      if (isDraggingTop) {
        setTopMargin(Math.max(0, Math.min(pageHeight / 2, inches)));
      }
      if (isDraggingBottom) {
        setBottomMargin(Math.max(0, Math.min(pageHeight / 2, pageHeight - inches)));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingTop(false);
      setIsDraggingBottom(false);
    };

    if (isDraggingTop || isDraggingBottom) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingTop, isDraggingBottom, zoom, pageHeight, pxPerInch]);

  const renderTicks = () => {
    const ticks = [];
    const totalInches = Math.ceil(pageHeight);
    
    for (let i = 0; i <= totalInches * 4; i++) {
      const inches = i / 4;
      const position = (inches / pageHeight) * 100;
      const isMajor = i % 4 === 0;
      const isHalf = i % 2 === 0;

      ticks.push(
        <div
          key={i}
          className="absolute"
          style={{
            top: `${position}%`,
            width: isMajor ? '10px' : isHalf ? '6px' : '4px',
            height: '1px',
            backgroundColor: 'hsl(var(--accent) / 0.5)',
            right: 0,
          }}
        />
      );

      if (isMajor && inches <= pageHeight) {
        ticks.push(
          <div
            key={`label-${i}`}
            className="absolute text-[7px] font-medium"
            style={{
              top: `${position}%`,
              transform: 'translateY(-50%)',
              right: '11px',
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
      className="absolute top-0 left-0 bottom-0 w-5 bg-accent/5 backdrop-blur-sm border-r border-accent/20 z-10 flex items-center"
      style={{
        pointerEvents: 'auto',
      }}
    >
      <div
        className="relative mx-auto"
        style={{
          height: `${rulerHeightPx}px`,
          width: '100%',
        }}
      >
        {renderTicks()}

        {/* Top margin marker */}
        <div
          className={`absolute left-0 w-3 h-3 rounded-full cursor-ns-resize ${
            isDraggingTop 
              ? 'bg-accent shadow-[0_0_12px_hsl(var(--accent))]' 
              : 'bg-accent hover:bg-accent/90 transition-all duration-200 ease-out'
          }`}
          style={{
            top: `${(topMargin / pageHeight) * 100}%`,
            transform: `translate(-2px, -50%) ${isDraggingTop ? 'scale(1.15)' : 'scale(1)'}`,
            transition: isDraggingTop ? 'none' : 'transform 0.2s ease-out, background-color 0.2s ease-out',
          }}
          onMouseDown={handleTopMarkerMouseDown}
          title="Top Margin"
        />

        {/* Bottom margin marker */}
        <div
          className={`absolute left-0 w-3 h-3 rounded-full cursor-ns-resize ${
            isDraggingBottom 
              ? 'bg-accent shadow-[0_0_12px_hsl(var(--accent))]' 
              : 'bg-accent hover:bg-accent/90 transition-all duration-200 ease-out'
          }`}
          style={{
            top: `${((pageHeight - bottomMargin) / pageHeight) * 100}%`,
            transform: `translate(-2px, -50%) ${isDraggingBottom ? 'scale(1.15)' : 'scale(1)'}`,
            transition: isDraggingBottom ? 'none' : 'transform 0.2s ease-out, background-color 0.2s ease-out',
          }}
          onMouseDown={handleBottomMarkerMouseDown}
          title="Bottom Margin"
        />
      </div>
    </div>
  );
};
