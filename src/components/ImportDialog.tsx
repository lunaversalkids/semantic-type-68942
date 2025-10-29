import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileUp, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import mammoth from 'mammoth';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor?: any;
  onSavePrompt?: () => Promise<boolean>;
  isDocumentSaved?: boolean;
}

export const ImportDialog = ({ 
  open, 
  onOpenChange, 
  editor,
  onSavePrompt,
  isDocumentSaved = true 
}: ImportDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [needsSave, setNeedsSave] = useState(false);

  const handleFileSelect = async () => {
    // Only prompt to save if document actually has unsaved changes
    const hasContent = editor && editor.getText().trim().length > 0;
    if (!isDocumentSaved && hasContent) {
      setNeedsSave(true);
      return;
    }

    fileInputRef.current?.click();
  };

  const handleSaveAndContinue = async () => {
    if (onSavePrompt) {
      const saved = await onSavePrompt();
      if (saved) {
        setNeedsSave(false);
        fileInputRef.current?.click();
      }
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let htmlContent = '';

      switch (fileExtension) {
        case 'docx':
          // Convert .docx to HTML using mammoth
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          htmlContent = result.value;
          
          if (result.messages.length > 0) {
            console.log('Conversion warnings:', result.messages);
          }
          break;

        case 'txt':
          // Handle plain text
          const text = await file.text();
          htmlContent = `<p>${text.replace(/\n/g, '</p><p>')}</p>`;
          break;

        case 'html':
        case 'htm':
          // Handle HTML directly
          htmlContent = await file.text();
          break;

        case 'pages':
          // Apple Pages files are package formats (zip archives)
          toast({
            title: "Pages Format Not Supported",
            description: "Please export your Pages document as .docx from Pages first, then import it here.",
            variant: "destructive",
          });
          setImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;

        default:
          toast({
            title: "Unsupported Format",
            description: "Please use .docx, .txt, or .html files.",
            variant: "destructive",
          });
          setImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
      }

      if (editor && htmlContent) {
        // Clear current content and insert imported content
        editor.commands.setContent(htmlContent);
        toast({
          title: "Import Successful",
          description: `${file.name} has been imported with formatting preserved.`,
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the file. Please ensure it's a valid document.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Document</DialogTitle>
          <DialogDescription>
            Import Microsoft Word, text, or HTML files with formatting preserved
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {needsSave && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your current document has unsaved changes. Please save before importing to avoid losing your work.
              </AlertDescription>
            </Alert>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.txt,.html,.htm"
            onChange={handleFileImport}
            className="hidden"
          />
          
          <div className="space-y-3">
            <div className="text-sm font-medium">Supported formats:</div>
            <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
              <li><strong>Microsoft Word (.docx)</strong> - Full formatting preserved</li>
              <li><strong>Plain Text (.txt)</strong> - Basic text import</li>
              <li><strong>HTML (.html, .htm)</strong> - Web format with styling</li>
            </ul>
            
            <Alert className="mt-4">
              <FileText className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Apple Pages users:</strong> Export your document as .docx from Pages (File → Export To → Word), then import it here.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {needsSave ? (
              <>
                <Button variant="outline" onClick={() => setNeedsSave(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAndContinue}>
                  Save & Continue
                </Button>
              </>
            ) : (
              <Button onClick={handleFileSelect} disabled={importing} className="w-full">
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Select Document to Import
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
