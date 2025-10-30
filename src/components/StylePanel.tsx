import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bold, Italic, Underline, Strikethrough, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const AVAILABLE_FONTS = ['Inter', 'Georgia', 'Monaco', 'Times New Roman', 'Arial', 'Helvetica', 'Courier New', 'Palatino', 'Garamond', 'Bookman'];

interface StylePanelProps {
  editor?: any;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const StylePanel = ({
  editor,
  collapsed = false,
  onToggleCollapse
}: StylePanelProps) => {
  const [fontSize, setFontSize] = useState('12');
  const [fontFamily, setFontFamily] = useState('Inter');
  return (
    <div className={`h-full bg-sidebar/30 border-l border-sidebar-border flex flex-col transition-all duration-300 ${collapsed ? 'w-0 overflow-hidden' : 'w-72'}`}>
      {!collapsed && (
        <>
          <div className="p-4 border-b border-sidebar-border">
            <h2 className="text-base font-semibold text-foreground">
              Text Style
            </h2>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Font Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Font</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
                
                <div className="flex gap-2 items-center">
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="flex-1 h-9 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_FONTS.map(font => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input 
                    type="number" 
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-16 h-9 bg-background text-center"
                  />
                </div>

                {/* Text Formatting Buttons */}
                <div className="flex gap-1 mt-3">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10"
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  >
                    <Underline className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10"
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                  >
                    <Strikethrough className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10"
                  >
                    <Type className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Text Alignment Section */}
              <div className="bg-primary/90 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-primary-foreground">Text</span>
                  <div className="w-8 h-4 bg-background/20 rounded"></div>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                  >
                    <span className="text-xs font-semibold">N</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                    onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground text-xs"
                  >
                    ≡
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                    onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                  >
                    <AlignJustify className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* List Types Section */}
              <div>
                <Button 
                  variant="ghost"
                  className="w-full justify-between h-10 bg-primary text-primary-foreground hover:bg-primary/90 mb-2"
                >
                  <ChevronDown className="w-4 h-4" />
                  <span className="flex-1 text-left ml-2">None</span>
                </Button>

                <div className="space-y-1">
                  <Button 
                    variant="ghost"
                    className="w-full justify-between h-10 hover:bg-primary/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">•</span>
                      <span className="text-sm">Bullet</span>
                    </div>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </Button>

                  <Button 
                    variant="ghost"
                    className="w-full justify-between h-10 hover:bg-primary/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">▪</span>
                      <span className="text-sm">Image</span>
                    </div>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </Button>

                  <Button 
                    variant="ghost"
                    className="w-full justify-between h-10 hover:bg-primary/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">A.</span>
                      <span className="text-sm">Lettered</span>
                    </div>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </Button>

                  <Button 
                    variant="ghost"
                    className="w-full justify-between h-10 hover:bg-primary/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">1.</span>
                      <span className="text-sm">Numbered</span>
                    </div>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
};