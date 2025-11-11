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
  const pageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
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
  }, [isDraggingDivider, layoutStyle, columnWidths]);

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

  // Auto-show on hover near top/bottom
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!pageRef.current) return;
      
      const pageElement = pageRef.current.closest('.page-card');
      if (!pageElement) return;
      
      const rect = pageElement.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Check if mouse is within the page bounds (not just Y, but X too)
      const isInPageBounds = 
        mouseX >= rect.left && 
        mouseX <= rect.right && 
        mouseY >= rect.top && 
        mouseY <= rect.bottom;
      
      if (!isInPageBounds) {
        setIsHovered(false);
        return;
      }
      
      const relativeY = mouseY - rect.top;
      const hoverThreshold = 100; // Show when within 100px of top/bottom
      
      if (type === 'header') {
        setIsHovered(relativeY < hoverThreshold);
      } else {
        setIsHovered(relativeY > rect.height - hoverThreshold);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [type]);

  return (
    <div 
      ref={pageRef}
      className="relative group w-full"
    >
      {/* Always-visible hover target - this ensures the area is always interactive */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none"
        style={{ background: 'rgba(139, 112, 247, 0.02)' }}
      />
      {/* Apply Button - shown when selected */}
      {isSelected && (
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 z-50 animate-fade-in transition-all duration-300"
          style={{
            top: type === 'header' ? `${height + 10}px` : '-50px',
          }}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
            className="bg-gradient-to-r from-[#8B70F7] to-[#A78BFA] hover:from-[#7C5FE6] hover:to-[#9670E6] text-white shadow-lg shadow-purple-500/50 px-6 py-2 transition-all duration-200"
          >
            Apply
          </Button>
        </div>
      )}

      {/* Drag Handle - shown when selected */}
      {isSelected && (
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 z-50 cursor-ns-resize animate-fade-in"
          style={{
            [type === 'header' ? 'top' : 'bottom']: type === 'header' ? `${height - 10}px` : `${height - 10}px`,
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="bg-gradient-to-r from-[#8B70F7] to-[#A78BFA] text-white px-4 py-1.5 rounded-full shadow-lg shadow-purple-500/50 text-xs font-medium flex items-center gap-2 hover:shadow-purple-500/70 transition-all duration-200">
            <span>⬍</span>
            <span>Drag to Position</span>
            <span>⬍</span>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={`w-full ${animationClass} absolute left-0 right-0`}
        style={{ 
          height: `${height}px`,
          cursor: isSelected ? 'ns-resize' : 'default',
          // Position from top for header, from bottom for footer
          ...(type === 'header' ? { top: `${position}px` } : { bottom: `${position}px` }),
          zIndex: isSelected ? 30 : 20,
          transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={onSelect}
      >
        {/* Column Guide Overlays - ONLY visible on hover or when selected */}
        <div className={`absolute inset-0 z-10 pointer-events-none transition-all duration-500 ease-out ${
          isSelected || isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
            {/* Helper text */}
            {!isSelected && (
              <div 
                className="absolute left-1/2 transform -translate-x-1/2 z-40 text-xs text-purple-600 font-medium bg-white/90 px-3 py-1 rounded-full shadow-lg transition-all duration-300"
                style={{
                  top: type === 'header' ? '-35px' : `${height + 10}px`,
                  opacity: isDragging ? 1 : 0,
                }}
              >
                {type === 'header' ? 'Drag down to position header' : 'Drag up to position footer'}
              </div>
            )}

            {/* Single Column Layout */}
            {layoutStyle === 'single' && (
              <div className="absolute inset-x-8 inset-y-0 transition-all duration-500 ease-out">
                <div 
                  className="w-full h-full border-[3px] border-solid relative transition-all duration-300 ease-out"
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
              <div className="absolute inset-x-8 inset-y-0 transition-all duration-500 ease-out">
                <div 
                  className="w-full h-full border-[3px] border-solid relative transition-all duration-300 ease-out"
                  style={{
                    borderColor: isDragging || isDraggingDivider !== null ? '#A78BFA' : '#8B70F7',
                    background: isDragging || isDraggingDivider !== null
                      ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(139, 112, 247, 0.15))' 
                      : 'linear-gradient(135deg, rgba(167, 139, 250, 0.10), rgba(139, 112, 247, 0.10))',
                    boxShadow: isDragging || isDraggingDivider !== null
                      ? '0 0 40px rgba(167, 139, 250, 0.6), inset 0 0 30px rgba(167, 139, 250, 0.2)' 
                      : '0 0 25px rgba(139, 112, 247, 0.4), inset 0 0 20px rgba(139, 112, 247, 0.1)',
                  }}
                >
                  {/* Vertical dividing line with draggable handle */}
                  <div 
                    className="absolute top-0 bottom-0 transform -translate-x-1/2 group"
                    style={{
                      left: `${columnWidths[0]}%`,
                      width: '3px',
                      background: isDraggingDivider === 0 ? '#A78BFA' : '#8B70F7',
                      cursor: 'ew-resize',
                      pointerEvents: 'auto',
                      transition: isDraggingDivider === 0 ? 'none' : 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseDown={(e) => handleDividerMouseDown(0, e)}
                  >
                    {/* Draggable handle indicator */}
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
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
              <div className="absolute inset-x-8 inset-y-0 transition-all duration-500 ease-out">
                <div 
                  className="w-full h-full border-[3px] border-solid relative transition-all duration-300 ease-out"
                  style={{
                    borderColor: isDragging || isDraggingDivider !== null ? '#A78BFA' : '#8B70F7',
                    background: isDragging || isDraggingDivider !== null
                      ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(139, 112, 247, 0.15))' 
                      : 'linear-gradient(135deg, rgba(167, 139, 250, 0.10), rgba(139, 112, 247, 0.10))',
                    boxShadow: isDragging || isDraggingDivider !== null
                      ? '0 0 40px rgba(167, 139, 250, 0.6), inset 0 0 30px rgba(167, 139, 250, 0.2)' 
                      : '0 0 25px rgba(139, 112, 247, 0.4), inset 0 0 20px rgba(139, 112, 247, 0.1)',
                  }}
                >
                  {/* First vertical line with draggable handle */}
                  <div 
                    className="absolute top-0 bottom-0 transform -translate-x-1/2 group"
                    style={{
                      left: `${columnWidths[0]}%`,
                      width: '3px',
                      background: isDraggingDivider === 0 ? '#A78BFA' : '#8B70F7',
                      cursor: 'ew-resize',
                      pointerEvents: 'auto',
                      transition: isDraggingDivider === 0 ? 'none' : 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseDown={(e) => handleDividerMouseDown(0, e)}
                  >
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                      style={{
                        boxShadow: '0 0 15px rgba(139, 112, 247, 0.6)',
                      }}
                    >
                      <div className="text-white text-xs font-bold">⬌</div>
                    </div>
                  </div>
                  
                  {/* Second vertical line with draggable handle */}
                  <div 
                    className="absolute top-0 bottom-0 transform -translate-x-1/2 group"
                    style={{
                      left: `${columnWidths[1]}%`,
                      width: '3px',
                      background: isDraggingDivider === 1 ? '#A78BFA' : '#8B70F7',
                      cursor: 'ew-resize',
                      pointerEvents: 'auto',
                      transition: isDraggingDivider === 1 ? 'none' : 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseDown={(e) => handleDividerMouseDown(1, e)}
                  >
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
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

        {/* Content Area - Always accessible for typing */}
        <div className="w-full h-full px-8 py-4 relative z-30 transition-all duration-300 ease-out">
        {shouldShowPageNumber && (
          <div 
            className={`absolute inset-x-8 inset-y-4 text-sm text-foreground pointer-events-none z-40 flex items-center ${
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
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            className="w-full h-full min-h-[40px] outline-none text-sm text-foreground cursor-text relative z-50 hover:bg-purple-50/20 transition-all duration-300 ease-out rounded"
            style={{ 
              padding: '8px',
            }}
          >
            {localContent || ''}
          </div>
        )}

        {layoutStyle === 'two' && (
          <div className="flex gap-0 h-full relative z-50">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('left', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="outline-none text-sm text-foreground cursor-text text-left pr-3 hover:bg-purple-50/20 rounded-l"
              style={{ 
                padding: '12px',
                width: `${columnWidths[0]}%`,
                transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {localContent?.left || ''}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('right', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="outline-none text-sm text-foreground cursor-text text-right pl-3 hover:bg-purple-50/20 rounded-r"
              style={{ 
                padding: '12px',
                width: `${100 - columnWidths[0]}%`,
                transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {localContent?.right || ''}
            </div>
          </div>
        )}

        {layoutStyle === 'three' && (
          <div className="flex gap-0 h-full relative z-50">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('left', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="outline-none text-sm text-foreground cursor-text text-left pr-2 hover:bg-purple-50/20 rounded-l"
              style={{ 
                padding: '12px',
                width: `${columnWidths[0]}%`,
                transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {localContent?.left || ''}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('center', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="outline-none text-sm text-foreground cursor-text text-center px-2 hover:bg-purple-50/20"
              style={{ 
                padding: '12px',
                width: `${columnWidths[1] - columnWidths[0]}%`,
                transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {localContent?.center || ''}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('right', e.currentTarget.textContent || '')}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="outline-none text-sm text-foreground cursor-text text-right pl-2 hover:bg-purple-50/20 rounded-r"
              style={{ 
                padding: '12px',
                width: `${100 - columnWidths[1]}%`,
                transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
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
