import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
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
const categories = [
  { id: 'animals', name: 'Animals' },
  { id: 'objects', name: 'Objects' },
  { id: 'nature', name: 'Nature' },
  { id: 'food', name: 'Food' },
  { id: 'symbols', name: 'Symbols' },
  { id: 'educational', name: 'Educational' },
  { id: 'artful', name: 'Artful' },
  { id: 'scientific', name: 'Scientific' },
  { id: 'people', name: 'People' },
  { id: 'earth', name: 'Earth' },
  { id: 'sports', name: 'Sports' },
  { id: 'vehicles', name: 'Vehicles' },
  { id: 'professions', name: 'Professions' },
  { id: 'ornaments', name: 'Ornaments' },
  { id: 'shapes', name: 'Shapes' },
  { id: 'arrows', name: 'Arrows' },
  { id: 'samarian', name: 'Samarian' },
  { id: 'egyptian', name: 'Egyptian' },
  { id: 'christianity', name: 'Christianity' },
  { id: 'indigenous', name: 'Indigenous' },
  { id: 'sacred-geometry', name: 'Sacred geometry' },
  { id: 'quantum-physics', name: 'Quantum physics' },
];
export function ShapesIconsDrawer({
  open,
  onOpenChange,
  onInsertIcon
}: ShapesIconsDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('animals');
  const [isEditMode, setIsEditMode] = useState(false);
  const [iconCrops, setIconCrops] = useState<Record<number, PixelCrop>>({});
  const [selectedAnkhIndex, setSelectedAnkhIndex] = useState<number | null>(null);
  const [previousCategory, setPreviousCategory] = useState<string>('animals');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const scrollToCategory = (categoryId: string) => {
    const categoryButton = categoryRefs.current[categoryId];
    if (categoryButton && scrollContainerRef.current) {
      categoryButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  const handleNextCategory = () => {
    const currentIndex = categories.findIndex(cat => cat.id === selectedCategory);
    const nextIndex = (currentIndex + 1) % categories.length;
    const nextCategory = categories[nextIndex].id;
    setSelectedCategory(nextCategory);
    setTimeout(() => scrollToCategory(nextCategory), 50);
  };

  const handlePrevCategory = () => {
    const currentIndex = categories.findIndex(cat => cat.id === selectedCategory);
    const prevIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1;
    const prevCategory = categories[prevIndex].id;
    setSelectedCategory(prevCategory);
    setTimeout(() => scrollToCategory(prevCategory), 50);
  };

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
    setSelectedCategory(previousCategory);
  };

  const handleOpenEditor = () => {
    setPreviousCategory(selectedCategory);
    setSelectedCategory('egyptian');
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
      <DialogContent className={`p-0 bg-[hsl(270,100%,95%)] border-[6px] border-[hsl(253,100%,64%)] rounded-[32px] shadow-[0_0_80px_20px_hsl(253,100%,64%,0.6),0_0_120px_30px_hsl(253,100%,64%,0.4),0_0_160px_40px_hsl(253,100%,64%,0.2)] transition-all duration-300 ${
        isEditMode
          ? 'max-w-7xl w-[1400px] h-[900px]' 
          : 'max-w-[950px] w-[950px] h-[650px]'
      }`}>
        {/* Edit button - always visible in non-edit mode */}
        {!isEditMode && (
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
        
        {/* Header */}
        <DialogHeader className="px-8 pt-6 pb-3 bg-[hsl(270,100%,95%)] rounded-t-[26px] overflow-hidden">
          {!isEditMode && (
            <>
              <DialogTitle className="text-3xl font-bold text-[hsl(253,100%,30%)] text-center mb-3">
                Shapes & Icons
              </DialogTitle>
              
              {/* Search Bar */}
              <div className="relative mb-4 max-w-sm mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(253,100%,30%)]/60" />
                <Input
                  placeholder="Search shapes and icons..."
                  className="pl-10 bg-white/80 border-[hsl(253,100%,64%)]/30 text-[hsl(253,100%,30%)] placeholder:text-[hsl(253,100%,30%)]/50 focus:border-[hsl(253,100%,64%)] focus:ring-[hsl(253,100%,64%)]"
                />
              </div>
              
               {/* Category Tabs with Plus Icon - scrollable horizontally */}
               <div className="w-full border-t border-[hsl(253,60%,88%)]">
                <div className="relative pt-3 pb-1">
                  {/* Left Arrow - Fixed */}
                  <button
                    onClick={handlePrevCategory}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex-shrink-0 w-5 h-5 flex items-center justify-center bg-white border border-[hsl(253,100%,30%)]/30 rounded-[3px] hover:bg-[hsl(253,100%,64%)]/20 hover:border-[hsl(253,100%,64%)] transition-all duration-200 shadow-sm"
                    aria-label="Previous category"
                  >
                    <ChevronLeft className="w-3 h-3 text-[hsl(253,100%,30%)]" strokeWidth={2.5} />
                  </button>
                  
                  {/* Right Arrow - Fixed */}
                  <button
                    onClick={handleNextCategory}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex-shrink-0 w-5 h-5 flex items-center justify-center bg-white border border-[hsl(253,100%,30%)]/30 rounded-[3px] hover:bg-[hsl(253,100%,64%)]/20 hover:border-[hsl(253,100%,64%)] transition-all duration-200 shadow-sm"
                    aria-label="Next category"
                  >
                    <ChevronRight className="w-3 h-3 text-[hsl(253,100%,30%)]" strokeWidth={2.5} />
                  </button>
                  
                  {/* Scrollable Container */}
                  <div ref={scrollContainerRef} className="overflow-x-auto overflow-y-hidden scrollbar-hide mx-9">
                    <div className="flex gap-3 items-center px-2 min-w-min">
                      {/* Plus Icon Box */}
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-white border border-[hsl(253,100%,30%)]/30 rounded-[3px]">
                        <Plus className="w-3 h-3 text-[hsl(253,100%,30%)]/50" strokeWidth={2.5} />
                      </div>
                      
                      {/* Category Tabs */}
                      {categories.map(category => (
                        <button
                          key={category.id}
                          ref={el => categoryRefs.current[category.id] = el}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`px-4 py-1.5 font-semibold text-[15px] transition-all duration-200 rounded-md whitespace-nowrap flex-shrink-0 ${
                            selectedCategory === category.id
                              ? 'bg-white text-[hsl(253,100%,30%)] shadow-[0_2px_12px_rgba(82,0,255,0.25),0_4px_20px_rgba(82,0,255,0.15)] border-2 border-[hsl(253,100%,64%)]/40'
                              : 'bg-transparent text-[hsl(253,100%,30%)] hover:bg-white/40'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Purple Scroll Indicator */}
                <div className="w-full flex justify-start pt-2 pb-2 px-2">
                  <div className="w-72 h-1.5 bg-[hsl(253,100%,64%)] rounded-full opacity-70" />
                </div>
              </div>
            </>
          )}
          
          {isEditMode && (
            <button 
              onClick={() => setIsEditMode(false)} 
              className="absolute top-4 right-6 rounded-lg px-3 py-1.5 hover:bg-purple-200/50 transition-colors flex items-center gap-2 text-[hsl(253,100%,30%)] font-semibold" 
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </DialogHeader>

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
          ) : (
            <div className="w-full h-full flex items-center justify-center">
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
                {selectedCategory === 'samarian' && 'Samarian coming soon...'}
                {selectedCategory === 'christianity' && 'Christianity coming soon...'}
                {selectedCategory === 'indigenous' && 'Indigenous coming soon...'}
                {selectedCategory === 'sacred-geometry' && 'Sacred geometry coming soon...'}
                {selectedCategory === 'quantum-physics' && 'Quantum physics coming soon...'}
              </p>
            </div>
          )}
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}