import { X, FileImage, Cross, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { SumerianIcon, EgyptianIcon, SacredGeometryIcon } from "./icons/CategoryIcons";
import { SquareFrame, CircleNode, TrianglePointer } from "./icons/CoreShapes";

interface ShapesIconsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { 
    id: 'shapes', 
    name: 'Shapes', 
    icon: () => (
      <div className="flex items-center gap-0.5">
        <CircleNode className="w-3 h-3" />
        <SquareFrame className="w-3 h-3" />
        <TrianglePointer className="w-3 h-3" />
      </div>
    )
  },
  { 
    id: 'icons', 
    name: 'Icons', 
    icon: FileImage 
  },
  { 
    id: 'sumerian', 
    name: 'Sumerian', 
    icon: SumerianIcon 
  },
  { 
    id: 'egyptian', 
    name: 'Egyptian', 
    icon: EgyptianIcon 
  },
  { 
    id: 'sacred-geometry', 
    name: 'Sacred Geometry', 
    icon: SacredGeometryIcon 
  },
  { 
    id: 'christianity', 
    name: 'Christianity', 
    icon: Cross 
  },
  { 
    id: 'arrows', 
    name: 'Arrows', 
    icon: ArrowRight 
  },
];

export function ShapesIconsDrawer({ open, onOpenChange }: ShapesIconsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left"
        className="w-[420px] rounded-r-xl bg-white shadow-[0_0_60px_hsl(253,100%,64%,0.4),0_12px_48px_hsl(253,100%,64%,0.3),0_0_100px_hsl(253,100%,64%,0.2)] border-r-[1.5px] border-[hsl(253,100%,64%,0.3)] p-0"
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between border-b border-purple-100 px-5 py-4">
          <SheetTitle className="text-xl font-bold text-[#1C1C1C]">
            Shapes & Icons
          </SheetTitle>
          <SheetClose asChild>
            <button 
              className="rounded-lg p-1.5 hover:bg-purple-50 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-[hsl(253,100%,64%)]" />
            </button>
          </SheetClose>
        </SheetHeader>

        {/* Category List */}
        <div className="p-5 space-y-3 overflow-y-auto max-h-[calc(100vh-120px)]">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isCustomIcon = category.id === 'shapes';
            
            return (
              <button
                key={category.id}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] bg-white border-[1.5px] border-[hsl(253,100%,64%,0.3)] hover:border-[hsl(253,100%,64%,0.5)] hover:shadow-[0_0_20px_hsl(253,100%,64%,0.3)] transition-all duration-200 group"
              >
                <div className="flex-shrink-0 text-[hsl(253,100%,64%)] group-hover:text-[hsl(266,100%,70%)] transition-colors">
                  {isCustomIcon ? (
                    <IconComponent />
                  ) : (
                    <IconComponent className="h-5 w-5" />
                  )}
                </div>
                <span className="text-[#1C1C1C] font-medium text-[15px]">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
