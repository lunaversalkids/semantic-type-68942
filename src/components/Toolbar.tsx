import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Search,
  FileDown,
  FileUp,
  Settings,
} from 'lucide-react';
import { FindReplaceDialog } from './FindReplaceDialog';
import { ExportDialog } from './ExportDialog';
import { ImportDialog } from './ImportDialog';

interface ToolbarProps {
  editor?: any;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const addQuotes = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');
    
    if (selectedText) {
      editor.chain().focus().insertContentAt({ from, to }, `"${selectedText}"`).run();
    }
  };
  
  if (!editor) return null;
  return (
    <div className="h-14 border-b border-border bg-background px-4 flex items-center gap-2 toolbar">
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive('bold')}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive('italic')}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          data-active={editor.isActive('underline')}
        >
          <Underline className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          data-active={editor.isActive({ textAlign: 'left' })}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          data-active={editor.isActive({ textAlign: 'center' })}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          data-active={editor.isActive({ textAlign: 'right' })}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-active={editor.isActive('bulletList')}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-active={editor.isActive('orderedList')}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          data-active={editor.isActive('blockquote')}
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 font-bold text-base"
          onClick={addQuotes}
          title="Add quotation marks"
        >
          "
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setFindReplaceOpen(true)} className="find-replace-btn">
          <Search className="w-4 h-4 mr-2" />
          Find & Replace
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setImportOpen(true)} className="import-btn">
          <FileUp className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setExportOpen(true)} className="export-btn">
          <FileDown className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
      
      <FindReplaceDialog 
        open={findReplaceOpen} 
        onOpenChange={setFindReplaceOpen}
        editor={editor}
      />
      <ImportDialog 
        open={importOpen} 
        onOpenChange={setImportOpen}
        editor={editor}
      />
      <ExportDialog 
        open={exportOpen} 
        onOpenChange={setExportOpen}
        editor={editor}
      />
    </div>
  );
};
