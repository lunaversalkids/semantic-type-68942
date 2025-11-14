import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { useState } from 'react';
import { coreShapes } from '../icons/CoreShapes';
import { egyptianAnkhs } from '../icons/EgyptianAnkhs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import egyptianAnkhsImage from '@/assets/egyptian-ankhs-grid.png';

export const IconNodeView = ({ node, updateAttributes, selected }: NodeViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { iconId, category, width, height, color, cropX, cropY, cropWidth, cropHeight } = node.attrs;

  const getAnkhCropStyle = (ankhId: string, width: number, height: number) => {
    // If custom crop data exists, use it
    if (cropX !== null && cropY !== null && cropWidth !== null && cropHeight !== null) {
      // Original image dimensions (assuming square grid image)
      const gridImageWidth = 1024; // Adjust based on your actual image
      const gridImageHeight = 1024;
      
      // Calculate background-size to scale the image so the crop area fits
      const scaleX = (gridImageWidth / cropWidth) * 100;
      const scaleY = (gridImageHeight / cropHeight) * 100;
      
      // Calculate background-position to offset the crop
      const posX = -(cropX / cropWidth) * 100;
      const posY = -(cropY / cropHeight) * 100;
      
      return {
        backgroundImage: `url(${egyptianAnkhsImage})`,
        backgroundSize: `${scaleX}% ${scaleY}%`,
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundRepeat: 'no-repeat',
      };
    }
    
    // Fallback to grid-based positioning
    const ankhNum = parseInt(ankhId.replace('ankh-', ''));
    const col = (ankhNum - 1) % 4; // 0-3 (column position)
    const row = Math.floor((ankhNum - 1) / 4); // 0-3 (row position)
    
    const percentX = (col * 100) / 3; // Convert to percentage (0%, 33.33%, 66.66%, 100%)
    const percentY = (row * 100) / 3; // Convert to percentage (0%, 33.33%, 66.66%, 100%)
    
    return {
      backgroundImage: `url(${egyptianAnkhsImage})`,
      backgroundSize: '400% 400%', // 4x4 grid means 400% in each direction
      backgroundPosition: `${percentX}% ${percentY}%`,
      backgroundRepeat: 'no-repeat',
    };
  };

  let icon;
  if (category === 'egyptian') {
    icon = egyptianAnkhs.find((a) => a.id === iconId);
  } else {
    icon = coreShapes.find((s) => s.id === iconId);
  }
  
  if (!icon && category !== 'egyptian') return null;

  const IconComponent = icon?.component;

  const handleCrop = () => {
    // Emit event with current crop data for editor to handle
    window.dispatchEvent(new CustomEvent('icon-crop-requested', {
      detail: {
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        updateAttributes,
      }
    }));
  };

  return (
    <NodeViewWrapper className="inline-block relative group">
      <Popover open={isEditing} onOpenChange={setIsEditing}>
        <PopoverTrigger asChild>
          <div
            className={`inline-flex items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
              selected ? 'ring-2 ring-primary' : ''
            }`}
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            {category === 'egyptian' ? (
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  ...getAnkhCropStyle(iconId, width, height)
                }}
                className="pointer-events-none"
              />
            ) : (
              IconComponent && (
                <IconComponent
                  style={{ color, width: '100%', height: '100%' }}
                  strokeWidth={2}
                />
              )
            )}
            
            {/* Resize handles - only show when selected */}
            {selected && (
              <>
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-[hsl(253,100%,70%)] to-[hsl(253,100%,60%)] rounded-full cursor-nw-resize border-2 border-white shadow-lg" 
                     style={{ boxShadow: '0 0 10px rgba(107, 91, 206, 0.6)' }} />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-[hsl(253,100%,70%)] to-[hsl(253,100%,60%)] rounded-full cursor-ne-resize border-2 border-white shadow-lg"
                     style={{ boxShadow: '0 0 10px rgba(107, 91, 206, 0.6)' }} />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-[hsl(253,100%,70%)] to-[hsl(253,100%,60%)] rounded-full cursor-sw-resize border-2 border-white shadow-lg"
                     style={{ boxShadow: '0 0 10px rgba(107, 91, 206, 0.6)' }} />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-[hsl(253,100%,70%)] to-[hsl(253,100%,60%)] rounded-full cursor-se-resize border-2 border-white shadow-lg"
                     style={{ boxShadow: '0 0 10px rgba(107, 91, 206, 0.6)' }} />
              </>
            )}
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
      
      {/* Crop Button - only show when selected and category is egyptian */}
      {selected && category === 'egyptian' && (
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            onClick={handleCrop}
            className="bg-gradient-to-r from-[hsl(253,100%,64%)] to-[hsl(266,100%,70%)] hover:from-[hsl(253,100%,70%)] hover:to-[hsl(266,100%,75%)] text-white px-6 py-2 rounded-lg shadow-lg font-semibold"
            style={{ boxShadow: '0 4px 16px rgba(107, 91, 206, 0.4)' }}
          >
            Crop Icon
          </Button>
        </div>
      )}
    </NodeViewWrapper>
  );
};
