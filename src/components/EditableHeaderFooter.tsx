import { useState, useEffect, useRef } from 'react';

interface EditableHeaderFooterProps {
  type: 'header' | 'footer';
  layoutStyle: 'single' | 'two' | 'three';
  content: any;
  height: number;
  onHeightChange: (height: number) => void;
  onContentChange: (content: any) => void;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}

export const EditableHeaderFooter = ({
  type,
  layoutStyle,
  content,
  height,
  onHeightChange,
  onContentChange,
  isSelected,
  onSelect,
  onDeselect,
}: EditableHeaderFooterProps) => {
  const [localContent, setLocalContent] = useState(content || getDefaultContent(layoutStyle));
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartHeight, setDragStartHeight] = useState(height);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!content) {
      setLocalContent(getDefaultContent(layoutStyle));
    } else {
      setLocalContent(content);
    }
  }, [layoutStyle, content]);

  function getDefaultContent(style: string) {
    switch (style) {
      case 'single':
        return '';
      case 'two':
        return { left: '', right: '' };
      case 'three':
        return { left: '', center: '', right: '' };
      default:
        return '';
    }
  }

  const handleContentUpdate = (field: string, value: string) => {
    let updated;
    if (layoutStyle === 'single') {
      updated = value;
    } else if (layoutStyle === 'two') {
      updated = { ...localContent, [field]: value };
    } else {
      updated = { ...localContent, [field]: value };
    }
    setLocalContent(updated);
    onContentChange(updated);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSelected) return;
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragStartHeight(height);
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = type === 'header' 
        ? e.clientY - dragStartY 
        : dragStartY - e.clientY;
      
      let newHeight = dragStartHeight + deltaY;
      newHeight = Math.max(30, Math.min(200, newHeight));
      
      onHeightChange(newHeight);
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
  }, [isDragging, dragStartY, dragStartHeight, onHeightChange, type]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node) && isSelected) {
        onDeselect();
      }
    };

    if (isSelected) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelected, onDeselect]);

  const animationClass = type === 'header' ? 'animate-slide-down' : 'animate-slide-up';

  return (
    <div
      ref={containerRef}
      className={`w-full transition-all duration-300 ${animationClass} relative`}
      style={{ 
        height: `${height}px`,
        background: isSelected || isDragging 
          ? 'rgba(139, 112, 247, 0.08)' 
          : 'transparent',
        cursor: isSelected ? 'ns-resize' : 'pointer',
      }}
      onClick={onSelect}
      onMouseDown={handleMouseDown}
    >
      {/* Column Guide Overlays - only show when selected */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          {layoutStyle === 'single' && (
            <div 
              className="absolute inset-x-16 inset-y-0 border-2 border-dashed border-[rgba(139,112,247,0.4)] rounded"
              style={{
                background: 'repeating-linear-gradient(90deg, rgba(139, 112, 247, 0.03), rgba(139, 112, 247, 0.03) 20px, transparent 20px, transparent 40px)',
                boxShadow: isDragging ? '0 0 30px rgba(139, 112, 247, 0.4)' : '0 0 15px rgba(139, 112, 247, 0.2)',
              }}
            />
          )}
          
          {layoutStyle === 'two' && (
            <div className="absolute inset-x-16 inset-y-0 grid grid-cols-2 gap-4">
              <div 
                className="border-2 border-dashed border-[rgba(139,112,247,0.4)] rounded"
                style={{
                  background: 'repeating-linear-gradient(90deg, rgba(139, 112, 247, 0.03), rgba(139, 112, 247, 0.03) 20px, transparent 20px, transparent 40px)',
                  boxShadow: isDragging ? '0 0 30px rgba(139, 112, 247, 0.4)' : '0 0 15px rgba(139, 112, 247, 0.2)',
                }}
              />
              <div 
                className="border-2 border-dashed border-[rgba(139,112,247,0.4)] rounded"
                style={{
                  background: 'repeating-linear-gradient(90deg, rgba(139, 112, 247, 0.03), rgba(139, 112, 247, 0.03) 20px, transparent 20px, transparent 40px)',
                  boxShadow: isDragging ? '0 0 30px rgba(139, 112, 247, 0.4)' : '0 0 15px rgba(139, 112, 247, 0.2)',
                }}
              />
            </div>
          )}
          
          {layoutStyle === 'three' && (
            <div className="absolute inset-x-16 inset-y-0 grid grid-cols-3 gap-4">
              <div 
                className="border-2 border-dashed border-[rgba(139,112,247,0.4)] rounded"
                style={{
                  background: 'repeating-linear-gradient(90deg, rgba(139, 112, 247, 0.03), rgba(139, 112, 247, 0.03) 20px, transparent 20px, transparent 40px)',
                  boxShadow: isDragging ? '0 0 30px rgba(139, 112, 247, 0.4)' : '0 0 15px rgba(139, 112, 247, 0.2)',
                }}
              />
              <div 
                className="border-2 border-dashed border-[rgba(139,112,247,0.4)] rounded"
                style={{
                  background: 'repeating-linear-gradient(90deg, rgba(139, 112, 247, 0.03), rgba(139, 112, 247, 0.03) 20px, transparent 20px, transparent 40px)',
                  boxShadow: isDragging ? '0 0 30px rgba(139, 112, 247, 0.4)' : '0 0 15px rgba(139, 112, 247, 0.2)',
                }}
              />
              <div 
                className="border-2 border-dashed border-[rgba(139,112,247,0.4)] rounded"
                style={{
                  background: 'repeating-linear-gradient(90deg, rgba(139, 112, 247, 0.03), rgba(139, 112, 247, 0.03) 20px, transparent 20px, transparent 40px)',
                  boxShadow: isDragging ? '0 0 30px rgba(139, 112, 247, 0.4)' : '0 0 15px rgba(139, 112, 247, 0.2)',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div
        className={`w-full h-full px-16 py-4 transition-all duration-200 relative z-10 ${
          isSelected 
            ? 'opacity-70' 
            : ''
        }`}
      >
        {layoutStyle === 'single' && (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleContentUpdate('single', e.currentTarget.textContent || '')}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full h-full min-h-[40px] outline-none text-sm text-gray-700 cursor-text"
            style={{ 
              padding: '8px',
              borderRadius: '4px',
            }}
          >
            {localContent || `Click to edit ${type}...`}
          </div>
        )}

        {layoutStyle === 'two' && (
          <div className="grid grid-cols-2 gap-4 h-full">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('left', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-left"
              style={{ 
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              {localContent?.left || 'Left column...'}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('right', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-right"
              style={{ 
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              {localContent?.right || 'Right column...'}
            </div>
          </div>
        )}

        {layoutStyle === 'three' && (
          <div className="grid grid-cols-3 gap-4 h-full">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('left', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-left"
              style={{ 
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              {localContent?.left || 'Left...'}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('center', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-center"
              style={{ 
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              {localContent?.center || 'Center...'}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('right', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-right"
              style={{ 
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              {localContent?.right || 'Right...'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
