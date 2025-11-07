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
  onPageCountChange?: (count: number) => void;
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
  onTogglePageNumber,
  onPageCountChange
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

  const [pages, setPages] = useState<string[]>(['page-1', 'page-2', 'page-3']);
  const [zoom, setZoom] = useState(1);
  const [targetZoom, setTargetZoom] = useState(1);
  const [isZooming, setIsZooming] = useState(false);

  const addNewPage = () => {
    const newPageId = `page-${pages.length + 1}`;
    setPages(prev => {
      const newPages = [...prev, newPageId];
      onPageCountChange?.(newPages.length);
      return newPages;
    });
    
    // Ensure the editor remains focused and editable after adding a new page
    setTimeout(() => {
      if (editor) {
        editor.commands.focus('end');
      }
    }, 100);
  };

  // Notify parent of initial page count
  useEffect(() => {
    onPageCountChange?.(pages.length);
  }, []);

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
      <h1 style="color: #6366f1; font-size: 3rem; margin-bottom: 1.5rem;">Insects</h1>
      
      <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Arthropods</h2>
      <p>Insects are an ind-isub sclass units of the class <span style="color: #6366f1; font-weight: 500;">Hexapoda</span> - In from novellisms them from other arthropods by their three-part body, compound eyes, and external skeleton, in an abusant serza.</p>
      
      <h2 style="color: #6366f1; font-size: 1.5rem; margin: 1.5rem 0 1rem 0;">Hexapoda</h2>
      <p><span style="color: #6366f1;">Arthroprod</span> <em>soptrtrice</em> <span style="color: #6366f1;">Hexapoda</span></p>
      <p>Insects comprise the most diverse group of animals an Earth.</p>
      
      <h2 style="font-size: 1.5rem; margin: 1.5rem 0 1rem 0;">Classification and Evolution</h2>
      <p><span style="color: #6366f1;">Insects</span> comprise the most diverse group of animals on Earth.</p>
      <p>Insects are the largest group of arthropods. The evolution, their evolution, Murninary endurseries, during the De-vonian period after thorough</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none editor-content',
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

  // Removed always show 3 pages - now dynamic

  // Smooth zoom animation with RAF
  useEffect(() => {
    if (Math.abs(targetZoom - zoom) < 0.001) {
      setIsZooming(false);
      return;
    }

    setIsZooming(true);
    const animate = () => {
      setZoom(prev => {
        const diff = targetZoom - prev;
        if (Math.abs(diff) < 0.001) return targetZoom;
        return prev + diff * 0.15; // Smooth easing
      });
    };

    const rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [zoom, targetZoom]);

  // Handle mouse wheel zoom (Ctrl/Cmd + scroll)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.03 : 0.03; // Smaller increments for smoothness
        setTargetZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Handle pinch-to-zoom for touch devices
  useEffect(() => {
    let lastDistance = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        lastDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        if (lastDistance > 0) {
          const delta = (distance - lastDistance) * 0.01;
          setTargetZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
        }

        lastDistance = distance;
      }
    };

    const handleTouchEnd = () => {
      lastDistance = 0;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="h-full flex items-start justify-center bg-[hsl(var(--editor-bg))] p-8 overflow-auto">
      <div 
        className="editor-zoom-container" 
        style={{ 
          transform: `scale(${zoom})`, 
          transformOrigin: 'top center',
          transition: isZooming ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <div className="document-container">
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
            <div className="pages-grid-container">
              {/* Background page cards */}
              <div className="pages-background">
                {pages.map((pageId, index) => {
                  const pageNum = index + 1;
                  return (
                    <Card 
                      key={pageId}
                      className="page-card w-[8.5in] h-[11in] bg-[hsl(var(--page-bg))] shadow-2xl rounded-none"
                    >
                      {pageNumbersVisibility[pageNum] !== false && (
                        <div 
                          className={`absolute bottom-8 text-sm text-muted-foreground ${
                            getPageNumberAlignment() === 'left' ? 'left-12' : 
                            getPageNumberAlignment() === 'center' ? 'left-1/2 -translate-x-1/2' : 
                            'right-12'
                          }`}
                        >
                          {getPageNumberText(pageNum)}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>

              {/* Editable content overlay */}
              <div 
                className="editor-overlay"
                onClick={(e) => {
                  // Focus editor when clicking anywhere
                  if (editor) {
                    editor.commands.focus();
                  }
                }}
              >
                <EditorContent editor={editor} />
              </div>
            </div>
            
            <button
              onClick={addNewPage}
              className="page-adder-button mt-6"
              title="Add new page"
            >
              + Add Page
            </button>
          </EditorContextMenu>
        </div>
      </div>
    </div>
  );
};
