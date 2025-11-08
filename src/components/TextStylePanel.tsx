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
              <PopoverContent className="w-auto p-4 bg-white border border-gray-200 shadow-[0_0_40px_rgba(200,180,255,0.4)]" align="end">
                <div className="space-y-3">
                  <div className="grid grid-cols-16 gap-1">
                    {/* Grayscale row */}
                    {['#FFFFFF', '#E8E8E8', '#D0D0D0', '#B8B8B8', '#A0A0A0', '#888888', '#707070', '#585858', 
                      '#404040', '#282828', '#181818', '#0C0C0C', '#000000', '#1A1A1A', '#121212', '#0A0A0A'].map((color, i) => (
                      <button
                        key={`gray-${i}`}
                        onClick={() => {
                          handleColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-[#8B7AB8] hover:scale-110 transition-all cursor-pointer"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                    
                    {/* Dark blues to dark greens */}
                    {['#003844', '#001F3F', '#1A0052', '#4B0082', '#6A0DAD', '#800020', '#8B0000', '#CC3300', 
                      '#8B4513', '#654321', '#4A4A00', '#2F4F2F', '#013220', '#004D00', '#003300', '#1B3B1B'].map((color, i) => (
                      <button
                        key={`dark1-${i}`}
                        onClick={() => {
                          handleColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-[#8B7AB8] hover:scale-110 transition-all cursor-pointer"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                    
                    {/* Dark saturated colors */}
                    {['#005F73', '#0074D9', '#4B0092', '#7209B7', '#9D00FF', '#B8001C', '#DD0000', '#FF3300', 
                      '#B85C00', '#935A00', '#807000', '#556B2F', '#01502F', '#006400', '#004D00', '#2D5016'].map((color, i) => (
                      <button
                        key={`dark2-${i}`}
                        onClick={() => {
                          handleColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-[#8B7AB8] hover:scale-110 transition-all cursor-pointer"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                    
                    {/* Mid-dark colors */}
                    {['#0077B6', '#0096FF', '#6A00F4', '#9D4EDD', '#BF40BF', '#E5383B', '#FF0000', '#FF4500', 
                      '#D2691E', '#B8860B', '#9B870C', '#6B8E23', '#228B22', '#008000', '#006400', '#3A5F0B'].map((color, i) => (
                      <button
                        key={`mid1-${i}`}
                        onClick={() => {
                          handleColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-[#8B7AB8] hover:scale-110 transition-all cursor-pointer"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                    
                    {/* Bright colors */}
                    {['#00B4D8', '#00BFFF', '#8B00FF', '#B565D8', '#DA70D6', '#FF1744', '#FF2020', '#FF5722', 
                      '#FF8C00', '#DAA520', '#BDB76B', '#7CB342', '#2E7D32', '#00A000', '#008000', '#4E7C0F'].map((color, i) => (
                      <button
                        key={`bright1-${i}`}
                        onClick={() => {
                          handleColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-[#8B7AB8] hover:scale-110 transition-all cursor-pointer"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                    
                    {/* Vibrant colors */}
                    {['#48CAE4', '#00D4FF', '#A020F0', '#D896FF', '#EE82EE', '#FF5252', '#FF4444', '#FF6E40', 
                      '#FFA500', '#FFD700', '#F0E68C', '#9CCC65', '#4CAF50', '#00C853', '#00B300', '#68A357'].map((color, i) => (
                      <button
                        key={`vibrant1-${i}`}
                        onClick={() => {
                          handleColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-[#8B7AB8] hover:scale-110 transition-all cursor-pointer"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                    
                    {/* Light vibrant */}
                    {['#90E0EF', '#5DADE2', '#BF40FF', '#E0A4FF', '#F4A6FF', '#FF7979', '#FF6B6B', '#FF8A65', 
                      '#FFB74D', '#FFE082', '#FFF59D', '#AED581', '#66BB6A', '#4CAF50', '#00E676', '#81C784'].map((color, i) => (
                      <button
                        key={`light1-${i}`}
                        onClick={() => {
                          handleColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-[#8B7AB8] hover:scale-110 transition-all cursor-pointer"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                    
                    {/* Lighter tones */}
                    {['#ADE8F4', '#85C1E9', '#D291FF', '#EABFFF', '#FAD6FF', '#FFB3BA', '#FFA3A3', '#FFAB91', 
                      '#FFCC80', '#FFECB3', '#FFF9C4', '#C5E1A5', '#81C784', '#66BB6A', '#69F0AE', '#A5D6A7'].map((color, i) => (
                      <button
                        key={`light2-${i}`}
                        onClick={() => {
                          handleColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-[#8B7AB8] hover:scale-110 transition-all cursor-pointer"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                    
                    {/* Pastel colors */}
                    {['#CAF0F8', '#AED6F1', '#E8D4FF', '#F5D7FF', '#FFE5F5', '#FFCCCB', '#FFC5C5', '#FFCCBC', 
                      '#FFE0B2', '#FFF3CD', '#FFFDE7', '#DCEDC8', '#A5D6A7', '#81C784', '#B9F6CA', '#C8E6C9'].map((color, i) => (
                      <button
                        key={`pastel1-${i}`}
                        onClick={() => {
                          handleColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-[#8B7AB8] hover:scale-110 transition-all cursor-pointer"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                    
                    {/* Very light pastels */}
                    {['#E0F7FA', '#D4E7F5', '#F3E8FF', '#FBF0FF', '#FFF0F8', '#FFE5E5', '#FFE3E3', '#FFE0D6', 
                      '#FFF0E0', '#FFFAEB', '#FFFFF0', '#E8F5E9', '#C8E6C9', '#A5D6A7', '#DCEDC8', '#E0F2F1'].map((color, i) => (
                      <button
                        key={`pastel2-${i}`}
                        onClick={() => {
                          handleColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-[#8B7AB8] hover:scale-110 transition-all cursor-pointer"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                    
                    {/* Near white tints */}
                    {['#F0FEFF', '#EBF4FA', '#FAF5FF', '#FEF9FF', '#FFF8FC', '#FFF5F5', '#FFF3F3', '#FFF5F0', 
                      '#FFFAF5', '#FFFDFA', '#FFFFFA', '#F1F8F4', '#E8F5E9', '#E0F2F1', '#F1F8E9', '#F0F4F0'].map((color, i) => (
                      <button
                        key={`tint1-${i}`}
                        onClick={() => {
                          handleColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-[#8B7AB8] hover:scale-110 transition-all cursor-pointer"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                    
                    {/* Almost white */}
                    {['#FCFEFF', '#F8FBFF', '#FEFCFF', '#FFFDFF', '#FFFCFE', '#FFFBFB', '#FFFAFA', '#FFFCFA', 
                      '#FFFEFC', '#FFFFFE', '#FFFFFD', '#FAFCFB', '#F5F9F5', '#F1F8F1', '#F9FDF9', '#F8FAF8'].map((color, i) => (
                      <button
                        key={`tint2-${i}`}
                        onClick={() => {
                          handleColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:border-[#8B7AB8] hover:scale-110 transition-all cursor-pointer"
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setIsColorPickerOpen(false)}
                    className="w-full h-10 bg-gradient-to-b from-[#C9B5FF] to-[#A890FF] hover:from-[#B9A1FF] hover:to-[#9B7FFF] text-white rounded-lg transition-colors font-medium text-sm mt-3"
                  >
                    Done
                  </button>
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