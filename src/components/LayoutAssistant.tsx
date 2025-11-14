import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AlignmentGuides } from "./AlignmentGuides";
import { Move, Grid3x3, AlignCenter, AlignLeft, AlignRight, Check, X } from "lucide-react";
import { toast } from "sonner";

interface LayoutAssistantProps {
  isActive: boolean;
  onClose: () => void;
  editorElement: HTMLElement | null;
}

export const LayoutAssistant = ({ isActive, onClose, editorElement }: LayoutAssistantProps) => {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive || !editorElement) return;

    // Add click handlers to editor elements
    const handleElementClick = (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      
      // Only select headings, paragraphs, and other block elements
      if (target.matches('h1, h2, h3, h4, h5, h6, p, div.ProseMirror > *')) {
        setSelectedElement(target);
        
        // Get current position
        const rect = target.getBoundingClientRect();
        const editorRect = editorElement.getBoundingClientRect();
        setElementPosition({
          x: rect.left - editorRect.left,
          y: rect.top - editorRect.top
        });
        
        // Highlight selected element
        target.style.outline = '2px solid hsl(253, 100%, 64%)';
        target.style.cursor = 'move';
        toast("Element selected - drag to reposition");
      }
    };

    editorElement.addEventListener('click', handleElementClick);

    return () => {
      editorElement.removeEventListener('click', handleElementClick);
      // Clean up outline on exit
      if (selectedElement) {
        selectedElement.style.outline = '';
        selectedElement.style.cursor = '';
      }
    };
  }, [isActive, editorElement, selectedElement]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedElement) return;
    
    setIsDragging(true);
    const rect = selectedElement.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement || !editorElement) return;

    const editorRect = editorElement.getBoundingClientRect();
    const newX = e.clientX - editorRect.left - dragOffset.x;
    const newY = e.clientY - editorRect.top - dragOffset.y;

    setElementPosition({ x: newX, y: newY });
    
    // Apply position
    selectedElement.style.position = 'relative';
    selectedElement.style.left = `${newX}px`;
    selectedElement.style.top = `${newY}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAlignCenter = () => {
    if (!selectedElement || !editorElement) return;
    
    const editorRect = editorElement.getBoundingClientRect();
    const elementRect = selectedElement.getBoundingClientRect();
    const centerX = (editorRect.width - elementRect.width) / 2;
    
    selectedElement.style.position = 'relative';
    selectedElement.style.left = `${centerX}px`;
    setElementPosition({ ...elementPosition, x: centerX });
    toast("Centered horizontally");
  };

  const handleAlignLeft = () => {
    if (!selectedElement) return;
    
    selectedElement.style.position = 'relative';
    selectedElement.style.left = '0px';
    setElementPosition({ ...elementPosition, x: 0 });
    toast("Aligned left");
  };

  const handleAlignRight = () => {
    if (!selectedElement || !editorElement) return;
    
    const editorRect = editorElement.getBoundingClientRect();
    const elementRect = selectedElement.getBoundingClientRect();
    const rightX = editorRect.width - elementRect.width;
    
    selectedElement.style.position = 'relative';
    selectedElement.style.left = `${rightX}px`;
    setElementPosition({ ...elementPosition, x: rightX });
    toast("Aligned right");
  };

  const handleConfirm = () => {
    if (selectedElement) {
      selectedElement.style.outline = '';
      selectedElement.style.cursor = '';
      toast.success("Layout confirmed! Position saved.");
    }
    setSelectedElement(null);
  };

  const handleCancel = () => {
    if (selectedElement) {
      selectedElement.style.position = '';
      selectedElement.style.left = '';
      selectedElement.style.top = '';
      selectedElement.style.outline = '';
      selectedElement.style.cursor = '';
      toast("Changes cancelled");
    }
    setSelectedElement(null);
  };

  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Toolbar */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-white rounded-lg shadow-lg border border-[hsl(253,60%,88%)] p-2 flex flex-col gap-2">
          <div className="text-sm font-semibold text-[hsl(253,100%,30%)] px-2">Layout Assistant</div>
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={showGrid ? "default" : "outline"}
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle Grid"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>

          {selectedElement && (
            <>
              <div className="h-px bg-[hsl(253,60%,88%)]" />
              
              <div className="text-xs text-[hsl(253,100%,30%)]/60 px-2">Alignment</div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAlignLeft}
                  title="Align Left"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAlignCenter}
                  title="Center"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAlignRight}
                  title="Align Right"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="h-px bg-[hsl(253,60%,88%)]" />
              
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirm}
                  className="flex-1 bg-[hsl(253,100%,64%)] hover:bg-[hsl(253,100%,54%)]"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Confirm
                </Button>
              </div>
            </>
          )}
          
          <div className="h-px bg-[hsl(253,60%,88%)]" />
          
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Close Assistant
          </Button>
        </div>

        {selectedElement && (
          <div className="bg-white rounded-lg shadow-lg border border-[hsl(253,60%,88%)] p-2 text-xs">
            <div className="text-[hsl(253,100%,30%)]/60">Position</div>
            <div className="text-[hsl(253,100%,30%)] font-mono">
              X: {Math.round(elementPosition.x)}px<br />
              Y: {Math.round(elementPosition.y)}px
            </div>
          </div>
        )}
      </div>

      {/* Alignment Guides */}
      {showGrid && editorElement && (
        <AlignmentGuides editorElement={editorElement} />
      )}

      {/* Drag overlay */}
      {selectedElement && (
        <div
          className="absolute inset-0 pointer-events-auto cursor-move"
          onMouseDown={handleMouseDown}
        />
      )}

      {/* Instructions */}
      {!selectedElement && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-[hsl(253,60%,88%)] p-4 pointer-events-auto max-w-md">
          <div className="flex items-start gap-3">
            <Move className="h-5 w-5 text-[hsl(253,100%,64%)] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-[hsl(253,100%,30%)] mb-1">How to use:</div>
              <ul className="text-sm text-[hsl(253,100%,30%)]/80 space-y-1">
                <li>• Click any heading or paragraph to select it</li>
                <li>• Drag the element to reposition it</li>
                <li>• Use alignment buttons to center or align</li>
                <li>• Click Confirm to save the position</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
