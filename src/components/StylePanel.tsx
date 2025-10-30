import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus } from 'lucide-react';
import { TextStyle, defaultStyles } from '@/types/styles';
import { StyleDesigner } from './StyleDesigner';

interface StylePanelProps {
  editor?: any;
  isOpen?: boolean;
  onClose?: () => void;
}

export const StylePanel = ({
  editor,
  isOpen = false,
  onClose
}: StylePanelProps) => {
  const [styles, setStyles] = useState<TextStyle[]>(defaultStyles);
  const [selectedStyle, setSelectedStyle] = useState<TextStyle | null>(null);
  const handleStyleClick = (style: TextStyle) => {
    setSelectedStyle(style);
    if (editor) {
      applyStyleToEditor(style);
    }
  };

  const applyStyleToEditor = (style: TextStyle) => {
    if (!editor) return;
    const chain = editor.chain().focus();
    if (style.font) chain.setFontFamily(style.font);
    if (style.size) chain.setFontSize(`${style.size}pt`);
    if (style.color) chain.setColor(style.color);
    if (style.weight) {
      chain.setFontWeight(style.weight.toString());
      if (style.weight >= 600) chain.setBold();
      else chain.unsetBold();
    }
    if (style.italic) chain.setItalic();
    else chain.unsetItalic();
    chain.run();
  };

  const handleSaveStyle = (updates: Partial<TextStyle>) => {
    if (!selectedStyle) return;
    const updatedStyle = { ...selectedStyle, ...updates };
    setStyles(styles.map(s => s.id === selectedStyle.id ? updatedStyle : s));
    setSelectedStyle(updatedStyle);
    applyStyleToEditor(updatedStyle);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Styles Drawer */}
      <div className="fixed top-3 right-3 bottom-24 w-[360px] bg-[#F7F1FF] border border-[#E6D8FF] rounded-[14px] shadow-[0_12px_28px_rgba(96,48,200,0.14)] p-3 flex flex-col z-50">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 font-extrabold text-[#22163F]">
            <span>🎨</span>
            <span>Styles</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              className="h-8 px-3 rounded-lg bg-gradient-to-b from-[#A77CFF] to-[#7A49FF] hover:opacity-90 text-white border-0 text-sm font-semibold"
              size="sm"
            >
              + Add Style
            </Button>
            <Button 
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-[#E6D8FF]"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Styles List */}
        <ScrollArea className="flex-1 pr-1">
          <div className="flex flex-col gap-2.5">
            {styles.map(style => (
              <button
                key={style.id}
                onClick={() => handleStyleClick(style)}
                className="grid grid-cols-[1fr_auto] gap-2 items-center p-3 bg-white border border-[#E6D8FF] rounded-xl cursor-pointer hover:border-[#A77CFF] transition-colors text-left"
              >
                <div className="flex flex-col gap-1">
                  <div className="font-bold text-[#22163F]">{style.name}</div>
                  <div 
                    className="text-[13px] text-[#5A4A86]"
                    style={{
                      fontFamily: style.font,
                      fontWeight: style.weight,
                      fontStyle: style.italic ? 'italic' : 'normal',
                      color: style.color
                    }}
                  >
                    The quick brown fox
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#EEE6FF] text-[#5C37E6] rounded-full font-semibold text-xs">
                  {style.tag || 'style'}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Style Designer Panel */}
      {selectedStyle && (
        <StyleDesigner
          style={selectedStyle}
          onClose={() => setSelectedStyle(null)}
          onSave={handleSaveStyle}
        />
      )}
    </>
  );
};