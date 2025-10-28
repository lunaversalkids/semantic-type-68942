import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { useState } from 'react';
import { coreShapes } from '../icons/CoreShapes';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export const IconNodeView = ({ node, updateAttributes, selected }: NodeViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { iconId, category, width, height, color } = node.attrs;

  const icon = coreShapes.find((s) => s.id === iconId);
  if (!icon) return null;

  const IconComponent = icon.component;

  return (
    <NodeViewWrapper className="inline-block relative">
      <Popover open={isEditing} onOpenChange={setIsEditing}>
        <PopoverTrigger asChild>
          <div
            className={`inline-flex items-center justify-center cursor-pointer transition-all ${
              selected ? 'ring-2 ring-primary' : ''
            }`}
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <IconComponent
              style={{ color, width: '100%', height: '100%' }}
              strokeWidth={2}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Edit Icon</h4>
            
            <div className="space-y-2">
              <Label>Size: {width}px</Label>
              <Slider
                value={[width]}
                onValueChange={([newWidth]) => updateAttributes({ width: newWidth, height: newWidth })}
                min={20}
                max={300}
                step={10}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => updateAttributes({ color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => updateAttributes({ color: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setIsEditing(false)}
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
};
