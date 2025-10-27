import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Palette, Type, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TextStyle, defaultStyles } from '@/types/styles';

const AVAILABLE_FONTS = [
  'Inter',
  'Georgia',
  'Monaco',
  'Times New Roman',
  'Arial',
  'Helvetica',
  'Courier New',
  'Palatino',
  'Garamond',
  'Bookman',
];

interface StylePanelProps {
  editor?: any;
}

export const StylePanel = ({ editor }: StylePanelProps) => {
  const [styles, setStyles] = useState<TextStyle[]>(defaultStyles);
  const [selectedStyle, setSelectedStyle] = useState<TextStyle | null>(null);

  const applyStyleToSelection = (style: TextStyle) => {
    if (!editor) return;
    
    const chain = editor.chain().focus();
    
    if (style.color) {
      chain.setColor(style.color);
    }
    if (style.weight) {
      if (style.weight >= 600) {
        chain.setBold();
      }
    }
    if (style.italic) {
      chain.setItalic();
    }
    
    chain.run();
  };

  const updateSelectedStyle = (updates: Partial<TextStyle>) => {
    if (!selectedStyle) return;
    
    const updatedStyle = { ...selectedStyle, ...updates };
    setSelectedStyle(updatedStyle);
    setStyles(styles.map(s => s.id === selectedStyle.id ? updatedStyle : s));
  };

  return (
    <div className="w-80 h-full bg-sidebar border-r border-sidebar-border flex flex-col style-panel">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Styles
          </h2>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Define semantic styles for your document
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Type className="w-3 h-3" />
            Character Styles
          </div>
          {styles.map((style) => (
            <Card
              key={style.id}
              className={`p-3 cursor-pointer transition-all hover:border-primary/50 ${
                selectedStyle?.id === style.id ? 'border-primary' : ''
              }`}
              onClick={() => {
                setSelectedStyle(style);
                applyStyleToSelection(style);
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{style.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {style.tag || 'Style'}
                </Badge>
              </div>
              <div
                className="text-sm"
                style={{
                  fontFamily: style.font,
                  fontSize: `${(style.size || 16) - 2}px`,
                  fontWeight: style.weight,
                  fontStyle: style.italic ? 'italic' : 'normal',
                  color: style.color,
                }}
              >
                The quick brown fox
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {selectedStyle && (
        <div className="border-t border-sidebar-border p-4 bg-sidebar-accent/30">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Font Family</Label>
              <Select
                value={selectedStyle.font}
                onValueChange={(value) => updateSelectedStyle({ font: value })}
              >
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_FONTS.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Size</Label>
                <Input
                  type="number"
                  value={selectedStyle.size}
                  onChange={(e) => updateSelectedStyle({ size: parseInt(e.target.value) })}
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Weight</Label>
                <Select
                  value={selectedStyle.weight?.toString()}
                  onValueChange={(value) => updateSelectedStyle({ weight: parseInt(value) })}
                >
                  <SelectTrigger className="mt-1 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light</SelectItem>
                    <SelectItem value="400">Normal</SelectItem>
                    <SelectItem value="500">Medium</SelectItem>
                    <SelectItem value="600">Semibold</SelectItem>
                    <SelectItem value="700">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={selectedStyle.color}
                  onChange={(e) => updateSelectedStyle({ color: e.target.value })}
                  className="h-8 w-16 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={selectedStyle.color}
                  onChange={(e) => updateSelectedStyle({ color: e.target.value })}
                  className="h-8 text-sm flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-full"
              onClick={() => applyStyleToSelection(selectedStyle)}
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Apply to Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
