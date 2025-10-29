import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Tag, Palette, Sparkles, FileText, Hash, Bookmark, Highlighter, Languages, Search } from 'lucide-react';
import { ReactNode } from 'react';

interface EditorContextMenuProps {
  children: ReactNode;
  editor?: any;
  onApplyToAll?: () => void;
  onAIAssist?: (action: string) => void;
  onInsertFootnote?: () => void;
  onTogglePageNumber?: () => void;
  onInsertTab?: () => void;
  onInsertPageBreak?: () => void;
  onInsertLineBreak?: () => void;
  onInsertSectionBreak?: () => void;
  onInsertColumnBreak?: () => void;
  onInsertPageNumber?: () => void;
  onInsertPageCount?: () => void;
  onInsertDateTime?: () => void;
  onInsertBookmark?: () => void;
  onInsertTableOfContents?: () => void;
  onHighlight?: () => void;
  onTranslate?: (language: string) => void;
  onFind?: () => void;
  showPageNumber?: boolean;
  pageNumber?: number;
}

export const EditorContextMenu = ({ 
  children, 
  editor, 
  onApplyToAll, 
  onAIAssist, 
  onInsertFootnote,
  onTogglePageNumber,
  onInsertTab,
  onInsertPageBreak,
  onInsertLineBreak,
  onInsertSectionBreak,
  onInsertColumnBreak,
  onInsertPageNumber,
  onInsertPageCount,
  onInsertDateTime,
  onInsertBookmark,
  onInsertTableOfContents,
  onHighlight,
  onTranslate,
  onFind,
  showPageNumber = true,
  pageNumber = 1
}: EditorContextMenuProps) => {
  if (!editor) return <>{children}</>;

  const applySemanticTag = (tag: string, color: string, weight?: number, italic?: boolean) => {
    const chain = editor.chain().focus();
    
    if (color) chain.setColor(color);
    if (weight && weight >= 600) chain.setBold();
    if (italic) chain.setItalic();
    
    chain.run();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Tag className="w-4 h-4 mr-2" />
            Tag as Semantic Style
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => applySemanticTag('definition', '#4A2FBF', 600, true)}>
              <span className="font-semibold italic" style={{ color: '#4A2FBF' }}>Definition</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => applySemanticTag('term', '#7B61FF', 500)}>
              <span className="font-medium" style={{ color: '#7B61FF' }}>Term</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => applySemanticTag('verse', '#555555', 400, true)}>
              <span className="italic" style={{ color: '#555555' }}>Verse</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => applySemanticTag('strong', '#A28CFF', 500)}>
              <span style={{ color: '#A28CFF', fontFamily: 'Monaco' }}>Strong's Number</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => applySemanticTag('footnote', '#666666', 400)}>
              <span style={{ color: '#666666', fontSize: '12px' }}>Footnote</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => applySemanticTag('notes', '#888888', 400, true)}>
              <span className="italic" style={{ color: '#888888' }}>Additional Notes</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <FileText className="w-4 h-4 mr-2" />
            Insert
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={onFind}>
              <Search className="w-4 h-4 mr-2" />
              Find & Replace...
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onInsertTab}>
              Tab
            </ContextMenuItem>
            <ContextMenuItem onClick={onInsertPageBreak}>
              Page Break
            </ContextMenuItem>
            <ContextMenuItem onClick={onInsertLineBreak}>
              Line Break
            </ContextMenuItem>
            <ContextMenuItem onClick={onInsertSectionBreak}>
              Section Break
            </ContextMenuItem>
            <ContextMenuItem onClick={onInsertColumnBreak}>
              Column Break
            </ContextMenuItem>
            <ContextMenuItem onClick={onInsertPageNumber}>
              Page Number
            </ContextMenuItem>
            <ContextMenuItem onClick={onInsertPageCount}>
              Page Count
            </ContextMenuItem>
            <ContextMenuItem onClick={onInsertDateTime}>
              Date & Time
            </ContextMenuItem>
            <ContextMenuItem onClick={onInsertBookmark}>
              Bookmark
            </ContextMenuItem>
            <ContextMenuItem onClick={onInsertFootnote}>
              Footnote
            </ContextMenuItem>
            <ContextMenuItem onClick={onInsertTableOfContents}>
              Table of Contents
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onTogglePageNumber}>
              <Hash className="w-4 h-4 mr-2" />
              {showPageNumber ? 'Hide' : 'Show'} Page Number
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuItem onClick={onApplyToAll}>
          <Palette className="w-4 h-4 mr-2" />
          Apply to All Instances...
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={onInsertBookmark}>
          <Bookmark className="w-4 h-4 mr-2" />
          Bookmark
        </ContextMenuItem>

        <ContextMenuItem onClick={onHighlight}>
          <Highlighter className="w-4 h-4 mr-2" />
          Highlight
        </ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Languages className="w-4 h-4 mr-2" />
            Translate
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => onTranslate?.('es')}>Spanish</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('fr')}>French</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('de')}>German</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('it')}>Italian</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('pt')}>Portuguese</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('ru')}>Russian</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('ja')}>Japanese</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('ko')}>Korean</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('zh')}>Chinese</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('ar')}>Arabic</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('hi')}>Hindi</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('he')}>Hebrew</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('el')}>Greek</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('nl')}>Dutch</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('pl')}>Polish</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('tr')}>Turkish</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('sv')}>Swedish</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('no')}>Norwegian</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('da')}>Danish</ContextMenuItem>
            <ContextMenuItem onClick={() => onTranslate?.('fi')}>Finnish</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assist
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => onAIAssist?.('grammar')}>Grammar Check</ContextMenuItem>
            <ContextMenuItem onClick={() => onAIAssist?.('clarity')}>Improve Clarity</ContextMenuItem>
            <ContextMenuItem onClick={() => onAIAssist?.('summarize')}>Summarize</ContextMenuItem>
            <ContextMenuItem onClick={() => onAIAssist?.('alphabetize')}>Alphabetize List</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
};
