import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';

interface EditableHeaderFooterProps {
  type: 'header' | 'footer';
  layoutStyle: 'single' | 'two' | 'three';
  content: any;
  height: number;
  position: number; // NEW: vertical offset from top (header) or bottom (footer)
  onHeightChange: (height: number) => void;
  onPositionChange: (position: number) => void; // NEW: callback for position updates
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
  position, // NEW
  onHeightChange,
  onPositionChange, // NEW
  onContentChange,
  isSelected,
  onSelect,
  onDeselect,
  onApply,
}: EditableHeaderFooterProps) => {
  const [localContent, setLocalContent] = useState(content || getDefaultContent(layoutStyle));
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState(position); // CHANGED from dragStartHeight
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
    setDragStartPosition(position); // CHANGED from setDragStartHeight(height)
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate delta based on drag direction
      const deltaY = e.clientY - dragStartY;
      
      // Calculate new position
      let newPosition = dragStartPosition + deltaY;
      
      // Constrain position (0 = top/bottom edge, 300 = max offset)
      newPosition = Math.max(0, Math.min(300, newPosition));
      
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
  }, [isDragging, dragStartY, dragStartPosition, onPositionChange]);

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
        className={`w-full transition-all duration-300 ${animationClass} absolute left-0 right-0`}
        style={{ 
          height: `${height}px`,
          cursor: isSelected ? 'ns-resize' : 'pointer',
          // Position from top for header, from bottom for footer
          ...(type === 'header' ? { top: `${position}px` } : { bottom: `${position}px` }),
          zIndex: isSelected ? 30 : 10,
        }}
        onClick={onSelect}
        onMouseDown={handleMouseDown}
      >
        {/* Column Guide Overlays - match reference image style */}
        {isSelected && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Helper text */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 z-40 text-xs text-purple-600 font-medium bg-white/90 px-3 py-1 rounded-full shadow-lg animate-fade-in"
              style={{
                top: type === 'header' ? '-35px' : `${height + 10}px`,
              }}
            >
              {isDragging ? 'Dragging...' : 'Click and drag to reposition'}
            </div>

            {/* Single Column Layout */}
            {layoutStyle === 'single' && (
              <div className="absolute inset-x-8 inset-y-0 animate-fade-in">
                <div 
                  className="w-full h-full border-[3px] border-solid relative transition-all duration-200"
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
            
            {/* Two Column Layout */}
            {layoutStyle === 'two' && (
              <div className="absolute inset-x-8 inset-y-0 animate-fade-in">
                <div 
                  className="w-full h-full border-[3px] border-solid relative transition-all duration-200"
                  style={{
                    borderColor: isDragging ? '#A78BFA' : '#8B70F7',
                    background: isDragging 
                      ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(139, 112, 247, 0.15))' 
                      : 'linear-gradient(135deg, rgba(167, 139, 250, 0.10), rgba(139, 112, 247, 0.10))',
                    boxShadow: isDragging 
                      ? '0 0 40px rgba(167, 139, 250, 0.6), inset 0 0 30px rgba(167, 139, 250, 0.2)' 
                      : '0 0 25px rgba(139, 112, 247, 0.4), inset 0 0 20px rgba(139, 112, 247, 0.1)',
                  }}
                >
                  {/* Vertical dividing line in middle */}
                  <div 
                    className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 transition-all duration-200"
                    style={{
                      width: '3px',
                      background: isDragging ? '#A78BFA' : '#8B70F7',
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Three Column Layout */}
            {layoutStyle === 'three' && (
              <div className="absolute inset-x-8 inset-y-0 animate-fade-in">
                <div 
                  className="w-full h-full border-[3px] border-solid relative transition-all duration-200"
                  style={{
                    borderColor: isDragging ? '#A78BFA' : '#8B70F7',
                    background: isDragging 
                      ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(139, 112, 247, 0.15))' 
                      : 'linear-gradient(135deg, rgba(167, 139, 250, 0.10), rgba(139, 112, 247, 0.10))',
                    boxShadow: isDragging 
                      ? '0 0 40px rgba(167, 139, 250, 0.6), inset 0 0 30px rgba(167, 139, 250, 0.2)' 
                      : '0 0 25px rgba(139, 112, 247, 0.4), inset 0 0 20px rgba(139, 112, 247, 0.1)',
                  }}
                >
                  {/* First vertical line at 1/3 */}
                  <div 
                    className="absolute top-0 bottom-0 left-1/3 transform -translate-x-1/2 transition-all duration-200"
                    style={{
                      width: '3px',
                      background: isDragging ? '#A78BFA' : '#8B70F7',
                    }}
                  />
                  {/* Second vertical line at 2/3 */}
                  <div 
                    className="absolute top-0 bottom-0 left-2/3 transform -translate-x-1/2 transition-all duration-200"
                    style={{
                      width: '3px',
                      background: isDragging ? '#A78BFA' : '#8B70F7',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Area */}
        <div
          className={`w-full h-full px-8 py-4 transition-all duration-200 relative z-20 ${
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
          <div className="grid grid-cols-2 gap-0 h-full">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('left', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-left border-r-2 border-purple-200/50 pr-3"
              style={{ 
                padding: '12px',
              }}
            >
              {localContent?.left || 'Left column...'}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('right', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-right pl-3"
              style={{ 
                padding: '12px',
              }}
            >
              {localContent?.right || 'Right column...'}
            </div>
          </div>
        )}

        {layoutStyle === 'three' && (
          <div className="grid grid-cols-3 gap-0 h-full">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('left', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-left border-r-2 border-purple-200/50 pr-2"
              style={{ 
                padding: '12px',
              }}
            >
              {localContent?.left || 'Left...'}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('center', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-center border-r-2 border-purple-200/50 px-2"
              style={{ 
                padding: '12px',
              }}
            >
              {localContent?.center || 'Center...'}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('right', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-right pl-2"
              style={{ 
                padding: '12px',
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
