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
  Check,
  Plus,
  Shapes,
  Image,
  Video,
  FolderOpen,
} from 'lucide-react';
import { FindReplaceDialog } from './FindReplaceDialog';
import { ExportDialog } from './ExportDialog';
import { ImportDialog } from './ImportDialog';
import { IconPicker } from './IconPicker';
import { WebVideoDialog } from './WebVideoDialog';
import { TableOfContentsDialog } from './TableOfContentsDialog';
import { FootnoteDialog } from './FootnoteDialog';
import { HeaderFooterDialog, HeaderFooterSettings } from './HeaderFooterDialog';
import { PDFImportDialog } from './PDFImportDialog';
import { toast } from 'sonner';

interface ToolbarProps {
  editor?: any;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [currentCapitalization, setCurrentCapitalization] = useState<string>('none');
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [webVideoOpen, setWebVideoOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [footnoteOpen, setFootnoteOpen] = useState(false);
  const [headerFooterOpen, setHeaderFooterOpen] = useState(false);
  const [pdfImportOpen, setPdfImportOpen] = useState(false);
  const [documentSaved, setDocumentSaved] = useState(true);

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
        // Remove small caps mark if active
        if (editor.isActive('smallCaps')) {
          editor.chain().focus().unsetMark('smallCaps').run();
        }
        // Convert to sentence case (first letter capitalized, rest lowercase)
        transformedText = selectedText.toLowerCase();
        if (transformedText.length > 0) {
          transformedText = transformedText.charAt(0).toUpperCase() + transformedText.slice(1);
        }
        editor.chain().focus().insertContentAt({ from, to }, transformedText).run();
        editor.commands.setTextSelection({ from, to: from + transformedText.length });
        setCurrentCapitalization('none');
        return;
      case 'allCaps':
        // Remove small caps if active
        if (editor.isActive('smallCaps')) {
          editor.chain().focus().unsetMark('smallCaps').run();
        }
        transformedText = selectedText.toUpperCase();
        setCurrentCapitalization('allCaps');
        break;
      case 'smallCaps':
        // First convert text to lowercase, then apply small caps styling
        transformedText = selectedText.toLowerCase();
        editor.chain().focus().insertContentAt({ from, to }, transformedText).run();
        editor.commands.setTextSelection({ from, to: from + transformedText.length });
        // Now apply small caps mark
        editor.chain().focus().setMark('smallCaps').run();
        setCurrentCapitalization('smallCaps');
        return;
      case 'titleCase':
        // Remove small caps if active
        if (editor.isActive('smallCaps')) {
          editor.chain().focus().unsetMark('smallCaps').run();
        }
        // Capitalize first letter of main words, except minor words (unless first word)
        transformedText = selectedText.toLowerCase().split(' ').map((word, index) => {
          if (index === 0 || !minorWords.includes(word)) {
            return word.charAt(0).toUpperCase() + word.slice(1);
          }
          return word;
        }).join(' ');
        setCurrentCapitalization('titleCase');
        break;
      case 'startCase':
        // Remove small caps if active
        if (editor.isActive('smallCaps')) {
          editor.chain().focus().unsetMark('smallCaps').run();
        }
        // Sentence case: only capitalize first letter of first word
        transformedText = selectedText.toLowerCase();
        if (transformedText.length > 0) {
          transformedText = transformedText.charAt(0).toUpperCase() + transformedText.slice(1);
        }
        setCurrentCapitalization('startCase');
        break;
    }
    
    editor.chain().focus().insertContentAt({ from, to }, transformedText).run();
    editor.commands.setTextSelection({ from, to: from + transformedText.length });
  };

  const handleIconSelect = (iconId: string, category: string) => {
    editor.commands.insertIcon({ iconId, category, width: 100, height: 100, color: '#000000' });
  };

  const handleInsertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          if (file.type.startsWith('image/')) {
            editor.chain().focus().setImage({ src: url }).run();
            toast.success('Image inserted!');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };


  const handleVideoInsert = (embedHtml: string) => {
    editor.chain().focus().insertContent(embedHtml).run();
  };

  const handleInsertFrom = () => {
    toast.info('Insert from external sources coming soon!');
  };

  const handleFootnoteInsert = (content: string) => {
    if (!editor) return;
    
    // Count existing footnotes
    let footnoteCount = 0;
    editor.state.doc.descendants((node: any) => {
      if (node.marks.some((mark: any) => mark.type.name === 'footnote')) {
        footnoteCount++;
      }
    });
    
    const footnoteNumber = footnoteCount + 1;
    const footnoteId = `fn-${footnoteNumber}`;
    
    editor.chain().focus()
      .setFootnote({ id: footnoteId, number: footnoteNumber, content })
      .run();
    
    toast.success('Footnote added');
  };

  const handleHeaderFooterSave = (settings: HeaderFooterSettings) => {
    // Store settings in localStorage or state management
    localStorage.setItem('headerFooterSettings', JSON.stringify(settings));
    toast.success('Header/Footer settings saved');
  };

  const handleInsertPageBreak = () => {
    editor.chain().focus().insertPageBreak().run();
    toast.success('Page break inserted');
  };

  const handleInsertChapter = () => {
    const title = prompt('Enter chapter title:');
    if (title) {
      editor.chain().focus().setChapter({ title }).run();
      toast.success('Chapter inserted');
    }
  };

  const handleSavePrompt = async (): Promise<boolean> => {
    // In a real implementation, this would trigger the actual save functionality
    // For now, we'll simulate a save
    return new Promise((resolve) => {
      toast.info('Save your document before proceeding');
      // Simulate save - in production this would call actual save logic
      setTimeout(() => {
        setDocumentSaved(true);
        resolve(true);
      }, 1000);
    });
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
          <DropdownMenuContent className="bg-background">
            <DropdownMenuItem onClick={() => applyCapitalization('none')}>
              <Check className={`w-4 h-4 mr-2 ${currentCapitalization === 'none' ? 'opacity-100' : 'opacity-0'}`} />
              None
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyCapitalization('allCaps')}>
              <Check className={`w-4 h-4 mr-2 ${currentCapitalization === 'allCaps' ? 'opacity-100' : 'opacity-0'}`} />
              All Caps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyCapitalization('smallCaps')}>
              <Check className={`w-4 h-4 mr-2 ${currentCapitalization === 'smallCaps' ? 'opacity-100' : 'opacity-0'}`} />
              Small Caps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyCapitalization('titleCase')}>
              <Check className={`w-4 h-4 mr-2 ${currentCapitalization === 'titleCase' ? 'opacity-100' : 'opacity-0'}`} />
              Title Case
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyCapitalization('startCase')}>
              <Check className={`w-4 h-4 mr-2 ${currentCapitalization === 'startCase' ? 'opacity-100' : 'opacity-0'}`} />
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              title="Insert"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background w-56">
            <DropdownMenuItem onClick={handleInsertTable}>
              <Settings className="w-4 h-4 mr-2" />
              Column
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIconPickerOpen(true)}>
              <Shapes className="w-4 h-4 mr-2" />
              Shapes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleInsertImage}>
              <Image className="w-4 h-4 mr-2" />
              Photo or Video
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setWebVideoOpen(true)}>
              <Video className="w-4 h-4 mr-2" />
              Web Video
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleInsertFrom}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Insert from...
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="sm" onClick={() => setFindReplaceOpen(true)} className="find-replace-btn">
          <Search className="w-4 h-4 mr-2" />
          Find & Replace
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="import-btn">
              <FileUp className="w-4 h-4 mr-2" />
              Import
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuItem onClick={() => setImportOpen(true)}>
              Standard Import
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPdfImportOpen(true)}>
              PDF with Style Inference
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="sm" onClick={() => setExportOpen(true)} className="export-btn">
          <FileDown className="w-4 h-4 mr-2" />
          Export
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuItem onClick={() => setTocOpen(true)}>
              Table of Contents
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFootnoteOpen(true)}>
              Insert Footnote
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHeaderFooterOpen(true)}>
              Headers & Footers
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleInsertPageBreak}>
              Insert Page Break
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleInsertChapter}>
              New Chapter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <IconPicker
        open={iconPickerOpen}
        onOpenChange={setIconPickerOpen}
        onIconSelect={handleIconSelect}
      />
      <WebVideoDialog
        open={webVideoOpen}
        onOpenChange={setWebVideoOpen}
        onVideoInsert={handleVideoInsert}
      />
      <TableOfContentsDialog
        open={tocOpen}
        onOpenChange={setTocOpen}
        editor={editor}
      />
      <FootnoteDialog
        open={footnoteOpen}
        onOpenChange={setFootnoteOpen}
        onInsert={handleFootnoteInsert}
      />
      <HeaderFooterDialog
        open={headerFooterOpen}
        onOpenChange={setHeaderFooterOpen}
        onSave={handleHeaderFooterSave}
      />
      <PDFImportDialog
        open={pdfImportOpen}
        onOpenChange={setPdfImportOpen}
        editor={editor}
        onSavePrompt={handleSavePrompt}
        isDocumentSaved={documentSaved}
      />
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
