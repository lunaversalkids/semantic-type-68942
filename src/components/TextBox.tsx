import { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { Lock, Unlock, X } from 'lucide-react';

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

  // Update orientation based on x position
  useEffect(() => {
    const screenWidth = window.innerWidth;
    const leftThreshold = screenWidth * 0.3;
    setIsVertical(x < leftThreshold);
  }, [x]);

  const handleContentChange = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerText;
      setLocalContent(newContent);
      onUpdate(id, { content: newContent });
    }
  };

  const handleLockToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(id, { isLocked: !isLocked });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

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
      enableResizing={!isLocked && isSelected}
      disableDragging={isLocked}
      style={{
        zIndex: isSelected ? 1000 : 1,
      }}
      className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      <div
        onClick={handleClick}
        className={`w-full h-full relative rounded-md transition-all duration-300 ${
          isSelected ? 'shadow-lg' : 'shadow-sm'
        }`}
        style={{
          backgroundColor: backgroundColor || 'rgba(255, 255, 255, 0.95)',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: isSelected ? (borderColor || 'hsl(var(--primary))') : 'transparent',
        }}
      >
        {/* Control buttons - only show when selected */}
        {isSelected && (
          <div className="absolute -top-10 right-0 flex gap-2 bg-background/90 backdrop-blur-sm rounded-md p-1 shadow-md">
            <button
              onClick={handleLockToggle}
              className="p-1.5 hover:bg-accent rounded transition-colors"
              title={isLocked ? 'Unlock' : 'Lock'}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 hover:bg-destructive/10 rounded transition-colors text-destructive"
              title="Delete"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Editable content */}
        <div
          ref={contentRef}
          contentEditable={!isLocked}
          suppressContentEditableWarning
          onBlur={handleContentChange}
          onInput={handleContentChange}
          className={`w-full h-full p-4 outline-none overflow-auto transition-all duration-300 ${
            isVertical ? 'vertical-text' : ''
          }`}
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            fontStyle,
            textDecoration,
            color: color || '#000000',
            cursor: isLocked ? 'default' : 'text',
            writingMode: isVertical ? 'vertical-rl' : 'horizontal-tb',
            textOrientation: isVertical ? 'mixed' : 'mixed',
          }}
        >
          {localContent || 'Click to edit text...'}
        </div>
      </div>
    </Rnd>
  );
};
