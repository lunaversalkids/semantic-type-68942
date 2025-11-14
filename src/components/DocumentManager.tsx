import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, Trash2, Copy, MoreVertical, Search } from 'lucide-react';
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
  onLoadDocument?: (id: string, content: string, name: string) => void;
}

export const DocumentManager = ({ open, onOpenChange, onLoadDocument }: DocumentManagerProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDocuments = () => {
    try {
      // Get saved documents
      const savedDocs = localStorage.getItem('savedDocuments');
      const saved = savedDocs ? JSON.parse(savedDocs) : [];
      
      // Get recent documents
      const recentDocs = localStorage.getItem('recentDocuments');
      const recent = recentDocs ? JSON.parse(recentDocs) : [];
      
      // Merge recent with saved, prioritizing saved documents
      const savedIds = new Set(saved.map((doc: Document) => doc.id));
      const recentWithSaved = recent.map((recentDoc: any) => {
        const savedDoc = saved.find((d: Document) => d.id === recentDoc.id);
        if (savedDoc) {
          return savedDoc;
        }
        return {
          id: recentDoc.id,
          name: recentDoc.title,
          content: '',
          savedAt: recentDoc.lastOpened
        };
      });
      
      // Add saved documents that aren't in recent
      const allDocs = [
        ...recentWithSaved,
        ...saved.filter((doc: Document) => !recent.some((r: any) => r.id === doc.id))
      ];
      
      setDocuments(allDocs);
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
      onLoadDocument(doc.id, doc.content, doc.name);
      onOpenChange(false);
      toast.success(`Loaded "${doc.name}"`);
    }
  };

  const handleDuplicateDocument = (doc: Document) => {
    try {
      const savedDocs = localStorage.getItem('savedDocuments');
      if (savedDocs) {
        const docs = JSON.parse(savedDocs);
        const newDoc: Document = {
          id: crypto.randomUUID(),
          name: `${doc.name} (Copy)`,
          content: doc.content,
          savedAt: new Date().toISOString()
        };
        const updatedDocs = [...docs, newDoc];
        localStorage.setItem('savedDocuments', JSON.stringify(updatedDocs));
        setDocuments(updatedDocs);
        toast.success('Document duplicated');
      }
    } catch (error: any) {
      toast.error('Failed to duplicate document');
    }
  };

  const filteredDocuments = documents
    .filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());

  const recentDocuments = filteredDocuments.slice(0, 5);
  const allDocuments = filteredDocuments;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-col">
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
              <div className="space-y-6">
                {/* Recent Documents Section */}
                {recentDocuments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Recent Documents</h3>
                    <div className="space-y-2">
                      {recentDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                          onClick={() => handleLoadDocument(doc)}
                        >
                          <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Saved {formatDistanceToNow(new Date(doc.savedAt), { addSuffix: true })}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateDocument(doc);
                              }}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDocument(doc.id, doc.name);
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Saved Documents Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">All Saved Documents</h3>
                  <div className="space-y-2">
                    {allDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => handleLoadDocument(doc)}
                      >
                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Saved {formatDistanceToNow(new Date(doc.savedAt), { addSuffix: true })}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateDocument(doc);
                            }}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDocument(doc.id, doc.name);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
