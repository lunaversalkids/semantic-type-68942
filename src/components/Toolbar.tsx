import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
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
      // Check if text already has quotes
      if (selectedText.startsWith('"') && selectedText.endsWith('"')) {
        // Remove quotes
        const withoutQuotes = selectedText.slice(1, -1);
        editor.chain().focus().insertContentAt({ from, to }, withoutQuotes).run();
        // Re-select the text without quotes
        editor.commands.setTextSelection({ from, to: from + withoutQuotes.length });
      } else {
        // Add quotes
        const quotedText = `"${selectedText}"`;
        editor.chain().focus().insertContentAt({ from, to }, quotedText).run();
        // Re-select the text including quotes
        editor.commands.setTextSelection({ from, to: from + quotedText.length });
      }
    } else {
      // If no text selected, insert quotes at cursor position
      editor.chain().focus().insertContent('""').run();
      // Move cursor between the quotes
      const newPos = editor.state.selection.from - 1;
      editor.commands.setTextSelection(newPos);
    }
  };

  const applyCapitalization = (type: string) => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');
    
    if (!selectedText) return;
    
    let transformedText = selectedText;
    
    // Words to keep lowercase in Title Case
    const minorWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'up', 'via'];
    
    switch (type) {
      case 'none':
        // Leave text exactly as typed
        transformedText = selectedText;
        break;
      case 'allCaps':
        transformedText = selectedText.toUpperCase();
        break;
      case 'smallCaps':
        // Apply small caps CSS styling
        editor.chain().focus().deleteRange({ from, to }).run();
        editor.chain().focus().insertContent(`<span style="font-variant-caps: small-caps;">${selectedText}</span>`).run();
        return;
      case 'titleCase':
        // Capitalize first letter of main words, except minor words (unless first word)
        transformedText = selectedText.toLowerCase().split(' ').map((word, index) => {
          if (index === 0 || !minorWords.includes(word)) {
            return word.charAt(0).toUpperCase() + word.slice(1);
          }
          return word;
        }).join(' ');
        break;
      case 'startCase':
        // Sentence case: only capitalize first letter of first word
        transformedText = selectedText.toLowerCase();
        if (transformedText.length > 0) {
          transformedText = transformedText.charAt(0).toUpperCase() + transformedText.slice(1);
        }
        break;
    }
    
    editor.chain().focus().insertContentAt({ from, to }, transformedText).run();
    editor.commands.setTextSelection({ from, to: from + transformedText.length });
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
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          data-active={editor.isActive('strike')}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
            >
              <span className="text-lg leading-none">•••</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => applyCapitalization('none')}>
              None
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyCapitalization('allCaps')}>
              All Caps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyCapitalization('smallCaps')}>
              Small Caps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyCapitalization('titleCase')}>
              Title Case
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyCapitalization('startCase')}>
              Start Case
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          onClick={addQuotes}
          title="Toggle quotation marks (wraps/unwraps selected text or inserts at cursor)"
        >
          <Quote className="w-4 h-4" />
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
