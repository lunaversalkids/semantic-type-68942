import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileDown, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor?: any;
}

export const ExportDialog = ({ open, onOpenChange, editor }: ExportDialogProps) => {
  const { toast } = useToast();

  const exportToPDF = () => {
    if (!editor) return;

    const doc = new jsPDF();
    const text = editor.getText();
    
    // Simple PDF export - in production you'd preserve formatting
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 15, 15);
    doc.save('document.pdf');

    toast({
      title: 'PDF Exported',
      description: 'Your document has been exported as PDF',
    });
    
    onOpenChange(false);
  };

  const exportToText = () => {
    if (!editor) return;

    const text = editor.getText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.txt';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Text Exported',
      description: 'Your document has been exported as plain text',
    });
    
    onOpenChange(false);
  };

  const exportToHTML = () => {
    if (!editor) return;

    const html = editor.getHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'HTML Exported',
      description: 'Your document has been exported as HTML',
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="w-5 h-5" />
            Export Document
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 pt-4">
          <Button onClick={exportToPDF} variant="outline" className="w-full justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
          <Button onClick={exportToHTML} variant="outline" className="w-full justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Export as HTML
          </Button>
          <Button onClick={exportToText} variant="outline" className="w-full justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Export as Plain Text
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
