import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Trash2, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Document {
  id: string;
  name: string;
  content: string;
  savedAt: string;
}

interface DocumentManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadDocument?: (content: string, name: string) => void;
}

export const DocumentManager = ({ open, onOpenChange, onLoadDocument }: DocumentManagerProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDocuments = () => {
    try {
      const savedDocs = localStorage.getItem('savedDocuments');
      if (savedDocs) {
        const docs = JSON.parse(savedDocs);
        setDocuments(docs);
      }
    } catch (error: any) {
      toast.error('Failed to load documents');
    }
  };

  useEffect(() => {
    if (open) {
      fetchDocuments();
    }
  }, [open]);

  const handleDeleteDocument = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;

    try {
      const savedDocs = localStorage.getItem('savedDocuments');
      if (savedDocs) {
        const docs = JSON.parse(savedDocs);
        const updatedDocs = docs.filter((doc: Document) => doc.id !== id);
        localStorage.setItem('savedDocuments', JSON.stringify(updatedDocs));
        setDocuments(updatedDocs);
        toast.success('Document deleted');
      }
    } catch (error: any) {
      toast.error('Failed to delete document');
    }
  };

  const handleLoadDocument = (doc: Document) => {
    if (onLoadDocument) {
      onLoadDocument(doc.content, doc.name);
      onOpenChange(false);
      toast.success(`Loaded "${doc.name}"`);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>My Documents</DialogTitle>
          <DialogDescription>
            Manage your saved documents in the cloud
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="flex-1 -mx-6 px-6">
            {filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'No documents found' : 'No documents yet. Save a document to get started!'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Saved {formatDistanceToNow(new Date(doc.savedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoadDocument(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id, doc.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
