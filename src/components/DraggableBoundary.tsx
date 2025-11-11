import { useState, useRef, useEffect } from 'react';

interface DraggableBoundaryProps {
  type: 'header' | 'footer';
  initialPosition: number;
  onPositionChange: (newPos: number) => void;
  minHeight?: number;
  maxHeight?: number;
}

export const DraggableBoundary = ({
  type,
  initialPosition,
  onPositionChange,
  minHeight = 30,
  maxHeight = 150,
}: DraggableBoundaryProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(initialPosition);
  const boundaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPosition(initialPosition);
  }, [initialPosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const startY = boundaryRef.current?.getBoundingClientRect().top || 0;
      const deltaY = type === 'header' ? e.clientY - startY : startY - e.clientY;
      
      let newPosition = currentPosition + deltaY;
      
      // Constrain to min/max
      newPosition = Math.max(minHeight, Math.min(maxHeight, newPosition));
      
      setCurrentPosition(newPosition);
      onPositionChange(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentPosition, onPositionChange, type, minHeight, maxHeight]);

  return (
    <div
      ref={boundaryRef}
      className={`w-full relative group ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      style={{
        height: '6px',
        cursor: 'ns-resize',
        zIndex: 15,
        marginTop: type === 'header' ? '0' : '0',
        marginBottom: type === 'footer' ? '0' : '0',
      }}
    >
      <div
        className="absolute inset-0 transition-all duration-200"
        style={{
          background: isDragging 
            ? 'repeating-linear-gradient(90deg, transparent, transparent 5px, #8B70F7 5px, #8B70F7 10px)'
            : 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(139, 112, 247, 0.4) 8px, rgba(139, 112, 247, 0.4) 12px)',
          boxShadow: isDragging ? '0 0 20px rgba(139, 112, 247, 0.7)' : 'none',
          height: '6px',
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 5px, #A78BFA 5px, #A78BFA 10px)',
          boxShadow: '0 0 20px rgba(139, 112, 247, 0.7)',
          height: '6px',
        }}
      />
    </div>
  );
};
