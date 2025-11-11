import { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import infinityIcon from '@/assets/new-infinity-icon.png';

interface TextBoxProps {
  id: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isLocked: boolean;
  isSelected: boolean;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  onUpdate: (id: string, updates: Partial<Omit<TextBoxProps, 'id' | 'onUpdate' | 'onSelect' | 'onDelete'>>) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

// Custom corner handle component
const CornerHandle = ({ corner }: { corner: string }) => (
  <div
    className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-[0_0_10px_rgba(167,139,250,0.6)] hover:shadow-[0_0_15px_rgba(167,139,250,0.9)] hover:scale-110 transition-all duration-200 z-[1001]"
    style={{
      top: corner.includes('top') ? '-10px' : 'auto',
      bottom: corner.includes('bottom') ? '-10px' : 'auto',
      left: corner.includes('Left') ? '-10px' : 'auto',
      right: corner.includes('Right') ? '-10px' : 'auto',
      cursor: corner === 'topLeft' || corner === 'bottomRight' ? 'nwse-resize' : 'nesw-resize',
      pointerEvents: 'auto',
    }}
  />
);

export const TextBox = ({
  id,
  content,
  x,
  y,
  width,
  height,
  isLocked,
  isSelected,
  fontSize,
  fontWeight,
  fontStyle,
  textDecoration,
  color,
  backgroundColor,
  borderColor,
  onUpdate,
  onSelect,
  onDelete,
}: TextBoxProps) => {
  const [localContent, setLocalContent] = useState(content);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVertical, setIsVertical] = useState(false);
  const [isDraggingInfinity, setIsDraggingInfinity] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  const handleContentChange = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerText;
      setLocalContent(newContent);
      onUpdate(id, { content: newContent });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      // Already selected, toggle lock
      onUpdate(id, { isLocked: !isLocked });
    } else {
      // Not selected, just select
      onSelect(id);
    }
  };

  const handleInfinityMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingInfinity(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  // Handle Delete key
  useEffect(() => {
    if (!isSelected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only delete if not actively editing text
        if (document.activeElement !== contentRef.current) {
          e.preventDefault();
          onDelete(id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, id, onDelete]);

  // Handle infinity icon drag
  useEffect(() => {
    if (!isDraggingInfinity) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dragX = e.clientX - dragStartPos.x;
      const dragY = e.clientY - dragStartPos.y;
      const distance = Math.sqrt(dragX * dragX + dragY * dragY);

      // Only change if dragged at least 15px for stability
      if (distance > 15) {
        // Determine orientation based on drag direction - more responsive
        if (dragX < -10 || dragY > 10) {
          setIsVertical(true); // Vertical stacking
        } else if (dragX > 10 || dragY < -10) {
          setIsVertical(false); // Horizontal
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingInfinity(false);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingInfinity, dragStartPos]);

  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      onDragStop={(e, d) => {
        onUpdate(id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate(id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
        });
      }}
      minWidth={100}
      minHeight={50}
      bounds="parent"
      dragHandleClassName="drag-handle"
      enableResizing={
        !isLocked && isSelected
          ? {
              top: false,
              right: false,
              bottom: false,
              left: false,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }
          : false
      }
      resizeHandleComponent={
        isSelected && !isLocked
          ? {
              topRight: <CornerHandle corner="topRight" />,
              bottomRight: <CornerHandle corner="bottomRight" />,
              bottomLeft: <CornerHandle corner="bottomLeft" />,
              topLeft: <CornerHandle corner="topLeft" />,
            }
          : undefined
      }
      resizeHandleStyles={{
        topRight: { zIndex: 1001 },
        bottomRight: { zIndex: 1001 },
        bottomLeft: { zIndex: 1001 },
        topLeft: { zIndex: 1001 },
      }}
      disableDragging={isLocked}
      style={{
        zIndex: isSelected ? 1000 : 1,
      }}
      className="transition-none"
    >
      <div
        ref={boxRef}
        onClick={handleClick}
        className={`w-full h-full relative rounded-lg drag-handle ${
          isSelected ? 'shadow-lg' : 'shadow-sm'
        }`}
        style={{
          backgroundColor: backgroundColor || 'rgba(255, 255, 255, 0.95)',
          borderWidth: isSelected ? '3px' : '0',
          borderStyle: isSelected ? 'dashed' : 'none',
          borderColor: isSelected ? (isLocked ? '#F87171' : '#A78BFA') : 'transparent',
          transition: 'border-color 0.2s ease',
        }}
      >
        {/* Infinity icon for orientation control - only show when selected and unlocked */}
        {isSelected && !isLocked && (
          <img
            src={infinityIcon}
            alt="Orientation control"
            className="absolute w-6 h-6 z-[1002] hover:scale-110"
            style={{
              right: '-12px',
              top: '50%',
              transform: 'translateY(-50%)',
              filter: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.5))',
              cursor: isDraggingInfinity ? 'grabbing' : 'grab',
              transition: 'transform 0.15s ease, filter 0.15s ease',
              pointerEvents: 'auto',
            }}
            onMouseDown={handleInfinityMouseDown}
            draggable={false}
          />
        )}

        {/* Editable content */}
        <div
          ref={contentRef}
          contentEditable={!isLocked}
          suppressContentEditableWarning
          onBlur={handleContentChange}
          onInput={handleContentChange}
          className="w-full h-full p-4 outline-none overflow-auto"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            fontStyle,
            textDecoration,
            color: color || '#000000',
            cursor: isLocked ? 'default' : 'text',
            writingMode: isVertical ? 'vertical-rl' : 'horizontal-tb',
            textOrientation: isVertical ? 'upright' : 'mixed',
            transition: 'writing-mode 0.2s ease, text-orientation 0.2s ease',
          }}
        >
          {localContent || 'Click to edit text...'}
        </div>
      </div>
    </Rnd>
  );
};
