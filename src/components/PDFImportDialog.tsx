import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, FileText, Save } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import worker using Vite's special syntax
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

interface PDFImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: any;
  onSavePrompt?: () => Promise<boolean>;
  isDocumentSaved?: boolean;
}

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const PDFImportDialog = ({ 
  open, 
  onOpenChange, 
  editor, 
  onSavePrompt,
  isDocumentSaved = true 
}: PDFImportDialogProps) => {
  const [importing, setImporting] = useState(false);
  const [needsSave, setNeedsSave] = useState(false);

  const handleFileSelect = async () => {
    // Check if document needs to be saved first
    if (!isDocumentSaved) {
      setNeedsSave(true);
      return;
    }

    proceedWithFileSelection();
  };

  const handleSaveAndContinue = async () => {
    if (onSavePrompt) {
      const saved = await onSavePrompt();
      if (saved) {
        setNeedsSave(false);
        proceedWithFileSelection();
      }
    }
  };

  const proceedWithFileSelection = () => {
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
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      toast.error('PDF file is too large. Maximum size is 50MB.');
      setImporting(false);
      return;
    }
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullContent = `<h1>${file.name.replace('.pdf', '')}</h1>`;
      const styles: Record<string, { fontSize: number; fontFamily: string; bold: boolean }> = {};
      
      // Extract text and style information from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let pageText = '';
        let lastY = 0;
        let lineText = '';
        
        textContent.items.forEach((item: any) => {
          // Type guard to check if item is a TextItem (has 'str' property)
          if (!('str' in item)) return;
          
          const text = item.str;
          const y = item.transform[5];
          const fontSize = Math.round(item.transform[0]);
          const fontName = item.fontName || 'default';
          
          // Store style information
          if (!styles[fontName]) {
            styles[fontName] = {
              fontSize,
              fontFamily: fontName,
              bold: fontName.toLowerCase().includes('bold')
            };
          }
          
          // Detect new lines based on Y position change
          if (lastY !== 0 && Math.abs(y - lastY) > 5) {
            if (lineText.trim()) {
              // Infer heading based on font size
              if (fontSize > 18) {
                pageText += `<h2>${lineText.trim()}</h2>`;
              } else if (fontSize > 14) {
                pageText += `<h3>${lineText.trim()}</h3>`;
              } else {
                pageText += `<p>${lineText.trim()}</p>`;
              }
            }
            lineText = text;
          } else {
            lineText += text;
          }
          
          lastY = y;
        });
        
        // Add remaining text
        if (lineText.trim()) {
          const firstItem = textContent.items.find((item: any) => 'str' in item) as any;
          if (firstItem && styles[firstItem.fontName]?.fontSize > 14) {
            pageText += `<h3>${lineText.trim()}</h3>`;
          } else {
            pageText += `<p>${lineText.trim()}</p>`;
          }
        }
        
        fullContent += pageText;
        
        // Add page break between pages (except for last page)
        if (pageNum < pdf.numPages) {
          fullContent += '<div data-page-break="true" class="page-break"></div>';
        }
      }
      
      // Clear existing content and insert PDF content
      editor.chain()
        .focus()
        .clearContent()
        .insertContent(fullContent)
        .run();
      
      toast.success(`PDF imported successfully! ${pdf.numPages} pages processed with style inference.`);
      onOpenChange(false);
    } catch (error) {
      console.error('PDF import error:', error);
      toast.error('Failed to import PDF. Please ensure the file is a valid PDF.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import PDF with Style Inference</DialogTitle>
          <DialogDescription>
            Import a PDF document and automatically detect fonts, sizes, and formatting styles. Maximum file size: 50MB.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {needsSave && (
            <Alert>
              <Save className="h-4 w-4" />
              <AlertDescription>
                Your current document has unsaved changes. Please save before importing a PDF to avoid losing your work.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground mb-1">What will be imported:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Text content with formatting preserved</li>
                  <li>Headings detected from font sizes</li>
                  <li>Paragraphs and line breaks</li>
                  <li>Page breaks between PDF pages</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            {needsSave ? (
              <>
                <Button variant="outline" onClick={() => setNeedsSave(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAndContinue}>
                  <Save className="mr-2 h-4 w-4" />
                  Save & Continue
                </Button>
              </>
            ) : (
              <Button onClick={handleFileSelect} disabled={importing}>
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing PDF...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Select PDF File
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
