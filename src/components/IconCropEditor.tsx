import { useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface IconCropEditorProps {
  imageSrc: string;
  onSaveCrop: (iconIndex: number, crop: PixelCrop) => void;
  onClose: () => void;
}

export function IconCropEditor({ imageSrc, onSaveCrop, onClose }: IconCropEditorProps) {
  const [crop, setCrop] = useState<Crop>();
  const [selectedIcon, setSelectedIcon] = useState(1);

  const handleSave = () => {
    if (crop && crop.width && crop.height) {
      onSaveCrop(selectedIcon, crop as PixelCrop);
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
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm">
            Save Crop
          </Button>
          <Button onClick={onClose} variant="outline" size="sm">
            Done
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,white_0%_50%)] bg-[length:20px_20px]">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          aspect={1}
          ruleOfThirds
        >
          <img src={imageSrc} alt="Crop editor" className="max-w-full" style={{ imageRendering: 'crisp-edges' }} />
        </ReactCrop>
      </div>

      <div className="p-4 bg-gray-50 text-sm text-gray-600">
        <p><strong>Instructions:</strong></p>
        <p>1. Select icon slot from dropdown</p>
        <p>2. Draw a crop box around the icon (drag from corners OR sides)</p>
        <p>3. Click "Save Crop" to store it</p>
        <p>4. Repeat for all 16 icons</p>
        <p className="mt-2 text-xs italic">Checkered background indicates transparency</p>
      </div>
    </div>
  );
}
