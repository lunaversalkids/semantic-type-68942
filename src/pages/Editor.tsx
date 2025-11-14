import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { TextStylePanel } from '@/components/TextStylePanel';
import { LeftSidebar } from '@/components/LeftSidebar';
import { FindReplaceBottomBar } from '@/components/FindReplaceBottomBar';
import { PermanentFindReplaceBar } from '@/components/PermanentFindReplaceBar';
import { Editor as EditorComponent } from '@/components/Editor';
import { ApplyToAllDialog } from '@/components/ApplyToAllDialog';
import { PageNumberDialog } from '@/components/PageNumberDialog';
import { OnboardingTour } from '@/components/OnboardingTour';
import { HelpMode } from '@/components/HelpMode';
import { DocumentManager } from '@/components/DocumentManager';
import { ExportDialog } from '@/components/ExportDialog';
import { ImportDialog } from '@/components/ImportDialog';
import { PDFImportDialog } from '@/components/PDFImportDialog';
import { PageViewer } from '@/components/PageViewer';
import { PageSizerDialog } from '@/components/PageSizerDialog';
import { TextBox } from '@/components/TextBox';
import { HeaderFooterDialog, HeaderFooterSettings } from '@/components/HeaderFooterDialog';
import { ColorCustomizerDialog } from '@/components/ColorCustomizerDialog';
import { EditableHeaderFooter } from '@/components/EditableHeaderFooter';
import { DraggableBoundary } from '@/components/DraggableBoundary';
import { HorizontalRuler } from '@/components/HorizontalRuler';
import { VerticalRuler } from '@/components/VerticalRuler';
import { ShapesIconsDrawer } from '@/components/ShapesIconsDrawer';
import { IconInstanceCropDialog } from '@/components/IconInstanceCropDialog';
import { RenameDocumentDialog } from '@/components/RenameDocumentDialog';
import { SaveAsTemplateDialog } from '@/components/SaveAsTemplateDialog';
import { defaultStyles } from '@/types/styles';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import purpleBookmark from '@/assets/purple-bookmark.png';

const Editor = () => {
  const [searchParams] = useSearchParams();
  const docId = searchParams.get('doc') || 'current-document';
  
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
    location: 'header' | 'footer';
  }>({
    position: 'right',
    format: 'page-x',
    location: 'footer'
  });
  const [footnoteCounter, setFootnoteCounter] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [documentSaved, setDocumentSaved] = useState(false);
  const [bookmarkedPages, setBookmarkedPages] = useState<Set<number>>(new Set([1]));
  const [wordCount, setWordCount] = useState(0);
  const [selectedWordCount, setSelectedWordCount] = useState(0);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [documentManagerOpen, setDocumentManagerOpen] = useState(false);
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [pdfImportOpen, setPdfImportOpen] = useState(false);
  const [pageViewerOpen, setPageViewerOpen] = useState(false);
  const [styles, setStyles] = useState(defaultStyles);
  const [isDoublePageLayout, setIsDoublePageLayout] = useState(false);
  const [pageSizerOpen, setPageSizerOpen] = useState(false);
  const [pageWidth, setPageWidth] = useState(8.5); // inches
  const [pageHeight, setPageHeight] = useState(11); // inches
  const [textBoxes, setTextBoxes] = useState<Array<{
    id: string;
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    isLocked: boolean;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
    color: string;
    backgroundColor: string;
    borderColor: string;
  }>>([]);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(null);
  const [headerFooterDialogOpen, setHeaderFooterDialogOpen] = useState(false);
  const [headerFooterConfig, setHeaderFooterConfig] = useState<HeaderFooterSettings | null>(null);
  const [headerHeight, setHeaderHeight] = useState(60);
  const [footerHeight, setFooterHeight] = useState(60);
  const [selectedHeaderFooter, setSelectedHeaderFooter] = useState<'header' | 'footer' | null>(null);
  const [headerPosition, setHeaderPosition] = useState(0); // Distance from top edge
  const [footerPosition, setFooterPosition] = useState(0); // Distance from bottom edge
  const [colorCustomizerOpen, setColorCustomizerOpen] = useState(false);
  const [showRuler, setShowRuler] = useState(false);
  const [activePageNum, setActivePageNum] = useState(1);
  const [shapesIconsDrawerOpen, setShapesIconsDrawerOpen] = useState(false);
  const [documentName, setDocumentName] = useState('Untitled');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [saveAsTemplateDialogOpen, setSaveAsTemplateDialogOpen] = useState(false);
  const [iconCropDialogOpen, setIconCropDialogOpen] = useState(false);
  const [currentIconCropData, setCurrentIconCropData] = useState<{
    cropX: number | null;
    cropY: number | null;
    cropWidth: number | null;
    cropHeight: number | null;
    updateAttributes: (attrs: any) => void;
  } | null>(null);
  const { toast } = useToast();

  // Track document access for recents
  useEffect(() => {
    const updateRecentDocuments = () => {
      const stored = localStorage.getItem('recentDocuments');
      const recentDocs = stored ? JSON.parse(stored) : [];
      
      // Get the first heading from the editor as the title
      const title = editor?.getText().split('\n')[0] || 'Insects';
      
      // Get first page preview content (first 500 characters of text)
      const fullText = editor?.getText() || '';
      const previewText = fullText.slice(0, 500);
      
      const existingIndex = recentDocs.findIndex((doc: any) => doc.id === docId);
      
      if (existingIndex >= 0) {
        // Update existing document
        recentDocs[existingIndex] = {
          ...recentDocs[existingIndex],
          lastOpened: Date.now(),
          title,
          thumbnail: previewText,
        };
      } else {
        // Add new document
        recentDocs.push({
          id: docId,
          title,
          lastOpened: Date.now(),
          thumbnail: previewText,
        });
      }
      
      // Keep only the 10 most recent
      const sorted = recentDocs.sort((a: any, b: any) => b.lastOpened - a.lastOpened).slice(0, 10);
      localStorage.setItem('recentDocuments', JSON.stringify(sorted));
    };

    // Update on mount
    updateRecentDocuments();

    // Update when editor content changes
    if (editor) {
      const handleUpdate = () => {
        updateRecentDocuments();
      };
      
      editor.on('update', handleUpdate);
      return () => {
        editor.off('update', handleUpdate);
      };
    }
  }, [editor, docId]);

  // Auto-renumber footnotes when content changes
  useEffect(() => {
    if (!editor) return;

    // Calculate word count
    const text = editor.getText() || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);

    // Track selection changes for selected word count
    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        const selectedText = editor.state.doc.textBetween(from, to, ' ');
        const selectedWords = selectedText.trim().split(/\s+/).filter(word => word.length > 0);
        setSelectedWordCount(selectedWords.length);
      } else {
        setSelectedWordCount(0);
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);

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
      editor.off('selectionUpdate', handleSelectionUpdate);
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
    applyToAll: boolean,
    location: 'header' | 'footer'
  ) => {
    setPageNumberSettings({ position, format, location });
    
    // Auto-enable header or footer if not already active
    if (!headerFooterConfig) {
      setHeaderFooterConfig({
        showHeader: location === 'header',
        showFooter: location === 'footer',
        layoutStyle: 'single',
        headerContent: '',
        footerContent: '',
        headerHeight: 60,
        footerHeight: 60,
      });
    } else {
      // Enable the specific header or footer if not already enabled
      if (location === 'header' && !headerFooterConfig.showHeader) {
        setHeaderFooterConfig({
          ...headerFooterConfig,
          showHeader: true,
        });
      } else if (location === 'footer' && !headerFooterConfig.showFooter) {
        setHeaderFooterConfig({
          ...headerFooterConfig,
          showFooter: true,
        });
      }
    }
    
    if (applyToAll) {
      // Show page numbers on all pages
      const updatedVisibility: Record<number, boolean> = {};
      for (let i = 1; i <= totalPages; i++) {
        updatedVisibility[i] = true;
      }
      setPageNumbersVisibility(updatedVisibility);
      toast({ 
        title: 'Page Numbers Applied', 
        description: `Applied to all pages in ${location} (${position}, ${format})` 
      });
    } else {
      // Show only on current page
      setPageNumbersVisibility(prev => ({
        ...prev,
        [currentPageForNumber]: true
      }));
      toast({ 
        title: 'Page Number Applied', 
        description: `Applied to page ${currentPageForNumber} in ${location}` 
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

  const handleQuotation = () => {
    if (!editor) return;
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');
    
    if (!selectedText) {
      toast({
        title: 'No Text Selected',
        description: 'Please select text to add or remove quotations',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if text already has quotes
    const hasQuotes = (selectedText.startsWith('"') && selectedText.endsWith('"')) ||
                     (selectedText.startsWith("'") && selectedText.endsWith("'"));
    
    if (hasQuotes) {
      // Remove quotes and keep selection
      const unquoted = selectedText.slice(1, -1);
      editor.chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(unquoted)
        .setTextSelection({ from, to: from + unquoted.length })
        .run();
      toast({ title: 'Quotations Removed' });
    } else {
      // Add quotes and keep selection
      const quoted = `"${selectedText}"`;
      editor.chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(quoted)
        .setTextSelection({ from, to: from + quoted.length })
        .run();
      toast({ title: 'Quotations Added' });
    }
  };

  const handlePageSizeChange = (width: number, height: number) => {
    setPageWidth(width);
    setPageHeight(height);
    sonnerToast.success('Page Size Updated', { 
      description: `New size: ${width}″ × ${height}″` 
    });
  };

  const handleHeaderFooter = () => {
    setHeaderFooterDialogOpen(true);
  };

  const getDefaultContent = (layoutStyle: string) => {
    switch (layoutStyle) {
      case 'single': return '';
      case 'two': return { left: '', right: '' };
      case 'three': return { left: '', center: '', right: '' };
      default: return '';
    }
  };

  const handleHeaderFooterSave = (config: HeaderFooterSettings) => {
    // Check if user is removing header/footer
    const removingHeader = headerFooterConfig?.showHeader && !config.showHeader;
    const removingFooter = headerFooterConfig?.showFooter && !config.showFooter;
    
    if (removingHeader || removingFooter) {
      // User is removing - clear content and reset positions
      const updatedConfig = {
        ...config,
        headerContent: removingHeader ? '' : config.headerContent,
        footerContent: removingFooter ? '' : config.footerContent,
      };
      setHeaderFooterConfig(updatedConfig);
      setHeaderHeight(config.headerHeight);
      setFooterHeight(config.footerHeight);
      
      // Reset positions
      if (removingHeader) setHeaderPosition(0);
      if (removingFooter) setFooterPosition(0);
      
      const removedParts = [];
      if (removingHeader) removedParts.push('Header');
      if (removingFooter) removedParts.push('Footer');
      
      toast({
        title: 'Header/Footer Removed',
        description: `${removedParts.join(' & ')} removed from document`,
      });
      return;
    }
    
    // Check if user is re-toggling (turning back on after removal)
    const reTogglingHeader = !headerFooterConfig?.showHeader && config.showHeader;
    const reTogglingFooter = !headerFooterConfig?.showFooter && config.showFooter;
    
    if (reTogglingHeader || reTogglingFooter) {
      // Reset to empty placeholders (not previous content) and reset positions
      const resetConfig = {
        ...config,
        headerContent: reTogglingHeader ? getDefaultContent(config.layoutStyle) : config.headerContent,
        footerContent: reTogglingFooter ? getDefaultContent(config.layoutStyle) : config.footerContent,
      };
      setHeaderFooterConfig(resetConfig);
      setHeaderHeight(config.headerHeight);
      setFooterHeight(config.footerHeight);
      
      // Reset positions
      if (reTogglingHeader) setHeaderPosition(0);
      if (reTogglingFooter) setFooterPosition(0);
    } else {
      // Normal save
      setHeaderFooterConfig(config);
      setHeaderHeight(config.headerHeight);
      setFooterHeight(config.footerHeight);
    }
    
    const parts = [];
    if (config.showHeader) parts.push('Header');
    if (config.showFooter) parts.push('Footer');
    
    toast({ 
      title: 'Header & Footer Applied', 
      description: `${parts.join(' & ')} configured successfully` 
    });
  };

  const handleTextFrame = () => {
    const newId = `textbox-${Date.now()}`;
    const newTextBox = {
      id: newId,
      content: '',
      x: window.innerWidth / 2 - 150,
      y: window.innerHeight / 2 - 100,
      width: 300,
      height: 200,
      isLocked: false,
      fontSize: 16,
      fontWeight: '400',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#000000',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: 'hsl(var(--primary))',
    };
    setTextBoxes(prev => [...prev, newTextBox]);
    setSelectedTextBoxId(newId);
    sonnerToast.success('Text box added! Click to edit text.');
  };

  const handlePalette = () => {
    setColorCustomizerOpen(true);
  };

  const handleShapesIcons = () => {
    setShapesIconsDrawerOpen(true);
  };

  const handleChapterPresets = () => {
    toast({ 
      title: 'Chapter Presets',
      description: 'Chapter presets feature coming soon'
    });
  };

  const handleToggleRuler = () => {
    setShowRuler(prev => !prev);
    toast({ 
      title: showRuler ? 'Ruler Removed' : 'Ruler Inserted',
      description: showRuler ? 'Rulers hidden from view' : 'Horizontal and vertical rulers are now visible'
    });
  };

  const handleInsertAnkh = (iconId: string, category: string, cropData?: {
    cropX: number;
    cropY: number;
    cropWidth: number;
    cropHeight: number;
  }) => {
    if (!editor) return;
    
    editor.commands.insertIcon({
      iconId,
      category,
      width: 80,
      height: 112,
      color: 'hsl(253, 100%, 64%)',
      ...(cropData && {
        cropX: cropData.cropX,
        cropY: cropData.cropY,
        cropWidth: cropData.cropWidth,
        cropHeight: cropData.cropHeight,
      }),
    });
    
    // Close the drawer temporarily (will reopen after confirm)
    setShapesIconsDrawerOpen(false);
    
    toast({ 
      title: 'Ankh Inserted', 
      description: cropData ? 'Custom cropped ankh inserted!' : 'Resize and position the ankh, then click Confirm' 
    });
  };

  // Listen for ankh confirmation to reopen drawer
  useEffect(() => {
    const handleAnkhConfirmed = () => {
      setShapesIconsDrawerOpen(true);
    };
    
    window.addEventListener('ankh-confirmed', handleAnkhConfirmed);
    
    return () => {
      window.removeEventListener('ankh-confirmed', handleAnkhConfirmed);
    };
  }, []);

  // Listen for icon crop requests
  useEffect(() => {
    const handleCropRequest = (e: any) => {
      const { cropX, cropY, cropWidth, cropHeight, updateAttributes } = e.detail;
      setCurrentIconCropData({
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        updateAttributes,
      });
      setIconCropDialogOpen(true);
    };
    
    window.addEventListener('icon-crop-requested', handleCropRequest);
    
    return () => {
      window.removeEventListener('icon-crop-requested', handleCropRequest);
    };
  }, []);

  // Load and apply saved color preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem('docOneColorPrefs');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        applyColorsFromPrefs(prefs);
      } catch (e) {
        console.error('Failed to load color preferences', e);
      }
    }
  }, []);

  const applyColorsFromPrefs = (prefs: any) => {
    const root = document.documentElement;
    const DEFAULT_COLORS = { light: '#A78BFA', dark: '#8B70F7' };
    
    const CHAKRA_COLORS = [
      { name: 'Root', light: '#FF6B6B', dark: '#FF0000', darkMode: '#8B0000' },
      { name: 'Sacral', light: '#FFA07A', dark: '#FF7F00', darkMode: '#CC5500' },
      { name: 'Solar Plexus', light: '#FFE66D', dark: '#FFFF00', darkMode: '#B8860B' },
      { name: 'Heart', light: '#90EE90', dark: '#00FF00', darkMode: '#228B22' },
      { name: 'Throat', light: '#87CEEB', dark: '#0000FF', darkMode: '#00008B' },
      { name: 'Third Eye', light: '#9370DB', dark: '#4B0082', darkMode: '#2E0854' },
      { name: 'Crown', light: '#DDA0DD', dark: '#8A2BE2', darkMode: '#4B0082' },
    ];

    const hexToHSL = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return '253 100% 64%';
      
      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }

      h = Math.round(h * 360);
      s = Math.round(s * 100);
      l = Math.round(l * 100);

      return `${h} ${s}% ${l}%`;
    };

    const adjustForDarkMode = (color: string) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const factor = 0.6;
      const newR = Math.floor(r * factor);
      const newG = Math.floor(g * factor);
      const newB = Math.floor(b * factor);
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    };

    if (prefs.mode === 'default') {
      root.style.setProperty('--accent', '253 100% 64%');
      root.style.setProperty('--accent-2', '253 100% 56%');
      root.style.setProperty('--accent-3', '253 80% 85%');
      root.style.setProperty('--primary', '253 100% 64%');
    } else if (prefs.mode === 'custom') {
      const light = prefs.darkMode ? adjustForDarkMode(prefs.customLight) : prefs.customLight;
      const dark = prefs.darkMode ? adjustForDarkMode(prefs.customDark) : prefs.customDark;
      
      const lightHSL = hexToHSL(light);
      const darkHSL = hexToHSL(dark);
      
      root.style.setProperty('--accent', lightHSL);
      root.style.setProperty('--accent-2', darkHSL);
      root.style.setProperty('--accent-3', lightHSL);
      root.style.setProperty('--primary', lightHSL);
    } else if (prefs.mode === 'chakra') {
      let light, dark;
      if (prefs.chakraMode === 'auto') {
        const hour = new Date().getHours();
        const chakraIndex = Math.floor((hour / 24) * CHAKRA_COLORS.length);
        const chakra = CHAKRA_COLORS[chakraIndex];
        light = prefs.darkMode ? chakra.darkMode : chakra.light;
        dark = prefs.darkMode ? adjustForDarkMode(chakra.darkMode) : chakra.dark;
      } else if (prefs.chakraMode === 'single') {
        const chakra = CHAKRA_COLORS[prefs.chakra1];
        light = prefs.darkMode ? chakra.darkMode : chakra.light;
        dark = prefs.darkMode ? adjustForDarkMode(chakra.darkMode) : chakra.dark;
      } else {
        const chakra1 = CHAKRA_COLORS[prefs.chakra1];
        const chakra2 = CHAKRA_COLORS[prefs.chakra2];
        light = prefs.darkMode ? chakra1.darkMode : chakra1.light;
        dark = prefs.darkMode ? chakra2.darkMode : chakra2.dark;
      }
      
      const lightHSL = hexToHSL(light);
      const darkHSL = hexToHSL(dark);
      
      root.style.setProperty('--accent', lightHSL);
      root.style.setProperty('--accent-2', darkHSL);
      root.style.setProperty('--accent-3', lightHSL);
      root.style.setProperty('--primary', lightHSL);
    }
  };

  const navigate = useNavigate();

  // Load document name from localStorage or derive from content
  useEffect(() => {
    const stored = localStorage.getItem('recentDocuments');
    if (stored) {
      const recentDocs = JSON.parse(stored);
      const currentDoc = recentDocs.find((doc: any) => doc.id === docId);
      if (currentDoc) {
        setDocumentName(currentDoc.title || 'Untitled');
      }
    }
  }, [docId]);

  // Update document name when editor content changes
  useEffect(() => {
    if (editor) {
      const firstLine = editor.getText().split('\n')[0];
      if (firstLine && firstLine.trim()) {
        setDocumentName(firstLine.trim());
      }
    }
  }, [editor?.getText()]);

  const handleSaveDocument = async () => {
    if (!editor) return;
    
    const content = editor.getHTML();
    
    // Save to localStorage
    const stored = localStorage.getItem('savedDocuments') || '{}';
    const savedDocs = JSON.parse(stored);
    savedDocs[documentName] = {
      name: documentName,
      content,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('savedDocuments', JSON.stringify(savedDocs));
    
    sonnerToast.success('Document saved successfully');
  };

  const handleRenameDocument = () => {
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = (newName: string) => {
    const oldName = documentName;
    setDocumentName(newName);

    // Update localStorage
    const stored = localStorage.getItem('recentDocuments');
    if (stored) {
      const recentDocs = JSON.parse(stored);
      const docIndex = recentDocs.findIndex((doc: any) => doc.id === docId);
      if (docIndex >= 0) {
        recentDocs[docIndex].title = newName;
        localStorage.setItem('recentDocuments', JSON.stringify(recentDocs));
      }
    }

    // Update saved documents
    const savedStored = localStorage.getItem('savedDocuments') || '{}';
    const savedDocs = JSON.parse(savedStored);
    if (savedDocs[oldName]) {
      savedDocs[newName] = savedDocs[oldName];
      savedDocs[newName].name = newName;
      delete savedDocs[oldName];
      localStorage.setItem('savedDocuments', JSON.stringify(savedDocs));
    }

    sonnerToast.success(`Renamed to "${newName}"`);
  };

  const handleSaveAsTemplate = () => {
    setSaveAsTemplateDialogOpen(true);
  };

  const handleSaveAsTemplateConfirm = (templateName: string) => {
    if (!editor) return;
    
    const content = editor.getHTML();
    
    // Save template to localStorage
    const stored = localStorage.getItem('documentTemplates') || '{}';
    const templates = JSON.parse(stored);
    templates[templateName] = {
      name: templateName,
      content,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('documentTemplates', JSON.stringify(templates));
    
    sonnerToast.success(`Template "${templateName}" saved successfully`);
  };

  // Handle click outside text boxes to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-textbox]')) {
        setSelectedTextBoxId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTextBoxUpdate = (id: string, updates: any) => {
    setTextBoxes(prev => prev.map(box => box.id === id ? { ...box, ...updates } : box));
  };

  const handleTextBoxDelete = (id: string) => {
    setTextBoxes(prev => prev.filter(box => box.id !== id));
    setSelectedTextBoxId(null);
    sonnerToast.success('Text box deleted');
  };

  return (
    <div className="h-screen grid grid-rows-[58px_1fr_86px] gap-3 p-3 overflow-hidden animate-fade-in">
      <Header
        onHomeClick={() => navigate('/home')}
        onFindClick={handleFind}
        onDocumentClick={() => setDocumentManagerOpen(true)}
        onCloudClick={() => navigate('/home?from=editor')}
        onPenModeClick={handlePenMode}
        onStylusModeClick={handleStylusMode}
        onPageSizerClick={() => setPageSizerOpen(true)}
        onHeaderFooterClick={handleHeaderFooter}
        onQuotationClick={handleQuotation}
        onTextFrameClick={handleTextFrame}
        onPaletteClick={handlePalette}
        onShapesIconsClick={handleShapesIcons}
        onChapterPresetsClick={handleChapterPresets}
        onExportClick={() => setExportOpen(true)}
        onImportClick={() => setImportOpen(true)}
        onPdfImportClick={() => setPdfImportOpen(true)}
        onPageViewerClick={() => setPageViewerOpen(prev => !prev)}
        pageViewerOpen={pageViewerOpen}
        onLayoutToggle={() => setIsDoublePageLayout(prev => !prev)}
        isDoublePageLayout={isDoublePageLayout}
        documentName={documentName}
        onSaveDocument={handleSaveDocument}
        onRenameDocument={handleRenameDocument}
        onSaveAsTemplate={handleSaveAsTemplate}
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
          pageCount={totalPages}
          wordCount={wordCount}
          initialExpanded={!!docId && docId !== 'current-document'}
        />
        <main className="overflow-hidden relative">
          {/* Text Boxes Layer */}
          {textBoxes.map(box => (
            <div key={box.id} data-textbox className="absolute inset-0 pointer-events-none" style={{ zIndex: 999 }}>
              <div className="pointer-events-auto">
                <TextBox
                  {...box}
                  isSelected={selectedTextBoxId === box.id}
                  onUpdate={handleTextBoxUpdate}
                  onSelect={setSelectedTextBoxId}
                  onDelete={handleTextBoxDelete}
                />
              </div>
            </div>
          ))}

          <EditorComponent
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
            headerFooterConfig={headerFooterConfig}
            onHeaderFooterConfigChange={setHeaderFooterConfig}
            showRuler={showRuler}
            onToggleRuler={handleToggleRuler}
            pageWidth={pageWidth}
            pageHeight={pageHeight}
          />
        </main>

        <TextStylePanel editor={editor} wordCount={wordCount} selectedWordCount={selectedWordCount} />
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

      <PageSizerDialog
        open={pageSizerOpen}
        onOpenChange={setPageSizerOpen}
        onSizeSelect={handlePageSizeChange}
      />

      <HeaderFooterDialog
        open={headerFooterDialogOpen}
        onOpenChange={setHeaderFooterDialogOpen}
        onSave={handleHeaderFooterSave}
        existingConfig={headerFooterConfig}
      />

      <ColorCustomizerDialog
        open={colorCustomizerOpen}
        onOpenChange={setColorCustomizerOpen}
      />

      <ShapesIconsDrawer
        open={shapesIconsDrawerOpen}
        onOpenChange={setShapesIconsDrawerOpen}
        onInsertIcon={handleInsertAnkh}
      />

      <RenameDocumentDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentName={documentName}
        onRename={handleRenameConfirm}
      />

      <SaveAsTemplateDialog
        open={saveAsTemplateDialogOpen}
        onOpenChange={setSaveAsTemplateDialogOpen}
        onSave={handleSaveAsTemplateConfirm}
      />

      <IconInstanceCropDialog
        open={iconCropDialogOpen}
        onOpenChange={setIconCropDialogOpen}
        currentCrop={
          currentIconCropData?.cropX !== null
            ? {
                cropX: currentIconCropData.cropX!,
                cropY: currentIconCropData.cropY!,
                cropWidth: currentIconCropData.cropWidth!,
                cropHeight: currentIconCropData.cropHeight!,
              }
            : undefined
        }
        onSave={(cropData) => {
          if (currentIconCropData?.updateAttributes) {
            currentIconCropData.updateAttributes({
              cropX: cropData.cropX,
              cropY: cropData.cropY,
              cropWidth: cropData.cropWidth,
              cropHeight: cropData.cropHeight,
            });
            toast({
              title: 'Crop Applied',
              description: 'Icon has been cropped successfully',
            });
          }
        }}
      />
      
      <OnboardingTour />
      <HelpMode isActive={helpModeActive} onClose={() => setHelpModeActive(false)} />
    </div>
  );
};

export default Editor;
