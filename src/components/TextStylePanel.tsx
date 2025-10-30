import { useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown, Info, Indent, Outdent } from 'lucide-react';

interface TextStylePanelProps {
  editor?: any;
}

export const TextStylePanel = ({ editor }: TextStylePanelProps) => {
  const [fontSize, setFontSize] = useState('12');
  const [fontFamily, setFontFamily] = useState('Inter');

  const handleFormat = (command: string) => {
    if (!editor) return;
    
    switch (command) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline().run();
        break;
      case 'strike':
        editor.chain().focus().toggleStrike().run();
        break;
    }
  };

  const handleAlign = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    if (!editor) return;
    editor.chain().focus().setTextAlign(alignment).run();
  };

  const handleIndent = () => {
    if (!editor) return;
    // Increase indentation
    const currentIndent = editor.getAttributes('paragraph').textIndent || '0px';
    const currentValue = parseInt(currentIndent) || 0;
    editor.chain().focus().updateAttributes('paragraph', { textIndent: `${currentValue + 30}px` }).run();
  };

  const handleOutdent = () => {
    if (!editor) return;
    // Decrease indentation
    const currentIndent = editor.getAttributes('paragraph').textIndent || '0px';
    const currentValue = parseInt(currentIndent) || 0;
    if (currentValue > 0) {
      editor.chain().focus().updateAttributes('paragraph', { textIndent: `${Math.max(0, currentValue - 30)}px` }).run();
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    if (editor) {
      editor.chain().focus().setFontSize(`${size}pt`).run();
    }
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    setFontFamily(font);
    if (editor) {
      editor.chain().focus().setFontFamily(font).run();
    }
  };

  return (
    <aside className="w-[340px] bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] p-3 grid grid-rows-[auto_auto_1fr] gap-0">
      {/* Title */}
      <div className="text-base font-extrabold text-[hsl(var(--ink))] mb-2">Text Style</div>

      {/* Font Box */}
      <div className="bg-gradient-to-b from-[#EDE3FF] to-[#E6DBFF] border border-[hsl(var(--stroke))] rounded-xl p-2.5 mb-2.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[hsl(var(--ink))]">Font</span>
          <button className="w-9 h-9 p-0 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors">
            <ChevronDown className="w-4 h-4 text-[hsl(var(--ink-weak))]" />
          </button>
        </div>

        {/* Font Family and Size */}
        <div className="flex gap-2 mb-2">
          <select 
            value={fontFamily}
            onChange={handleFontFamilyChange}
            className="flex-1 h-9 px-2.5 py-2 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white text-sm"
          >
            <option value="Inter">Inter</option>
            <option value="Georgia">Georgia</option>
            <option value="Monaco">Monaco</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
          <div className="w-16 h-9 px-2.5 py-2 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white text-center text-sm flex items-center justify-center">
            {fontSize}
          </div>
        </div>

        {/* Format Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleFormat('bold')}
            className="w-9 h-9 p-0 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white hover:bg-[hsl(var(--panel-2))] transition-colors text-sm font-bold"
          >
            B
          </button>
          <button
            onClick={() => handleFormat('italic')}
            className="w-9 h-9 p-0 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white hover:bg-[hsl(var(--panel-2))] transition-colors text-sm italic"
          >
            I
          </button>
          <button
            onClick={() => handleFormat('underline')}
            className="w-9 h-9 p-0 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white hover:bg-[hsl(var(--panel-2))] transition-colors text-sm underline"
          >
            U
          </button>
          <button
            onClick={() => handleFormat('strike')}
            className="w-9 h-9 p-0 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white hover:bg-[hsl(var(--panel-2))] transition-colors text-sm line-through"
          >
            S
          </button>
          <button
            className="w-9 h-9 p-0 border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] bg-white hover:bg-[hsl(var(--panel-2))] transition-colors text-xs font-semibold"
            title="Capitalization"
          >
            A↑
          </button>
        </div>
      </div>

      {/* Text Alignment Section */}
      <div className="bg-gradient-to-b from-[#EDE3FF] to-[#E6DBFF] border border-[hsl(var(--stroke))] rounded-xl p-2.5 mb-1.5">
        <div className="text-sm font-extrabold mb-1.5 text-[hsl(var(--ink))]">Text</div>
        <div className="bg-gradient-to-b from-[#C9B5FF] to-[#A382FF] rounded-xl p-2">
          {/* First row */}
          <div className="grid grid-cols-4 gap-1.5 mb-1.5">
            <button
              onClick={() => handleAlign('left')}
              className="h-9 p-0 text-white hover:bg-white/20 border-0 rounded-[var(--r-sm)] text-xs font-semibold transition-colors"
            >
              N
            </button>
            <button
              onClick={() => handleAlign('left')}
              className="h-9 p-0 text-white hover:bg-white/20 border-0 rounded-[var(--r-sm)] transition-colors grid place-items-center"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAlign('center')}
              className="h-9 p-0 text-white hover:bg-white/20 border-0 rounded-[var(--r-sm)] transition-colors grid place-items-center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAlign('right')}
              className="h-9 p-0 text-white hover:bg-white/20 border-0 rounded-[var(--r-sm)] transition-colors grid place-items-center"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Second row */}
          <div className="grid grid-cols-2 gap-1.5 mb-1.5">
            <button
              className="h-7 p-0 text-white hover:bg-white/20 border-0 rounded-[var(--r-sm)] text-xs transition-colors"
            >
              ≡
            </button>
            <button
              onClick={() => handleAlign('justify')}
              className="h-7 p-0 text-white hover:bg-white/20 border-0 rounded-[var(--r-sm)] transition-colors grid place-items-center"
            >
              <AlignJustify className="w-3 h-3" />
            </button>
          </div>

          {/* Third row - Indent Controls */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleOutdent}
              className="h-7 p-0 text-white hover:bg-white/20 border-0 rounded-[var(--r-sm)] transition-colors grid place-items-center"
              title="Decrease indent"
            >
              <Outdent className="w-3 h-3" />
            </button>
            <button
              onClick={handleIndent}
              className="h-7 p-0 text-white hover:bg-white/20 border-0 rounded-[var(--r-sm)] transition-colors grid place-items-center"
              title="Increase indent"
            >
              <Indent className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Lists Panel */}
      <div className="bg-gradient-to-b from-[#CDBAFF] to-[#AC8CFF] rounded-xl p-2">
        {/* None option */}
        <div className="grid grid-cols-[1fr_auto] items-center bg-white border border-[hsl(var(--stroke))] px-3 py-2.5 rounded-[var(--r-sm)] mb-2">
          <div className="text-sm font-medium text-[hsl(var(--ink))]">None</div>
          <div className="w-[22px] h-[22px] grid place-items-center bg-[#EFE8FF] rounded-full">
            <Info className="w-3.5 h-3.5 text-[#6C3AFF]" />
          </div>
        </div>

        {/* Bullet */}
        <div className="grid grid-cols-[1fr_auto] items-center bg-white border border-[hsl(var(--stroke))] px-3 py-2.5 rounded-[var(--r-sm)] mb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--ink))]">
            <span className="text-lg">•</span>
            <span>Bullet</span>
          </div>
          <div className="w-[22px] h-[22px] grid place-items-center bg-[#EFE8FF] rounded-full">
            <Info className="w-3.5 h-3.5 text-[#6C3AFF]" />
          </div>
        </div>

        {/* Image */}
        <div className="grid grid-cols-[1fr_auto] items-center bg-white border border-[hsl(var(--stroke))] px-3 py-2.5 rounded-[var(--r-sm)] mb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--ink))]">
            <span className="text-sm font-bold">▣</span>
            <span>Image</span>
          </div>
          <div className="w-[22px] h-[22px] grid place-items-center bg-[#EFE8FF] rounded-full">
            <Info className="w-3.5 h-3.5 text-[#6C3AFF]" />
          </div>
        </div>

        {/* Lettered */}
        <div className="grid grid-cols-[1fr_auto] items-center bg-gradient-to-b from-[#B9A1FF] to-[#8F6BFF] text-white px-3 py-2.5 rounded-[var(--r-sm)] mb-2 border-0">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-sm font-bold">A.</span>
            <span>Lettered</span>
          </div>
          <div className="w-[22px] h-[22px] grid place-items-center bg-[#EFE8FF] rounded-full">
            <Info className="w-3.5 h-3.5 text-[#6C3AFF]" />
          </div>
        </div>

        {/* Numbered */}
        <div className="grid grid-cols-[1fr_auto] items-center bg-gradient-to-b from-[#B9A1FF] to-[#8F6BFF] text-white px-3 py-2.5 rounded-[var(--r-sm)] border-0">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-sm font-bold">1.</span>
            <span>Numbered</span>
          </div>
          <div className="w-[22px] h-[22px] grid place-items-center bg-[#EFE8FF] rounded-full">
            <Info className="w-3.5 h-3.5 text-[#6C3AFF]" />
          </div>
        </div>
      </div>
    </aside>
  );
};
