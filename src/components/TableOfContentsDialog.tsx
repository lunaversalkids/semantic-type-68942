import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';

interface TOCItem {
  level: number;
  text: string;
  id: string;
}

interface TableOfContentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: any;
}

export const TableOfContentsDialog = ({ open, onOpenChange, editor }: TableOfContentsDialogProps) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    if (open && editor) {
      generateTOC();
    }
  }, [open, editor]);

  const generateTOC = () => {
    const items: TOCItem[] = [];
    let counter = 0;

    editor.state.doc.descendants((node: any, pos: number) => {
      if (node.type.name === 'heading') {
        const id = `heading-${counter++}`;
        const level = node.attrs.level;
        const text = node.textContent;
        
        items.push({ level, text, id });
        
        // Add ID to heading if it doesn't have one
        if (!node.attrs.id) {
          editor.chain().setTextSelection(pos).updateAttributes('heading', { id }).run();
        }
      }
    });

    setTocItems(items);
  };

  const insertTOC = () => {
    let tocHtml = '<div class="table-of-contents"><h2>Table of Contents</h2><ul>';
    
    tocItems.forEach(item => {
      const indent = (item.level - 1) * 20;
      tocHtml += `<li style="margin-left: ${indent}px;"><a href="#${item.id}">${item.text}</a></li>`;
    });
    
    tocHtml += '</ul></div>';
    
    editor.chain().focus().insertContent(tocHtml).run();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Table of Contents</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ScrollArea className="h-[300px] w-full rounded border p-4">
            {tocItems.length === 0 ? (
              <p className="text-muted-foreground text-sm">No headings found in document</p>
            ) : (
              <div className="space-y-2">
                {tocItems.map((item, index) => (
                  <div
                    key={index}
                    style={{ marginLeft: `${(item.level - 1) * 20}px` }}
                    className="text-sm"
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={insertTOC} disabled={tocItems.length === 0}>
              Insert TOC
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
