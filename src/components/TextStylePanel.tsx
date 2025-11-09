import { useState } from 'react';
import { ChevronDown, ChevronLeft, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronRight, Indent, Outdent, Check, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import capitalizeIcon from '@/assets/capitalize-icon.jpg';
import baselineIcon from '@/assets/baseline-icon.jpg';
interface TextStylePanelProps {
  editor?: any;
}
export const TextStylePanel = ({
  editor
}: TextStylePanelProps) => {
  const [fontSize, setFontSize] = useState('12');
  const [fontFamily, setFontFamily] = useState('Graphik');
  const [selectedAlignment, setSelectedAlignment] = useState('harvard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFontOpen, setIsFontOpen] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [formattingMode, setFormattingMode] = useState('Normal');
  const formattingModes = ['Normal', 'Single Spacing', '1.15 Spacing', '1.5 Spacing', 'Double Spacing', '2.5 Spacing', 'Double Sentence', 'Indented', 'No Indent (Block)', 'Left-Aligned Header', 'Centered Header', 'Expanded Line', 'Justified', 'Hanging Indent'];
  const availableFonts = ['Graphik', 'Arial', 'Times New Roman', 'Georgia', 'Helvetica', 'Courier New', 'Verdana', 'Garamond', 'Palatino', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Impact', 'Lucida Console', 'Tahoma', 'Lucida Sans', 'Monaco', 'Gill Sans', 'Century Gothic', 'Franklin Gothic Medium', 'Cambria', 'Calibri', 'Consolas', 'Didot', 'Futura', 'Optima', 'Baskerville'];
  const handleFontChange = (font: string) => {
    setFontFamily(font);
    setIsFontOpen(false);
    if (editor) {
      editor.chain().focus().setFontFamily(font).run();
    }
  };
  const handleColorChange = (color: string) => {
    setTextColor(color);
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  };
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
    const currentIndent = editor.getAttributes('paragraph').textIndent || '0px';
    const currentValue = parseInt(currentIndent) || 0;
    editor.chain().focus().updateAttributes('paragraph', {
      textIndent: `${currentValue + 30}px`
    }).run();
  };
  const handleOutdent = () => {
    if (!editor) return;
    const currentIndent = editor.getAttributes('paragraph').textIndent || '0px';
    const currentValue = parseInt(currentIndent) || 0;
    if (currentValue > 0) {
      editor.chain().focus().updateAttributes('paragraph', {
        textIndent: `${Math.max(0, currentValue - 30)}px`
      }).run();
    }
  };

  const handleTab = () => {
    if (!editor) return;
    editor.chain().focus().insertContent('\t').run();
  };

  const handleFormattingMode = (mode: string) => {
    if (!editor) return;
    setFormattingMode(mode);
    switch (mode) {
      case 'Normal':
        // Standard single spacing with regular paragraph settings
        editor.chain().focus().setParagraphAttributes({
          textIndent: '0px',
          marginBottom: '0px',
          lineHeight: 'normal',
          paddingLeft: '0px'
        }).run();
        editor.chain().focus().setTextAlign('left').run();
        break;
      case 'Single Spacing':
        editor.chain().focus().setParagraphAttributes({
          lineHeight: '1',
          textIndent: '0px',
          marginBottom: '0px',
          paddingLeft: '0px'
        }).run();
        break;
      case '1.15 Spacing':
        editor.chain().focus().setParagraphAttributes({
          lineHeight: '1.15',
          textIndent: '0px',
          marginBottom: '0px',
          paddingLeft: '0px'
        }).run();
        break;
      case '1.5 Spacing':
        editor.chain().focus().setParagraphAttributes({
          lineHeight: '1.5',
          textIndent: '0px',
          marginBottom: '0px',
          paddingLeft: '0px'
        }).run();
        break;
      case 'Double Spacing':
        editor.chain().focus().setParagraphAttributes({
          lineHeight: '2',
          textIndent: '0px',
          marginBottom: '0px',
          paddingLeft: '0px'
        }).run();
        break;
      case '2.5 Spacing':
        editor.chain().focus().setParagraphAttributes({
          lineHeight: '2.5',
          textIndent: '0px',
          marginBottom: '0px',
          paddingLeft: '0px'
        }).run();
        break;
      case 'Double Sentence':
        // Extra spacing between paragraphs for sentence separation
        editor.chain().focus().setParagraphAttributes({
          textIndent: '0px',
          marginBottom: '1.5em',
          lineHeight: 'normal',
          paddingLeft: '0px'
        }).run();
        break;
      case 'Indented':
        // First line indent for each paragraph
        editor.chain().focus().setParagraphAttributes({
          textIndent: '2em',
          marginBottom: '0px',
          lineHeight: 'normal',
          paddingLeft: '0px'
        }).run();
        break;
      case 'No Indent (Block)':
        // No indentation, spacing between paragraphs
        editor.chain().focus().setParagraphAttributes({
          textIndent: '0px',
          marginBottom: '1em',
          lineHeight: 'normal',
          paddingLeft: '0px'
        }).run();
        break;
      case 'Left-Aligned Header':
        // Only affects headers - keeps them left-aligned
        ['heading', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(nodeType => {
          if (editor.isActive(nodeType)) {
            editor.chain().focus().setTextAlign('left').run();
          }
        });
        break;
      case 'Centered Header':
        // Only affects headers - centers them
        ['heading', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(nodeType => {
          if (editor.isActive(nodeType)) {
            editor.chain().focus().setTextAlign('center').run();
          }
        });
        break;
      case 'Expanded Line':
        // Increased line spacing for readability
        editor.chain().focus().setParagraphAttributes({
          lineHeight: '1.8',
          textIndent: '0px',
          paddingLeft: '0px'
        }).run();
        break;
      case 'Justified':
        // Even alignment on both margins
        editor.chain().focus().setTextAlign('justify').run();
        editor.chain().focus().setParagraphAttributes({
          textIndent: '0px',
          paddingLeft: '0px'
        }).run();
        break;
      case 'Hanging Indent':
        // First line starts left, subsequent lines indented (for citations)
        editor.chain().focus().setParagraphAttributes({
          textIndent: '-2em',
          paddingLeft: '2em',
          marginBottom: '0.5em',
          lineHeight: 'normal'
        }).run();
        break;
      default:
        break;
    }
  };
  const handleListType = (type: 'none' | 'bullet' | 'numbered' | 'lettered' | 'harvard' | 'dash' | 'note-taking' | 'image' | 'custom') => {
    if (!editor) return;
    setSelectedAlignment(type);
    switch (type) {
      case 'none':
        if (editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        } else if (editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        break;
      case 'bullet':
        if (editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        if (!editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        // Update to remove custom class
        editor.chain().focus().updateAttributes('bulletList', {
          class: null
        }).run();
        break;
      case 'numbered':
        if (editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        if (!editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        // Update to remove custom class
        editor.chain().focus().updateAttributes('orderedList', {
          class: null
        }).run();
        break;
      case 'lettered':
        if (editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        if (!editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        editor.chain().focus().updateAttributes('orderedList', {
          class: 'list-lettered'
        }).run();
        break;
      case 'image':
        if (editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        if (!editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        editor.chain().focus().updateAttributes('bulletList', {
          class: 'list-square'
        }).run();
        break;
      case 'harvard':
        if (editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        if (!editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        editor.chain().focus().updateAttributes('bulletList', {
          class: 'list-harvard'
        }).run();
        break;
      case 'dash':
        if (editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        if (!editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        editor.chain().focus().updateAttributes('bulletList', {
          class: 'list-dash'
        }).run();
        break;
      case 'note-taking':
        if (editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        if (!editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        editor.chain().focus().updateAttributes('bulletList', {
          class: 'list-note'
        }).run();
        break;
      case 'custom':
        if (editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        if (!editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        // Placeholder for custom icon functionality
        break;
      default:
        break;
    }
  };
  if (isCollapsed) {
    return <aside className="w-16 h-full bg-sidebar border-l border-sidebar-border flex flex-col items-center py-4">
        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-sidebar-accent mb-4" onClick={() => setIsCollapsed(false)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="writing-mode-vertical text-sm font-medium text-muted-foreground uppercase tracking-wide" style={{
        writingMode: 'vertical-rl'
      }}>
          Paragraph Mode
        </div>
      </aside>;
  }
  return <aside className="w-[340px] h-full bg-sidebar border-l border-sidebar-border flex flex-col overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-bold text-[#8B7AB8] uppercase tracking-wide">Paragraph Mode</h2>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-sidebar-accent" onClick={() => setIsCollapsed(true)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Formatting Mode Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-[hsl(var(--stroke))] hover:bg-gray-50 transition-colors">
            <span className="text-lg font-semibold text-[hsl(var(--ink))]">{formattingMode}</span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-lg" align="start">
          {formattingModes.map(mode => <DropdownMenuItem key={mode} onClick={() => handleFormattingMode(mode)} className={`px-4 py-2 cursor-pointer hover:bg-[#F5F0FF] transition-colors ${formattingMode === mode ? 'bg-[#E8DDFF] text-[#8B5CF6] font-medium' : 'text-[hsl(var(--ink))]'}`}>
              {mode}
              {formattingMode === mode && <Check className="w-4 h-4 ml-auto" />}
            </DropdownMenuItem>)}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#8B7AB8]">Font</span>
            <span className="text-sm font-semibold text-[#8B7AB8]">Color</span>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Popover open={isFontOpen} onOpenChange={setIsFontOpen}>
              <PopoverTrigger asChild>
                <button className="text-sm font-medium text-[hsl(var(--ink))] hover:text-[#8B7AB8] transition-colors flex items-center gap-1" style={{
                    fontFamily: `${fontFamily}, sans-serif`
                  }}>
                  {fontFamily}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto z-50" align="end">
                <div className="flex flex-col gap-1">
                  {availableFonts.map(font => <button key={font} onClick={() => handleFontChange(font)} className={`text-left px-3 py-2 rounded-lg hover:bg-[#F5F0FF] transition-colors text-sm ${fontFamily === font ? 'bg-[#E8DDFF] text-[#8B5CF6] font-medium' : 'text-[hsl(var(--ink))]'}`} style={{
                      fontFamily: `${font}, sans-serif`
                    }}>
                      {font}
                    </button>)}
                </div>
              </PopoverContent>
            </Popover>
            <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
              <PopoverTrigger asChild>
                <button className="w-16 h-8 rounded-lg border-2 border-gray-300 hover:border-[#8B7AB8] transition-colors cursor-pointer" style={{
                    backgroundColor: textColor
                  }} aria-label="Choose color" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3 bg-white border-2 border-white shadow-[0_0_40px_rgba(200,180,255,0.4)] z-50" align="end">
                <div className="max-h-[280px] overflow-y-auto overflow-x-hidden border border-gray-300">
                  <div className="grid grid-cols-16 gap-0">
                    {/* Grayscale row */}
                    {['#EFEFEF', '#DEDEDE', '#CECECE', '#BEBEBE', '#AEAEAE', '#9E9E9E', '#8E8E8E', '#7E7E7E', '#6E6E6E', '#5E5E5E', '#4E4E4E', '#3E3E3E', '#2E2E2E', '#1E1E1E', '#0E0E0E', '#000000'].map(color => <button key={color} onClick={() => {
                        handleColorChange(color);
                        setIsColorPickerOpen(false);
                      }} className="w-[17.5px] h-[17.5px] hover:scale-105 transition-transform border-0" style={{
                        backgroundColor: color
                      }} aria-label={`Select ${color}`} />)}
                    
                    {/* Color spectrum rows */}
                    {[['#003050', '#000060', '#00004D', '#4B0082', '#660066', '#6B0066', '#7A004D', '#6B0000', '#8B0000', '#A00000', '#B54B00', '#A55000', '#6B3800', '#6B6B00', '#4D5F1E', '#004400'], ['#004D80', '#0000A0', '#0000CD', '#000099', '#7B008B', '#800080', '#9B0066', '#8B0000', '#B22222', '#CD0000', '#DC5B23', '#CC5500', '#8B5A00', '#8B8B00', '#6B8E23', '#228B22'], ['#006BB3', '#0033FF', '#4169E1', '#0066FF', '#6A5ACD', '#9932CC', '#CC0066', '#CD0000', '#FF0000', '#FF3300', '#FF6B23', '#FF7700', '#D27A00', '#CDB700', '#9ACD32', '#32CD32'], ['#0080FF', '#0066FF', '#4682B4', '#1E90FF', '#7B68EE', '#9370DB', '#BA55D3', '#FF0066', '#FF4500', '#FF6600', '#FF8C00', '#FFA500', '#FFB900', '#FFD700', '#ADFF2F', '#7FFF00'], ['#00BFFF', '#4DA6FF', '#5DADE2', '#66B3FF', '#8A7FD3', '#9966FF', '#DA70D6', '#FF6699', '#FF7F7F', '#FF9966', '#FFB366', '#FFB84D', '#FFCC00', '#FFEB00', '#D4FF00', '#90EE90'], ['#6DD5ED', '#87CEEB', '#89CFF0', '#99CCFF', '#9999FF', '#B19CD9', '#E6A8D7', '#FFB6C1', '#FFB3BA', '#FFCC99', '#FFD6A5', '#FFDA8F', '#FFE066', '#FFFF99', '#E8FF99', '#B4FFB4'], ['#AED9E0', '#B0E0E6', '#C1E7F4', '#CCDDFF', '#C8BFE7', '#E0BBE4', '#F4C2C2', '#FFC0CB', '#FFCCCB', '#FFE0B2', '#FFE5B4', '#FFEDB3', '#FFF3CC', '#FFFDD0', '#F0FFCC', '#D5FFD5'], ['#D4F1F4', '#E0F6F6', '#E6F7FF', '#EDE7F6', '#F3E5F5', '#FDEEF4', '#FFF0F5', '#FFF5F7', '#FFF5EE', '#FFF8E1', '#FFFBEA', '#FFFEF0', '#FFFEF5', '#FFFFEB', '#FAFFF0', '#F0FFF0']].map((row, rowIndex) => row.map(color => <button key={`${rowIndex}-${color}`} onClick={() => {
                        handleColorChange(color);
                        setIsColorPickerOpen(false);
                      }} className="w-[17.5px] h-[17.5px] hover:scale-105 transition-transform border-0" style={{
                        backgroundColor: color
                      }} aria-label={`Select ${color}`} />))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Format Buttons */}
        <div className="flex gap-2">
          <button onClick={() => handleFormat('bold')} className="flex-1 h-12 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold rounded-lg transition-colors text-lg">
            B
          </button>
          <button onClick={() => handleFormat('italic')} className="flex-1 h-12 bg-white hover:bg-gray-50 text-[#8B5CF6] font-semibold italic rounded-lg border border-gray-200 transition-colors text-lg">
            I
          </button>
          <button onClick={() => handleFormat('underline')} className="flex-1 h-12 bg-white hover:bg-gray-50 text-[#8B5CF6] font-semibold underline rounded-lg border border-gray-200 transition-colors text-lg">
            U
          </button>
          <button onClick={() => handleFormat('strike')} className="flex-1 h-12 bg-white hover:bg-gray-50 text-[#8B5CF6] font-semibold line-through rounded-lg border border-gray-200 transition-colors text-lg">
            S
          </button>
          <button className="flex-1 h-12 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors flex items-center justify-center p-2">
            <img src={capitalizeIcon} alt="Capitalize" className="w-7 h-7 object-contain" />
          </button>
          <button className="flex-1 h-12 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors flex items-center justify-center p-2">
            <img src={baselineIcon} alt="Baseline" className="w-7 h-7 object-contain" />
          </button>
        </div>
      </div>

      {/* Alignment Grid */}
      <div className="bg-gradient-to-b from-[#C9B5FF] to-[#A890FF] rounded-2xl p-3 space-y-2">
        {/* Top row - 4 buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => handleAlign('left')} className="h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center">
            <AlignLeft className="w-5 h-5" />
          </button>
          <button onClick={() => handleAlign('center')} className="h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center">
            <AlignCenter className="w-5 h-5" />
          </button>
          <button onClick={() => handleAlign('right')} className="h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center">
            <AlignRight className="w-5 h-5" />
          </button>
          <button onClick={() => handleAlign('justify')} className="h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center">
            <AlignJustify className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom row - Tab and indent buttons */}
        <div className="flex gap-2">
          <button onClick={handleTab} className="w-16 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center text-sm font-medium">
            Tab
          </button>
          <button onClick={handleOutdent} className="flex-1 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleIndent} className="flex-1 h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Alignment Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-[#8B7AB8]">Alignment Section</h3>
        
        {/* None */}
        <button onClick={() => handleListType('none')} className="w-full bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-gray-200 hover:bg-gray-50 transition-colors">
          <span className="text-sm font-medium text-[hsl(var(--ink))]">None</span>
          {selectedAlignment === 'none' && <Check className="w-5 h-5 text-[#8B5CF6]" />}
        </button>

        {/* Numbered List */}
        <button onClick={() => handleListType('numbered')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${selectedAlignment === 'numbered' ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-medium ${selectedAlignment === 'numbered' ? 'text-white' : ''}`}>1.</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'numbered' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Numbers</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Lettered List */}
        <button onClick={() => handleListType('lettered')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${selectedAlignment === 'lettered' ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-medium ${selectedAlignment === 'lettered' ? 'text-white' : ''}`}>a.</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'lettered' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Letters</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Bullet */}
        <button onClick={() => handleListType('bullet')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${selectedAlignment === 'bullet' ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${selectedAlignment === 'bullet' ? 'text-white' : ''}`}>•</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'bullet' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Bullet</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Image */}
        <button onClick={() => handleListType('image')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${selectedAlignment === 'image' ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${selectedAlignment === 'image' ? 'text-white' : ''}`}>▣</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'image' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Square</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Harvard */}
        <button onClick={() => handleListType('harvard')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${selectedAlignment === 'harvard' ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${selectedAlignment === 'harvard' ? 'text-white' : ''}`}>✓</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'harvard' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Harvard</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Dash */}
        <button onClick={() => handleListType('dash')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${selectedAlignment === 'dash' ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${selectedAlignment === 'dash' ? 'text-white' : ''}`}>—</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'dash' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Dash</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Note Taking */}
        <button onClick={() => handleListType('note-taking')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${selectedAlignment === 'note-taking' ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${selectedAlignment === 'note-taking' ? 'text-white' : ''}`}>–</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'note-taking' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Note Taking</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Add Custom Icon */}
        <button onClick={() => handleListType('custom')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${selectedAlignment === 'custom' ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-medium ${selectedAlignment === 'custom' ? 'text-white' : ''}`}>+</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'custom' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Add custom icon</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>
      </div>
        </div>
      </ScrollArea>
    </aside>;
};