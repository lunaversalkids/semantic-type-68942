import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface PageNumberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (position: 'left' | 'center' | 'right', format: 'page-x' | 'x' | 'x-of-total', applyToAll: boolean) => void;
  currentPage: number;
  totalPages: number;
}

export const PageNumberDialog = ({
  open,
  onOpenChange,
  onInsert,
  currentPage,
  totalPages,
}: PageNumberDialogProps) => {
  const [position, setPosition] = useState<'left' | 'center' | 'right'>('right');
  const [format, setFormat] = useState<'page-x' | 'x' | 'x-of-total'>('page-x');
  const [applyToAll, setApplyToAll] = useState(true);

  const handleInsert = () => {
    onInsert(position, format, applyToAll);
    onOpenChange(false);
  };

  const getPreview = () => {
    switch (format) {
      case 'page-x':
        return `Page ${currentPage}`;
      case 'x':
        return `${currentPage}`;
      case 'x-of-total':
        return `${currentPage} of ${totalPages}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Page Number</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Position</Label>
            <RadioGroup value={position} onValueChange={(v) => setPosition(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="left" />
                <Label htmlFor="left" className="font-normal cursor-pointer">Left</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="center" id="center" />
                <Label htmlFor="center" className="font-normal cursor-pointer">Center</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="right" id="right" />
                <Label htmlFor="right" className="font-normal cursor-pointer">Right</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="page-x" id="page-x" />
                <Label htmlFor="page-x" className="font-normal cursor-pointer">Page {currentPage}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="x" id="x" />
                <Label htmlFor="x" className="font-normal cursor-pointer">{currentPage}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="x-of-total" id="x-of-total" />
                <Label htmlFor="x-of-total" className="font-normal cursor-pointer">{currentPage} of {totalPages}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <Label className="text-sm text-muted-foreground">Preview</Label>
            <p className={`mt-2 text-${position === 'center' ? 'center' : position === 'right' ? 'right' : 'left'}`}>
              {getPreview()}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="apply-all" 
              checked={applyToAll} 
              onCheckedChange={(checked) => setApplyToAll(checked as boolean)}
            />
            <Label htmlFor="apply-all" className="font-normal cursor-pointer">
              Apply to all pages consistently
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>
            Insert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
