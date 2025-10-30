import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileText, Search, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface FilePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: Array<{ name: string; savedAt: string }>;
  onSelectFile: (filename: string) => void;
}

export const FilePickerDialog = ({
  open,
  onOpenChange,
  files,
  onSelectFile
}: FilePickerDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFile = (filename: string) => {
    onSelectFile(filename);
    onOpenChange(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Load Document</DialogTitle>
          <DialogDescription>
            Select a document from your Doc One folder
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* File List */}
          <ScrollArea className="h-[400px] border rounded-md">
            {filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  {files.length === 0
                    ? "No documents found in your Doc One folder"
                    : "No documents match your search"}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredFiles.map((file) => (
                  <Button
                    key={file.name}
                    variant="ghost"
                    className="w-full justify-start h-auto py-3 px-3"
                    onClick={() => handleSelectFile(file.name)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium truncate">{file.name}</div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatDistanceToNow(new Date(file.savedAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
