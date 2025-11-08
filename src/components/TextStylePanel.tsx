import { useState } from 'react';
import { ChevronDown, ChevronLeft, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronRight, Indent, Outdent, Check, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

  const availableFonts = [
    'Graphik',
    'Arial',
    'Times New Roman',
    'Georgia',
    'Helvetica',
    'Courier New',
    'Verdana',
    'Garamond',
    'Palatino',
    'Bookman',
    'Comic Sans MS',
    'Trebuchet MS',
    'Impact',
    'Lucida Console',
    'Tahoma',
    'Lucida Sans',
    'Monaco',
    'Gill Sans',
    'Century Gothic',
    'Franklin Gothic Medium',
    'Cambria',
    'Calibri',
    'Consolas',
    'Didot',
    'Futura',
    'Optima',
    'Baskerville'
  ];

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
        editor.chain().focus().updateAttributes('bulletList', { class: null }).run();
        break;
      case 'numbered':
        if (editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        if (!editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        // Update to remove custom class
        editor.chain().focus().updateAttributes('orderedList', { class: null }).run();
        break;
      case 'lettered':
        if (editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        if (!editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        editor.chain().focus().updateAttributes('orderedList', { class: 'list-lettered' }).run();
        break;
      case 'image':
        if (editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        if (!editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        editor.chain().focus().updateAttributes('bulletList', { class: 'list-square' }).run();
        break;
      case 'harvard':
        if (editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        if (!editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        editor.chain().focus().updateAttributes('bulletList', { class: 'list-harvard' }).run();
        break;
      case 'dash':
        if (editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        if (!editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        editor.chain().focus().updateAttributes('bulletList', { class: 'list-dash' }).run();
        break;
      case 'note-taking':
        if (editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run();
        }
        if (!editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run();
        }
        editor.chain().focus().updateAttributes('bulletList', { class: 'list-note' }).run();
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

      {/* Normal Dropdown */}
      <button className="w-full bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-[hsl(var(--stroke))] hover:bg-gray-50 transition-colors">
        <span className="text-lg font-semibold text-[hsl(var(--ink))]">Normal</span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

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
                <button className="text-sm font-medium text-[hsl(var(--ink))] hover:text-[#8B7AB8] transition-colors flex items-center gap-1" style={{ fontFamily: `${fontFamily}, sans-serif` }}>
                  {fontFamily}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto z-50" align="end">
                <div className="flex flex-col gap-1">
                  {availableFonts.map((font) => (
                    <button
                      key={font}
                      onClick={() => handleFontChange(font)}
                      className={`text-left px-3 py-2 rounded-lg hover:bg-[#F5F0FF] transition-colors text-sm ${
                        fontFamily === font ? 'bg-[#E8DDFF] text-[#8B5CF6] font-medium' : 'text-[hsl(var(--ink))]'
                      }`}
                      style={{ fontFamily: `${font}, sans-serif` }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
              <PopoverTrigger asChild>
                <button 
                  className="w-16 h-8 rounded-lg border-2 border-gray-300 hover:border-[#8B7AB8] transition-colors cursor-pointer"
                  style={{ backgroundColor: textColor }}
                  aria-label="Choose color"
                />
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-2 bg-white border border-gray-200 shadow-lg z-50" 
                align="end"
              >
                <input 
                  type="color" 
                  value={textColor} 
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-32 h-32 rounded-lg cursor-pointer border-0"
                />
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
            <img src={capitalizeIcon} alt="Capitalize" className="w-5 h-5 object-contain" />
          </button>
          <button className="flex-1 h-12 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors flex items-center justify-center p-2">
            <img src={baselineIcon} alt="Baseline" className="w-5 h-5 object-contain" />
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

        {/* Middle row - 2 buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button className="h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center text-2xl">
            ≡
          </button>
          <button onClick={() => handleAlign('justify')} className="h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center">
            <AlignJustify className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom row - Tab and indent buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button className="h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center text-sm font-medium">
            Tab
          </button>
          <button onClick={handleOutdent} className="h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleIndent} className="h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center">
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center">
            <Indent className="w-4 h-4" />
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
        <button onClick={() => handleListType('numbered')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${
          selectedAlignment === 'numbered' 
            ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-medium ${selectedAlignment === 'numbered' ? 'text-white' : ''}`}>1.</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'numbered' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Numbers</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Lettered List */}
        <button onClick={() => handleListType('lettered')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${
          selectedAlignment === 'lettered' 
            ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-medium ${selectedAlignment === 'lettered' ? 'text-white' : ''}`}>a.</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'lettered' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Letters</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Bullet */}
        <button onClick={() => handleListType('bullet')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${
          selectedAlignment === 'bullet' 
            ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${selectedAlignment === 'bullet' ? 'text-white' : ''}`}>•</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'bullet' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Bullet</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Image */}
        <button onClick={() => handleListType('image')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${
          selectedAlignment === 'image' 
            ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${selectedAlignment === 'image' ? 'text-white' : ''}`}>▣</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'image' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Square</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Harvard */}
        <button onClick={() => handleListType('harvard')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${
          selectedAlignment === 'harvard' 
            ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${selectedAlignment === 'harvard' ? 'text-white' : ''}`}>✓</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'harvard' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Harvard</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Dash */}
        <button onClick={() => handleListType('dash')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${
          selectedAlignment === 'dash' 
            ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${selectedAlignment === 'dash' ? 'text-white' : ''}`}>—</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'dash' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Dash</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Note Taking */}
        <button onClick={() => handleListType('note-taking')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${
          selectedAlignment === 'note-taking' 
            ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${selectedAlignment === 'note-taking' ? 'text-white' : ''}`}>–</span>
            <span className={`text-sm font-medium ${selectedAlignment === 'note-taking' ? 'text-white' : 'text-[hsl(var(--ink))]'}`}>Note Taking</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[#E8DDFF] flex items-center justify-center">
            <Info className="w-4 h-4 text-[#8B5CF6]" />
          </div>
        </button>

        {/* Add Custom Icon */}
        <button onClick={() => handleListType('custom')} className={`w-full rounded-xl px-4 py-3 flex items-center justify-between border-0 transition-colors ${
          selectedAlignment === 'custom' 
            ? 'bg-gradient-to-b from-[#B9A1FF] to-[#9B7FFF]' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`}>
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