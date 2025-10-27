import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileUp, FileText } from 'lucide-react';
import { useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor?: any;
}

export const ImportDialog = ({ open, onOpenChange, editor }: ImportDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      
      if (editor) {
        // Clear current content and insert imported text
        editor.commands.setContent(text);
        toast({
          title: "Import Successful",
          description: `${file.name} has been imported.`,
        });
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "There was an error importing the file.",
        variant: "destructive",
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Document</DialogTitle>
          <DialogDescription>
            Import content from a file into your document
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.html,.pdf"
            onChange={handleFileImport}
            className="hidden"
          />
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={triggerFileInput}
          >
            <FileText className="w-4 h-4 mr-2" />
            Import from Text/HTML File
          </Button>

          <div className="text-xs text-muted-foreground">
            Supported formats: TXT, HTML, PDF
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
