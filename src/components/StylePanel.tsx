import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Palette, Type, Sparkles } from 'lucide-react';
import { TextStyle, defaultStyles } from '@/types/styles';

export const StylePanel = () => {
  const [styles, setStyles] = useState<TextStyle[]>(defaultStyles);
  const [selectedStyle, setSelectedStyle] = useState<TextStyle | null>(null);

  return (
    <div className="w-80 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
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
              onClick={() => setSelectedStyle(style)}
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
              <Input
                value={selectedStyle.font}
                className="mt-1 h-8 text-sm"
                readOnly
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Size</Label>
                <Input
                  value={selectedStyle.size}
                  className="mt-1 h-8 text-sm"
                  readOnly
                />
              </div>
              <div>
                <Label className="text-xs">Weight</Label>
                <Input
                  value={selectedStyle.weight}
                  className="mt-1 h-8 text-sm"
                  readOnly
                />
              </div>
            </div>
            <Button size="sm" variant="secondary" className="w-full">
              <Sparkles className="w-3 h-3 mr-2" />
              Apply to Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
