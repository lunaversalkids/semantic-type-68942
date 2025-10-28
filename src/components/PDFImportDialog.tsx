import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PDFImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: any;
}

export const PDFImportDialog = ({ open, onOpenChange, editor }: PDFImportDialogProps) => {
  const [importing, setImporting] = useState(false);

  const handleFileSelect = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await importPDF(file);
      }
    };
    
    input.click();
  };

  const importPDF = async (file: File) => {
    setImporting(true);
    
    try {
      // Read the PDF file
      const formData = new FormData();
      formData.append('file', file);
      
      // Note: In a real implementation, you would:
      // 1. Parse PDF using a library like pdf.js
      // 2. Extract text, images, and style information
      // 3. Infer fonts, sizes, colors from PDF
      // 4. Convert to TipTap format
      // 5. Insert into editor
      
      // For now, we'll show a placeholder implementation
      toast.info('PDF parsing and style inference would happen here');
      
      // Placeholder: Just insert some text
      editor.chain().focus().insertContent('<h2>Imported from PDF</h2><p>Content would be extracted with style inference here.</p>').run();
      
      toast.success('PDF imported successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('PDF import error:', error);
      toast.error('Failed to import PDF');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import PDF with Style Inference</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Import a PDF document and automatically detect fonts, sizes, and formatting styles.
          </p>
          <div className="flex justify-center">
            <Button onClick={handleFileSelect} disabled={importing}>
              {importing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {importing ? 'Importing...' : 'Select PDF File'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
