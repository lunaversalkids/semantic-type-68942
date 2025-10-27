import { useState } from 'react';
import { Header } from '@/components/Header';
import { Toolbar } from '@/components/Toolbar';
import { StylePanel } from '@/components/StylePanel';
import { Editor } from '@/components/Editor';
import { ApplyToAllDialog } from '@/components/ApplyToAllDialog';
import { OnboardingTour } from '@/components/OnboardingTour';
import { defaultStyles } from '@/types/styles';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedText, setSelectedText] = useState('');
  const [editor, setEditor] = useState<any>(null);
  const [applyToAllOpen, setApplyToAllOpen] = useState(false);
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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <Toolbar editor={editor} />
      <div className="flex-1 flex overflow-hidden">
        <StylePanel editor={editor} />
        <main className="flex-1 overflow-hidden">
          <Editor 
            onSelectionChange={setSelectedText} 
            onEditorReady={setEditor}
            onApplyToAll={handleApplyToAll}
            onAIAssist={handleAIAssist}
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
    </div>
  );
};

export default Index;
