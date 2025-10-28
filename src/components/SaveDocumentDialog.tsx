import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

interface SaveDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (filename: string) => void;
  defaultFilename?: string;
}

export const SaveDocumentDialog = ({ 
  open, 
  onOpenChange, 
  onSave,
  defaultFilename = 'Untitled Document'
}: SaveDocumentDialogProps) => {
  const [filename, setFilename] = useState(defaultFilename);

  const handleSave = () => {
    if (filename.trim()) {
      onSave(filename.trim());
      onOpenChange(false);
    } else {
      toast.error('Please enter a filename');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Document</DialogTitle>
          <DialogDescription>
            Enter a name for your document before proceeding.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Document Name</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter document name"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
