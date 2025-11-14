import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconCropEditor } from "./IconCropEditor";
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
  id: 'animals',
  name: 'Animals'
}, {
  id: 'objects',
  name: 'Objects'
}, {
  id: 'nature',
  name: 'Nature'
}, {
  id: 'food',
  name: 'Food'
}, {
  id: 'symbols',
  name: 'Symbols'
}, {
  id: 'educational',
  name: 'Educational'
}, {
  id: 'artful',
  name: 'Artful'
}, {
  id: 'scientific',
  name: 'Scientific'
}, {
  id: 'people',
  name: 'People'
}, {
  id: 'earth',
  name: 'Earth'
}, {
  id: 'sports',
  name: 'Sports'
}, {
  id: 'vehicles',
  name: 'Vehicles'
}, {
  id: 'professions',
  name: 'Professions'
}, {
  id: 'ornaments',
  name: 'Ornaments'
}, {
  id: 'shapes',
  name: 'Shapes'
}, {
  id: 'arrows',
  name: 'Arrows'
}, {
  id: 'samarian',
  name: 'Samarian'
}, {
  id: 'egyptian',
  name: 'Egyptian'
}, {
  id: 'christianity',
  name: 'Christianity'
}, {
  id: 'indigenous',
  name: 'Indigenous'
}, {
  id: 'sacred',
  name: 'Sacred Geometry'
}, {
  id: 'quantum',
  name: 'Quantum Physics'
}];
export function ShapesIconsDrawer({
  open,
  onOpenChange,
  onInsertIcon
}: ShapesIconsDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('animals');
  const [isEditMode, setIsEditMode] = useState(false);
  const [iconCrops, setIconCrops] = useState<Record<number, PixelCrop>>({});
  const [selectedAnkhIndex, setSelectedAnkhIndex] = useState<number | null>(null);

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
    // Get the ankh number from the id (e.g., 'ankh-1' -> 1)
    const ankhNum = parseInt(ankhId.replace('ankh-', ''));
    
    // Clicking always just selects the icon
    setSelectedAnkhIndex(ankhNum);
  };

  const handleSaveCrop = (iconIndex: number, crop: PixelCrop) => {
    const newCrops = { ...iconCrops, [iconIndex]: crop };
    setIconCrops(newCrops);
    localStorage.setItem('egyptian-ankh-crops', JSON.stringify(newCrops));
  };

  const handleCloseEditor = () => {
    setIsEditMode(false);
    setSelectedAnkhIndex(null);
  };

  const handleOpenEditor = () => {
    setIsEditMode(true);
    // Auto-select the first ankh if none selected
    if (selectedAnkhIndex === null) {
      setSelectedAnkhIndex(1);
    }
  };
  return <Dialog open={open} onOpenChange={(newOpen) => {
      // Prevent accidental closing during edit mode
      if (isEditMode && !newOpen) {
        return;
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className={`relative p-0 bg-[hsl(270,100%,95%)] border-[6px] border-[hsl(253,100%,64%)] rounded-[32px] shadow-[0_0_80px_20px_hsl(253,100%,64%,0.6),0_0_120px_30px_hsl(253,100%,64%,0.4),0_0_160px_40px_hsl(253,100%,64%,0.2)] transition-all duration-300 ${
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
          <div className="overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-4 items-center min-w-max px-4">
              {categories.map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-1.5 font-semibold text-[15px] transition-all duration-200 rounded-md whitespace-nowrap flex-shrink-0 ${selectedCategory === category.id ? 'bg-white text-[hsl(253,100%,30%)] shadow-[0_2px_8px_rgba(0,0,0,0.15)]' : 'bg-transparent text-[hsl(253,100%,30%)] hover:bg-white/40'}`}>
                  {category.name}
                </button>)}
            </div>
          </div>
        </DialogHeader>

        {/* Edit button - aligned with X button */}
        {selectedCategory === 'egyptian' && !isEditMode && (
          <button
            onClick={handleOpenEditor}
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
                initialSelectedIcon={selectedAnkhIndex || 1}
                existingCrops={iconCrops}
              />
            ) : (
              <div className="relative max-w-3xl mx-auto">
              <img src={egyptianAnkhsGrid} alt="Egyptian Ankhs Grid" className="w-full h-auto block" />
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4" style={{ padding: '2% 8%' }}>
                {Array.from({ length: 16 }).map((_, index) => {
                  const ankhNum = index + 1;
                  const isSelected = selectedAnkhIndex === ankhNum;
                  const cropData = iconCrops[ankhNum];
                  const hasCrop = cropData !== undefined;
                  
                  return (
                  <button
                      key={index}
                      onClick={() => handleAnkhClick(`ankh-${ankhNum}`)}
                      draggable
                      onDragStart={(e) => {
                        // Create a custom drag preview
                        const dragPreview = document.createElement('div');
                        dragPreview.style.position = 'absolute';
                        dragPreview.style.top = '-1000px';
                        dragPreview.style.width = '100px';
                        dragPreview.style.height = '130px';
                        dragPreview.style.opacity = '0.7';
                        dragPreview.style.pointerEvents = 'none';
                        
                        if (cropData) {
                          dragPreview.style.backgroundImage = `url(${egyptianAnkhsGrid})`;
                          dragPreview.style.backgroundPosition = `-${cropData.x}px -${cropData.y}px`;
                          dragPreview.style.backgroundSize = `${cropData.width > 0 ? (100 * 100) / cropData.width : 100}% auto`;
                          dragPreview.style.backgroundRepeat = 'no-repeat';
                        } else {
                          // Fallback to grid-based positioning for uncropped icons
                          const col = (ankhNum - 1) % 4;
                          const row = Math.floor((ankhNum - 1) / 4);
                          const percentX = (col * 100) / 3;
                          const percentY = (row * 100) / 3;
                          
                          dragPreview.style.backgroundImage = `url(${egyptianAnkhsGrid})`;
                          dragPreview.style.backgroundSize = '400% 400%';
                          dragPreview.style.backgroundPosition = `${percentX}% ${percentY}%`;
                          dragPreview.style.backgroundRepeat = 'no-repeat';
                        }
                        
                        document.body.appendChild(dragPreview);
                        e.dataTransfer.setDragImage(dragPreview, 50, 65);
                        
                        // Clean up the preview element after drag starts
                        setTimeout(() => {
                          document.body.removeChild(dragPreview);
                        }, 0);
                        
                        e.dataTransfer.setData('iconId', `ankh-${ankhNum}`);
                        e.dataTransfer.setData('category', 'egyptian');
                        
                        // Include crop data if it exists
                        if (cropData) {
                          e.dataTransfer.setData('cropData', JSON.stringify({
                            cropX: cropData.x,
                            cropY: cropData.y,
                            cropWidth: cropData.width,
                            cropHeight: cropData.height,
                          }));
                        }
                        
                        // Close the drawer after a brief delay so drag preview is set
                        setTimeout(() => onOpenChange(false), 50);
                      }}
                      className={`relative w-full h-full border-2 transition-all cursor-pointer overflow-hidden ${
                        isSelected 
                          ? 'border-[hsl(253,100%,64%)] bg-purple-200/50' 
                          : 'border-transparent hover:border-[hsl(253,100%,64%)] hover:bg-purple-200/30'
                      }`}
                      style={{ aspectRatio: '1 / 1.3' }}
                      title={`Ankh ${ankhNum}${hasCrop ? ' (cropped)' : ''}`}
                    >
                      {hasCrop && (
                        <div 
                          className="absolute inset-0 bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url(${egyptianAnkhsGrid})`,
                            backgroundPosition: `-${cropData.x}px -${cropData.y}px`,
                            backgroundSize: `${cropData.width > 0 ? (100 * 100) / cropData.width : 100}% auto`,
                            transform: 'scale(1.2)',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            )
          ) : <div className="w-full h-full flex items-center justify-center">
              <p className="text-[hsl(253,100%,30%)] text-lg">
                {selectedCategory === 'animals' && 'Animals coming soon...'}
                {selectedCategory === 'objects' && 'Objects coming soon...'}
                {selectedCategory === 'nature' && 'Nature coming soon...'}
                {selectedCategory === 'food' && 'Food coming soon...'}
                {selectedCategory === 'symbols' && 'Symbols coming soon...'}
                {selectedCategory === 'educational' && 'Educational coming soon...'}
                {selectedCategory === 'artful' && 'Artful coming soon...'}
                {selectedCategory === 'scientific' && 'Scientific coming soon...'}
                {selectedCategory === 'people' && 'People coming soon...'}
                {selectedCategory === 'earth' && 'Earth coming soon...'}
                {selectedCategory === 'sports' && 'Sports coming soon...'}
                {selectedCategory === 'vehicles' && 'Vehicles coming soon...'}
                {selectedCategory === 'professions' && 'Professions coming soon...'}
                {selectedCategory === 'ornaments' && 'Ornaments coming soon...'}
                {selectedCategory === 'shapes' && 'Shapes coming soon...'}
                {selectedCategory === 'arrows' && 'Arrows coming soon...'}
                {selectedCategory === 'samarian' && 'Samarian symbols coming soon...'}
                {selectedCategory === 'christianity' && 'Christianity symbols coming soon...'}
                {selectedCategory === 'indigenous' && 'Indigenous symbols coming soon...'}
                {selectedCategory === 'sacred' && 'Sacred Geometry coming soon...'}
                {selectedCategory === 'quantum' && 'Quantum Physics coming soon...'}
              </p>
            </div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}