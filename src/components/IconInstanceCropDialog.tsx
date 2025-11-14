import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import egyptianAnkhsGrid from "@/assets/egyptian-ankhs-grid.png";

interface IconInstanceCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCrop?: {
    cropX: number;
    cropY: number;
    cropWidth: number;
    cropHeight: number;
  };
  onSave: (cropData: {
    cropX: number;
    cropY: number;
    cropWidth: number;
    cropHeight: number;
  }) => void;
}

export function IconInstanceCropDialog({
  open,
  onOpenChange,
  currentCrop,
  onSave,
}: IconInstanceCropDialogProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    x: currentCrop?.cropX || 0,
    y: currentCrop?.cropY || 0,
    width: currentCrop?.cropWidth || 200,
    height: currentCrop?.cropHeight || 260,
  });

  const [completedCrop, setCompletedCrop] = useState<PixelCrop | undefined>(
    currentCrop ? {
      unit: "px",
      x: currentCrop.cropX,
      y: currentCrop.cropY,
      width: currentCrop.cropWidth,
      height: currentCrop.cropHeight,
    } : undefined
  );

  const handleSave = () => {
    if (completedCrop) {
      onSave({
        cropX: completedCrop.x,
        cropY: completedCrop.y,
        cropWidth: completedCrop.width,
        cropHeight: completedCrop.height,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[900px] h-[700px] bg-[hsl(270,100%,95%)] border-[6px] border-[hsl(253,100%,64%)] rounded-[32px] shadow-[0_0_80px_20px_hsl(253,100%,64%,0.6)]">
        <DialogHeader className="px-8 pt-6 pb-2">
          <DialogTitle className="text-3xl font-bold text-[hsl(253,100%,30%)] text-center">
            Crop Icon
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-8 pb-8">
          <div className="relative max-w-2xl mx-auto">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={undefined}
            >
              <img src={egyptianAnkhsGrid} alt="Crop area" className="max-w-full" />
            </ReactCrop>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-[hsl(253,100%,64%)] to-[hsl(266,100%,70%)] hover:from-[hsl(253,100%,70%)] hover:to-[hsl(266,100%,75%)] text-white px-6"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
