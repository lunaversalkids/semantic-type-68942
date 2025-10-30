import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  Info
} from 'lucide-react';

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

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    if (editor) {
      editor.chain().focus().setFontSize(`${size}pt`).run();
    }
  };

  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
    if (editor) {
      editor.chain().focus().setFontFamily(font).run();
    }
  };

  return (
    <div className="w-[280px] bg-[#F7F5FF] border-l border-[#E6D8FF] p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="text-base font-semibold text-[#22163F]">Text Style</div>

      {/* Font Section */}
      <div className="bg-white rounded-xl p-3 border border-[#E6D8FF]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#22163F]">Font</span>
          <ChevronDown className="w-4 h-4 text-[#5A4A86]" />
        </div>

        {/* Font Family and Size */}
        <div className="flex gap-2 mb-3">
          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger className="flex-1 h-9 border-[#E6D8FF] bg-[#F7F5FF]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Monaco">Monaco</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
          <Input 
            type="number" 
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="w-16 h-9 border-[#E6D8FF] bg-[#F7F5FF] text-center"
          />
        </div>

        {/* Format Buttons */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat('bold')}
            className="h-9 w-9 p-0 text-[#7A49FF] hover:bg-[#F2ECFF]"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat('italic')}
            className="h-9 w-9 p-0 text-[#7A49FF] hover:bg-[#F2ECFF]"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat('underline')}
            className="h-9 w-9 p-0 text-[#7A49FF] hover:bg-[#F2ECFF]"
          >
            <Underline className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFormat('strike')}
            className="h-9 w-9 p-0 text-[#7A49FF] hover:bg-[#F2ECFF]"
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-[#7A49FF] hover:bg-[#F2ECFF]"
          >
            <Type className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Text Alignment Section */}
      <div className="bg-gradient-to-b from-[#9B6FFF] to-[#7A49FF] rounded-xl p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">Text</span>
          <div className="w-8 h-5 bg-black/30 rounded"></div>
        </div>

        {/* Alignment Buttons */}
        <div className="grid grid-cols-4 gap-1 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAlign('left')}
            className="h-9 p-0 text-white hover:bg-white/20 border-0"
          >
            <span className="text-xs font-semibold">N</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAlign('left')}
            className="h-9 p-0 text-white hover:bg-white/20 border-0"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAlign('center')}
            className="h-9 p-0 text-white hover:bg-white/20 border-0"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAlign('right')}
            className="h-9 p-0 text-white hover:bg-white/20 border-0"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 p-0 text-white hover:bg-white/20 border-0 text-xs"
          >
            ≡
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAlign('justify')}
            className="h-7 p-0 text-white hover:bg-white/20 border-0"
          >
            <AlignJustify className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* List Type Section */}
      <div className="bg-white rounded-xl border border-[#E6D8FF]">
        <Button
          variant="ghost"
          className="w-full h-11 justify-between px-4 text-[#22163F] hover:bg-[#F2ECFF] rounded-xl"
        >
          <span className="text-sm font-medium">None</span>
          <ChevronDown className="w-4 h-4 text-[#5A4A86]" />
        </Button>
      </div>

      {/* List Options */}
      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          className="w-full justify-between px-4 h-10 bg-white border border-[#E6D8FF] rounded-xl hover:bg-[#F2ECFF] text-[#22163F]"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">•</span>
            <span className="text-sm font-medium">Bullet</span>
          </div>
          <Info className="w-4 h-4 text-[#5A4A86]" />
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-between px-4 h-10 bg-white border border-[#E6D8FF] rounded-xl hover:bg-[#F2ECFF] text-[#22163F]"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">■</span>
            <span className="text-sm font-medium">Image</span>
          </div>
          <Info className="w-4 h-4 text-[#5A4A86]" />
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-between px-4 h-10 bg-gradient-to-b from-[#9B6FFF] to-[#7A49FF] rounded-xl hover:opacity-90 text-white border-0"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">A.</span>
            <span className="text-sm font-medium">Lettered</span>
          </div>
          <Info className="w-4 h-4 text-white" />
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-between px-4 h-10 bg-gradient-to-b from-[#9B6FFF] to-[#7A49FF] rounded-xl hover:opacity-90 text-white border-0"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">1.</span>
            <span className="text-sm font-medium">Numbered</span>
          </div>
          <Info className="w-4 h-4 text-white" />
        </Button>
      </div>
    </div>
  );
};
