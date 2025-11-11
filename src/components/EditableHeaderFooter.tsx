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
        className={`w-full h-full px-16 py-4 transition-all duration-200 ${
          isSelected 
            ? 'border-2 border-dotted border-[rgba(139,112,247,0.5)] outline outline-2 outline-offset-2 outline-[#8B70F7] bg-[rgba(139,112,247,0.08)]' 
            : 'border-2 border-transparent'
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
          <div className="grid grid-cols-2 gap-4 h-full">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('left', e.currentTarget.textContent || '')}
              className="outline-none text-sm text-gray-700 cursor-text text-left"
              style={{ 
                padding: '8px',
                borderRadius: '4px',
                borderLeft: isSelected ? '2px dotted rgba(139, 112, 247, 0.4)' : 'none',
              }}
            >
              {localContent?.left || 'Left column...'}
            </div>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentUpdate('right', e.currentTarget.textContent || '')}
              className="outline-none text-sm text-gray-700 cursor-text text-right"
              style={{ 
                padding: '8px',
                borderRadius: '4px',
                borderRight: isSelected ? '2px dotted rgba(139, 112, 247, 0.4)' : 'none',
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
