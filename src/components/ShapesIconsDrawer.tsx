import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconCropEditor } from "./IconCropEditor";
import { IconInstanceCropDialog } from "./IconInstanceCropDialog";
import { Pencil } from "lucide-react";
import egyptianAnkhsGrid from "@/assets/egyptian-ankhs-grid.png";
import { PixelCrop } from "react-image-crop";
interface ShapesIconsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertIcon?: (iconId: string, category: string, cropData?: {
    cropX: number;
    cropY: number;
    cropWidth: number;
    cropHeight: number;
  }) => void;
}
const categories = [{
  id: 'shapes',
  name: 'Shapes'
}, {
  id: 'arrows',
  name: 'Arrows'
}, {
  id: 'sumerian',
  name: 'Sumerian'
}, {
  id: 'egyptian',
  name: 'Egyptian'
}, {
  id: 'sacred',
  name: 'Sacred'
}, {
  id: 'christianity',
  name: 'Christianity'
}];
export function ShapesIconsDrawer({
  open,
  onOpenChange,
  onInsertIcon
}: ShapesIconsDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('shapes');
  const [isEditMode, setIsEditMode] = useState(false);
  const [iconCrops, setIconCrops] = useState<Record<number, PixelCrop>>({});
  const [editingAnkhIndex, setEditingAnkhIndex] = useState<number | null>(null);
  const [ankhCropDialogOpen, setAnkhCropDialogOpen] = useState(false);

  // Load saved crops from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('egyptian-ankh-crops');
    if (saved) {
      try {
        setIconCrops(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved crops:', e);
      }
    }
  }, []);
  const handleAnkhClick = (ankhId: string) => {
    if (onInsertIcon) {
      // Get the ankh number from the id (e.g., 'ankh-1' -> 1)
      const ankhNum = parseInt(ankhId.replace('ankh-', ''));
      const cropData = iconCrops[ankhNum];
      
      // Pass crop data if available
      if (cropData) {
        onInsertIcon(ankhId, 'egyptian', {
          cropX: cropData.x,
          cropY: cropData.y,
          cropWidth: cropData.width,
          cropHeight: cropData.height,
        });
      } else {
        onInsertIcon(ankhId, 'egyptian');
      }
    }
  };

  const handleSaveCrop = (iconIndex: number, crop: PixelCrop) => {
    setIconCrops(prev => ({ ...prev, [iconIndex]: crop }));
    // Store in localStorage so it persists
    localStorage.setItem('egyptian-ankh-crops', JSON.stringify({ ...iconCrops, [iconIndex]: crop }));
  };

  const handleCloseEditor = () => {
    setIsEditMode(false);
  };

  const getAnkhDisplayStyle = (ankhIndex: number, cropData?: PixelCrop) => {
    if (cropData) {
      // Use custom crop
      return {
        backgroundImage: `url(${egyptianAnkhsGrid})`,
        backgroundPosition: `-${cropData.x}px -${cropData.y}px`,
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat',
        width: `${cropData.width}px`,
        height: `${cropData.height}px`,
      };
    } else {
      // Use default grid position
      const col = (ankhIndex - 1) % 4;
      const row = Math.floor((ankhIndex - 1) / 4);
      return {
        backgroundImage: `url(${egyptianAnkhsGrid})`,
        backgroundPosition: `${-col * 25}% ${-row * 25}%`,
        backgroundSize: '400% 400%',
        backgroundRepeat: 'no-repeat',
        width: '80px',
        height: '104px',
      };
    }
  };

  const handleSaveIndividualCrop = (cropData: { cropX: number; cropY: number; cropWidth: number; cropHeight: number }) => {
    if (editingAnkhIndex === null) return;

    const pixelCrop: PixelCrop = {
      x: cropData.cropX,
      y: cropData.cropY,
      width: cropData.cropWidth,
      height: cropData.cropHeight,
      unit: 'px',
    };

    setIconCrops(prev => {
      const updated = { ...prev, [editingAnkhIndex]: pixelCrop };
      localStorage.setItem('egyptian-ankh-crops', JSON.stringify(updated));
      return updated;
    });

    setAnkhCropDialogOpen(false);
    setEditingAnkhIndex(null);
  };
  return <Dialog open={open} onOpenChange={(newOpen) => {
      // Prevent accidental closing during edit mode (only allow explicit X button click)
      if (isEditMode && !newOpen) {
        return;
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className={`p-0 bg-[hsl(270,100%,95%)] border-[6px] border-[hsl(253,100%,64%)] rounded-[32px] shadow-[0_0_80px_20px_hsl(253,100%,64%,0.6),0_0_120px_30px_hsl(253,100%,64%,0.4),0_0_160px_40px_hsl(253,100%,64%,0.2)] transition-all duration-300 ${
        isEditMode 
          ? 'max-w-7xl w-[1400px] h-[900px]' 
          : 'max-w-4xl w-[900px] h-[600px]'
      }`}>
        {/* Header */}
        <DialogHeader className="relative px-8 pt-6 pb-2">
          <DialogTitle className="text-3xl font-bold text-[hsl(253,100%,30%)] text-center mb-4">
            Shapes & Icons
          </DialogTitle>
          {isEditMode && (
            <button 
              onClick={() => setIsEditMode(false)} 
              className="absolute top-4 right-6 rounded-lg px-3 py-1.5 hover:bg-purple-200/50 transition-colors flex items-center gap-2 text-[hsl(253,100%,30%)] font-semibold" 
              aria-label="Back"
            >
              ← Back
            </button>
          )}
          
          {/* Category Tabs - positioned right under title */}
          <div className="flex gap-4 justify-center items-center">
            {categories.map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-1.5 font-semibold text-[15px] transition-all duration-200 rounded-md ${selectedCategory === category.id ? 'bg-white text-[hsl(253,100%,30%)] shadow-[0_2px_8px_rgba(0,0,0,0.15)]' : 'bg-transparent text-[hsl(253,100%,30%)] hover:bg-white/40'}`}>
                {category.name}
              </button>)}
          </div>
        </DialogHeader>

        {/* Edit button - aligned with X button */}
        {selectedCategory === 'egyptian' && !isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="absolute top-4 left-6 z-10 transition-transform hover:scale-105"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(82, 0, 255, 0.8)) drop-shadow(0 0 30px rgba(82, 0, 255, 0.4))'
            }}
          >
            <img 
              src={new URL('../assets/edit-button.png', import.meta.url).href} 
              alt="Edit" 
              className="w-16 h-auto"
            />
          </button>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex relative">
          <div className="flex-1 overflow-y-auto px-8 pb-8">
          {selectedCategory === 'egyptian' ? (
            isEditMode ? (
              <IconCropEditor
                imageSrc={egyptianAnkhsGrid}
                onSaveCrop={handleSaveCrop}
                onClose={handleCloseEditor}
              />
            ) : (
              <div className="grid grid-cols-4 gap-6 max-w-3xl mx-auto p-4">
                {Array.from({ length: 16 }).map((_, index) => {
                  const ankhId = index + 1;
                  const cropData = iconCrops[ankhId];
                  
                  return (
                    <div 
                      key={ankhId} 
                      className="relative group flex items-center justify-center p-4 rounded-lg hover:bg-purple-100/30 transition-all"
                    >
                      {/* Ankh display with crop applied */}
                      <div
                        onClick={() => handleAnkhClick(`ankh-${ankhId}`)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('iconId', `ankh-${ankhId}`);
                          e.dataTransfer.setData('category', 'egyptian');
                          if (cropData) {
                            e.dataTransfer.setData('cropData', JSON.stringify({
                              cropX: cropData.x,
                              cropY: cropData.y,
                              cropWidth: cropData.width,
                              cropHeight: cropData.height,
                            }));
                          }
                        }}
                        style={getAnkhDisplayStyle(ankhId, cropData)}
                        className="cursor-pointer hover:ring-2 hover:ring-[hsl(253,100%,64%)] rounded transition-all"
                        title={`Ankh ${ankhId}${cropData ? ' (Custom Crop)' : ''}`}
                      />
                      
                      {/* Edit button (appears on hover) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAnkhIndex(ankhId);
                          setAnkhCropDialogOpen(true);
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[hsl(253,100%,64%)] text-white p-2 rounded-full hover:bg-[hsl(253,100%,54%)] shadow-lg"
                        title="Edit Crop"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Custom crop indicator */}
                      {cropData && (
                        <div className="absolute bottom-2 left-2 bg-[hsl(253,100%,64%)] text-white text-xs px-2 py-0.5 rounded-full">
                          Custom
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : <div className="w-full h-full flex items-center justify-center">
              <p className="text-[hsl(253,100%,30%)] text-lg">
                {selectedCategory === 'shapes' && 'Shapes coming soon...'}
                {selectedCategory === 'arrows' && 'Arrows coming soon...'}
                {selectedCategory === 'sumerian' && 'Sumerian symbols coming soon...'}
                {selectedCategory === 'sacred' && 'Sacred geometry coming soon...'}
                {selectedCategory === 'christianity' && 'Christianity symbols coming soon...'}
              </p>
            </div>}
          </div>
        </div>
      </DialogContent>

      {/* Individual Ankh Crop Dialog */}
      {editingAnkhIndex !== null && (
        <IconInstanceCropDialog
          open={ankhCropDialogOpen}
          onOpenChange={(open) => {
            setAnkhCropDialogOpen(open);
            if (!open) setEditingAnkhIndex(null);
          }}
          currentCrop={
            iconCrops[editingAnkhIndex]
              ? {
                  cropX: iconCrops[editingAnkhIndex].x,
                  cropY: iconCrops[editingAnkhIndex].y,
                  cropWidth: iconCrops[editingAnkhIndex].width,
                  cropHeight: iconCrops[editingAnkhIndex].height,
                }
              : undefined
          }
          onSave={handleSaveIndividualCrop}
        />
      )}
    </Dialog>;
}