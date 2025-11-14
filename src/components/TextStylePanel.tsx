import { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronRight, Indent, Outdent, Check, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import capitalizeIcon from '@/assets/capitalize-icon.jpg';
import baselineSuperscriptIcon from '@/assets/baseline-superscript-icon.jpg';
import baselineSubscriptIcon from '@/assets/baseline-subscript-icon.jpg';
interface TextStylePanelProps {
  editor?: any;
  wordCount?: number;
  selectedWordCount?: number;
}
export const TextStylePanel = ({
  editor,
  wordCount = 0,
  selectedWordCount = 0
}: TextStylePanelProps) => {
  const [fontSize, setFontSize] = useState('12');
  const [fontFamily, setFontFamily] = useState('Graphik');
  const [selectedAlignment, setSelectedAlignment] = useState('harvard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFontOpen, setIsFontOpen] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [formattingMode, setFormattingMode] = useState('Normal - 1.15');
  const [baselineMode, setBaselineMode] = useState<'superscript' | 'subscript' | 'normal'>('normal');
  const [capitalizationMode, setCapitalizationMode] = useState('None');
  const formattingModes = ['Normal - 1.15', 'Single Spacing', '1.5 Spacing', '2.5 Spacing', 'Hanging Indent'];
  const availableFonts = ['Graphik', 'Arial', 'Times New Roman', 'Georgia', 'Helvetica', 'Courier New', 'Verdana', 'Garamond', 'Palatino', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Impact', 'Lucida Console', 'Tahoma', 'Lucida Sans', 'Monaco', 'Gill Sans', 'Century Gothic', 'Franklin Gothic Medium', 'Cambria', 'Calibri', 'Consolas', 'Didot', 'Futura', 'Optima', 'Baskerville'];
  
  // Update formattingMode based on current editor attributes
  useEffect(() => {
    if (!editor) return;

    const updateFormattingMode = () => {
      const attrs = editor.getAttributes('paragraph');
      const lineHeight = attrs.lineHeight || '1.15';
      const textIndent = attrs.textIndent || '0px';
      const marginBottom = attrs.marginBottom || '0px';
      
      // Detect the current formatting mode based on attributes
      if (textIndent === '30px' && marginBottom === '0px') {
        setFormattingMode('Hanging Indent');
      } else if (lineHeight === '1') {
        setFormattingMode('Single Spacing');
      } else if (lineHeight === '1.5') {
        setFormattingMode('1.5 Spacing');
      } else if (lineHeight === '2.5') {
        setFormattingMode('2.5 Spacing');
      } else {
        // Default to Normal - 1.15 for 1.15 or unset
        setFormattingMode('Normal - 1.15');
      }
    };

    // Update on selection change
    editor.on('selectionUpdate', updateFormattingMode);
    editor.on('transaction', updateFormattingMode);

    return () => {
      editor.off('selectionUpdate', updateFormattingMode);
      editor.off('transaction', updateFormattingMode);
    };
  }, [editor]);

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
    if (!editor) {
      console.error('Editor not available');
      return;
    }
    
    try {
      // Get current selection or set to entire content if nothing selected
      const { from, to } = editor.state.selection;
      
      // Apply alignment to current paragraph/selection
      editor.chain().focus().setTextAlign(alignment).run();
      
      console.log(`Text aligned to: ${alignment}`);
    } catch (error) {
      console.error('Error aligning text:', error);
    }
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

  const handleBaselineCycle = () => {
    if (!editor) return;
    
    if (baselineMode === 'superscript') {
      // Switch to subscript: turn off superscript, turn on subscript
      if (editor.isActive('superscript')) {
        editor.chain().focus().unsetSuperscript().run();
      }
      editor.chain().focus().setSubscript().run();
      setBaselineMode('subscript');
    } else if (baselineMode === 'subscript') {
      // Switch to normal: turn off subscript
      if (editor.isActive('subscript')) {
        editor.chain().focus().unsetSubscript().run();
      }
      setBaselineMode('normal');
    } else {
      // Switch to superscript: turn on superscript
      editor.chain().focus().setSuperscript().run();
      setBaselineMode('superscript');
    }
  };

  const handleCapitalization = (mode: string) => {
    if (!editor) return;
    setCapitalizationMode(mode);
    
    const { from, to } = editor.state.selection;
    
    // If no text is selected, do nothing
    if (from === to) return;
    
    const text = editor.state.doc.textBetween(from, to, ' ');
    
    // First, remove all capitalization marks
    if (editor.isActive('smallCaps')) {
      editor.chain().focus().unsetSmallCaps().run();
    }
    if (editor.isActive('allCaps')) {
      editor.chain().focus().unsetAllCaps().run();
    }
    
    // Then apply the selected capitalization style
    switch (mode) {
      case 'None':
        // All marks already removed, text stays as originally typed
        break;
      case 'All Caps':
        // Use CSS transform for uppercase
        editor.chain().focus().setAllCaps().run();
        break;
      case 'Small Caps':
        // Use CSS small-caps
        editor.chain().focus().setSmallCaps().run();
        break;
      case 'Title Case': {
        // Transform text: capitalize first letter of major words
        const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'of', 'in', 'with', 'from'];
        const words = text.split(' ');
        const transformedText = words.map((word, index) => {
          // Always capitalize first and last word, or if not a minor word
          if (index === 0 || index === words.length - 1 || !minorWords.includes(word.toLowerCase())) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }
          return word.toLowerCase();
        }).join(' ');
        
        editor.chain().focus()
          .deleteRange({ from, to })
          .insertContent(transformedText)
          .setTextSelection({ from, to: from + transformedText.length })
          .run();
        break;
      }
      case 'Start Case': {
        // Transform text: capitalize only first letter of first word
        const sentences = text.split(/([.!?]\s+)/);
        const transformedText = sentences.map((part, index) => {
          // Check if this is actual text (not punctuation)
          if (index % 2 === 0 && part.length > 0) {
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
          }
          return part;
        }).join('');
        
        editor.chain().focus()
          .deleteRange({ from, to })
          .insertContent(transformedText)
          .setTextSelection({ from, to: from + transformedText.length })
          .run();
        break;
      }
    }
  };

  const handleFormattingMode = (mode: string) => {
    if (!editor) return;
    setFormattingMode(mode);
    switch (mode) {
      case 'Normal - 1.15':
        // Default 1.15 spacing with regular paragraph settings
        editor.chain().focus().setParagraphAttributes({
          textIndent: '0px',
          marginBottom: '0px',
          lineHeight: '1.15',
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
      case '2.5 Spacing':
        editor.chain().focus().setParagraphAttributes({
          lineHeight: '2.5',
          textIndent: '0px',
          marginBottom: '0px',
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
    return <aside className="w-16 h-full bg-sidebar border-l border-sidebar-border flex flex-col items-center py-4 relative">
        {/* Word Counter - Square, centered when collapsed */}
        <div 
          className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-[hsl(253,45%,85%)] text-[hsl(266,50%,35%)] font-bold text-center flex flex-col items-center justify-center w-[56px] h-[56px] rounded-md shadow-sm">
            <div className="text-[8px] tracking-[0.15em] leading-none mb-1">WORD</div>
            <div className="text-xl leading-none">{selectedWordCount > 0 ? selectedWordCount : wordCount}</div>
          </div>
        </div>

        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:bg-sidebar-accent mb-4 mt-14" onClick={() => setIsCollapsed(false)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="writing-mode-vertical text-sm font-medium text-muted-foreground uppercase tracking-wide mt-2" style={{
        writingMode: 'vertical-rl'
      }}>
          Paragraph Mode
        </div>
      </aside>;
  }
  return <aside className="w-[340px] h-full bg-sidebar border-l border-sidebar-border flex flex-col overflow-hidden relative">
      {/* Word Counter - Square, right when expanded */}
      <div 
        className="absolute top-2 right-2 z-50 pointer-events-none"
      >
        <div className="bg-[hsl(253,45%,85%)] text-[hsl(266,50%,35%)] font-bold text-center flex flex-col items-center justify-center w-[56px] h-[56px] rounded-md shadow-sm">
          <div className="text-[8px] tracking-[0.15em] leading-none mb-1">WORD</div>
          <div className="text-xl leading-none">{selectedWordCount > 0 ? selectedWordCount : wordCount}</div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-2.5 pt-[72px]">
        <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-bold text-[#8B7AB8] uppercase tracking-wide">Paragraph Mode</h2>
        </div>
        <Button size="icon" variant="ghost" onClick={() => setIsCollapsed(true)} className="h-9 w-9 text-muted-foreground hover:bg-sidebar-accent">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 h-12 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors flex items-center justify-center p-2">
                <img src={capitalizeIcon} alt="Capitalize" className="w-7 h-7 object-contain" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg" align="start">
              <DropdownMenuItem 
                onClick={() => handleCapitalization('None')}
                className={`px-4 py-2 cursor-pointer hover:bg-[#F5F0FF] transition-colors ${capitalizationMode === 'None' ? 'bg-[#E8DDFF] text-[#8B5CF6] font-medium' : 'text-[hsl(var(--ink))]'}`}
              >
                <span className="text-[#8B7AB8]">None</span>
                {capitalizationMode === 'None' && <Check className="w-4 h-4 ml-auto text-[#8B5CF6]" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleCapitalization('All Caps')}
                className={`px-4 py-2 cursor-pointer hover:bg-[#F5F0FF] transition-colors ${capitalizationMode === 'All Caps' ? 'bg-[#E8DDFF] text-[#8B5CF6] font-medium' : 'text-[hsl(var(--ink))]'}`}
              >
                <span className="text-[#8B7AB8] uppercase">All Caps</span>
                {capitalizationMode === 'All Caps' && <Check className="w-4 h-4 ml-auto text-[#8B5CF6]" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleCapitalization('Small Caps')}
                className={`px-4 py-2 cursor-pointer hover:bg-[#F5F0FF] transition-colors ${capitalizationMode === 'Small Caps' ? 'bg-[#E8DDFF] text-[#8B5CF6] font-medium' : 'text-[hsl(var(--ink))]'}`}
              >
                <span className="text-[#8B7AB8]" style={{ fontVariantCaps: 'small-caps' }}>Small Caps</span>
                {capitalizationMode === 'Small Caps' && <Check className="w-4 h-4 ml-auto text-[#8B5CF6]" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleCapitalization('Title Case')}
                className={`px-4 py-2 cursor-pointer hover:bg-[#F5F0FF] transition-colors ${capitalizationMode === 'Title Case' ? 'bg-[#E8DDFF] text-[#8B5CF6] font-medium' : 'text-[hsl(var(--ink))]'}`}
              >
                <span className="text-[#8B7AB8]">Title Case</span>
                {capitalizationMode === 'Title Case' && <Check className="w-4 h-4 ml-auto text-[#8B5CF6]" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleCapitalization('Start Case')}
                className={`px-4 py-2 cursor-pointer hover:bg-[#F5F0FF] transition-colors ${capitalizationMode === 'Start Case' ? 'bg-[#E8DDFF] text-[#8B5CF6] font-medium' : 'text-[hsl(var(--ink))]'}`}
              >
                <span className="text-[#8B7AB8]">Start Case</span>
                {capitalizationMode === 'Start Case' && <Check className="w-4 h-4 ml-auto text-[#8B5CF6]" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button 
            onClick={handleBaselineCycle}
            className={`flex-1 h-12 rounded-lg border transition-all flex items-center justify-center p-2 ${
              baselineMode !== 'normal' 
                ? 'bg-[#8B5CF6] border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.5)]' 
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }`}
          >
            <img 
              src={baselineMode === 'superscript' ? baselineSuperscriptIcon : baselineSubscriptIcon} 
              alt="Baseline" 
              className="w-7 h-7 object-contain" 
            />
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