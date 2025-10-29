import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import { Card } from '@/components/ui/card';
import { EditorContextMenu } from './ContextMenu';
import { FontSize } from './extensions/FontSize';
import { FontWeight } from './extensions/FontWeight';
import { SmallCaps } from './extensions/SmallCaps';
import { IconNode } from './extensions/IconNode';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Image } from '@tiptap/extension-image';
import { Footnote } from './extensions/FootnoteExtension';
import { Chapter } from './extensions/ChapterNode';
import { PageBreak } from './extensions/PageBreak';

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
  onFind?: () => void;
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
  onFind,
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

  const [pages, setPages] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      FontSize,
      FontWeight,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      Superscript,
      SmallCaps,
      IconNode,
      Image,
      Footnote,
      Chapter,
      PageBreak,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
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

  // Always show 3 pages for the layout
  useEffect(() => {
    setPages(['page-1', 'page-2', 'page-3']);
  }, []);

  // Handle zoom with mouse wheel - smoother with smaller increments
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setZoom(prev => Math.max(0.25, Math.min(2, prev + delta)));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="h-full flex items-start justify-center bg-[hsl(var(--editor-bg))] p-8 overflow-auto">
      {/* Zoom controls */}
      <div className="fixed top-20 right-8 z-30 flex flex-col gap-2 bg-background border border-border rounded-lg p-2 shadow-lg">
        <button
          onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
          className="px-3 py-1 text-sm hover:bg-accent rounded"
          title="Zoom in (Ctrl/Cmd + Scroll)"
        >
          +
        </button>
        <span className="px-3 py-1 text-xs text-center text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(prev => Math.max(0.25, prev - 0.1))}
          className="px-3 py-1 text-sm hover:bg-accent rounded"
          title="Zoom out (Ctrl/Cmd + Scroll)"
        >
          −
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-3 py-1 text-xs hover:bg-accent rounded"
          title="Reset zoom"
        >
          Reset
        </button>
      </div>

      <div 
        className="relative transition-transform duration-200 ease-out" 
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
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
          onFind={onFind}
          onTogglePageNumber={() => onTogglePageNumber?.(1)}
          showPageNumber={pageNumbersVisibility[1] ?? true}
          pageNumber={1}
        >
          <div className="three-page-layout">
            {/* Top single page on the right */}
            <div className="top-page-wrapper">
              <Card className="w-[8.5in] h-[11in] bg-[hsl(var(--page-bg))] shadow-2xl p-0 relative overflow-hidden">
                {pageNumbersVisibility[1] !== false && (
                  <div 
                    className={`absolute bottom-8 text-sm text-muted-foreground z-20 ${
                      getPageNumberAlignment() === 'left' ? 'left-12' : 
                      getPageNumberAlignment() === 'center' ? 'left-1/2 -translate-x-1/2' : 
                      'right-12'
                    }`}
                  >
                    {getPageNumberText(1)}
                  </div>
                )}
              </Card>
            </div>
            
            {/* Bottom two-page spread */}
            <div className="bottom-pages-wrapper flex gap-3 mt-4">
              <Card className="w-[8.5in] h-[11in] bg-[hsl(var(--page-bg))] shadow-2xl p-0 relative overflow-hidden">
                {pageNumbersVisibility[2] !== false && (
                  <div 
                    className={`absolute bottom-8 text-sm text-muted-foreground z-20 ${
                      getPageNumberAlignment() === 'left' ? 'left-12' : 
                      getPageNumberAlignment() === 'center' ? 'left-1/2 -translate-x-1/2' : 
                      'right-12'
                    }`}
                  >
                    {getPageNumberText(2)}
                  </div>
                )}
              </Card>
              <Card className="w-[8.5in] h-[11in] bg-[hsl(var(--page-bg))] shadow-2xl p-0 relative overflow-hidden">
                {pageNumbersVisibility[3] !== false && (
                  <div 
                    className={`absolute bottom-8 text-sm text-muted-foreground z-20 ${
                      getPageNumberAlignment() === 'left' ? 'left-12' : 
                      getPageNumberAlignment() === 'center' ? 'left-1/2 -translate-x-1/2' : 
                      'right-12'
                    }`}
                  >
                    {getPageNumberText(3)}
                  </div>
                )}
              </Card>
            </div>
          </div>
          <div className="three-page-editor-wrapper">
            <EditorContent editor={editor} />
          </div>
        </EditorContextMenu>
      </div>
    </div>
  );
};
