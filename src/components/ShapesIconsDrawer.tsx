import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import egyptianAnkhsImage from "@/assets/egyptian-ankhs.jpg";
interface ShapesIconsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertIcon?: (iconId: string, category: string) => void;
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
  const handleAnkhClick = (ankhId: string) => {
    if (onInsertIcon) {
      onInsertIcon(ankhId, 'egyptian');
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[900px] h-[600px] p-0 bg-[hsl(270,100%,95%)] border-[6px] border-[hsl(253,100%,64%)] rounded-[32px] shadow-[0_0_80px_20px_hsl(253,100%,64%,0.6),0_0_120px_30px_hsl(253,100%,64%,0.4),0_0_160px_40px_hsl(253,100%,64%,0.2)]">
        {/* Header */}
        <DialogHeader className="relative px-8 pt-6 pb-2">
          <DialogTitle className="text-3xl font-bold text-[hsl(253,100%,30%)] text-center mb-4">
            Shapes & Icons
          </DialogTitle>
          <button onClick={() => onOpenChange(false)} className="absolute top-4 right-6 rounded-lg p-1.5 hover:bg-purple-200/50 transition-colors" aria-label="Close">
            
          </button>
          
          {/* Category Tabs - positioned right under title */}
          <div className="flex gap-4 justify-center items-center">
            {categories.map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-1.5 font-semibold text-[15px] transition-all duration-200 rounded-md ${selectedCategory === category.id ? 'bg-white text-[hsl(253,100%,30%)] shadow-[0_2px_8px_rgba(0,0,0,0.15)]' : 'bg-transparent text-[hsl(253,100%,30%)] hover:bg-white/40'}`}>
                {category.name}
              </button>)}
          </div>
        </DialogHeader>

        {/* Content Area */}
        <div className="px-8 pb-8 flex-1 overflow-y-auto">
          {selectedCategory === 'egyptian' ? <div className="w-full h-full flex items-center justify-center p-6">
              
            </div> : <div className="w-full h-full flex items-center justify-center">
              <p className="text-[hsl(253,100%,30%)] text-lg">
                {selectedCategory === 'shapes' && 'Shapes coming soon...'}
                {selectedCategory === 'arrows' && 'Arrows coming soon...'}
                {selectedCategory === 'sumerian' && 'Sumerian symbols coming soon...'}
                {selectedCategory === 'sacred' && 'Sacred geometry coming soon...'}
                {selectedCategory === 'christianity' && 'Christianity symbols coming soon...'}
              </p>
            </div>}
        </div>
      </DialogContent>
    </Dialog>;
}