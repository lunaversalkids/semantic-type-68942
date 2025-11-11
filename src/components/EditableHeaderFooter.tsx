import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';

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
  onApply: () => void;
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
  onApply,
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
    <div className="relative">
      {/* Apply Button - shown when selected */}
      {isSelected && (
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 z-50 animate-fade-in"
          style={{
            top: type === 'header' ? `${height + 10}px` : '-50px',
          }}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
            className="bg-gradient-to-r from-[#8B70F7] to-[#A78BFA] hover:from-[#7C5FE6] hover:to-[#9670E6] text-white shadow-lg shadow-purple-500/50 px-6 py-2"
          >
            Apply
          </Button>
        </div>
      )}

      <div
        ref={containerRef}
        className={`w-full transition-all duration-300 ${animationClass} relative`}
        style={{ 
          height: `${height}px`,
          cursor: isSelected ? 'ns-resize' : 'pointer',
        }}
        onClick={onSelect}
        onMouseDown={handleMouseDown}
      >
        {/* Column Guide Overlays - highly visible when selected */}
        {isSelected && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {layoutStyle === 'single' && (
            <div 
              className="absolute inset-x-16 inset-y-0 border-4 border-dashed rounded-lg animate-fade-in"
              style={{
                borderColor: isDragging ? '#A78BFA' : '#8B70F7',
                background: isDragging 
                  ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(139, 112, 247, 0.15))' 
                  : 'linear-gradient(135deg, rgba(167, 139, 250, 0.10), rgba(139, 112, 247, 0.10))',
                boxShadow: isDragging 
                  ? '0 0 40px rgba(167, 139, 250, 0.6), inset 0 0 30px rgba(167, 139, 250, 0.2)' 
                  : '0 0 25px rgba(139, 112, 247, 0.4), inset 0 0 20px rgba(139, 112, 247, 0.1)',
              }}
            />
          )}
          
          {layoutStyle === 'two' && (
            <div className="absolute inset-x-16 inset-y-0 grid grid-cols-2 gap-6 animate-fade-in">
              <div 
                className="border-4 border-dashed rounded-lg"
                style={{
                  borderColor: isDragging ? '#A78BFA' : '#8B70F7',
                  background: isDragging 
                    ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(139, 112, 247, 0.15))' 
                    : 'linear-gradient(135deg, rgba(167, 139, 250, 0.10), rgba(139, 112, 247, 0.10))',
                  boxShadow: isDragging 
                    ? '0 0 40px rgba(167, 139, 250, 0.6), inset 0 0 30px rgba(167, 139, 250, 0.2)' 
                    : '0 0 25px rgba(139, 112, 247, 0.4), inset 0 0 20px rgba(139, 112, 247, 0.1)',
                }}
              />
              <div 
                className="border-4 border-dashed rounded-lg"
                style={{
                  borderColor: isDragging ? '#A78BFA' : '#8B70F7',
                  background: isDragging 
                    ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(139, 112, 247, 0.15))' 
                    : 'linear-gradient(135deg, rgba(167, 139, 250, 0.10), rgba(139, 112, 247, 0.10))',
                  boxShadow: isDragging 
                    ? '0 0 40px rgba(167, 139, 250, 0.6), inset 0 0 30px rgba(167, 139, 250, 0.2)' 
                    : '0 0 25px rgba(139, 112, 247, 0.4), inset 0 0 20px rgba(139, 112, 247, 0.1)',
                }}
              />
            </div>
          )}
          
          {layoutStyle === 'three' && (
            <div className="absolute inset-x-16 inset-y-0 grid grid-cols-3 gap-6 animate-fade-in">
              <div 
                className="border-4 border-dashed rounded-lg"
                style={{
                  borderColor: isDragging ? '#A78BFA' : '#8B70F7',
                  background: isDragging 
                    ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(139, 112, 247, 0.15))' 
                    : 'linear-gradient(135deg, rgba(167, 139, 250, 0.10), rgba(139, 112, 247, 0.10))',
                  boxShadow: isDragging 
                    ? '0 0 40px rgba(167, 139, 250, 0.6), inset 0 0 30px rgba(167, 139, 250, 0.2)' 
                    : '0 0 25px rgba(139, 112, 247, 0.4), inset 0 0 20px rgba(139, 112, 247, 0.1)',
                }}
              />
              <div 
                className="border-4 border-dashed rounded-lg"
                style={{
                  borderColor: isDragging ? '#A78BFA' : '#8B70F7',
                  background: isDragging 
                    ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(139, 112, 247, 0.15))' 
                    : 'linear-gradient(135deg, rgba(167, 139, 250, 0.10), rgba(139, 112, 247, 0.10))',
                  boxShadow: isDragging 
                    ? '0 0 40px rgba(167, 139, 250, 0.6), inset 0 0 30px rgba(167, 139, 250, 0.2)' 
                    : '0 0 25px rgba(139, 112, 247, 0.4), inset 0 0 20px rgba(139, 112, 247, 0.1)',
                }}
              />
              <div 
                className="border-4 border-dashed rounded-lg"
                style={{
                  borderColor: isDragging ? '#A78BFA' : '#8B70F7',
                  background: isDragging 
                    ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(139, 112, 247, 0.15))' 
                    : 'linear-gradient(135deg, rgba(167, 139, 250, 0.10), rgba(139, 112, 247, 0.10))',
                  boxShadow: isDragging 
                    ? '0 0 40px rgba(167, 139, 250, 0.6), inset 0 0 30px rgba(167, 139, 250, 0.2)' 
                    : '0 0 25px rgba(139, 112, 247, 0.4), inset 0 0 20px rgba(139, 112, 247, 0.1)',
                }}
              />
            </div>
          )}
        </div>
      )}

        {/* Content Area */}
        <div
          className={`w-full h-full px-16 py-4 transition-all duration-200 relative z-20 ${
            isSelected 
              ? 'opacity-60' 
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
    </div>
  );
};
