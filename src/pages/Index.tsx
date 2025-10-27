import { useState } from 'react';
import { Header } from '@/components/Header';
import { Toolbar } from '@/components/Toolbar';
import { StylePanel } from '@/components/StylePanel';
import { Editor } from '@/components/Editor';
import { ApplyToAllDialog } from '@/components/ApplyToAllDialog';
import { PageNumberDialog } from '@/components/PageNumberDialog';
import { OnboardingTour } from '@/components/OnboardingTour';
import { HelpMode } from '@/components/HelpMode';
import { defaultStyles } from '@/types/styles';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedText, setSelectedText] = useState('');
  const [editor, setEditor] = useState<any>(null);
  const [applyToAllOpen, setApplyToAllOpen] = useState(false);
  const [pageNumberDialogOpen, setPageNumberDialogOpen] = useState(false);
  const [currentPageForNumber, setCurrentPageForNumber] = useState(1);
  const [helpModeActive, setHelpModeActive] = useState(false);
  const [stylePanelCollapsed, setStylePanelCollapsed] = useState(false);
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
  const { toast } = useToast();

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
    
    editor.chain()
      .focus()
      .insertContent(`<sup>${footnoteNumber}</sup>`)
      .run();
    
    setFootnoteCounter(prev => prev + 1);
    
    toast({
      title: 'Footnote Inserted',
      description: `Footnote ${footnoteNumber} added`,
    });
  };

  const handleInsertTab = () => {
    if (!editor) return;
    editor.chain().focus().insertContent('&nbsp;&nbsp;&nbsp;&nbsp;').run();
  };

  const handleInsertPageBreak = () => {
    if (!editor) return;
    editor.chain().focus().insertContent('<div style="page-break-after: always;"></div>').run();
    toast({ title: 'Page Break Inserted' });
  };

  const handleInsertLineBreak = () => {
    if (!editor) return;
    editor.chain().focus().insertContent('<br>').run();
  };

  const handleInsertSectionBreak = () => {
    if (!editor) return;
    editor.chain().focus().insertContent('<hr style="page-break-after: always; border: none; margin: 2rem 0;">').run();
    toast({ title: 'Section Break Inserted' });
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
    editor.chain().focus().insertContent('[Page Count]').run();
    toast({ title: 'Page Count Placeholder Inserted' });
  };

  const handleInsertDateTime = () => {
    if (!editor) return;
    const now = new Date().toLocaleString();
    editor.chain().focus().insertContent(now).run();
    toast({ title: 'Date & Time Inserted' });
  };

  const handleInsertBookmark = () => {
    if (!editor) return;
    const bookmarkId = `bookmark-${Date.now()}`;
    editor.chain().focus().insertContent(`<span id="${bookmarkId}" style="background: #fef3c7; padding: 0 4px;">📌 Bookmark</span>`).run();
    toast({ title: 'Bookmark Inserted', description: `ID: ${bookmarkId}` });
  };

  const handleInsertTableOfContents = () => {
    if (!editor) return;
    const content = `
      <div style="border: 1px solid #e5e7eb; padding: 1rem; margin: 1rem 0; background: #f9fafb;">
        <h3 style="margin-top: 0;">Table of Contents</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li>1. Introduction</li>
          <li>2. Main Content</li>
          <li>3. Conclusion</li>
        </ul>
      </div>
    `;
    editor.chain().focus().insertContent(content).run();
    toast({ title: 'Table of Contents Inserted' });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header onHelpClick={() => setHelpModeActive(true)} />
      <Toolbar 
        editor={editor}
      />
      <div className="flex-1 flex overflow-hidden">
        <StylePanel 
          editor={editor} 
          collapsed={stylePanelCollapsed}
          onToggleCollapse={() => setStylePanelCollapsed(!stylePanelCollapsed)}
        />
        <main className="flex-1 overflow-hidden">
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
            pageNumbersVisibility={pageNumbersVisibility}
            pageNumberSettings={pageNumberSettings}
            totalPages={2}
            onTogglePageNumber={(pageNum) => {
              setPageNumbersVisibility(prev => ({
                ...prev,
                [pageNum]: !prev[pageNum]
              }));
            }}
          />
        </main>
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
        onHide={() => {
          setPageNumbersVisibility(prev => ({
            ...prev,
            [currentPageForNumber]: false
          }));
          toast({ 
            title: 'Page Number Hidden', 
            description: `Hidden on page ${currentPageForNumber}` 
          });
        }}
        currentPage={currentPageForNumber}
        totalPages={2}
      />
      
      <OnboardingTour />
      <HelpMode isActive={helpModeActive} onClose={() => setHelpModeActive(false)} />
    </div>
  );
};

export default Index;
