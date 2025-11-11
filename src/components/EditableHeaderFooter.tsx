import { useState, useEffect } from 'react';

interface EditableHeaderFooterProps {
  type: 'header' | 'footer';
  layoutStyle: 'single' | 'two' | 'three';
  content: any;
  height: number;
  onHeightChange: (height: number) => void;
  onContentChange: (content: any) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const EditableHeaderFooter = ({
  type,
  layoutStyle,
  content,
  height,
  onContentChange,
  isSelected,
  onSelect,
}: EditableHeaderFooterProps) => {
  const [localContent, setLocalContent] = useState(content || getDefaultContent(layoutStyle));

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
        return { row1: '', row2: '' };
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

  const animationClass = type === 'header' ? 'animate-slide-down' : 'animate-slide-up';

  return (
    <div
      className={`w-full transition-all duration-200 ${animationClass}`}
      style={{ 
        minHeight: `${height}px`,
        background: isSelected ? 'rgba(139, 112, 247, 0.05)' : 'transparent',
      }}
      onClick={onSelect}
    >
      <div
        className={`w-full h-full px-16 py-4 ${
          isSelected ? 'border-2 border-dashed border-[rgba(139,112,247,0.3)] outline outline-2 outline-[#8B70F7]' : ''
        }`}
      >
        {layoutStyle === 'single' && (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleContentUpdate('single', e.currentTarget.textContent || '')}
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
          <div className="flex flex-col gap-2 h-full">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('row1', e.currentTarget.textContent || '')}
              className="flex-1 outline-none text-sm text-gray-700 cursor-text"
              style={{ 
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              {localContent?.row1 || 'Row 1...'}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('row2', e.currentTarget.textContent || '')}
              className="flex-1 outline-none text-sm text-gray-700 cursor-text"
              style={{ 
                padding: '8px',
                borderRadius: '4px',
              }}
            >
              {localContent?.row2 || 'Row 2...'}
            </div>
          </div>
        )}

        {layoutStyle === 'three' && (
          <div className="grid grid-cols-3 gap-4 h-full">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('left', e.currentTarget.textContent || '')}
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
