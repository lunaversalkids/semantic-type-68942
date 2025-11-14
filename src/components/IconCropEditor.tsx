import { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Wand2, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

interface IconCropEditorProps {
  imageSrc: string;
  onSaveCrop: (iconIndex: number, crop: PixelCrop) => void;
  onClose: () => void;
}

export function IconCropEditor({ imageSrc, onSaveCrop, onClose }: IconCropEditorProps) {
  const [crop, setCrop] = useState<Crop>();
  const [selectedIcon, setSelectedIcon] = useState(1);
  const [isSquareMode, setIsSquareMode] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleSave = () => {
    if (crop && crop.width && crop.height) {
      onSaveCrop(selectedIcon, crop as PixelCrop);
      toast.success(`Crop saved for Ankh ${selectedIcon}`);
    }
  };

  const detectEdges = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = 0;
    let maxY = 0;
    
    // Threshold for detecting non-transparent/non-white pixels
    const alphaThreshold = 30;
    const brightnessThreshold = 250;
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3];
        const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
        
        // Check if pixel is visible and not white
        if (alpha > alphaThreshold && brightness < brightnessThreshold) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    // Add small padding
    const padding = 2;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(canvas.width, maxX + padding);
    maxY = Math.min(canvas.height, maxY + padding);
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
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
      const detectedCrop = detectEdges(canvas, ctx);
      
      if (detectedCrop.width > 0 && detectedCrop.height > 0) {
        // Convert to percentage-based crop for ReactCrop
        const percentCrop: Crop = {
          unit: 'px',
          x: detectedCrop.x,
          y: detectedCrop.y,
          width: detectedCrop.width,
          height: detectedCrop.height
        };
        
        setCrop(percentCrop);
        toast.success("Auto-crop detected! Adjust if needed.");
      } else {
        toast.error("Could not detect edges. Try manual cropping.");
      }
    } catch (error) {
      console.error("Auto-crop error:", error);
      toast.error("Auto-crop failed. Please crop manually.");
    }
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
          <Button 
            onClick={() => setIsSquareMode(!isSquareMode)} 
            variant={isSquareMode ? "default" : "outline"} 
            size="sm"
          >
            {isSquareMode ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
            {isSquareMode ? "Square" : "Free"}
          </Button>
          <Button onClick={handleAutoCrop} variant="secondary" size="sm">
            <Wand2 className="w-4 h-4 mr-1" />
            Auto-Crop
          </Button>
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
          aspect={isSquareMode ? 1 : undefined}
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

      <div className="p-4 bg-gray-50 text-sm text-gray-600">
        <p><strong>Instructions:</strong></p>
        <p>1. Select icon slot from dropdown</p>
        <p>2. Toggle <strong>Square/Free</strong> mode for aspect ratio control</p>
        <p>3. Click "Auto-Crop" to detect edges automatically, or draw manually</p>
        <p>4. Adjust crop box by dragging corners or sides</p>
        <p>5. Click "Save Crop" to store it</p>
        <p>6. Repeat for all 16 icons</p>
        <p className="mt-2 text-xs italic">Checkered background indicates transparency</p>
      </div>
    </div>
  );
}
