import { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Wand2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface IconCropEditorProps {
  imageSrc: string;
  onSaveCrop: (iconIndex: number, crop: PixelCrop) => void;
  onClose: () => void;
}

export function IconCropEditor({ imageSrc, onSaveCrop, onClose }: IconCropEditorProps) {
  const [crop, setCrop] = useState<Crop>();
  const [selectedIcon, setSelectedIcon] = useState(1);
  const [isInstructionsVisible, setIsInstructionsVisible] = useState(true);
  const [detectedRegions, setDetectedRegions] = useState<PixelCrop[]>([]);
  const [currentRegionIndex, setCurrentRegionIndex] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleSave = () => {
    if (crop && crop.width && crop.height) {
      onSaveCrop(selectedIcon, crop as PixelCrop);
      toast.success(`Crop saved for Ankh ${selectedIcon}`);
    }
  };

  const detectMultipleRegions = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): PixelCrop[] => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const visited = new Set<string>();
    const regions: PixelCrop[] = [];
    
    const alphaThreshold = 30;
    const brightnessThreshold = 250;
    
    const isValidPixel = (x: number, y: number): boolean => {
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return false;
      const index = (y * canvas.width + x) * 4;
      const alpha = data[index + 3];
      const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
      return alpha > alphaThreshold && brightness < brightnessThreshold;
    };
    
    const floodFill = (startX: number, startY: number): PixelCrop | null => {
      const queue: [number, number][] = [[startX, startY]];
      let minX = startX, maxX = startX, minY = startY, maxY = startY;
      let pixelCount = 0;
      
      while (queue.length > 0) {
        const [x, y] = queue.shift()!;
        const key = `${x},${y}`;
        
        if (visited.has(key) || !isValidPixel(x, y)) continue;
        
        visited.add(key);
        pixelCount++;
        
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        
        queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
      
      // Filter out very small regions (noise)
      if (pixelCount < 100) return null;
      
      const padding = 2;
      return {
        x: Math.max(0, minX - padding),
        y: Math.max(0, minY - padding),
        width: Math.min(canvas.width, maxX + padding) - Math.max(0, minX - padding),
        height: Math.min(canvas.height, maxY + padding) - Math.max(0, minY - padding),
        unit: 'px'
      };
    };
    
    // Scan for regions
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const key = `${x},${y}`;
        if (!visited.has(key) && isValidPixel(x, y)) {
          const region = floodFill(x, y);
          if (region) regions.push(region);
        }
      }
    }
    
    return regions.sort((a, b) => a.x - b.x || a.y - b.y);
  };

  const handleAutoCrop = () => {
    if (!imageRef.current) {
      toast.error("Image not loaded yet");
      return;
    }

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error("Failed to create canvas context");
      return;
    }

    ctx.drawImage(img, 0, 0);
    
    try {
      const regions = detectMultipleRegions(canvas, ctx);
      
      if (regions.length === 0) {
        toast.error("Could not detect any icons. Try manual cropping.");
        return;
      }
      
      setDetectedRegions(regions);
      setCurrentRegionIndex(0);
      setCrop(regions[0]);
      
      if (regions.length === 1) {
        toast.success("1 icon detected! Adjust if needed.");
      } else {
        toast.success(`${regions.length} icons detected! Use arrows to navigate.`);
      }
    } catch (error) {
      console.error("Auto-crop error:", error);
      toast.error("Auto-crop failed. Please crop manually.");
    }
  };
  
  const handleNextRegion = () => {
    if (detectedRegions.length === 0) return;
    const nextIndex = (currentRegionIndex + 1) % detectedRegions.length;
    setCurrentRegionIndex(nextIndex);
    setCrop(detectedRegions[nextIndex]);
    toast.info(`Icon ${nextIndex + 1} of ${detectedRegions.length}`);
  };
  
  const handlePrevRegion = () => {
    if (detectedRegions.length === 0) return;
    const prevIndex = currentRegionIndex === 0 ? detectedRegions.length - 1 : currentRegionIndex - 1;
    setCurrentRegionIndex(prevIndex);
    setCrop(detectedRegions[prevIndex]);
    toast.info(`Icon ${prevIndex + 1} of ${detectedRegions.length}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex gap-4 items-center">
          <Label>Icon Slot:</Label>
          <select
            value={selectedIcon}
            onChange={(e) => setSelectedIcon(Number(e.target.value))}
            className="px-3 py-1 border rounded-md"
          >
            {Array.from({ length: 16 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Ankh {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <Button onClick={handleAutoCrop} variant="secondary" size="sm">
            <Wand2 className="w-4 h-4 mr-1" />
            Auto-Crop
          </Button>
          {detectedRegions.length > 1 && (
            <div className="flex gap-1 items-center border rounded-md">
              <Button onClick={handlePrevRegion} variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm px-2">
                {currentRegionIndex + 1}/{detectedRegions.length}
              </span>
              <Button onClick={handleNextRegion} variant="ghost" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Button onClick={handleSave} size="sm">
            Save Crop
          </Button>
          <Button onClick={onClose} variant="outline" size="sm">
            Done
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,white_0%_50%)] bg-[length:20px_20px]">
        <div className="mb-2 text-sm text-muted-foreground">
          {crop?.width && crop?.height && (
            <span>Crop size: {Math.round(crop.width)} × {Math.round(crop.height)}px</span>
          )}
        </div>
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          ruleOfThirds
          minWidth={10}
          minHeight={10}
        >
          <img 
            ref={imageRef}
            src={imageSrc} 
            alt="Crop editor" 
            className="max-w-full" 
            style={{ imageRendering: 'crisp-edges' }} 
          />
        </ReactCrop>
      </div>

      {isInstructionsVisible && (
        <div className="p-4 bg-gray-50 text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <p>1. Select icon slot from dropdown</p>
          <p>2. Click "Auto-Crop" to detect all icons automatically</p>
          <p>3. Use arrow buttons to navigate between detected icons (if multiple)</p>
          <p>4. Manually adjust crop box by dragging corners or sides</p>
          <p>5. Click "Save Crop" to store the current crop</p>
          <p>6. Repeat for all 16 icons</p>
          <p className="mt-2 text-xs italic">Checkered background indicates transparency</p>
        </div>
      )}

      <Button
        onClick={() => setIsInstructionsVisible(!isInstructionsVisible)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-10 shadow-lg"
      >
        {isInstructionsVisible ? (
          <ChevronDown className="w-4 h-4 mr-1" />
        ) : (
          <ChevronUp className="w-4 h-4 mr-1" />
        )}
        {isInstructionsVisible ? "Hide" : "Show"} Instructions
      </Button>
    </div>
  );
}
