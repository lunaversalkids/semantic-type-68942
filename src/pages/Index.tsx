import { useState } from 'react';
import { Header } from '@/components/Header';
import { Toolbar } from '@/components/Toolbar';
import { StylePanel } from '@/components/StylePanel';
import { Editor } from '@/components/Editor';
import { ApplyToAllDialog } from '@/components/ApplyToAllDialog';
import { OnboardingTour } from '@/components/OnboardingTour';
import { HelpMode } from '@/components/HelpMode';
import { defaultStyles } from '@/types/styles';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedText, setSelectedText] = useState('');
  const [editor, setEditor] = useState<any>(null);
  const [applyToAllOpen, setApplyToAllOpen] = useState(false);
  const [helpModeActive, setHelpModeActive] = useState(false);
  const [stylePanelCollapsed, setStylePanelCollapsed] = useState(false);
  const [pageNumbersVisibility, setPageNumbersVisibility] = useState<Record<number, boolean>>({
    1: true,
    2: true,
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
    const { from } = editor.state.selection;
    
    // Insert superscript footnote number at cursor position
    editor.chain()
      .focus()
      .insertContent(`<sup>${footnoteNumber}</sup>`)
      .run();
    
    setFootnoteCounter(prev => prev + 1);
    
    toast({
      title: 'Footnote Inserted',
      description: `Footnote ${footnoteNumber} added at cursor position`,
    });
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
            pageNumbersVisibility={pageNumbersVisibility}
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
      
      <OnboardingTour />
      <HelpMode isActive={helpModeActive} onClose={() => setHelpModeActive(false)} />
    </div>
  );
};

export default Index;
