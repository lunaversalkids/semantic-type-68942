import { useState } from 'react';
import { Header } from '@/components/Header';
import { Toolbar } from '@/components/Toolbar';
import { StylePanel } from '@/components/StylePanel';
import { Editor } from '@/components/Editor';

const Index = () => {
  const [selectedText, setSelectedText] = useState('');

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <StylePanel />
        <main className="flex-1 overflow-hidden">
          <Editor onSelectionChange={setSelectedText} />
        </main>
      </div>
    </div>
  );
};

export default Index;
