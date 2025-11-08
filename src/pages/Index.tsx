import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TextStylePanel } from '@/components/TextStylePanel';
import { LeftSidebar } from '@/components/LeftSidebar';
import { FindReplaceBottomBar } from '@/components/FindReplaceBottomBar';
import { PermanentFindReplaceBar } from '@/components/PermanentFindReplaceBar';
import { Editor } from '@/components/Editor';
import { ApplyToAllDialog } from '@/components/ApplyToAllDialog';
import { PageNumberDialog } from '@/components/PageNumberDialog';
import { OnboardingTour } from '@/components/OnboardingTour';
import { HelpMode } from '@/components/HelpMode';
import { DocumentManager } from '@/components/DocumentManager';
import { ExportDialog } from '@/components/ExportDialog';
import { ImportDialog } from '@/components/ImportDialog';
import { PDFImportDialog } from '@/components/PDFImportDialog';
import { PageViewer } from '@/components/PageViewer';
import { defaultStyles } from '@/types/styles';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import purpleBookmark from '@/assets/purple-bookmark.png';

const Index = () => {
  const [selectedText, setSelectedText] = useState('');
  const [editor, setEditor] = useState<any>(null);
  const [addPageFn, setAddPageFn] = useState<(() => void) | null>(null);
  const [applyToAllOpen, setApplyToAllOpen] = useState(false);
  const [pageNumberDialogOpen, setPageNumberDialogOpen] = useState(false);
  const [currentPageForNumber, setCurrentPageForNumber] = useState(1);
  const [helpModeActive, setHelpModeActive] = useState(false);
  const [pageNumbersVisibility, setPageNumbersVisibility] = useState<Record<number, boolean>>({
    1: true,
    2: true,
  });
  const [pageNumberSettings, setPageNumberSettings] = useState<{
    position: 'left' | 'center' | 'right';
    format: 'page-x' | 'x' | 'x-of-total';
  }>({
    position: 'right',
    format: 'page-x',
  });
  const [footnoteCounter, setFootnoteCounter] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [documentSaved, setDocumentSaved] = useState(false);
  const [bookmarkedPages, setBookmarkedPages] = useState<Set<number>>(new Set([1]));
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [documentManagerOpen, setDocumentManagerOpen] = useState(false);
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [pdfImportOpen, setPdfImportOpen] = useState(false);
  const [pageViewerOpen, setPageViewerOpen] = useState(false);
  const [styles, setStyles] = useState(defaultStyles);
  const [isDoublePageLayout, setIsDoublePageLayout] = useState(false);
  const { toast } = useToast();

  // Auto-renumber footnotes when content changes
  useEffect(() => {
    if (!editor) return;

    const renumberFootnotes = () => {
      const html = editor.getHTML();
      
      // Find all footnote markers (superscripts with data-footnote attribute)
      const markerRegex = /<sup data-footnote="(\d+)">(\d+)<\/sup>/g;
      const markers: number[] = [];
      let match;
      
      while ((match = markerRegex.exec(html)) !== null) {
        markers.push(parseInt(match[1]));
      }
      
      if (markers.length === 0) {
        setFootnoteCounter(1);
        return;
      }

      // Find all footnote texts
      const textRegex = /<p class="footnote-text" data-footnote="(\d+)"><sup>(\d+)<\/sup>/g;
      const texts: number[] = [];
      
      while ((match = textRegex.exec(html)) !== null) {
        texts.push(parseInt(match[1]));
      }

      // Check if we need to renumber
      const allFootnotes = Array.from(new Set([...markers, ...texts])).sort((a, b) => a - b);
      const needsRenumbering = allFootnotes.some((num, idx) => num !== idx + 1);

      if (needsRenumbering) {
        let newHtml = html;
        
        // Renumber both markers and texts sequentially
        allFootnotes.forEach((oldNum, idx) => {
          const newNum = idx + 1;
          if (oldNum !== newNum) {
            // Update markers
            newHtml = newHtml.replace(
              new RegExp(`<sup data-footnote="${oldNum}">${oldNum}</sup>`, 'g'),
              `<sup data-footnote="${newNum}" data-temp="true">${newNum}</sup>`
            );
            // Update footnote texts
            newHtml = newHtml.replace(
              new RegExp(`<p class="footnote-text" data-footnote="${oldNum}"><sup>${oldNum}</sup>`, 'g'),
              `<p class="footnote-text" data-footnote="${newNum}" data-temp="true"><sup>${newNum}</sup>`
            );
          }
        });
        
        // Remove temp markers
        newHtml = newHtml.replace(/ data-temp="true"/g, '');
        
        // Update editor without triggering another update
        editor.commands.setContent(newHtml, false);
      }

      // Remove orphaned footnote texts (markers deleted but text remains)
      const orphanedTexts = texts.filter(t => !markers.includes(t));
      if (orphanedTexts.length > 0) {
        let newHtml = html;
        orphanedTexts.forEach(num => {
          const regex = new RegExp(`<p class="footnote-text" data-footnote="${num}">.*?</p>`, 'g');
          newHtml = newHtml.replace(regex, '');
        });
        editor.commands.setContent(newHtml, false);
      }

      // Update counter to next available number
      const maxNumber = markers.length > 0 ? Math.max(...markers) : 0;
      setFootnoteCounter(maxNumber + 1);
    };

    const handleUpdate = () => {
      renumberFootnotes();
    };

    editor.on('update', handleUpdate);
    
    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor]);

  const handleApplyToAll = () => {
    if (!selectedText) {
      toast({
        title: 'No Text Selected',
        description: 'Please select text to apply a style to all instances',
        variant: 'destructive',
      });
      return;
    }
    setApplyToAllOpen(true);
  };

  const handleAIAssist = (action: string) => {
    toast({
      title: 'AI Assist',
      description: `${action} feature coming soon with Lovable AI integration`,
    });
  };

  const handleInsertFootnote = () => {
    if (!editor) return;
    
    const footnoteNumber = footnoteCounter;
    const { from } = editor.state.selection;
    
    // Get footnote style settings
    const footnoteStyle = defaultStyles.find(s => s.id === 'footnote');
    const fontSize = footnoteStyle?.size || 12;
    const fontFamily = footnoteStyle?.font || 'Inter';
    const color = footnoteStyle?.color || '#666666';
    const lineHeight = footnoteStyle?.lineHeight || 1.4;
    
    // Insert superscript number at cursor position with a unique ID
    editor.chain()
      .focus()
      .insertContent(`<sup data-footnote="${footnoteNumber}">${footnoteNumber}</sup>`)
      .run();
    
    // Get current content to check for existing footnotes section
    const currentContent = editor.getHTML();
    const hasFootnoteSection = currentContent.includes('class="footnotes-section"');
    
    // Navigate to end of document
    const docSize = editor.state.doc.content.size;
    editor.chain()
      .focus()
      .setTextSelection(docSize - 1)
      .run();
    
    if (!hasFootnoteSection) {
      // Create the entire footnotes section at once with style applied
      editor.chain()
        .focus()
        .insertContent(`
          <div class="footnotes-section">
            <hr class="footnotes-separator" />
            <p class="footnote-text" data-footnote="${footnoteNumber}" style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${color}; line-height: ${lineHeight};"><sup>${footnoteNumber}</sup> Enter footnote text here</p>
          </div>
        `)
        .run();
    } else {
      // Just add the new footnote text to existing section with style
      editor.chain()
        .focus()
        .insertContent(`<p class="footnote-text" data-footnote="${footnoteNumber}" style="font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${color}; line-height: ${lineHeight};"><sup>${footnoteNumber}</sup> Enter footnote text here</p>`)
        .run();
    }
    
    // Return cursor to original position
    setTimeout(() => {
      editor.chain().focus().setTextSelection(from + 1).run();
    }, 10);
    
    setFootnoteCounter(prev => prev + 1);
    
    toast({
      title: 'Footnote Inserted',
      description: `Footnote ${footnoteNumber} added at bottom of page.`,
    });
  };

  const handleInsertTab = () => {
    if (!editor) return;
    // Insert actual tab character (0.5 inch default tab stop)
    editor.chain().focus().insertContent('\t').run();
  };

  const handleInsertPageBreak = () => {
    if (!editor) return;
    // Insert a page break that visually separates content
    editor.chain().focus().insertContent('<div class="page-break">Page Break</div>').run();
    toast({ title: 'Page Break Inserted', description: 'Content below will appear on a new page' });
  };

  const handleInsertLineBreak = () => {
    if (!editor) return;
    editor.chain().focus().insertContent('<br>').run();
  };

  const handleInsertSectionBreak = () => {
    if (!editor) return;
    // Insert section break that allows different formatting per section
    editor.chain().focus().insertContent('<div class="section-break" style="page-break-after: always; border-top: 2px dashed #ccc; margin: 2rem 0; padding-top: 1rem;"><p style="text-align: center; color: #999; font-size: 0.8rem;">Section Break</p></div>').run();
    toast({ title: 'Section Break Inserted', description: 'Each section can have different formatting' });
  };

  const handleInsertColumnBreak = () => {
    if (!editor) return;
    editor.chain().focus().insertContent('<div style="break-after: column;"></div>').run();
    toast({ title: 'Column Break Inserted' });
  };

  const handleInsertPageNumber = (pageNum: number) => {
    setCurrentPageForNumber(pageNum);
    setPageNumberDialogOpen(true);
  };

  const handlePageNumberInsert = (
    position: 'left' | 'center' | 'right',
    format: 'page-x' | 'x' | 'x-of-total',
    applyToAll: boolean
  ) => {
    setPageNumberSettings({ position, format });
    
    if (applyToAll) {
      // Show page numbers on all pages
      const updatedVisibility: Record<number, boolean> = {};
      for (let i = 1; i <= 2; i++) {
        updatedVisibility[i] = true;
      }
      setPageNumbersVisibility(updatedVisibility);
      toast({ 
        title: 'Page Numbers Applied', 
        description: `Applied to all pages (${position}, ${format})` 
      });
    } else {
      // Show only on current page
      setPageNumbersVisibility(prev => ({
        ...prev,
        [currentPageForNumber]: true
      }));
      toast({ 
        title: 'Page Number Applied', 
        description: `Applied to page ${currentPageForNumber}` 
      });
    }
  };

  const handleInsertPageCount = () => {
    if (!editor) return;
    // Insert dynamic page count that updates automatically
    editor.chain().focus().insertContent(`<span class="page-count-dynamic">${totalPages}</span>`).run();
    toast({ title: 'Page Count Inserted', description: 'Updates automatically as pages change' });
  };

  const handleInsertDateTime = () => {
    if (!editor) return;
    const now = new Date();
    const formatted = now.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    // Insert with data attribute for potential auto-updating
    editor.chain().focus().insertContent(`<span class="datetime-stamp" data-timestamp="${now.getTime()}">${formatted}</span>`).run();
    toast({ title: 'Date & Time Inserted', description: 'Static timestamp inserted' });
  };

  const handleInsertBookmark = () => {
    if (!editor) return;
    const bookmarkId = `bookmark-${Date.now()}`;
    // Calculate current page (simplified - assumes 1 page = ~3000 chars of content)
    const currentPos = editor.state.selection.from;
    const contentBefore = editor.state.doc.textBetween(0, currentPos, '\n');
    const estimatedPage = Math.floor(contentBefore.length / 3000) + 1;
    const actualPage = Math.min(estimatedPage, totalPages);
    
    editor.chain().focus().insertContent(`<span id="${bookmarkId}" data-page="${actualPage}" style="display: inline-flex; align-items: center; vertical-align: middle; margin: 0 2px;"><img src="${purpleBookmark}" alt="Bookmark" style="width: 12px !important; height: 12px !important; display: inline-block !important; vertical-align: middle !important; margin: 0 !important; object-fit: contain !important; filter: drop-shadow(0 1px 2px rgba(122, 73, 255, 0.3));" /></span>`).run();
    
    // Add page to bookmarked pages
    setBookmarkedPages(prev => new Set([...prev, actualPage]));
    
    toast({ title: 'Bookmark Inserted', description: `Added to page ${actualPage}` });
  };

  const handleInsertTableOfContents = () => {
    if (!editor) return;
    
    // Extract all headings from the document
    const html = editor.getHTML();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let tocContent = '<div class="table-of-contents" style="border: 1px solid hsl(var(--border)); padding: 1.5rem; margin: 1rem 0; background: hsl(var(--muted));">';
    tocContent += '<h3 style="margin-top: 0; margin-bottom: 1rem; font-weight: 600;">Table of Contents</h3>';
    tocContent += '<ul style="list-style: none; padding-left: 0; margin: 0;">';
    
    if (headings.length === 0) {
      tocContent += '<li style="color: hsl(var(--muted-foreground)); font-style: italic;">No headings found. Add headings to generate TOC.</li>';
    } else {
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        const indent = (level - 1) * 1.5;
        const text = heading.textContent || `Heading ${index + 1}`;
        tocContent += `<li style="margin: 0.25rem 0; padding-left: ${indent}rem;">${text}</li>`;
      });
    }
    
    tocContent += '</ul></div>';
    
    editor.chain().focus().insertContent(tocContent).run();
    toast({ 
      title: 'Table of Contents Inserted', 
      description: `Generated from ${headings.length} heading${headings.length !== 1 ? 's' : ''} in document` 
    });
  };

  const handleHighlight = () => {
    if (!editor) return;
    editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run();
    toast({ title: 'Highlight Applied' });
  };

  const handleTranslate = async (language: string) => {
    if (!editor || !selectedText) {
      toast({
        title: 'No Text Selected',
        description: 'Please select text to translate',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          text: selectedText,
          targetLanguage: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const { translatedText } = await response.json();
      
      // Replace selected text with translation
      const { from, to } = editor.state.selection;
      editor.chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(translatedText)
        .run();

      toast({
        title: 'Translation Complete',
        description: `Text translated to ${language}`,
      });
    } catch (error) {
      toast({
        title: 'Translation Error',
        description: 'Failed to translate text. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLoadDocument = (content: string, name: string) => {
    if (editor) {
      editor.commands.setContent(content);
      sonnerToast.success(`Loaded "${name}"`);
    }
  };

  const handleFind = () => {
    setFindReplaceOpen(prev => !prev);
  };

  const handlePenMode = () => {
    toast({ title: 'Pen Mode', description: 'Pen/Insert mode activated' });
  };

  const handleStylusMode = () => {
    toast({ title: 'Stylus Mode', description: 'Stylus mode activated' });
  };

  return (
    <div className="h-screen grid grid-rows-[58px_1fr_86px] gap-3 p-3 overflow-hidden">
      <Header
        onFindClick={handleFind}
        onDocumentClick={() => setDocumentManagerOpen(true)}
        onCloudClick={() => setDocumentManagerOpen(true)}
        onPenModeClick={handlePenMode}
        onStylusModeClick={handleStylusMode}
        onExportClick={() => setExportOpen(true)}
        onImportClick={() => setImportOpen(true)}
        onPdfImportClick={() => setPdfImportOpen(true)}
        onPageViewerClick={() => setPageViewerOpen(prev => !prev)}
        pageViewerOpen={pageViewerOpen}
        onLayoutToggle={() => setIsDoublePageLayout(prev => !prev)}
        isDoublePageLayout={isDoublePageLayout}
      />

      <div className="grid grid-cols-[auto_1fr_auto] gap-3 overflow-hidden relative">
        <PageViewer 
          isOpen={pageViewerOpen} 
          onClose={() => setPageViewerOpen(false)} 
          totalPages={totalPages}
          editor={editor}
          onAddPage={() => {
            if (addPageFn) {
              addPageFn();
              sonnerToast.success('New page added');
            }
          }}
          onCopyPages={(pageNumbers, editorContent, insertBeforePage) => {
            if (addPageFn && editor && editorContent) {
              // Add visual pages for each copied page
              pageNumbers.forEach(() => {
                addPageFn();
              });
              
              // If insertBeforePage is specified, insert before that page
              // Otherwise append to end (for backward compatibility)
              if (insertBeforePage && insertBeforePage > 1) {
                // Find the page break for the target page
                const html = editor.getHTML();
                const pageBreaks = html.split('<div class="page-break">');
                
                if (pageBreaks.length >= insertBeforePage) {
                  // Insert before the specified page
                  const beforeContent = pageBreaks.slice(0, insertBeforePage - 1).join('<div class="page-break">');
                  const afterContent = pageBreaks.slice(insertBeforePage - 1).join('<div class="page-break">');
                  
                  const newContent = beforeContent + 
                    '<div class="page-break">Page Break</div>' + 
                    editorContent + 
                    '<div class="page-break">Page Break</div>' + 
                    afterContent;
                  
                  editor.commands.setContent(newContent);
                } else {
                  // Fallback to append at end
                  editor.chain()
                    .focus('end')
                    .insertContent('<div class="page-break">Page Break</div>')
                    .insertContent(editorContent)
                    .run();
                }
              } else {
                // Append to end
                editor.chain()
                  .focus('end')
                  .insertContent('<div class="page-break">Page Break</div>')
                  .insertContent(editorContent)
                  .run();
              }
              
              sonnerToast.success(`Pasted ${pageNumbers.length} page${pageNumbers.length > 1 ? 's' : ''} ${insertBeforePage ? `before page ${insertBeforePage}` : 'at end'}`);
            }
          }}
        />
        
        <LeftSidebar 
          styles={styles}
          onStylesChange={setStyles}
        />
        <main className="overflow-hidden">
        <Editor 
            onSelectionChange={setSelectedText} 
            onEditorReady={setEditor}
            onApplyToAll={handleApplyToAll}
            onAIAssist={handleAIAssist}
            onInsertFootnote={handleInsertFootnote}
            onInsertTab={handleInsertTab}
            onInsertPageBreak={handleInsertPageBreak}
            onInsertLineBreak={handleInsertLineBreak}
            onInsertSectionBreak={handleInsertSectionBreak}
            onInsertColumnBreak={handleInsertColumnBreak}
            onInsertPageNumber={handleInsertPageNumber}
            onInsertPageCount={handleInsertPageCount}
            onInsertDateTime={handleInsertDateTime}
            onInsertBookmark={handleInsertBookmark}
            onInsertTableOfContents={handleInsertTableOfContents}
            onHighlight={handleHighlight}
            onTranslate={handleTranslate}
            onFind={handleFind}
            pageNumbersVisibility={pageNumbersVisibility}
            pageNumberSettings={pageNumberSettings}
            totalPages={totalPages}
            onPageCountChange={setTotalPages}
            onAddPageReady={(fn) => setAddPageFn(() => fn)}
            onTogglePageNumber={(pageNum) => {
              setPageNumbersVisibility(prev => ({
                ...prev,
                [pageNum]: !prev[pageNum]
              }));
            }}
            isDoublePageLayout={isDoublePageLayout}
          />
        </main>

        <TextStylePanel editor={editor} />
      </div>
      
      <div className="relative">
        <PermanentFindReplaceBar />
        {findReplaceOpen && (
          <div className="absolute inset-0">
            <FindReplaceBottomBar 
              editor={editor} 
              isVisible={findReplaceOpen}
              onClose={() => setFindReplaceOpen(false)}
            />
          </div>
        )}
      </div>
      
      
      <ApplyToAllDialog
        open={applyToAllOpen}
        onOpenChange={setApplyToAllOpen}
        selectedText={selectedText}
        styles={defaultStyles}
        editor={editor}
      />
      
      <PageNumberDialog
        open={pageNumberDialogOpen}
        onOpenChange={setPageNumberDialogOpen}
        onInsert={handlePageNumberInsert}
        onHide={(pageNum) => {
          setPageNumbersVisibility(prev => ({
            ...prev,
            [pageNum]: false
          }));
          toast({ 
            title: 'Page Number Hidden', 
            description: `Hidden on page ${pageNum}` 
          });
        }}
        currentPage={currentPageForNumber}
        totalPages={2}
      />
      
      <DocumentManager 
        open={documentManagerOpen}
        onOpenChange={setDocumentManagerOpen}
        onLoadDocument={handleLoadDocument}
      />

      <ExportDialog 
        open={exportOpen}
        onOpenChange={setExportOpen}
        editor={editor}
      />

      <ImportDialog 
        open={importOpen}
        onOpenChange={setImportOpen}
        editor={editor}
        isDocumentSaved={documentSaved}
      />

      <PDFImportDialog 
        open={pdfImportOpen}
        onOpenChange={setPdfImportOpen}
        editor={editor}
        isDocumentSaved={documentSaved}
      />

      <PageViewer 
        isOpen={pageViewerOpen}
        onClose={() => setPageViewerOpen(false)}
        totalPages={totalPages}
        onPageClick={(pageNum) => {
          console.log('Navigate to page:', pageNum);
          // Future: Add page navigation logic
        }}
        onAddPage={addPageFn}
        onCopyPages={(pageNumbers, content, insertBefore) => {
          console.log('Copy pages:', pageNumbers, 'Insert before:', insertBefore);
        }}
        editor={editor}
        bookmarkedPages={bookmarkedPages}
        onBookmarkToggle={(pageNum) => {
          setBookmarkedPages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(pageNum)) {
              newSet.delete(pageNum);
            } else {
              newSet.add(pageNum);
            }
            return newSet;
          });
        }}
      />
      
      <OnboardingTour />
      <HelpMode isActive={helpModeActive} onClose={() => setHelpModeActive(false)} />
    </div>
  );
};

export default Index;
