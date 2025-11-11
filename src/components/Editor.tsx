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
import Subscript from '@tiptap/extension-subscript';
import { Card } from '@/components/ui/card';
import { EditorContextMenu } from './ContextMenu';
import { PageAddButton } from './PageAddButton';
import { FontSize } from './extensions/FontSize';
import { FontWeight } from './extensions/FontWeight';
import { SmallCaps } from './extensions/SmallCaps';
import { AllCaps } from './extensions/AllCaps';
import { IconNode } from './extensions/IconNode';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Image } from '@tiptap/extension-image';
import { Footnote } from './extensions/FootnoteExtension';
import { Chapter } from './extensions/ChapterNode';
import { PageBreak } from './extensions/PageBreak';
import { CustomBulletList } from './extensions/CustomBulletList';
import { CustomOrderedList } from './extensions/CustomOrderedList';
import { CustomParagraph } from './extensions/CustomParagraph';
import ListItem from '@tiptap/extension-list-item';
import { EditableHeaderFooter } from './EditableHeaderFooter';
import { DraggableBoundary } from './DraggableBoundary';
import type { HeaderFooterSettings } from './HeaderFooterDialog';

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
    location: 'header' | 'footer';
  };
  totalPages?: number;
  onTogglePageNumber?: (pageNum: number) => void;
  onPageCountChange?: (count: number) => void;
  onAddPageReady?: (addPageFn: () => void) => void;
  isDoublePageLayout?: boolean;
  headerFooterConfig?: HeaderFooterSettings | null;
  onHeaderFooterConfigChange?: (config: HeaderFooterSettings) => void;
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
  pageNumberSettings = { position: 'right', format: 'page-x', location: 'footer' },
  totalPages = 2,
  onTogglePageNumber,
  onPageCountChange,
  onAddPageReady,
  isDoublePageLayout = false,
  headerFooterConfig = null,
  onHeaderFooterConfigChange
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
  const [pageBackgrounds, setPageBackgrounds] = useState<Record<number, string>>({});
  const [zoom, setZoom] = useState(1);
  const [targetZoom, setTargetZoom] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [selectedHeaderFooter, setSelectedHeaderFooter] = useState<{ type: 'header' | 'footer', pageNum: number } | null>(null);
  const [headerPosition, setHeaderPosition] = useState(0); // Distance from top edge
  const [footerPosition, setFooterPosition] = useState(0); // Distance from bottom edge

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

  const addPageWithBackground = (pageNum: number) => {
    const newPageId = `page-${pages.length + 1}`;
    const previousBackground = pageBackgrounds[pageNum] || '';
    
    setPages(prev => {
      const newPages = [...prev, newPageId];
      onPageCountChange?.(newPages.length);
      return newPages;
    });
    
    if (previousBackground) {
      setPageBackgrounds(prev => ({
        ...prev,
        [pages.length + 1]: previousBackground
      }));
    }
    
    setTimeout(() => {
      if (editor) {
        editor.commands.focus('end');
      }
    }, 100);
  };

  const changeBackground = (pageNum: number) => {
    // Create file input to select image
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          setPageBackgrounds(prev => ({
            ...prev,
            [pageNum]: imageUrl
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const copyPage = (pageNum: number) => {
    const newPageId = `page-${pages.length + 1}`;
    const pageBackground = pageBackgrounds[pageNum];
    
    // Get current editor content HTML
    const currentContent = editor?.getHTML() || '';
    
    setPages(prev => {
      const newPages = [...prev, newPageId];
      onPageCountChange?.(newPages.length);
      return newPages;
    });
    
    // Copy the background if it exists
    if (pageBackground) {
      setPageBackgrounds(prev => ({
        ...prev,
        [pages.length + 1]: pageBackground
      }));
    }
    
    // Append the copied content to the editor
    setTimeout(() => {
      if (editor) {
        editor.commands.focus('end');
        editor.commands.insertContent('<div class="page-break"></div>' + currentContent);
      }
    }, 100);
  };

  // Notify parent of initial page count and provide add page function
  useEffect(() => {
    onPageCountChange?.(pages.length);
    onAddPageReady?.(addNewPage);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        paragraph: false,
      }),
      CustomParagraph,
      CustomBulletList,
      CustomOrderedList,
      ListItem,
      TextStyle,
      FontFamily,
      FontSize,
      FontWeight,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      Superscript,
      Subscript,
      SmallCaps,
      AllCaps,
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
            <div className={`pages-grid-container ${isDoublePageLayout ? 'double-page-layout' : ''}`}>
              {/* Background page cards */}
              <div className={`pages-background ${isDoublePageLayout ? 'double-page-layout' : ''}`}>
                {pages.map((pageId, index) => {
                  const pageNum = index + 1;
                  const isFirstPage = index === 0 && isDoublePageLayout;
                  const pageBackground = pageBackgrounds[pageNum];
                  return (
                    <Card 
                      key={pageId}
                      className="page-card w-[8.5in] h-[11in] bg-[hsl(var(--page-bg))] shadow-2xl rounded-none overflow-visible"
                      style={{
                        ...(isFirstPage ? { gridColumnStart: 2 } : undefined),
                        ...(pageBackground ? { 
                          backgroundImage: `url(${pageBackground})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        } : undefined),
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                      }}
                    >
                      {/* Header */}
                      {headerFooterConfig?.showHeader && (
                        <EditableHeaderFooter
                          type="header"
                          layoutStyle={headerFooterConfig.layoutStyle}
                          content={headerFooterConfig.headerContent}
                          height={headerFooterConfig.headerHeight}
                          position={headerPosition}
                          pageNumber={pageNum}
                          showPageNumber={pageNumbersVisibility[pageNum] ?? true}
                          pageNumberSettings={pageNumberSettings}
                          totalPages={totalPages}
                          onHeightChange={(height) => {
                            if (onHeaderFooterConfigChange) {
                              onHeaderFooterConfigChange({
                                ...headerFooterConfig,
                                headerHeight: height,
                              });
                            }
                          }}
                          onPositionChange={setHeaderPosition}
                          onContentChange={(content) => {
                            if (onHeaderFooterConfigChange) {
                              onHeaderFooterConfigChange({
                                ...headerFooterConfig,
                                headerContent: content,
                              });
                            }
                          }}
                          isSelected={selectedHeaderFooter?.type === 'header' && selectedHeaderFooter?.pageNum === pageNum}
                          onSelect={() => setSelectedHeaderFooter({ type: 'header', pageNum })}
                          onDeselect={() => setSelectedHeaderFooter(null)}
                          onApply={() => setSelectedHeaderFooter(null)}
                        />
                      )}

                      {/* Page Content Area */}
                      <div 
                        className="flex-1 relative"
                        style={{
                          paddingTop: headerFooterConfig?.showHeader ? '0' : undefined,
                          paddingBottom: headerFooterConfig?.showFooter ? '0' : undefined,
                        }}
                      >
                        <div className="page-add-text-button-wrapper">
                          <button
                            onClick={addNewPage}
                            className="page-add-text-button"
                            title="Add new page"
                          >
                            + Add Page
                          </button>
                        </div>
                        <PageAddButton
                          pageNumber={pageNum}
                          onAddPage={addNewPage}
                          onAddPageWithBackground={() => addPageWithBackground(pageNum)}
                          onChangeBackground={() => changeBackground(pageNum)}
                          onCopyPage={() => copyPage(pageNum)}
                        />
                      </div>

                      {/* Footer */}
                      {headerFooterConfig?.showFooter && (
                        <EditableHeaderFooter
                          type="footer"
                          layoutStyle={headerFooterConfig.layoutStyle}
                          content={headerFooterConfig.footerContent}
                          height={headerFooterConfig.footerHeight}
                          position={footerPosition}
                          pageNumber={pageNum}
                          showPageNumber={pageNumbersVisibility[pageNum] ?? true}
                          pageNumberSettings={pageNumberSettings}
                          totalPages={totalPages}
                          onHeightChange={(height) => {
                            if (onHeaderFooterConfigChange) {
                              onHeaderFooterConfigChange({
                                ...headerFooterConfig,
                                footerHeight: height,
                              });
                            }
                          }}
                          onPositionChange={setFooterPosition}
                          onContentChange={(content) => {
                            if (onHeaderFooterConfigChange) {
                              onHeaderFooterConfigChange({
                                ...headerFooterConfig,
                                footerContent: content,
                              });
                            }
                          }}
                          isSelected={selectedHeaderFooter?.type === 'footer' && selectedHeaderFooter?.pageNum === pageNum}
                          onSelect={() => setSelectedHeaderFooter({ type: 'footer', pageNum })}
                          onDeselect={() => setSelectedHeaderFooter(null)}
                          onApply={() => setSelectedHeaderFooter(null)}
                        />
                      )}
                    </Card>
                  );
                })}
              </div>

              {/* Editable content overlay */}
              <div 
                className={`editor-overlay ${isDoublePageLayout ? 'double-page-layout' : ''}`}
                onClick={(e) => {
                  // Focus editor when clicking anywhere
                  if (editor) {
                    editor.commands.focus();
                  }
                }}
              >
                <div 
                  className={isDoublePageLayout ? 'editor-content-wrapper-double' : 'editor-content-wrapper'}
                  style={isDoublePageLayout ? { gridColumn: 2, gridRow: 1 } : undefined}
                >
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>
          </EditorContextMenu>
        </div>
      </div>
    </div>
  );
};
