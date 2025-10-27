import { useState } from 'react';
import { Header } from '@/components/Header';
import { Toolbar } from '@/components/Toolbar';
import { StylePanel } from '@/components/StylePanel';
import { Editor } from '@/components/Editor';

const Index = () => {
  const [selectedText, setSelectedText] = useState('');
  const [editor, setEditor] = useState<any>(null);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <StylePanel editor={editor} />
        <main className="flex-1 overflow-hidden">
          <Editor onSelectionChange={setSelectedText} onEditorReady={setEditor} />
        </main>
      </div>
    </div>
  );
};

export default Index;
