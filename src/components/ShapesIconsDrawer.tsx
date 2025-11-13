import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShapesIconsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { id: 'shapes', name: 'Shapes' },
  { id: 'arrows', name: 'Arrows' },
  { id: 'sumerian', name: 'Sumerian' },
  { id: 'egyptian', name: 'Egyptian' },
  { id: 'sacred', name: 'Sacred' },
  { id: 'christianity', name: 'Christianity' },
];

export function ShapesIconsDrawer({ open, onOpenChange }: ShapesIconsDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('shapes');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl w-[900px] h-[600px] p-0 bg-[hsl(270,100%,95%)] border-[6px] border-[hsl(253,100%,64%)] rounded-[32px] shadow-[0_0_80px_20px_hsl(253,100%,64%,0.6),0_0_120px_30px_hsl(253,100%,64%,0.4),0_0_160px_40px_hsl(253,100%,64%,0.2)]"
      >
        {/* Header */}
        <DialogHeader className="relative px-8 pt-6 pb-4">
          <DialogTitle className="text-3xl font-bold text-[hsl(253,100%,30%)] text-center">
            Shapes & Icons
          </DialogTitle>
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-6 right-8 rounded-lg p-1.5 hover:bg-purple-200/50 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-[hsl(253,100%,64%)]" />
          </button>
        </DialogHeader>

        {/* Category Tabs */}
        <div className="px-8 pb-4">
          <div className="flex gap-3 justify-start">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-full font-semibold text-[15px] transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[hsl(253,100%,64%)] text-white shadow-[0_0_20px_hsl(253,100%,64%,0.5)]'
                    : 'bg-white text-[hsl(253,100%,30%)] hover:bg-purple-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 pb-8 flex-1 overflow-y-auto">
          <div className="w-full h-full bg-[hsl(270,100%,95%)] rounded-2xl">
            {/* Content for selected category will go here */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
