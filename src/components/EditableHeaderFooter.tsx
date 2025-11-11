import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';

interface EditableHeaderFooterProps {
  type: 'header' | 'footer';
  layoutStyle: 'single' | 'two' | 'three';
  content: any;
  height: number;
  position: number;
  onHeightChange: (height: number) => void;
  onPositionChange: (position: number) => void;
  onContentChange: (content: any) => void;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  onApply: () => void;
  pageNumber?: number;
  showPageNumber?: boolean;
  pageNumberSettings?: {
    position: 'left' | 'center' | 'right';
    format: 'page-x' | 'x' | 'x-of-total';
    location: 'header' | 'footer';
  };
  totalPages?: number;
}

export const EditableHeaderFooter = ({
  type,
  layoutStyle,
  content,
  height,
  position,
  onHeightChange,
  onPositionChange,
  onContentChange,
  isSelected,
  onSelect,
  onDeselect,
  onApply,
  pageNumber = 1,
  showPageNumber = false,
  pageNumberSettings = { position: 'right', format: 'page-x', location: 'footer' },
  totalPages = 1,
}: EditableHeaderFooterProps) => {
  const [localContent, setLocalContent] = useState(content || getDefaultContent(layoutStyle));
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState(position);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Column width state (percentages)
  const [columnWidths, setColumnWidths] = useState<number[]>(
    layoutStyle === 'two' ? [50] : layoutStyle === 'three' ? [33.33, 66.66] : []
  );
  const [isDraggingDivider, setIsDraggingDivider] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartWidths, setDragStartWidths] = useState<number[]>([]);

  useEffect(() => {
    if (!content) {
      setLocalContent(getDefaultContent(layoutStyle));
    } else {
      setLocalContent(content);
    }
    // Reset column widths when layout changes
    setColumnWidths(
      layoutStyle === 'two' ? [50] : layoutStyle === 'three' ? [33.33, 66.66] : []
    );
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

  // Vertical drag (position adjustment)
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragStartY;
      let newPosition = dragStartPosition + deltaY;
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

  // Horizontal drag (column width adjustment)
  useEffect(() => {
    if (isDraggingDivider === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const relativeX = e.clientX - containerRect.left;
      const percentage = (relativeX / containerWidth) * 100;

      setColumnWidths((prevWidths) => {
        const newWidths = [...prevWidths];
        
        if (layoutStyle === 'two') {
          // Constrain between 20% and 80%
          newWidths[0] = Math.max(20, Math.min(80, percentage));
        } else if (layoutStyle === 'three') {
          if (isDraggingDivider === 0) {
            // First divider: constrain between 15% and (second divider - 15%)
            const maxFirst = newWidths[1] - 15;
            newWidths[0] = Math.max(15, Math.min(maxFirst, percentage));
          } else if (isDraggingDivider === 1) {
            // Second divider: constrain between (first divider + 15%) and 85%
            const minSecond = newWidths[0] + 15;
            newWidths[1] = Math.max(minSecond, Math.min(85, percentage));
          }
        }
        
        return newWidths;
      });
    };

    const handleMouseUp = () => {
      setIsDraggingDivider(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingDivider, layoutStyle]);

  const handleDividerMouseDown = (dividerIndex: number, e: React.MouseEvent) => {
    if (!isSelected) return;
    e.stopPropagation();
    setIsDraggingDivider(dividerIndex);
    setDragStartX(e.clientX);
    setDragStartWidths([...columnWidths]);
  };

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

  const getPageNumberText = () => {
    const { format } = pageNumberSettings;
    switch (format) {
      case 'page-x':
        return `Page ${pageNumber}`;
      case 'x':
        return `${pageNumber}`;
      case 'x-of-total':
        return `${pageNumber} of ${totalPages}`;
      default:
        return `${pageNumber}`;
    }
  };

  const getPageNumberAlignment = () => {
    const { position } = pageNumberSettings;
    return position === 'center' ? 'center' : position === 'left' ? 'left' : 'right';
  };

  const shouldShowPageNumber = showPageNumber && pageNumberSettings.location === type;
  const hasContent = layoutStyle === 'single' ? !!localContent : 
    layoutStyle === 'two' ? !!(localContent?.left || localContent?.right) :
    !!(localContent?.left || localContent?.center || localContent?.right);
  
  // Always visible if: selected, has page number, or has content
  // Otherwise only visible on hover
  const isAlwaysVisible = isSelected || shouldShowPageNumber || hasContent;

  return (
    <div 
      className={`relative transition-opacity duration-200 group ${
        isAlwaysVisible ? 'opacity-100' : 'opacity-0 hover:opacity-100'
      }`}
    >
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
        {/* Column Guide Overlays - only visible on hover or when selected */}
        <div className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-200 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
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
                  {/* Vertical dividing line with draggable handle */}
                  <div 
                    className="absolute top-0 bottom-0 transform -translate-x-1/2 transition-all duration-200 group"
                    style={{
                      left: `${columnWidths[0]}%`,
                      width: '3px',
                      background: isDraggingDivider === 0 ? '#A78BFA' : '#8B70F7',
                      cursor: 'ew-resize',
                      pointerEvents: 'auto',
                    }}
                    onMouseDown={(e) => handleDividerMouseDown(0, e)}
                  >
                    {/* Draggable handle indicator */}
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      style={{
                        boxShadow: '0 0 15px rgba(139, 112, 247, 0.6)',
                      }}
                    >
                      <div className="text-white text-xs font-bold">⬌</div>
                    </div>
                  </div>
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
                  {/* First vertical line with draggable handle */}
                  <div 
                    className="absolute top-0 bottom-0 transform -translate-x-1/2 transition-all duration-200 group"
                    style={{
                      left: `${columnWidths[0]}%`,
                      width: '3px',
                      background: isDraggingDivider === 0 ? '#A78BFA' : '#8B70F7',
                      cursor: 'ew-resize',
                      pointerEvents: 'auto',
                    }}
                    onMouseDown={(e) => handleDividerMouseDown(0, e)}
                  >
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      style={{
                        boxShadow: '0 0 15px rgba(139, 112, 247, 0.6)',
                      }}
                    >
                      <div className="text-white text-xs font-bold">⬌</div>
                    </div>
                  </div>
                  
                  {/* Second vertical line with draggable handle */}
                  <div 
                    className="absolute top-0 bottom-0 transform -translate-x-1/2 transition-all duration-200 group"
                    style={{
                      left: `${columnWidths[1]}%`,
                      width: '3px',
                      background: isDraggingDivider === 1 ? '#A78BFA' : '#8B70F7',
                      cursor: 'ew-resize',
                      pointerEvents: 'auto',
                    }}
                    onMouseDown={(e) => handleDividerMouseDown(1, e)}
                  >
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      style={{
                        boxShadow: '0 0 15px rgba(139, 112, 247, 0.6)',
                      }}
                    >
                      <div className="text-white text-xs font-bold">⬌</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        {/* Content Area */}
        <div
          className={`w-full h-full px-8 py-4 transition-all duration-200 relative z-20 ${
            isSelected 
              ? 'opacity-60' 
              : ''
          }`}
        >
        {shouldShowPageNumber && (
          <div 
            className={`absolute inset-x-8 inset-y-4 text-sm text-muted-foreground pointer-events-none z-30 flex items-center ${
              getPageNumberAlignment() === 'left' ? 'justify-start' : 
              getPageNumberAlignment() === 'center' ? 'justify-center' : 
              'justify-end'
            }`}
          >
            {getPageNumberText()}
          </div>
        )}
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
            {localContent || ''}
          </div>
        )}

        {layoutStyle === 'two' && (
          <div className="flex gap-0 h-full">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('left', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-left border-r-2 border-purple-200/50 pr-3"
              style={{ 
                padding: '12px',
                width: `${columnWidths[0]}%`,
              }}
            >
              {localContent?.left || ''}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('right', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-right pl-3"
              style={{ 
                padding: '12px',
                width: `${100 - columnWidths[0]}%`,
              }}
            >
              {localContent?.right || ''}
            </div>
          </div>
        )}

        {layoutStyle === 'three' && (
          <div className="flex gap-0 h-full">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('left', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-left border-r-2 border-purple-200/50 pr-2"
              style={{ 
                padding: '12px',
                width: `${columnWidths[0]}%`,
              }}
            >
              {localContent?.left || ''}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('center', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-center border-r-2 border-purple-200/50 px-2"
              style={{ 
                padding: '12px',
                width: `${columnWidths[1] - columnWidths[0]}%`,
              }}
            >
              {localContent?.center || ''}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('right', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              className="outline-none text-sm text-gray-700 cursor-text text-right pl-2"
              style={{ 
                padding: '12px',
                width: `${100 - columnWidths[1]}%`,
              }}
            >
            {localContent?.right || ''}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};
