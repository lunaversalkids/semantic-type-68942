import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Card } from '@/components/ui/card';
import { EditorContextMenu } from './ContextMenu';

interface EditorProps {
  onSelectionChange?: (text: string) => void;
  onEditorReady?: (editor: any) => void;
  onApplyToAll?: () => void;
  onAIAssist?: (action: string) => void;
  onInsertFootnote?: () => void;
  onInsertTab?: () => void;
  onInsertPageBreak?: () => void;
  onInsertLineBreak?: () => void;
  onInsertSectionBreak?: () => void;
  onInsertColumnBreak?: () => void;
  onInsertPageNumber?: (pageNum: number) => void;
  onInsertPageCount?: () => void;
  onInsertDateTime?: () => void;
  onInsertBookmark?: () => void;
  onInsertTableOfContents?: () => void;
  onHighlight?: () => void;
  onTranslate?: (language: string) => void;
  pageNumbersVisibility?: Record<number, boolean>;
  pageNumberSettings?: {
    position: 'left' | 'center' | 'right';
    format: 'page-x' | 'x' | 'x-of-total';
  };
  totalPages?: number;
  onTogglePageNumber?: (pageNum: number) => void;
}

export const Editor = ({ 
  onSelectionChange, 
  onEditorReady, 
  onApplyToAll, 
  onAIAssist, 
  onInsertFootnote,
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
  pageNumbersVisibility = { 1: true, 2: true },
  pageNumberSettings = { position: 'right', format: 'page-x' },
  totalPages = 2,
  onTogglePageNumber 
}: EditorProps) => {
  const getPageNumberText = (pageNum: number) => {
    const { format } = pageNumberSettings;
    switch (format) {
      case 'page-x':
        return `Page ${pageNum}`;
      case 'x':
        return `${pageNum}`;
      case 'x-of-total':
        return `${pageNum} of ${totalPages}`;
    }
  };

  const getPageNumberAlignment = () => {
    const { position } = pageNumberSettings;
    return position === 'center' ? 'center' : position === 'left' ? 'left' : 'right';
  };
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle.configure({
        HTMLAttributes: {
          class: 'text-style',
        },
      }).extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            fontSize: {
              default: null,
              parseHTML: element => element.style.fontSize || null,
              renderHTML: attributes => {
                if (!attributes.fontSize) {
                  return {};
                }
                return {
                  style: `font-size: ${attributes.fontSize}`,
                };
              },
            },
            fontWeight: {
              default: null,
              parseHTML: element => element.style.fontWeight || null,
              renderHTML: attributes => {
                if (!attributes.fontWeight) {
                  return {};
                }
                return {
                  style: `font-weight: ${attributes.fontWeight}`,
                };
              },
            },
          };
        },
      }),
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: `
      <h1>The Semantic Editor</h1>
      <p>This is a professional document editor with semantic styling capabilities. Select text and apply named styles like <strong>Definition</strong>, <em>Term</em>, or <em>Verse</em>.</p>
      <h2>Key Features</h2>
      <ul>
        <li>Apply semantic styles that carry meaning beyond appearance</li>
        <li>Find and replace while preserving or re-applying styles</li>
        <li>Define rules to automatically style matching text</li>
        <li>Create beautiful, consistent documents</li>
      </ul>
      <h2>Example Terms</h2>
      <p>Words like <strong>Elohim</strong> or <strong>H1234</strong> can be automatically styled based on semantic rules you define.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ');
      onSelectionChange?.(text);
    },
    onCreate: ({ editor }) => {
      onEditorReady?.(editor);
    },
  });

  return (
    <div className="h-full flex items-start justify-center bg-[hsl(var(--editor-bg))] p-8 overflow-auto">
      <div className="flex gap-8 editor-pages">
        <EditorContextMenu 
          editor={editor}
          onApplyToAll={onApplyToAll}
          onAIAssist={onAIAssist}
          onInsertFootnote={onInsertFootnote}
          onInsertTab={onInsertTab}
          onInsertPageBreak={onInsertPageBreak}
          onInsertLineBreak={onInsertLineBreak}
          onInsertSectionBreak={onInsertSectionBreak}
          onInsertColumnBreak={onInsertColumnBreak}
          onInsertPageNumber={() => onInsertPageNumber?.(1)}
          onInsertPageCount={onInsertPageCount}
          onInsertDateTime={onInsertDateTime}
          onInsertBookmark={onInsertBookmark}
          onInsertTableOfContents={onInsertTableOfContents}
          onHighlight={onHighlight}
          onTranslate={onTranslate}
          onTogglePageNumber={() => onTogglePageNumber?.(1)}
          showPageNumber={pageNumbersVisibility[1]}
          pageNumber={1}
        >
          <Card className="w-[8.5in] min-h-[11in] bg-[hsl(var(--page-bg))] shadow-lg p-16 relative">
            <EditorContent editor={editor} />
            {pageNumbersVisibility[1] && (
              <div 
                className={`absolute bottom-8 text-sm text-muted-foreground ${
                  getPageNumberAlignment() === 'left' ? 'left-8' : 
                  getPageNumberAlignment() === 'center' ? 'left-1/2 -translate-x-1/2' : 
                  'right-8'
                }`}
              >
                {getPageNumberText(1)}
              </div>
            )}
          </Card>
        </EditorContextMenu>
        <EditorContextMenu 
          editor={editor}
          onApplyToAll={onApplyToAll}
          onAIAssist={onAIAssist}
          onInsertFootnote={onInsertFootnote}
          onInsertTab={onInsertTab}
          onInsertPageBreak={onInsertPageBreak}
          onInsertLineBreak={onInsertLineBreak}
          onInsertSectionBreak={onInsertSectionBreak}
          onInsertColumnBreak={onInsertColumnBreak}
          onInsertPageNumber={() => onInsertPageNumber?.(2)}
          onInsertPageCount={onInsertPageCount}
          onInsertDateTime={onInsertDateTime}
          onInsertBookmark={onInsertBookmark}
          onInsertTableOfContents={onInsertTableOfContents}
          onHighlight={onHighlight}
          onTranslate={onTranslate}
          onTogglePageNumber={() => onTogglePageNumber?.(2)}
          showPageNumber={pageNumbersVisibility[2]}
          pageNumber={2}
        >
          <Card className="w-[8.5in] min-h-[11in] bg-[hsl(var(--page-bg))] shadow-lg p-16 relative flex items-center justify-center text-muted-foreground">
            <p>Page 2</p>
            {pageNumbersVisibility[2] && (
              <div 
                className={`absolute bottom-8 text-sm text-muted-foreground ${
                  getPageNumberAlignment() === 'left' ? 'left-8' : 
                  getPageNumberAlignment() === 'center' ? 'left-1/2 -translate-x-1/2' : 
                  'right-8'
                }`}
              >
                {getPageNumberText(2)}
              </div>
            )}
          </Card>
        </EditorContextMenu>
      </div>
    </div>
  );
};
