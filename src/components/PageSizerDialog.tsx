import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PageSize {
  name: string;
  width: number;
  height: number;
  category: string;
}

const presetSizes: PageSize[] = [
  // Novels / Trade Paperbacks
  { name: 'Mass-market paperback', width: 4.25, height: 6.87, category: 'Novels / Trade Paperbacks' },
  { name: 'Compact trade fiction', width: 5, height: 8, category: 'Novels / Trade Paperbacks' },
  { name: 'Mid-sized trade paperback', width: 5.25, height: 8, category: 'Novels / Trade Paperbacks' },
  { name: 'Digest fiction & memoir', width: 5.5, height: 8.5, category: 'Novels / Trade Paperbacks' },
  { name: 'Classic trade book', width: 6, height: 9, category: 'Novels / Trade Paperbacks' },
  
  // Textbooks / Academic / Workbooks
  { name: 'Compact academic', width: 6, height: 9, category: 'Textbooks / Academic / Workbooks' },
  { name: 'Manual / workbook', width: 7, height: 10, category: 'Textbooks / Academic / Workbooks' },
  { name: 'U.S. Letter', width: 8.5, height: 11, category: 'Textbooks / Academic / Workbooks' },
  { name: 'A4 International', width: 8.27, height: 11.69, category: 'Textbooks / Academic / Workbooks' },
  
  // Children's Books / Illustrated
  { name: 'Picture book', width: 7, height: 10, category: "Children's Books / Illustrated" },
  { name: 'Square storybook', width: 7.5, height: 7.5, category: "Children's Books / Illustrated" },
  { name: 'Large illustrated', width: 8, height: 10, category: "Children's Books / Illustrated" },
  { name: 'Landscape picture book', width: 10, height: 8, category: "Children's Books / Illustrated" },
];

interface PageSizerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSizeSelect: (width: number, height: number) => void;
}

export const PageSizerDialog = ({ open, onOpenChange, onSizeSelect }: PageSizerDialogProps) => {
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  const handlePresetSelect = (size: PageSize) => {
    onSizeSelect(size.width, size.height);
    onOpenChange(false);
  };

  const handleCustomApply = () => {
    const width = parseFloat(customWidth);
    const height = parseFloat(customHeight);
    
    if (width > 0 && height > 0) {
      onSizeSelect(width, height);
      onOpenChange(false);
    }
  };

  const categories = Array.from(new Set(presetSizes.map(s => s.category)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-background">
        <DialogHeader>
          <DialogTitle>Select Page Size</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-8">
            {categories.map(category => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4 text-foreground">{category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {presetSizes
                    .filter(size => size.category === category)
                    .map((size, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePresetSelect(size)}
                        className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-accent hover:border-primary transition-colors"
                      >
                        <div
                          className="bg-muted border-2 border-border rounded shadow-sm"
                          style={{
                            width: `${size.width * 10}px`,
                            height: `${size.height * 10}px`,
                            maxWidth: '80px',
                            maxHeight: '120px',
                          }}
                        />
                        <div className="text-center">
                          <div className="text-sm font-medium text-foreground">{size.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {size.width}″ × {size.height}″
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}

            {/* Manual Input Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Custom Page Size</h3>
              <div className="flex gap-4 items-end max-w-md">
                <div className="flex-1">
                  <Label htmlFor="width">Width (inches)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="8.5"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="height">Height (inches)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="11"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleCustomApply}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
